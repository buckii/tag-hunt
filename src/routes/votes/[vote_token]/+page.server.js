import { getVotes } from "$lib/db/mysql";
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
	if (params.vote_token) {
        let vote_decoded = atob(decodeURIComponent(params.vote_token));

        // check that the decoded value is just an integer
        if(!/^\d+$/.test(vote_decoded)) {
            error(401, 'Invalid vote.');
            return {};
        }
        let vote_number = parseInt(vote_decoded);
        let vote_data = await getVotes(url.host);
        let vote = vote_data?.votes[0];

		return {
            vote,
		};
	}

    error(404, 'Vote not found.');
}
