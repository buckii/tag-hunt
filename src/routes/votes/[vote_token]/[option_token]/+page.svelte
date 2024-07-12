<script>
import { PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT, PUBLIC_PUSHER_KEY } from "$env/static/public";
import axios from 'axios';
import Pusher from 'pusher-js';
import { onMount } from 'svelte';

export let data;

let pusher;
let pusher_channel;

let vote;
let option;

onMount(() => {
    vote = data.vote;
    option = data.option;
    let vote_token = data.vote_token;
    let option_token = data.option_token;

    //console.log(window.localStorage);
    let name = localStorage.getItem('name') || '';
    let organization = localStorage.getItem('organization') || '';
    let email = localStorage.getItem('email') || '';

    axios.post('/api/vote', {
        email,
        name,
        organization,
        vote_token,
        option_token,
    })

    console.log({vote,option});

    pusher = new Pusher(PUBLIC_PUSHER_KEY, {
      cluster: 'us2'
    });

    pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
    pusher_channel.bind(PUBLIC_PUSHER_EVENT, function(data) {
      console.log(JSON.stringify(data));
    });
});
</script>

<div class="wrapper">
<div class="inner">
<div class="voted">
    <div>You have voted for</div>
    <div class="voted-option">{option}</div>
    <div>as your {vote?.name}</div>
</div>
<div class="change-vote">
    To change your vote, tap the card for a different option.
</div>
</div>
</div>

<style>
    .voted {
        text-align: center;
        font-size: 1.5em;
        line-height: 1.5em;
    }
    .voted-option {
        font-weight: bold;
        font-size: 1.5em;
        line-height: 1.1em;
        padding: 20px 0;
    }
    .change-vote {
        font-size: .9em;
        padding-top: 1em;
        font-style: italic;
    }
</style>