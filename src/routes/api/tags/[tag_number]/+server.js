import { getTag } from "$lib/db/mysql";
import { json } from '@sveltejs/kit';

export async function GET({ request, params }) {
    let result = await getTag(params.tag_number);
    return json(result);
}