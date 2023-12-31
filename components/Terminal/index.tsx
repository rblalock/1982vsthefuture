import { useCallback, useEffect, useState } from 'react';

import { BootSequence, LoggedInSequence, LoginSequence, LoseSequence, SignupSequence, StartGameSequence, WinSequence } from './Sequences';
import { TerminalToolbar } from './Toolbar';
import { LevelOneSequence } from './LevelOneSequence';
import { LevelTwoSequence } from './LevelTwoSequence';
import { useUser } from '../../hooks/useUser';

export const TerminalWrapper = () => {
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(false);
	const [won, setWon] = useState<boolean>(false);
	const [currentSequence, setCurrentSequence] = useState<JSX.Element>(<></>);
	const [musicTrack, setMusicTrack] = useState<number>();
	const { user, logout } = useUser();

	useEffect(() => {
		const component = <BootSequence handleTerminalInput={handleTerminalInput} />;
		setCurrentSequence(component);
	}, []);

	const handleTerminalInput = useCallback(async (sequenceCallback: {[key: string]: any}) => {
		if (sequenceCallback?.command === 'login' || sequenceCallback?.command === 'signup') {
			if (!user) {
				const component = <SignupSequence handleTerminalInput={handleTerminalInput} />;
				setCurrentSequence(component);
			} else {
				if (!user?.username) {
					const component = (
						<LoginSequence
							handleTerminalInput={handleTerminalInput}
						/>
					);
					setCurrentSequence(component);

					return;
				}

				const component = (
					<LoggedInSequence
						handleTerminalInput={handleTerminalInput}
						username={user?.username || 'Supa'}
					/>
				);
				setCurrentSequence(component);
			}
		}

		if (sequenceCallback?.command === 'logout') {
			logout();
			setTimeout(() => window.location.replace('/'), 1000);
		}

		if (sequenceCallback?.command === 'login_successful') {
			const component = (
				<LoggedInSequence
					handleTerminalInput={handleTerminalInput}
					username={sequenceCallback.username || 'Supa'}
				/>
			);
			setCurrentSequence(component);
		}

		if (sequenceCallback?.command === 'music') {
			setMusicTrack(sequenceCallback.track);
		}

		if (sequenceCallback?.command === 'start_game') {
			const component = (
				<StartGameSequence
					handleTerminalInput={handleTerminalInput}
				/>
			);
			setCurrentSequence(component);
		}

		if (sequenceCallback?.command === 'level_one') {
			const component = (
				<LevelOneSequence
					username={user?.username || 'Supa'}
					handleTerminalInput={handleTerminalInput}
				/>
			);
			setCurrentSequence(component);
		}

		if (sequenceCallback?.command === 'lose_condition') {
			const component = (
				<LoseSequence
					handleTerminalInput={handleTerminalInput}
				/>
			);
			setCurrentSequence(component);
		}

		if (sequenceCallback?.command === 'win_condition') {
			if (sequenceCallback?.level === 1) {
				const component = (
					<LevelTwoSequence
						username={user?.username || 'Supa'}
						handleTerminalInput={handleTerminalInput}
					/>
				);
				setCurrentSequence(component);
			}
			if (sequenceCallback?.level === 2) {
				const component = (
					<WinSequence
						handleTerminalInput={handleTerminalInput}
					/>
				);
				setCurrentSequence(component);
				setWon(true);
			}
		}

		if (sequenceCallback?.command === 'restart') {
			const component = (
				<LoggedInSequence
					handleTerminalInput={handleTerminalInput}
					username={user?.username || 'Supa'}
				/>
			);
			setCurrentSequence(component);
			setWon(false);
		}

		console.log('sequenceCallback', sequenceCallback);
	}, [user]);

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

			{won ? (
				<div className="h-screen w-screen text-center">
					<div className="scene">
						<div className="wrap">
							<div className="wall wall-right"></div>
							<div className="wall wall-left"></div>
							<div className="wall wall-top"></div>
							<div className="wall wall-bottom"></div>
							<div className="wall wall-back"></div>
						</div>
						<div className="wrap">
							<div className="wall wall-right"></div>
							<div className="wall wall-left"></div>
							<div className="wall wall-top"></div>
							<div className="wall wall-bottom"></div>
							<div className="wall wall-back"></div>
						</div>
					</div>

					<div className={`absolute inset-0 z-50 mx-auto flex h-screen w-1/2 items-center justify-center`}>
						<div className="rounded-3xl bg-black p-48 font-mono font-bold uppercase text-white opacity-90 shadow-xl">
							You won!
							<br />but suddenly you feel yourself getting pulled into the future.

							<hr className="my-5" />

							<ul className="lowercase text-green-500">
								<li><a href="https://github.com/rblalock/1982vsthefuture">Github Repo</a></li>
								<li><a href="https://twitter.com/rblalock">X: @rblalock</a></li>
								<li><a href="https://www.linkedin.com/in/rickblalock/">LinkedIN</a></li>
								<li><a href="https://rickblalock.dev">rickblalock.dev</a></li>
								<li><a href="https://onestudy.ai">OneStudy.ai</a></li>
							</ul>

							<div className="mt-5 text-xs">
								How was your experience? Please take a minute and let me know what you thought
								and how it can be better.

								<div className="mt-3 bg-green-500 py-2">
									<a className="block" target="_blank" href="https://onestudy.ai/link/7abceda4-4621-4a0a-ae1f-98407dab91a2" rel="noreferrer">Leave feedback</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<TerminalToolbar
					musicTrack={musicTrack}
					isToggled={toggleDisplay}
					setToggle={setToggleDisplay}
				/>
			)}
		</>
	);
};
