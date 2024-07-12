import { castVote } from "$lib/db/mysql";
import { message } from '$lib/pusher';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();
    let user = {
        email: data.email,
        name: data.name,
        organization: data.organization,
    };

    let vote_id = atob(data.vote_token);
    let option_value = atob(data.option_token);
    
    message('vote', data);
    let result = castVote(user, vote_id, option_value);

    return json(result);
}