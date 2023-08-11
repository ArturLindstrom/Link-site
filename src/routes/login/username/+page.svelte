<script lang="ts">
	import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user, userData } from "$lib/firebase";
  import { doc, getDoc, writeBatch } from "firebase/firestore";

  let username = "";
  let loading = false;
  let isAvailable = false;
  let debounceTimer: NodeJS.Timeout;

  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  
  $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !isAvailable && !loading
  
  const confirmUsername = async () => {
    console.log("confirming username", username);
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), { 
      username, 
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: 'I am the Walrus',
      links: [
        {
          title: 'Test Link',
          url: 'https://kung.foo',
          icon: 'custom'
        }
      ]
    });

    await batch.commit();

    username = '';
    isAvailable = false;
  }
  const checkAvailability = async () => {
    isAvailable = false;
    clearTimeout(debounceTimer);
    loading = true;

    debounceTimer = setTimeout(async () => {
      const docRef = doc(db, "usernames", username);
      const exists = await getDoc(docRef).then((doc) => doc.exists());
      isAvailable = !exists;
      loading = false;
    }, 500);
  }
    
</script>

<AuthCheck>
  {#if $userData?.username}
    <h2 class='text-lg'>Ditt användarnamn är: <span class="font-bold text-secondary">@{$userData.username}</span></h2>
    <p class="text-sm">(Du kan inte ändra ditt användarnamn)</p>
    <a href="/login/photo" class="btn btn-primary">Ladda upp profilbild</a>
  {:else}
  <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
    <input
      type="text"
      placeholder="Username"
      class="w-full input"
      bind:value={username}
      on:input={checkAvailability}
      class:input-error={(!isValid && isTouched)}
      class:input-warning={isTaken}
      class:input-success={isAvailable && isValid && !loading}
    />

    <div class="w-full px-8 my-4 min-h-16">
      {#if loading && isTouched}
        <p class="text-secondary">Kontrollerar om <span class="text-primary">@{username}</span> är ledigt...</p>
      {/if}
  
      {#if !isValid && isTouched}
        <p class="text-sm text-error">
          Måste vara 3-16 tecken långt, och får bara innehålla bokstäver, siffror, punkter och understreck.
        </p>
      {/if}
  
      {#if isValid && !isAvailable && !loading}
        <p class="text-sm text-warning">
          @{username} är upptaget 🫡
        </p>
      {/if}
  
      {#if isAvailable && isValid && !loading}
        <button class="w-full mt-1 btn btn-success">Bekräfta användarnamn: @{username} </button>
      {/if}
    </div>
  </form>
  {/if}

</AuthCheck>