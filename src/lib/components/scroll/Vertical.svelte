<div class="overflow-y-auto vertical">
   <slot></slot>
</div>

<style>
   .vertical {
      max-width: 100%;
      scrollbar-color: var(--primary-color) #f5f5f5;
      scrollbar-width: thin;
   }

   .vertical::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
   }

   .vertical::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
   }

   .vertical::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: var(--primary-color);
   }
</style>