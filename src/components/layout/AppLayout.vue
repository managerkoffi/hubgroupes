<script setup>
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Contenu principal -->
    <div class="flex-1 overflow-auto">
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout'
}
</script>
