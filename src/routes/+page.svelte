<script>
import { onMount } from 'svelte';
import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import axios from 'axios';
import Taglist from '../components/Taglist.svelte';

let pusher;
let pusher_channel;

let tag_number = null;
let opt_out = false;
let opted_out = false;
let tags_tapped = [];
let tag_count = 0;
let total_tags_count = 90;
let tag_arg = '';
let testing = false;
let loaded = false;

let tags = [];
let tag = null;

// Tag 1 - Participant Info
let name = '';
let organization = '';
let email = '';

let tag_list = [];
for(let i = 1;i <= total_tags_count;i++) {
    tag_list.push(i);
}

Pusher.logToConsole = true;

onMount(() => {
console.log('onMount');

    //pull from local storage
    testing = localStorage.getItem('testing') || false;
    name = localStorage.getItem('name') || '';
    organization = localStorage.getItem('organization') || '';
    email = localStorage.getItem('email') || '';
    let tags_tapped_string = localStorage.getItem('tags_tapped');
    tags_tapped = tags_tapped_string ? JSON.parse(tags_tapped_string) : [];

    console.log(['tapped',tags_tapped]);

    let hash_array = document.location.search.replace(/^\?/,'').split('/');

    // testing mode when #test is in the URL
    testing = document.location.hash.match(/^#test/);// || testing;
    //if(document.location.hash.match(/^#notest/)) testing = false;
    
    // set tag number
    tag_number = parseInt(atob(decodeURIComponent(hash_array[0]))) || 0;
    tag_arg = hash_array.length > 1 ? atob(decodeURIComponent(hash_array[1])) : '';

    // get tag
    axios.get('/tags/' + tag_number).then((response) => {
        tag = response.data.tag;
        total_tags_count = response.data.total_tags_count;
    });

    if(tag_number > 0 && name) {
        store();
    }

    loaded = true;

    pusher = new Pusher(PUBLIC_PUSHER_KEY, {
      cluster: 'us2'
    });

    pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
    pusher_channel.bind(PUBLIC_PUSHER_EVENT, function(data) {
      console.log(JSON.stringify(data));
    });
});

function addCurrentTag() {
    console.log('Checking if tag number ' + tag_number + ' has been tapped');
    if(!tags_tapped.includes(tag_number) && tag_number > 0) {
        tags_tapped.push(tag_number);
        tags_tapped = tags_tapped;
    }
}

function store() {
    localStorage.setItem('testing', testing);
    localStorage.setItem('name', name);
    localStorage.setItem('organization', organization);
    localStorage.setItem('email', email);

    if(!tags_tapped) {
        tags_tapped = [];
    }
    addCurrentTag();
    
    localStorage.setItem('tags_tapped', JSON.stringify(tags_tapped));

    let data = {
        name,
        organization,
        email,
        tags_tapped,
        tag_number,
        opt_out,
    };
    //let data_string = JSON.stringify(data);
    axios.post('/user', data)
    .then(function (response) {
        console.log('saved successfully');
        if(opt_out) {
            opted_out = true;
        }
        addCurrentTag();
        localStorage.setItem('tags_tapped', JSON.stringify(tags_tapped));
    })
    .catch(function (error) {
        console.log(error);
    });
}

function resetTagsTapped() {
    tags_tapped = [];
    name = '';
    email = '';
    organization = '';
    store();
}

function handleSubmitFirst() {
    store(0, false);
}
</script>

<div class="container">
{#if loaded}
<Taglist tag_count={tags_tapped.length} total_tags_count={total_tags_count}></Taglist>

<p><img src="/nfc-found.svg" alt="You found it!" class="found-it" /></p>

{#if tag_number === 0 || !tags_tapped.length}
<p>Welcome to the Multi-Chamber Expo booth hunt!</p>
<div style="text-align: left">
<h3 class="hint">Instructions:</h3>
<div class="hint-container">
<ol>
    <li>Find a card to tap</li>
    <li>Unlock your phone screen</li>
    <li>Touch your phone to the tap zone (camera area for iPhone, center back for Android)</li>
    <li>If you would like to opt out of sharing your information with the booth, tap the "opt out" button on your phone.</li>
    <li>Repeat!</li>
</ol>
</div>
</div>

{#if !tags_tapped.length || !name}
    <h1>You found a tag!</h1>
    <p>Would you share with us a little about yourself?</p>
    <p>
        <label for="name">Your Name</label>
        <input type="text" id="name" bind:value={name} placeholder="Your Name" />
    </p>
    <p>
        <label for="organization">Your Company / Organization</label>
        <input type="text" id="organization" bind:value={organization} placeholder="Your Company / Organization" />
    </p>
    <p>
        <label for="email">Your Email Address</label>
        <input type="email" id="email" bind:value={email} placeholder="Your Email Address" />
    </p>
    <button on:click={handleSubmitFirst}>Start My Adventure</button>
{/if}

{:else if tag_number && tag}
    <h2>You found tag #{tag_number}!</h2>
    <h3>{tag.name}</h3>
    {#if tag.description}
    <p>{@html tag.description}</p>
    {/if}
    {#if tag.cta_url}
    <p><a class="button" href={tag.cta_url} target="_blank">{tag.cta_text}</a></p>
    {:else}
    <p><a class="button" href={tag.website_url} target="_blank">Visit our Website</a></p>

    {#if opted_out}
    You have opted out of communication from {tag.name}.
    {:else}
    <label for="optout" class="optout-label">
        <input type="checkbox" id="optout" bind:value={opt_out} />
        Check then click below to opt out of sharing your information with this organization.
    </label>
    {#if opt_out}
    <p><button on:click={store} class="simple">Confirm opt out</button></p>
    {/if}
    {/if}

    {/if}
{/if}

{#if testing}
<div style="text-align: left">
<p>For testing only:</p>
<button on:click={resetTagsTapped}>Reset Tags Tapped</button>
<ul class="test-tag-list">
    {#each tag_list as tag}
    <li><a href={'/?' + btoa(tag)}>{tag}</a></li>
    {/each}
</ul>
</div>
{/if}
{/if}
</div>