<script>
import { onMount } from 'svelte';
import axios from 'axios';

let tags;

function refreshTags() {
  axios.get('/tags').then((response) => {
    tags = response.data.tags;
  });
}

onMount(() => {
  console.log('mounting');
  refreshTags();
});
</script>
<style>
.cards {
  padding: 0;
  margin: 0;
}
li.card {
  position: relative;
  list-style: none none;
  page-break-before: always;
  width: 100vw;
  height: 70vh;
}
.powered-by-link {
  color: #000;
}
.qr img {
  width: 50px;
}
.powered-by-link {

}
.powered-by-link img {
  width: 200px;
  margin: 7px auto 0;
}
.footer {
  display: flex;
  color: #000;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: .5em;
}
.tap {
  display: block;
  margin: 50px auto 20px;
  width: 40px;
}
</style>

<ul class="cards">
  {#if tags}
  {#each tags as tag}
  <li class="card">
    <img class="tap" src="tap.png" alt="tap NFC" />
    <div class="footer">
      <div class="qr">
        <img alt="QR code" src={'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + encodeURIComponent('https://tag.buckii.com/?' + btoa(tag.id))} />
      </div>
      <div class="powered-by-link">
        <a href="https://www.buckeyeinnovation.com/" target="_blank"><img src="/powered-by-buckii-dark.svg" alt="Powered by Buckeye Innovation" /></a>
      </div>
      <div class="tag-id">{tag.id}</div>
    </div>
  </li>
  {/each}
  {/if}
</ul>