import { getVotes } from "$lib/db/mysql";
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
    let vote_data = await getVotes(url.host);
    let votes = vote_data?.votes;

    return {
        votes,
    };

    error(404, 'Votes not found.');
}
