<script>
import { onMount } from 'svelte';
import Pusher from 'pusher-js';
import { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_EVENT } from "$env/static/public";
import axios from 'axios';
import VoteChart from '../../components/VoteChart.svelte';

let pusher;
let pusher_channel;
Pusher.logToConsole = true;

let users;

function refreshUsers() {
  axios.get('/user').then((response) => {
    users = response.data;
  });
}

onMount(() => {
  console.log('mounting');
  pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: 'us2'
  });

  pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
  pusher_channel.bind('user', function(data) {
    refreshUsers();
  });

  refreshUsers();
});
</script>

<div>
  <h3>Latest</h3>
  <table>
    <thead>
      <th>ID</th>
      <th>Name</th>
      <th>Library</th>
      <th>Email</th>
      <th>Tags Tapped</th>
      <th>CTA Success</th>
    </thead>
    <tbody>
      {#if users}
      {#each users as user}
      <tr>
        <td>{user.ID}</td>
        <td>{user.name}</td>
        <td>{user.library}</td>
        <td>{user.email}</td>
        <td>{user.tags_tapped}</td>
        <td>{user.cta_success}</td>
      </tr>
      {/each}
      {/if}
    </tbody>
  </table>
</div>