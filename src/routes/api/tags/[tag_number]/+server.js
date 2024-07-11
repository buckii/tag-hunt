import { json } from '@sveltejs/kit';
import { getTag } from "$lib/db/mysql";

export async function GET({ request, params }) {
    let result = await getTag(params.tag_number);
    return json(result);
}