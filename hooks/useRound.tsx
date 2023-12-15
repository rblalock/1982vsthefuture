import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';
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
			});

		if (results.error) { console.error(results.error); }

		return results;
	};

	return {
		insertRound
	};
};
