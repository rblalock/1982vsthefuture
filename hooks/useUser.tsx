import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
	throw new Error('Add the supabase envs!');
}

export const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const useUser = () => {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<{
		username: string;
		id: string;
	}>();

	useEffect(() => {
		supabaseClient.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
		})

		const {
			data: { subscription },
		} = supabaseClient.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (session && session.user?.id) {
				getProfile(session.user.id);
			}
		})

		return () => subscription.unsubscribe()
	}, []);

	const getProfile = async (userId: string) => {
		setLoading(true)
		const { data, error } = await supabaseClient
			.from('profiles')
			.select(`username`)
			.eq('id', userId)
			.single();

		if (error) { console.error(error); }

		setUser({
			username: data?.username,
			id: userId
		});
		setLoading(false);
	};

	const updateProfile = async (username: string) => {
		if (!user?.id) { return; }

		const results = await supabaseClient
			.from('profiles')
			.update({ username })
			.eq('id', user?.id);

		if (results.error) { console.error(results.error); }

		await getProfile(user?.id);

		return results;
	};

	const logout = async () => {
		setSession(null);
		setUser(undefined);

		return await supabaseClient.auth.signOut();
	};

	return {
		session,
		user,
		updateProfile,
		loading,
		logout
	};
};
