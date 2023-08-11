<script lang="ts">
    import { page } from "$app/stores";
	import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
  </script>
  
  <nav class="flex justify-center my-6">
    <ul class="steps">
      <a href="/login" class="step step-primary">Logga in</a>
      <a
        href="/login/username"
        class="step"
        class:step-primary={$page.route.id?.match(/username|photo/g)}>
        Välj användarnamn
      </a>
      <a
        href="/login/photo"
        class="step"
        class:step-primary={$page.route.id?.includes("photo")}>
        Ladda upp foto
      </a>
    </ul>
  </nav>
  
  <AnimatedRoute>
    <main class="w-4/6 mx-auto card bg-neutral text-neutral-content">
      <div class="items-center text-center card-body">
        <slot />
      </div>
    </main>
  </AnimatedRoute>