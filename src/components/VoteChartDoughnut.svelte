<script>
    import { Doughnut } from 'svelte-chartjs';
  
    export let data = {};
    export let options = { responsive: true, };

    import {
    	ArcElement,
    	CategoryScale,
    	Chart as ChartJS,
    	Legend,
    	Title,
    	Tooltip,
    } from 'chart.js';

    ChartJS.register(
      Title,
      Tooltip,
      Legend,
      ArcElement,
      CategoryScale
    );
  </script>
 
  <Doughnut {data} {options} />