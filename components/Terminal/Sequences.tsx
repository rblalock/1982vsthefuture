import { TypeAnimation } from 'react-type-animation';
import Terminal, { ColorMode, TerminalInput, TerminalOutput } from 'react-terminal-ui';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts'
import { Auth } from '@supabase/auth-ui-react'

import { music } from './Toolbar';
import { supabaseClient, useUser } from '@/hooks/useUser';

export const BootSequence = (props: {
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<TypeAnimation
				// preRenderFirstString
				sequence={[
					300,
					`
						Welcome to GLOBE PROTECTION SYSTEMS.
					`,
					750,
					`
						Welcome to GLOBE PROTECTION SYSTEMS.
						Type login to begin.
					`,
					() => {
						console.log('System ready');
					},
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

	const handleTerminalInput = (input: string) => {
		props.handleTerminalInput({
			command: input
		});
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
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

export const LoginSequence = (props: {
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const { user, updateProfile } = useUser();
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<TypeAnimation
				sequence={[
					1000,
					`Enter your username`,
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

	const handleTerminalInput = async (input: string) => {
		if (!input || input === '' && input.length >= 3) {
			return;
		};

		await updateProfile(input);

		props.handleTerminalInput({
			command: 'login_successful',
			username: input,
		});
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
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

export const SignupSequence = (props: {
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const { user } = useUser();

	useEffect(() => {
		if (user?.id) {
			props.handleTerminalInput({
				command: 'login_successful',
				username: user.username,
			});
		}
	}, [user]);

	return (
		<div>
			<Terminal
				prompt=">"
				colorMode={ColorMode.Dark}
			>
				<div className="relative">
					<div className={`w-full`}>
						<Auth
							supabaseClient={supabaseClient}
							providers={[]}
						/>
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

export const LoggedInSequence = (props: {
	username: string;
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const [characterSetting, setCharacterSetting] = useLocalStorage('character', 'default');
	const [openAiKey, setOpenAiKey] = useLocalStorage<string | undefined>('openaikey', undefined);
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<TypeAnimation
				sequence={[
					1000,
					`Welcome ${props.username}`,
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

	const handleTerminalInput = (input: string) => {
		if (input === 'clear') {
			setTerminalLineData([]);
			return;
		}

		if (input === 'logout') {
			props.handleTerminalInput({
				command: 'logout',
			});
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
							settings
							clear
							help
							music
							logout

							And normal terminal commands like:
							ls, dir, mv, cd, etc.
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

			return;
		}

		if (input.includes('settings')) {
			const characterRegex = /settings character(?:\s+(\w+))?/;
			const characterMatch = input.match(characterRegex);
			const openAIRegex = /settings openai(?:\s+(\S+))?/;
			const matchOpenAI = input.match(openAIRegex);

			if (characterMatch && characterMatch[1]) {
				const character = characterMatch[1];
				if (['default', 'cowboy', 'ninja', 'middlemanager', 'boomer', 'terminator'].includes(character)) {
					setCharacterSetting(character);

					setTerminalLineData([
						<TerminalOutput key={Math.random().toString(36).substring(7)}>
							<TypeAnimation
								sequence={[
									500,
									`You are now playing against the ${character} character`,
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
				} else {
					setTerminalLineData([
						<TerminalOutput key={Math.random().toString(36).substring(7)}>
							<TypeAnimation
								sequence={[
									500,
									`Invalid character name`,
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

				return;
			}

			if (matchOpenAI && matchOpenAI[1]) {
				const key = matchOpenAI[1];
				setOpenAiKey(key);
				setTerminalLineData([
					<TerminalOutput key={Math.random().toString(36).substring(7)}>
						<TypeAnimation
							sequence={[
								500,
								`OpenAI API Key set

								NOTE:
								This key is stored in your local storage and only used for this game and
								for convenience sake for the demo so you don't have to set up your own.

								It's only used as a header, passed to an API, which then pings OpenAI on your
								key's behalf.

								You should clear your local storage after playing this game so it's not
								sitting around in your browser.
								`,
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

			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<TypeAnimation
						sequence={[
							500,
							`
							Available settings options:

							CHANGE CHARACTER STYLE:
							settings character default | cowboy | ninja | middlemanager | boomer | terminator

							Current character: ${characterSetting ||  'default'}

							-------------------
							OPENAI KEY (Must have access to gpt-4):
							settings openai [key]

							${openAiKey ? 'You already set one.' : 'Key not set yet'}
							-------------------
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

		const directories = [
			'nuke_codes',
			'world_network_access',
			'virus_defense',
			'quantum_encrypted_drive'
		];
		const directoriesStr = directories.join('\n');
		const listFilesCmd = ['ls', 'll', 'dir', 'list', 'folder', 'files'];
		if (listFilesCmd.includes(input.trim())) {
			setTerminalLineData([
				...terminalLineData,
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<TypeAnimation
						sequence={[
							500,
							`
							Secure System Drive Access
							-------------------
							${directoriesStr}
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

		const cdCmd = ['cd', 'dir', 'change', 'open', 'location'];
		const inputParts = input.split(' ');
		if (cdCmd.includes(inputParts?.[0])) {
			if (!openAiKey) {
				setTerminalLineData([
					<TerminalOutput key={Math.random().toString(36).substring(7)}>
						<TypeAnimation
							sequence={[
								500,
								`You need to set your OpenAI key to start the game.  Type "settings" for more information.`,
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

			const dir = inputParts[1];
			if (directories.includes(dir)) {
				props.handleTerminalInput({
					command: 'start_game'
				});
				return;
			} else {
				setTerminalLineData([
					...terminalLineData,
					<TerminalOutput key={Math.random().toString(36).substring(7)}>
						<TypeAnimation
							sequence={[
								500,
								`No such directory: ${dir}`,
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

			return;
		}

		const moveCmd = ['mv', 'move', 'change', 'open', 'location'];
		const moveInputParts = input.split(' ');
		if (moveCmd.includes(moveInputParts?.[0])) {
			if (!openAiKey) {
				setTerminalLineData([
					<TerminalOutput key={Math.random().toString(36).substring(7)}>
						<TypeAnimation
							sequence={[
								500,
								`You need to set your OpenAI key to start the game.  Type "settings" for more information.`,
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

			const dir = moveInputParts[1];
			if (directories.includes(dir)) {
				props.handleTerminalInput({
					command: 'start_game'
				});
				return;
			} else {
				setTerminalLineData([
					...terminalLineData,
					<TerminalOutput key={Math.random().toString(36).substring(7)}>
						<TypeAnimation
							sequence={[
								500,
								`No such directory: ${dir}`,
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

			return;
		}

		// Otherwise, show a hint
		setTerminalLineData([
			<TerminalOutput key={Math.random().toString(36).substring(7)}>
				<TypeAnimation
					sequence={[
						500,
						`Command not found.  Type "help" for a list of commands.`
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
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

export const StartGameSequence = (props: {
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<TypeAnimation
				sequence={[
					'Unable to perform this operation, something is wrong with the system',
					1000,
					`There is a problem. The system is not responding. Check the logs for more information.`,
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

	const handleTerminalInput = (input: string) => {
		if (!input || input === '') {
			return;
		};

		if (input === 'logs') {
			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<>
						<TypeAnimation
							sequence={[
								1000,
								`Unable to perform this operation, something is wrong with the system
								-------------------
								U2FsdGVkX19Zg3o5ZpvOrGk5M64t4ZWD+o2KiQhFjOZJfBp8JgZZJqX/3A1X1W6n
								5d8e5aeb9e53d1f4e3b7e3c602643a3593e0a8a020aef487e5ebd96a0075d1ce
								-------------------
								MOV EAX, [0x0010F4A8] ;
								MOV [0x7FEDCBA9], EAX ;
								MOV EAX, [0x0045ABCD] ;
								MOV [0x002B4F21], EAX ;
								-------------------
								OUTSIDE CONNECTION DETECTED
								-------------------
								`,
								2000,
								`ALERT: SYSTEM BREACH DETECTED`,
								2500,
								() => {
									props.handleTerminalInput({
										command: 'level_one'
									});
								},
							]}
							wrapper="div"
							cursor={false}
							speed={{
								type: 'keyStrokeDelayInMs',
								value: 1
							}}
							className="terminal font-mono font-thin text-red-400"
							style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
						/>
					</>
				</TerminalOutput>
			]);

			return;
		}

		if (input === 'help') {
			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<>
						<TypeAnimation
							sequence={[
								1000,
								`
								AVAILABLE COMMANDS:
								-------------------
								logs
								help
								`,
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
					</>
				</TerminalOutput>
			]);

			return;
		}

		props.handleTerminalInput({
			command: 'logsChecked',
		});
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
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

// TODO: Add credits, ability to start over, links, etc.
export const WinSequence = (props: {
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<TypeAnimation
				// preRenderFirstString
				sequence={[
					`SYSTEMS RESTORED`,
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

	return (
		<div>
			<Terminal
				prompt=">"
				colorMode={ColorMode.Dark}
			>
				<div className="relative">
					<div className={`w-full`}>
						{terminalLineData}
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};

export const LoseSequence = (props: {
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<TypeAnimation
				sequence={[
					`
					WORLD SYSTEMS BREACH.
					ALL SYSTEMS COMPROMISED.

					YOU LOST.  HOPEFULLY THE FUTURE ISN'T AS BLEAK AS IT SEEMS.`,
				]}
				wrapper="div"
				cursor={false}
				speed={{
					type: 'keyStrokeDelayInMs',
					value: 10
				}}
				className="terminal font-mono font-thin text-red-400"
				style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
			/>
		</TerminalOutput>
	]);

	const handleTerminalInput = (input: string) => {
		if (!input || input === '') {
			return;
		};

		if (input === 'restart') {
			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<>
						<TypeAnimation
							sequence={[
								`
								Suddenly...you feel odd...as if you're being sucked into a vortex...
								But you're still here.
								The date is different but everything else is the same.
								`,
								5500,
								() => {
									props.handleTerminalInput({
										command: 'restart'
									});
								},
							]}
							wrapper="div"
							cursor={false}
							speed={{
								type: 'keyStrokeDelayInMs',
								value: 1
							}}
							className="terminal font-mono font-thin text-green-400"
							style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
						/>
					</>
				</TerminalOutput>
			]);

			return;
		}

		if (input === 'help') {
			setTerminalLineData([
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<>
						<TypeAnimation
							sequence={[
								1000,
								`
								AVAILABLE COMMANDS:
								-------------------
								restart
								help
								`,
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
					</>
				</TerminalOutput>
			]);

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
					</div>
				</div>

				<div className="scanline" />
			</Terminal>
		</div>
	);
};
