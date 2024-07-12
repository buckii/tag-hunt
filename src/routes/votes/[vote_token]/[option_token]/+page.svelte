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
let vote_token;
let option_token;

let newuser = false;

let hunt;
let name;
let organization;
let email;

onMount(() => {
    vote = data.vote;
    option = data.option;
    vote_token = data.vote_token;
    option_token = data.option_token;

    name = localStorage.getItem('name') || '';
    organization = localStorage.getItem('organization') || '';
    email = localStorage.getItem('email') || '';

    newuser = !name;

    if(!newuser) {
        castVote();
    }

    pusher = new Pusher(PUBLIC_PUSHER_KEY, {
      cluster: 'us2'
    });

    pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
    pusher_channel.bind(PUBLIC_PUSHER_EVENT, function(data) {
      //console.log(JSON.stringify(data));
    });
});

function castVote() {

    localStorage.setItem('hunt', hunt);
    localStorage.setItem('name', name);
    localStorage.setItem('organization', organization);
    localStorage.setItem('email', email);

    let data = {
        hunt,
        name,
        organization,
        email,
        vote_token,
        option_token,
        newuser,
    };
    axios.post('/api/vote', data)
    .then(function (response) {
        newuser = false;
    })
    .catch(function (error) {
        console.log(error);
    });
}
</script>

<div class="wrapper">
<div class="inner">
{#if data.error}
{data.error}
{:else if newuser}
    <div>You are about to vote for</div>
    <div class="voted-option">{option}</div>
    <div>as your {vote?.name}</div>
    <br />
    <p><strong>Enter your info below and start your quest!</strong></p>
    <p>
        <label for="name">First Name</label>
        <input type="text" id="name" bind:value={name} placeholder="First Name" />
    </p>
    <p style="display: none;">
        <label for="organization">Your Company / Organization</label>
        <input type="text" id="organization" bind:value={organization} placeholder="Your Company / Organization" />
    </p>
    <p>
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} placeholder="Email" />
    </p>
    <button on:click={castVote}>Cast My Vote!</button>
{:else}
<div class="voted">
    <div>You have voted for</div>
    <div class="voted-option">{option}</div>
    <div>as your {vote?.name}</div>
</div>
<div class="change-vote">
    To change your vote, tap the card for a different option.
</div>
{/if}
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