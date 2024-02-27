import { PUSHER_APP_ID, PUSHER_SECRET } from "$env/static/private";
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import Pusher from 'pusher';

export async function message( event, data ) {
    
    const pusher = new Pusher({
        appId: PUSHER_APP_ID,
        key: PUBLIC_PUSHER_KEY,
        secret: PUSHER_SECRET,
        cluster: "us2",
        useTLS: true
    });

    pusher.trigger(PUBLIC_PUSHER_CHANNEL, event, {
        message: data
    });

    return data;
}