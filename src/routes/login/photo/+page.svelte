<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { user, userData, storage, db } from "$lib/firebase";
    import { doc, updateDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  
    let previewURL: string;
    let uploading = false;
    $: href = `/${$userData?.username}/edit`;
  
    const upload = async (e: any) => {
      uploading = true;
      const file = e.target.files[0];
      previewURL = URL.createObjectURL(file);
      const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
      const result = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(result.ref);
  
      await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
      uploading = false;

    }
  </script>
  
  <AuthCheck>
    <h2 class="card-title">Upload a Profile Photo</h2>
  
    <form class="w-full max-w-screen-md">
      <div class="flex flex-col items-center w-full max-w-xs mx-auto my-10 text-center form-control">
        {#if $userData?.photoURL}
        <img
          src={previewURL ?? $userData?.photoURL ?? "/user.png"}
          alt="photoURL"
          width="256"
          height="256"
          class="mx-auto rounded-lg"
        />
        {:else}
        <div class='grid items-center w-64 h-64 rounded-lg bg-neutral-focus'>
            <p class="text-primary">Välj en bild</p>
        </div>
        {/if}
        <label for="photoURL" class="label">
          <span class="label-text">Välj en bild</span>
        </label>
        <input
          on:change={upload}
          name="photoURL"
          type="file"
          class="w-full max-w-xs file-input file-input-bordered"
          accept="image/png, image/jpeg, image/gif, image/webp"
        />
        {#if uploading}
          <div class="flex flex-col items-center w-full mt-2">
              <p>Laddar upp...</p>
              <progress class="w-56 mt-6 progress progress-info" />
          </div>
        {/if}
      </div>
    </form>
  
    <a {href} class="btn btn-primary">Klar!</a>
  </AuthCheck>
  