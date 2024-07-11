<script>
import { onMount } from 'svelte';
import axios from 'axios';

let tags;

function refreshTags() {
  axios.get('/api/tags').then((response) => {
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
  margin: 0 auto;
  max-width: 400px;
}
li.card {
  position: relative;
  list-style: none none;
  page-break-before: always;
  padding: 30px 0;
}
.powered-by-link {
  display: none;
  color: #000;
}
.qr img {
  width: 100px;
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
}
</style>

<ul class="cards">
  {#if tags}
  {#each tags as tag}
  <li class="card">
    <div class="footer">
      <div class="qr">
        <img alt="QR code" src={'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + window.location.protocol + ':/' + window.location.host + '/' + tag.url} />
      </div>
      <div class="tag-name"><a href="{tag.url}">{tag.name}</a></div>
      <div class="tag-id">{tag.id}</div>
      <div class="powered-by-link">
        <a href="https://www.buckeyeinnovation.com/" target="_blank"><img src="/powered-by-buckii-dark.svg" alt="Powered by Buckeye Innovation" /></a>
      </div>
    </div>
  </li>
  {/each}
  {/if}
</ul>