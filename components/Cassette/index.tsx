import { useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';

export const Casette = (props: {
	title: string;
	id: string;
}) => {
	const [player, setPlayer] = useState<YouTubePlayer>();
console.log(props.id)
	const onPlayerReady: YouTubeProps['onReady'] = (event) => {
		setPlayer(event.target);
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
