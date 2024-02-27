import { json } from '@sveltejs/kit';
import { getVoteCounts } from "$lib/db/mysql";

export async function GET({ request }) {
    let counts = await getVoteCounts();
    return json(counts);
}