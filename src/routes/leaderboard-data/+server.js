import { json } from '@sveltejs/kit';
import { getLeaderboard } from "$lib/db/mysql";

export async function GET({ request }) {
    let leaderboard = await getLeaderboard();
    return json(leaderboard);
}