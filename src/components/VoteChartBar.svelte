<script>
  import { Bar } from 'svelte-chartjs';

  export let data = {};
  export let options = {};

  import {
  	BarElement,
  	CategoryScale,
  	Chart,
  	Legend,
  	LinearScale,
  	Title,
  	Tooltip,
  } from 'chart.js';

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );
</script>

<Bar {data} {options} />