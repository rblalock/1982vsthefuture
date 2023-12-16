import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient, type CookieOptions, serialize } from "@supabase/ssr"
import { OpenAI } from 'openai'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL env var is not defined')
}

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString);

export default async function createEmbeddings(
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

	if (!json.id || json.id == '') {
		return res.status(400).send({
			success: false,
			error: 'Missing ID',
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
		const messages = json.messages || [];
		const AIClient = new OpenAI({
			apiKey: openaikey! as string
		});
		const model = 'text-embedding-ada-002';
		const embeddings = await AIClient.embeddings.create({
			model,
			input: messages,
			encoding_format: "float",
		});
		const payload = embeddings.data.map((embedding) => embedding.embedding);

		console.log(`Updating round ID ${json.id} with embeddings`);

		// I WOULD HAVE LOVED TO USE THIS BUT SENDING VECTORS THROUGH THE SDK DOESNT WORK
		// const { data, error } = await supabase
		// 	.from('round')
		// 	.update({
		// 		embedding: payload?.[0],
		// 	})
		// 	.eq('id', json.id);

		// console.log(data, error)

		// if (error) {
		// 	return res.status(400).send({
		// 		success: false,
		// 		error
		// 	});
		// }

		const data = await sql`
			update public.round
			set embedding = ${JSON.stringify(payload[0])}
			where id = ${json.id} AND profile_id = ${session.data.session.user.id}
		`;

		return res.send({
			success: true,
			data
		});
	} catch (err) {
		console.error(err);
		return res.status(400).send({
			success: false,
			err
		});
	}
}

