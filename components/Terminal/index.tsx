import { useEffect, useState } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { TypeAnimation } from 'react-type-animation';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';

export const TerminalWrapper = () => {
	const [toggleDisplay, setToggleDisplay] = useState<boolean>(false);
	const [terminalLineData, setTerminalLineData] = useState([
		<TerminalOutput key={Math.random().toString(36).substring(7)}>
			<></>
		</TerminalOutput>
	]);
	const [botResponse, setBotResponse] = useState<string>();

	return (
		<>
			<div id="monitor">
				<div id="bezel" className={`relative rounded-xl font-mono text-green-400 ${!toggleDisplay ? 'turn-off' : ''}`}>
					{toggleDisplay ? (
						<Terminal
							prompt=">"
							colorMode={ColorMode.Dark}
							onInput={terminalInput => console.log(`New terminal input received: '${terminalInput}'`)}
						>
							<div className="relative h-full overflow-hidden">
								<TypeAnimation
									preRenderFirstString
									sequence={[
										`
											Welcome to GLOBE PROTECTION SYSTEMS.

											Type "login" to get started.
										`,
										() => {
											console.log('Sequence completed');
										},
									]}
									wrapper="div"
									cursor={false}
									// repeat={Infinity}
									speed={{
										type: 'keyStrokeDelayInMs',
										value: 10
									}}
									className="terminal h-[500px] font-mono font-thin uppercase text-green-400"
									style={{ fontSize: '1em', display: 'inline-block', whiteSpace: 'pre-line' }}
								/>

								<div className={`bottom absolute w-full ${toggleDisplay ? 'block' : 'hidden'}`}>
									{terminalLineData}
								</div>
							</div>

							<div className="scanline" />
						</Terminal>
					) : (
						<div className="h-[710px] overflow-auto font-mono font-thin uppercase text-green-400">
						</div>
					)}
				</div>
			</div>

			{/* Toolbar */}
			<div className="relative z-50 w-full bg-gray-900 shadow-2xl">
				<label className="rocker rocker-small cursor-pointer">
					<input
						id="switch"
						type="checkbox"
						defaultChecked={!toggleDisplay}
						onChange={() => {
							setToggleDisplay(!toggleDisplay);
							let clickSound = new Audio("/click.mp3");
							clickSound.play();
						}}
					/>
					<span className="switch-left cursor-pointer">O</span>
					<span className="switch-right cursor-pointer">I</span>
				</label>

				<div id="casetteWrapper">
					<Casette
						title={music[0].title}
						id={music[0].id}
					/>
				</div>

				<div className="post-it">
					<h1>Get this done today!</h1>
					<p>
						Move the secure codes from the old folder, to the
						new securely encrypted one.
					</p>
				</div>
			</div>
		</>
	);
};

const music = [
	{
		id: 'r1POD-IdG-I',
		title: 'Supabase mix',
	},
	{
		id: 'Kt-tLuszKBA',
		title: 'Awesome mix, vol. 1',
	},
	{
		id: 'TB_hcHcmorc',
		title: 'Pylot AXIOM',
	}
];

const Casette = (props: {
	title: string;
	id: string;
}) => {
	const [player, setPlayer] = useState<YouTubePlayer>();

	const onPlayerReady: YouTubeProps['onReady'] = (event) => {
		setPlayer(event.target);
		event.target.pauseVideo();
	}

	const play = () => {
		let casetteClickSound = new Audio("/switch.mp3");
		casetteClickSound.play();
		if (player?.getPlayerState() === 1) {
			player?.pauseVideo();
		} else {
			player?.playVideo();
		}
	};

	const opts: YouTubeProps['opts'] = {
		height: '390',
		width: '640',
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 1,
		},
	};

	return (
		<>
			<YouTube
				videoId={props.id}
				opts={opts}
				onReady={onPlayerReady}
				style={{
					display: 'none'
				}}
			/>

			<div className="casette-container" onClick={play}>
				<div className="side left"></div>
				<div className="cassette">
					<div className="tape beginning">
						<div className="center">
							<div className="hole">
								<span />
								<span />
								<span />
								<span />
								<span />
								<span />
							</div>
						</div>
					</div>
					<div className="tape end">
						<div className="center">
							<div className="hole">
								<span />
								<span />
								<span />
								<span />
								<span />
								<span />
							</div>
						</div>
					</div>
					<div className="face">
						<span className="screw">
							<span className="screw-center" />
							<span className="screw-center" />
						</span>
						<span className="screw">
							<span className="screw-center" />
							<span className="screw-center" />
						</span>
						<span className="screw">
							<span className="screw-center" />
							<span className="screw-center" />
						</span>
						<span className="screw">
							<span className="screw-center" />
							<span className="screw-center" />
						</span>
						<span className="screw">
							<span className="screw-center" />
							<span className="screw-center" />
						</span>
						<div className="sticker">
							<div className="title-label"></div>
							<div className="title-label"></div>
							<div className="title-label"></div>
							<span id="text2">{props.title}</span>
							<div className="bottom-label">
								<span id="text3">TAPE</span>
								<span id="text4">90min</span>
								<span id="text5">AUDIO CASSETTE TAPE</span>
							</div>
							<div className="window">
								<div className="tape beginning"></div>
							</div>
							<span id="text1" className="text">
								A
							</span>
						</div>
					</div>
					<div className="socket">
						<div className="hole" />
						<div className="hole" />
						<div className="hole" />
						<div className="hole" />
					</div>
				</div>
				<div className="side right"></div>
			</div>
		</>
	);
};
