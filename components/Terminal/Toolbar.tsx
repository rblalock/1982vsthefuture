
import { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Casette } from "../Cassette";
import { supabaseClient, useUser } from "@/hooks/useUser";

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
		<div className="relative z-50 w-screen bg-gray-900 shadow-2xl">
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

			<div className="absolute left-[160px] top-[2px] h-[60px]">
				<Counter />
			</div>

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
					Move the new nuke codes from the current folder, to the
					new, securely encrypted one.
				</p>
			</div>
		</div>
	);
};

const roomCode = 'terminal-presence';
const Counter = () => {
	const { user } = useUser();
	const [users, setUsers] = useState<string[]>([]);
	const [channel, setChannel] = useState<RealtimeChannel>();

	useEffect(() => {
		if (roomCode && user) {
			const channel = supabaseClient.channel(`room:${roomCode}`, {
				config: {
					broadcast: {
						self: true
					}
				}
			});

			channel.subscribe((status) => {
				if (status === 'SUBSCRIBED') {
					channel.track({ user: user.username });
				}
			});
			setChannel(channel);

			channel.on('presence', { event: 'sync' }, () => {
				const presenceState = channel.presenceState();

				const users = Object.keys(presenceState)
					.map((presenceId) => {
						const presences = presenceState[presenceId] as unknown as { user: string }[];
						return presences.map((presence) => presence.user);
					})
					.flat();

				setUsers(users.sort());
			});

			return () => {
				channel.unsubscribe();
				setChannel(undefined);
			};
		}
	}, [user]);

	return (
		<div className="">
			<div className="mx-2 text-xs text-white">
				Active Terminals
			</div>
			<div className="relative flex border border-slate-700 font-mono text-xl text-white shadow-2xl">
				<span className="absolute -right-2 top-1 z-10 me-3 flex h-2 w-2 animate-pulse rounded-full bg-green-500"></span>

				<div className="relative w-full bg-black px-8 py-2 text-center">
					<div className="absolute inset-0 grid grid-rows-2">
						<div className="bg-gradient-to-br from-gray-800 to-black"></div>
						<div className="bg-gradient-to-br from-gray-700 to-black"></div>
					</div>

					<span className="relative">{users.length}</span>

					<div className="absolute inset-0 flex items-center">
						<div className="h-px w-full bg-black"></div>
					</div>
				</div>
			</div>
		</div>
	);
};
