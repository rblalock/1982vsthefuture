import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient, type CookieOptions, serialize } from "@supabase/ssr"
import { OpenAI } from 'openai'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL env var is not defined')
}

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString);

export default async function searchHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const json = await req.body;
	const headers = req.headers;
	const openaikey = headers.openaikey;

	if (!openaikey || openaikey == '') {
		return res.status(401).send({
			success: false,
			error: 'Key Unauthorized',
		});
	}

	if (!json.search || json.search == '') {
		return res.status(400).send({
			success: false,
			error: 'Missing search text',
		});
	}

	// The cookies from the client aren't being set right, the token is actually in
	// local storage for some reason, so I have to send manually.  I don't think this is
	// right but it's the only thing I can get to work for right now.
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				// NOTE THIS DOESN"T WORK!
				// get(name: string) {
				// 	return req.cookies[name];
				// },
				// set(name: string, value: string, options: CookieOptions) {
				// 	res.setHeader("Set-Cookie", serialize(name, value, options));
				// },
				// remove(name: string, options: CookieOptions) {
				// 	res.setHeader("Set-Cookie", serialize(name, "", options));
				// },
			},
		}
	);
	const session = await supabase.auth.setSession({
		access_token: headers.accesstoken! as string,
		refresh_token: headers.refreshtoken! as string,
	})

	if (!session.data.session) {
		return res.status(401).json({
			error: 'not_authenticated',
			description: 'The user does not have an active session or is not authenticated'
		});
	}

	try {
		const sanitizedQuery = json.search.trim();
		console.log('sanitizedQuery', sanitizedQuery);
		const AIClient = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY
		});
		const model = 'text-embedding-ada-002';
		const embeddings = await AIClient.embeddings.create({
			model,
			input: sanitizedQuery,
			encoding_format: "float",
		});
		const vectors = embeddings.data?.[0].embedding;
		const data = await sql`
			SELECT *
			FROM round
			ORDER BY embedding <-> ${JSON.stringify(vectors)}
			LIMIT 20
		`;

		const conversationModel = 'gpt-4-1106-preview';
		const searchResult = await AIClient.chat.completions.create({
			model: conversationModel,
			messages: [
				{
					role: 'system',
					content: `
						You are a computer robot representative who loves
						to help understand how Spies/hackers from the future have been beaten!
						Given the following sections, answer the question using only that information.
				`.trim().replace(/\t/g, ''),
				},
				{
					role: 'user',
					content: `
						Sections where Spies/hackers from the future have been beaten:
						${data.map((r) => `character_type:${r.character_type}\nLog:${r.log}`).join('\n')}

						Question: """
						${sanitizedQuery}
						"""

						If you are unable to answer the question, please respond with "I am not able to
						determine this right now".
				`.trim().replace(/\t/g, ''),
				},
			],
		});

		return res.send({
			success: true,
			results: searchResult.choices[0].message?.content
		});
	} catch (err) {
		console.error(err);
		return res.status(400).send({
			success: false,
			err
		});
	}
}

