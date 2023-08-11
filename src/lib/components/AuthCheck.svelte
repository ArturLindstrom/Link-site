<script lang='ts'>
  import { user } from '$lib/firebase'
</script>

{#if $user}
<slot />
{:else}
<p class="text-error">Du behöver logga in för att se den här sidan</p>
<a class="btn btn-primary" href="/login">Logga in</a>
{/if}
