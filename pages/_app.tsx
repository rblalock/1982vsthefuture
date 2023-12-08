import "@/styles/globals.css"

import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes';

import { fontSans, fontMono, fontMarker } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const router = useRouter();

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			</Head>

			<div
				className={cn(
					"min-h-screen bg-black font-mono antialiased",
					fontSans.variable, fontMarker.variable, fontMono.variable,
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="dark">
					<div className="relative flex min-h-screen flex-col">
						<div className="flex-1">
							<Component {...pageProps} />
						</div>
					</div>
				</ThemeProvider>
			</div>
		</>
	);
}
