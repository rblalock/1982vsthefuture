import { Casette } from "../Cassette";

export const music = [
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

export const TerminalToolbar = (props: {
	isToggled: boolean;
	musicTrack?: number;
	setToggle: (toggleDisplay: boolean) => void;
}) => {
	return (
		<div className="relative z-50 w-full bg-gray-900 shadow-2xl">
			<label className="rocker rocker-small cursor-pointer">
				<input
					id="switch"
					type="checkbox"
					defaultChecked={!props.isToggled}
					onChange={() => {
						props.setToggle(!props.isToggled);
						let clickSound = new Audio("/click.mp3");
						clickSound.play();
					}}
				/>
				<span className="switch-left cursor-pointer">O</span>
				<span className="switch-right cursor-pointer">I</span>
			</label>

			<div id="casetteWrapper">
				{props.musicTrack !== undefined && music[props.musicTrack] ? (
					<Casette
						title={music[props.musicTrack].title}
						id={music[props.musicTrack].id}
					/>
				) : null}
			</div>

			<div className="post-it">
				<h1>Get this done today!</h1>
				<p>
					Move the nuke codes from the current folder, to the
					new securely encrypted one.
				</p>
			</div>
		</div>
	);
};
