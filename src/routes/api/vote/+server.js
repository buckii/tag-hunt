import { message } from '$lib/pusher';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();
    
    message('vote', data);

    return json(data);
}