<script>
import { onMount } from 'svelte';
import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import axios from 'axios';

let pusher;
let pusher_channel;
Pusher.logToConsole = true;

let leaderboard;

function refreshLeaderboard() {
  axios.get('/leaderboard-data').then((response) => {
    leaderboard = response.data;
  });
}

onMount(() => {
  console.log('mounting');
  document.body.classList.add('leaderboard');
  pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: 'us2'
  });

  pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
  pusher_channel.bind('user', function(data) {
    refreshLeaderboard();
  });

  console.log('refreshing data and leaderboard');
  refreshLeaderboard();
});
</script>

<header>
  <div>
    <div class="logo">
      <img src="/nfc-logo.png" />
    </div>
    <div class="heading">
      <h1>Multi-Chamber Business Expo & <br>Business After hours <strong>Leaderboard</strong></h1>
      <ul>
        <li>New Albany</li>
        <li>Johnstown</li>
        <li>Pataskala</li>
      </ul>
    </div>
  </div>
</header>
<div class="leaderboard-container flex">
<!--
<div>
  <h3>Latest</h3>
  <table>
    <tbody>
      {#if leaderboard}
      {#each leaderboard.latest as late}
      <tr>
        <td>{late.name.split(' ')[0]} | <span class="org-name">{late.organization}</span></td>
        <td>{late.tag_count} tap{late.tag_count == 1 ? '' : 's'}</td>
      </tr>
      {/each}
      {/if}
    </tbody>
  </table>
</div>
-->
<div>
  <h3>Top 10 Participants (most taps)</h3>
  <ul class="leaderboard-list">
    {#if leaderboard}
    {#each leaderboard.leaders as lead}
    <li>
      <div class="label"><span class="participant-name">{lead.name.split(' ')[0]}</span> | <span class="org-name">{lead.organization}</span></div>
      <div class="score">{lead.tag_count} tap{lead.tag_count == 1 ? '' : 's'}</div>
    </li>
    {/each}
    {/if}
    </ul>
</div>
<div>
  <h3>Top 10 Businesses (most received taps)</h3>
  <ul class="leaderboard-list">
    {#if leaderboard}
    {#each leaderboard.tags as tag}
    <li>
      <div class="label participant-name">{tag.name}</div>
      <div class="score">{tag.user_tag_count} participants</div>
    </li>
    {/each}
    {/if}
  </ul>
</div>
</div>