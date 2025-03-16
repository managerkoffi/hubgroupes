<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LandingLayout from './components/layout/LandingLayout.vue'
import AuthLayout from './components/layout/AuthLayout.vue'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()

// Déterminer quel layout utiliser en fonction de la route
const currentLayout = computed(() => {
  // Pages d'authentification
  if (route.name === 'login' || route.name === 'register') {
    return 'auth-layout'
  }
  
  // Page d'accueil
  if (route.path === '/') {
    return 'landing-layout'
  }
  
  // Toutes les autres pages (application)
  return 'app-layout'
})
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script>
export default {
  components: {
    'landing-layout': LandingLayout,
    'auth-layout': AuthLayout,
    'app-layout': AppLayout
  }
}
</script>
