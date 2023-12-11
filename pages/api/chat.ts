import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Readable } from 'stream';
import { Configuration, OpenAIApi } from 'openai-edge'

export const config = {
	runtime: 'edge',
};

const openaiConfig = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
})

export const AIConversationClient = new OpenAIApi(openaiConfig);
// gpt-4-1106-preview
export const conversationModel = process.env.CONVERSATION_MODEL || 'gpt-4-1106-preview';

export default async function interviewConversationApi(
	req: NextRequest,
	res: NextResponse
) {
	const json = await req.json();

	// TODO need to check against session token or auth of respondent once we implement that
	// TODO Store current conversation in cache (?)

	const messages = json.messages || [];
	const conversation = await AIConversationClient.createChatCompletion({
		model: conversationModel,
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
