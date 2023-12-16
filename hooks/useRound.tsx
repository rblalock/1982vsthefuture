import { supabaseClient, useUser } from './useUser';

export const useRound = () => {
	const { user } = useUser();

	const insertRound = async (payload: {
		log: string;
		did_win: boolean;
		character_type: string;
		metadata?: {[key: string]: any};
	}) => {
		if (!user?.id) { return; }

		const results = await supabaseClient
			.from('round')
			.insert({
				...payload,
				profile_id: user?.id
			}).select('*');

		if (results.error) { console.error(results.error); }

		console.log(results);
		return results?.data?.[0];
	};

	return {
		insertRound
	};
};
