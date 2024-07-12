<script>
import { PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_KEY } from "$env/static/public";
import axios from 'axios';
import { Chart } from 'chart.js';
import Pusher from 'pusher-js';
import { onMount } from 'svelte';
import VoteChart from '../../components/VoteChart.svelte';

let pusher;
let pusher_channel;
Pusher.logToConsole = true;

let leaderboard;

let data = {
    labels: ['Harry Potter', 'Lord of the Rings'],
    datasets: [
        {
        label: '# Votes',
        data: [],
        backgroundColor: [
            'rgba(255, 134,159,0.4)',
            'rgba(255, 177, 101,0.4)',
        ],
        borderWidth: 2,
        borderColor: [
            'rgba(255, 134, 159, 1)',
            'rgba(255, 177, 101, 1)',
        ],
        },
    ],
};

Chart.defaults.font.size = 26;

let options = {
  legend: {
    display: false
  },
  responsive: true,
};

function refreshVotes() {
  axios.get('/api/vote_count').then((response) => {
    data.datasets[0].data = [response.data[0].vote_count, response.data[1].vote_count];
    data = data;
  });
}

function refreshLeaderboard() {
  axios.get('/api/leaderboard').then((response) => {
    leaderboard = response.data;
  });
}

onMount(() => {
  console.log('mounting');
  pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: 'us2'
  });

  pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
  pusher_channel.bind('vote', function(data) {
    refreshVotes();
  });
  pusher_channel.bind('user', function(data) {
    refreshLeaderboard();
  });

  console.log('refreshing data and leaderboard');
  refreshVotes();
  refreshLeaderboard();
});
</script>

<style>
  .chart {
    width: 70%;
    margin: 0 auto 20px;
  }
</style>

<div class="chart">
<VoteChart {data} {options} />
</div>

<div class="flex">
<div>
  <h3>Latest</h3>
  <table>
    <thead>
      <th>Name</th>
      <th>Library</th>
    </thead>
    <tbody>
      {#if leaderboard}
      {#each leaderboard.latest as late}
      <tr>
        <td>{late.name}</td>
        <td>{late.library}</td>
      </tr>
      {/each}
      {/if}
    </tbody>
  </table>
</div>
<div>
  <h3>Leaders</h3>
  <table>
    <thead>
      <th>Name</th>
      <th>Library</th>
      <th>Tags</th>
    </thead>
    <tbody>
      {#if leaderboard}
      {#each leaderboard.leaders as lead}
      <tr>
        <td>{lead.name}</td>
        <td>{lead.library}</td>
        <td class="center">{lead.tags_tapped.split(/,/).length}</td>
      </tr>
      {/each}
      {/if}
    </tbody>
  </table>
</div>
<div>
  <h3>Libraries</h3>
  <table>
    <thead>
      <th>Library</th>
      <th>Participants</th>
    </thead>
    <tbody>
      {#if leaderboard}
      {#each leaderboard.libraries as lib}
      <tr>
        <td>{lib.library}</td>
        <td class="center">{lib.library_count}</td>
      </tr>
      {/each}
      {/if}
    </tbody>
  </table>
</div>
</div>