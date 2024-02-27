import { json } from '@sveltejs/kit';
import { getTags } from "$lib/db/mysql";

export async function GET({ request }) {
    let tags = await getTags();
    return json(tags);
}