<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot></slot>
    </main>
    <AppFooter />
  </div>
</template>

<script>
export default {
  name: 'LandingLayout'
}
</script>
