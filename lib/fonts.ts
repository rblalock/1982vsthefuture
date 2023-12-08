import {
	IBM_Plex_Mono,
	Permanent_Marker as FontMarker,
} from "next/font/google"

export const fontSans = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: '400',
	variable: "--font-sans",
})

export const fontMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: '400',
	variable: "--font-mono",
});

export const fontMarker = FontMarker({
	subsets: ["latin"],
	weight: '400',
	variable: "--font-marker",
});
