import { json } from '@sveltejs/kit';
import { message } from '$lib/pusher';
import { storeInDB, getAllUsers } from "$lib/db/mysql";

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