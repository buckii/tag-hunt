import { getLeaderboard } from "$lib/db/mysql";
import { json } from '@sveltejs/kit';

export async function GET({ request, url }) {
    let hunt_name = url.host;
    let leaderboard = await getLeaderboard(hunt_name);
    return json(leaderboard);
}