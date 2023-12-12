import { TypeAnimation } from 'react-type-animation';
import Terminal, { ColorMode, TerminalInput, TerminalOutput } from 'react-terminal-ui';
import { useState } from 'react';
import { useChat } from "ai/react"
import { music } from './Toolbar';
import { initialSpyPrompt, initialSystemPrompt } from '@/lib/prompts';
import { useLocalStorage } from '@/lib/useLocalStorage';

export const LevelOneSequence = (props: {
	username: string;
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const [characterSetting, setCharacterSetting] = useLocalStorage('character', 'default');
	const [openAiKey, setOpenAiKey] = useLocalStorage<string | undefined>('openaikey', undefined);
	const [turnsLeft, setTurnsLeft] = useState(10);
	const { messages, append, isLoading, error } = useChat({
		api: '/api/chat',
		initialMessages: [
			{ role: 'system', content: initialSystemPrompt('middlemanager'), id: '0' },
			{ role: 'assistant', content: initialSpyPrompt, id: '1' }
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
					command: 'lose_condition'
				});
				return;
			}

			if (winCondition) {
				props.handleTerminalInput({
					command: 'win_condition',
					level: 1
				});
				return;
			}
		}
	});

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

