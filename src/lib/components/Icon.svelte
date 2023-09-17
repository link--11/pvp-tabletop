<script>
   export let path
   export let size = 24

   let _class = ""
   export { _class as class }
</script>

<svg viewBox="0 0 {size} {size}" fill="currentColor" class={_class} on:click>
   <path fill-rule="evenodd" clip-rule="evenodd" d={path} />
</svg>

<style>
   svg {
      display: inline-block;
      width: 2em;
      height: 2em;
      overflow: visible;
      transform-origin: 50% 50%;
   }
</style>