import { getAllUsers, storeInDB } from "$lib/db/mysql";
import { message } from '$lib/pusher';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();

    // store in db
    let result = await storeInDB(data);

    message('user', 'updated');

    return json(result);
}

export async function GET({ request }) {
    // store in db
    let result = await getAllUsers();

    return json(result);
}