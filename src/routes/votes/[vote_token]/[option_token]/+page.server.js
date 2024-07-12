import { getVote } from "$lib/db/mysql";
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	if (params.vote_token) {
        let vote_decoded = atob(decodeURIComponent(params.vote_token));

        // check that the decoded value is just an integer
        if(!/^\d+$/.test(vote_decoded)) {
            error(401, 'Invalid vote.');
            return {};
        }
        let vote_number = parseInt(vote_decoded);
        let vote_data = await getVote(vote_number);
        let vote = vote_data?.vote;
        
        let option = atob(decodeURIComponent(params.option_token));

		return {
            vote,
            option,
            vote_token: params.vote_token,
            option_token: params.option_token,
		};
	}

    error(404, 'Vote not found.');
}
