import { useEffect, useState } from 'react';
import Terminal, { ColorMode, TerminalInput, TerminalOutput } from 'react-terminal-ui';
import { BootSequence, LoggedInSequence, LoginSequence } from './Sequences';
import { TerminalToolbar } from './Toolbar';

export const TerminalWrapper = () => {
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(true);
	const [currentSequence, setCurrentSequence] = useState<JSX.Element>(<></>);
	const [musicTrack, setMusicTrack] = useState<number>();

	const handleTerminalInput = (sequenceCallback: {[key: string]: any}) => {
		if (sequenceCallback?.command === 'login') {
			const component = <LoginSequence handleTerminalInput={handleTerminalInput} />;
			setCurrentSequence(component);
		}

		if (sequenceCallback?.command === 'loginSuccessful') {
			const component = (
				<LoggedInSequence
					handleTerminalInput={handleTerminalInput}
					username={sequenceCallback.username}
				/>
			);
			setCurrentSequence(component);
		}

		if (sequenceCallback?.command === 'music') {
			setMusicTrack(sequenceCallback.track);
		}
	};

	useEffect(() => {
		const component = <LoggedInSequence username="test" handleTerminalInput={handleTerminalInput} />;
		setCurrentSequence(component);
	}, []);

	return (
		<>
			<div id="monitor">
				<div id="bezel" className={`relative rounded-xl font-mono text-green-400 ${!toggleDisplay ? 'turn-off' : ''}`}>
					{toggleDisplay ? (
						<>
							{currentSequence && currentSequence}
						</>
					) : (
						<div className="h-[710px] overflow-auto font-mono font-thin uppercase text-green-400">
						</div>
					)}
				</div>
			</div>

			{/* Toolbar */}
			<TerminalToolbar
				musicTrack={musicTrack}
				isToggled={toggleDisplay}
				setToggle={setToggleDisplay}
			/>
		</>
	);
};
