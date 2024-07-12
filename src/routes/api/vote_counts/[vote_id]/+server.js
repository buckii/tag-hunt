import { getVoteCounts } from "$lib/db/mysql";
import { json } from '@sveltejs/kit';

export async function GET({ request, params }) {
    let counts = await getVoteCounts(params.vote_id);
    return json(counts);
}