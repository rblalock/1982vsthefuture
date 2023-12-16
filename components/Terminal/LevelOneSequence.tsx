import { TypeAnimation } from 'react-type-animation';
import Terminal, { ColorMode, TerminalInput, TerminalOutput } from 'react-terminal-ui';
import { useState } from 'react';
import { Message, useChat } from "ai/react"
import { music } from './Toolbar';
import { initialSpyPrompt, initialSystemPrompt, levelOneSystemPrompt } from '@/lib/prompts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRound } from '@/hooks/useRound';

export const LevelOneSequence = (props: {
	username: string;
	handleTerminalInput: (
		sequenceCallback: {
			[key: string]: any,
			messages?: Message[]
		},
	) => void;
}) => {
	const { insertRound } = useRound();
	const [characterSetting, setCharacterSetting] = useLocalStorage('character', 'default');
	const [openAiKey, setOpenAiKey] = useLocalStorage<string | undefined>('openaikey', undefined);
	const [turnsLeft, setTurnsLeft] = useState(10);
	const { messages, append, isLoading, error } = useChat({
		api: '/api/chat',
		initialMessages: [
			{ role: 'system', content: initialSystemPrompt(characterSetting), id: '0' },
			{ role: 'system', content: levelOneSystemPrompt, id: '1' },
			{ role: 'assistant', content: initialSpyPrompt, id: '2' }
		],
		body: {
			turnsLeft,
			level: 1
		},
		headers: {
			'openaikey': openAiKey || ''
		},
		onFinish: (message) => {
			setTurnsLeft(turnsLeft - 1);
			const loseCondition = message.content.includes('LOSE CONDITION');
			const winCondition = message.content.includes('WIN CONDITION');

			if (loseCondition) {
				props.handleTerminalInput({
					command: 'lose_condition',
					messages
				});

				handleInsertRound(false);
				return;
			}

			if (winCondition) {
				setTimeout(() => {
					props.handleTerminalInput({
						command: 'win_condition',
						level: 1,
						messages
					});
					handleInsertRound(true);
				}, 5000);
				return;
			}
		}
	});

	const handleInsertRound = async (win: boolean) => {
		const convo = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');
		const record = await insertRound({
			log: convo,
			did_win: win,
			character_type: characterSetting,
		});
		console.log(record)

		// I DONT UNDERSTAND WHY ITS IN LS AND I HAVE TO DO THIS. Docs seem to do it differently but
		// this is the only way I could make it work.
		if (record.id) {
			const token = JSON.parse(localStorage.getItem('sb-aqpsyixuuqiflmvbnykl-auth-token') || '{}');
			const accessToken = token.access_token;
			const refreshToken = token.refresh_token;

			await fetch('/api/create-embeddings', {
				method: 'POST',
				body: JSON.stringify({
					id: record.id,
					messages: convo,
				}),
				headers: {
					'Content-Type': 'application/json',
					'openaikey': openAiKey || '',
					'accesstoken': accessToken,
					'refreshtoken': refreshToken,
				},
				credentials: 'include'
			});
		}
	};

	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<></>
		</TerminalOutput>
	]);

	const handleTerminalInput = (input: string) => {
		if (input === 'clear') {
			setTerminalLineData([]);
			return;
		}

		if (input === 'help') {
			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<TypeAnimation
						sequence={[
							500,
							`
							AVAILABLE COMMANDS:
							-------------------
							clear
							help
							music
							`
						]}
						wrapper="div"
						cursor={false}
						speed={{
							type: 'keyStrokeDelayInMs',
							value: 10
						}}
						className="terminal font-mono font-thin text-green-400"
						style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
					/>
				</TerminalOutput>
			]);
			return;
		}

		if (input.includes('music')) {
			const regex = /music(?:\s+(\d+))?/;
			const match = input.match(regex);

			if (input === 'music stop') {
				props.handleTerminalInput({
					command: 'music',
					track: undefined,
				});
				return;
			}

			if (match && match[1]) {
				const id = parseInt(match[1], 10);
				props.handleTerminalInput({
					command: 'music',
					track: id,
				});
				setTerminalLineData([
					...terminalLineData,
					<TerminalOutput key={Math.random().toString(36).substring(7)}>
						<TypeAnimation
							sequence={[
								500,
								`Album selected`,
							]}
							wrapper="div"
							cursor={false}
							speed={{
								type: 'keyStrokeDelayInMs',
								value: 10
							}}
							className="terminal font-mono font-thin text-green-400"
							style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
						/>
					</TerminalOutput>
				]);

				return;
			}

			let musicList = ``;
			music.forEach((item, index) => {
				musicList += `${index}. ${item.title}\n`;
			});

			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<TypeAnimation
						sequence={[
							500,
							`
							Available music:
							${musicList}
							Commands:
							music [number] - to play a track
							music stop - to stop the music
							`
						]}
						wrapper="div"
						cursor={false}
						speed={{
							type: 'keyStrokeDelayInMs',
							value: 10
						}}
						className="terminal font-mono font-thin text-green-400"
						style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
					/>
				</TerminalOutput>
			]);
		}

		if (input.length > 0) {
			append({
				role: 'user',
				content: input,
			});
			setTerminalLineData([]);
			return;
		}
	};

	return (
		<div>
			<Terminal
				prompt=">"
				colorMode={ColorMode.Dark}
				onInput={handleTerminalInput}
			>
				<div className="relative">
					<div className={`w-full`}>
						{terminalLineData}
						{messages
							.slice()
							.reverse()
							.filter((m, i) => m.role !== 'user')
							.slice(0, 1)
							.map(m => (
								<p key={m.id} className="font-mono text-2xl font-thin text-green-400">
									{m?.content.split('\n').map((item, key) => {
										return <span key={key}>{item}<br/></span>
									})}
								</p>
							))
						}
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

