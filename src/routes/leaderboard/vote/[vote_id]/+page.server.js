import { getVote } from "$lib/db/mysql";

export async function load({ params }) {
    let vote = getVote(params.vote_id);
    return {
        vote
    };
}
