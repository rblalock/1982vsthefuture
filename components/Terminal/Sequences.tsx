import { TypeAnimation } from 'react-type-animation';
import Terminal, { ColorMode, TerminalInput, TerminalOutput } from 'react-terminal-ui';
import { useState } from 'react';
import { music } from './Toolbar';

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
	const [username, setUsername] = useState<string>();
	const [password, setPassword] = useState<string>();

	const handleTerminalInput = (input: string) => {
		if (!input || input === '') {
			return;
		};

		if (!username) {
			setUsername(input);

			setTerminalLineData([
				...terminalLineData,
				<TerminalOutput key={Math.random().toString(36).substring(7)}>
					<>
						{input}
						<br />
						<TypeAnimation
							sequence={[
								1000,
								`Enter your password`,
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

		setPassword(input);
		props.handleTerminalInput({
			command: 'loginSuccessful',
			username: username,
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

export const LoggedInSequence = (props: {
	username: string;
	handleTerminalInput: (sequenceCallback: { [key: string]: any }) => void;
}) => {
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

		if (input.includes('settings')) {
			const regex = /settings character(?:\s+(\w+))?/;
			const match = input.match(regex);

			if (match && match[1]) {
				const character = match[1];
				console.log(match?.[1]);
				props.handleTerminalInput({
					command: 'character',
					character,
				});
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
							settings character default | cowboy | ninja | middlemanager | boomer
							-------------------
							OPENAI KEY (notice: stored in local storage):
							settings openai [key]
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
		}

		const cdCmd = ['cd', 'dir', 'change', 'open', 'location'];
		const inputParts = input.split(' ');
		if (cdCmd.includes(inputParts[0])) {
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
		}

		const moveCmd = ['mv', 'move', 'change', 'open', 'location'];
		const moveInputParts = input.split(' ');
		if (moveCmd.includes(moveInputParts[0])) {
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
