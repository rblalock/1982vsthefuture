import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Readable } from 'stream';
import { Configuration, OpenAIApi } from 'openai-edge'

export const config = {
	runtime: 'edge',
};

// gpt-4-1106-preview
export const conversationModel = process.env.CONVERSATION_MODEL || 'gpt-4-1106-preview';

export default async function interviewConversationApi(
	req: NextRequest,
	res: NextResponse
) {
	const json = await req.json();
	const headers = req.headers;
	const openaikey = headers.get('openaikey');

	if (!openaikey || openaikey == '') {
		return new Response('Unauthorized', { status: 401 });
	}

	// TODO need to check against session token or auth of respondent once we implement that
	// TODO Store current conversation in cache (?)

	const messages = json.messages || [];
	const turnsLeft = json.turnsLeft || 0;
	const level = json.level || 1;
	console.log('turnsLeft', turnsLeft);
	if (turnsLeft <= 0) {
		messages.push({
			role: 'system',
			content: 'There are no turns left after this.  One more turn and the Spy loses and the WIN CONDITION is met.',
		});
	} else {
		messages.push({
			role: 'system',
			content: `There are ${turnsLeft} turns left.`,
		});
	}

	const openaiConfig = new Configuration({
		apiKey: openaikey,
	});
	const AIConversationClient = new OpenAIApi(openaiConfig);
	const conversation = await AIConversationClient.createChatCompletion({
		model: 'gpt-4-1106-preview', //'gpt-4',//(level > 1) ? 'gpt-4' : conversationModel,
		stream: true,
		messages: messages,
	});
	const stream = OpenAIStream(conversation, {
		async onCompletion(completion) {
			console.log('completion', completion);
		}
	});

	return new StreamingTextResponse(stream);

	// const emptyStream = getEmptyStreamMessage();
	// return new StreamingTextResponse(emptyStream);
}

const getEmptyStreamMessage = (): ReadableStream => {
	const stream = new ReadableStream({
		start(controller) {
			controller.close();
		}
	});

	return stream;
}
