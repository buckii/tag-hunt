<script>
import { PUBLIC_PUSHER_CHANNEL, PUBLIC_PUSHER_KEY } from "$env/static/public";
import axios from 'axios';
import { Chart } from 'chart.js';
import Pusher from 'pusher-js';
import { onMount } from 'svelte';
import VoteChart from '../../../../components/VoteChartDoughnut.svelte';

export let data;
let pusher;
let pusher_channel;
//Pusher.logToConsole = true;

let leaderboard;

let chart_data = {
    labels: [],
    datasets: [
        {
        label: '# Votes',
        data: [],
        backgroundColor: [
            '#5DBF8C',
            '#595959',
            '#DE5D36',
            '#ECBF64',
            '#458DCD',
            '#C4C4C4',
        ],
        borderWidth: 2,
        borderColor: [
            '#5DBF8C',
            '#595959',
            '#DE5D36',
            '#ECBF64',
            '#458DCD',
            '#C4C4C4',
        ],
        },
    ],
};

Chart.defaults.font.size = 22;

let options = {
  legend: {
    display: false
  },
  responsive: true,
};

function refreshVotes() {
  axios.get('/api/vote_counts/' + data.vote.id).then((response) => {
    let vote_options = JSON.parse(response.data.vote.vote_options);
    chart_data.datasets[0].data = response.data.values.map((v) => v.vote_count);
    chart_data.labels = response.data.values.map((v) => v.value);
    chart_data = chart_data;
  });
}

function refreshLeaderboard() {
  axios.get('/api/leaderboard').then((response) => {
    leaderboard = response.data;
  });
}

onMount(() => {
  pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: 'us2'
  });

  pusher_channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
  pusher_channel.bind('vote', function(data) {
    refreshVotes();
  });

  refreshVotes();
});
</script>

<style>
  .chart {
    margin: -30px auto 20px;
    background: #fff;
    max-height: 80vh;
  }
  h1 {
    color: #0772BA;
    text-transform: none;
    padding: 20px 0;
  }
  :global(main) {
    background: #fff;
    padding: 0 0 1px;
  }

  :global(footer) {
    background: #fff;
    padding-top: 0;
  }
  :global(footer .logos) {
    display: none;
  }
</style>

  <h1>{data.vote.description}</h1>
  <div class="chart">
    <VoteChart data={chart_data} {options} />
    <canvas></canvas>
  </div>