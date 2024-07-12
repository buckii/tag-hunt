import { getTags } from "$lib/db/mysql";
import { json } from '@sveltejs/kit';

export async function GET({ request, url }) {
    let tags = await getTags(url.host);
    return json(tags);
}