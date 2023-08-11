<script lang="ts">
  import { auth, user } from "$lib/firebase";

  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
  }

  async function signOutSSR() {
    const res = await fetch("/api/signin", { method: "DELETE" });
    await signOut(auth);
  }
</script>


{#if $user}
<h2 class='card-title'>Hej {$user.displayName}!</h2>
<p class="text-success">Du är inloggad</p>
  <button class="btn btn-warning" on:click={() => signOutSSR()}>Logga ut</button>
  
  {:else}
  <button class="btn btn-primary" on:click={signInWithGoogle}>Logga in med Google</button>
  {/if}