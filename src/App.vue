<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

// État pour gérer l'affichage du menu mobile
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Vérifier si l'utilisateur est authentifié
const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token')
})

// Récupérer les informations de l'utilisateur
const user = computed(() => {
  return authStore.user
})

// Fonction pour obtenir les initiales de l'utilisateur
const getUserInitials = computed(() => {
  if (!user.value) return 'U';
  const firstName = user.value.firstName || '';
  const lastName = user.value.lastName || '';
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
})

// Fermer le menu mobile lors du changement de route
onMounted(() => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
})

// Fonction pour déconnexion
const logout = () => {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}

// Fonction pour basculer le menu utilisateur
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// Fermer le menu utilisateur si on clique ailleurs
const closeUserMenu = (event) => {
  if (!event.target.closest('.user-menu-container')) {
    isUserMenuOpen.value = false
  }
}

// Ajouter un écouteur d'événement pour fermer le menu utilisateur
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

// Supprimer l'écouteur d'événement lors du démontage du composant
onMounted(() => {
  return () => {
    document.removeEventListener('click', closeUserMenu)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Barre de navigation -->
    <nav class="bg-white shadow-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <RouterLink to="/" class="text-indigo-600 font-bold text-xl">HubGroupes</RouterLink>
          </div>

          <!-- Navigation desktop et avatar -->
          <div class="hidden sm:flex sm:items-center sm:space-x-4">
            <div class="flex items-center space-x-4 mr-4">
              <RouterLink to="/" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Accueil
              </RouterLink>
              <template v-if="isAuthenticated">
                <RouterLink to="/communities"
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Communautés
                </RouterLink>
                <RouterLink to="/members"
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Membres
                </RouterLink>
                <RouterLink to="/activities"
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Activités
                </RouterLink>
                <RouterLink to="/announcements"
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Annonces
                </RouterLink>
                <RouterLink to="/marketplace"
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Marketplace
                </RouterLink>
              </template>
            </div>

            <!-- Avatar et dropdown -->
            <div class="flex items-center">
              <template v-if="isAuthenticated">
                <!-- Avatar de l'utilisateur avec dropdown -->
                <div class="relative user-menu-container">
                  <button @click="toggleUserMenu" class="flex items-center focus:outline-none">
                    <div v-if="user && user.avatar" class="h-8 w-8 rounded-full overflow-hidden">
                      <img :src="user.avatar" alt="Avatar de l'utilisateur" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
                      {{ getUserInitials }}
                    </div>
                  </button>

                  <!-- Menu dropdown -->
                  <div v-if="isUserMenuOpen"
                    class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                    <RouterLink to="/messages"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Messages
                    </RouterLink>
                    <RouterLink to="/profile"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil
                    </RouterLink>
                    <button @click="logout"
                      class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </template>
              <template v-else>
                <RouterLink to="/login"
                  class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium mr-2">
                  Connexion
                </RouterLink>
                <RouterLink to="/register"
                  class="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Inscription
                </RouterLink>
              </template>
            </div>
          </div>

          <!-- Bouton menu mobile -->
          <div class="flex items-center sm:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path v-if="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu mobile -->
      <div :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <RouterLink to="/"
            class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
            Accueil
          </RouterLink>
          <template v-if="isAuthenticated">
            <RouterLink to="/communities"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Communautés
            </RouterLink>
            <RouterLink to="/members"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Membres
            </RouterLink>
            <RouterLink to="/activities"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Activités
            </RouterLink>
            <RouterLink to="/announcements"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Annonces
            </RouterLink>
            <RouterLink to="/marketplace"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Marketplace
            </RouterLink>

            <!-- Informations utilisateur -->
            <div class="border-t border-gray-200 mt-2 pt-2">
              <div class="flex items-center px-3 py-2">
                <div v-if="user && user.avatar" class="h-8 w-8 rounded-full overflow-hidden mr-3">
                  <img :src="user.avatar" alt="Avatar de l'utilisateur" class="h-full w-full object-cover" />
                </div>
                <div v-else class="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white mr-3">
                  {{ getUserInitials }}
                </div>
                <div class="text-gray-700">
                  <p class="text-sm font-medium">{{ user ? `${user.firstName} ${user.lastName}` : 'Utilisateur' }}</p>
                  <p class="text-xs opacity-75">{{ user ? user.email : '' }}</p>
                </div>
              </div>
            </div>

            <RouterLink to="/messages"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Messages
            </RouterLink>
            <RouterLink to="/profile"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Profil
            </RouterLink>
            <button @click="logout"
              class="w-full text-left text-gray-700 bg-red-500 hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium">
              Déconnexion
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Connexion
            </RouterLink>
            <RouterLink to="/register"
              class="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Inscription
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="w-full mx-auto  overflow-x-hidden"
      :class="{ 'py-4 mx-auto px-4 sm:px-6 lg:px-8': route.path !== '/' }">
      <RouterView />
    </main>

    <!-- Pied de page -->
    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-gray-500 text-sm"> 2025 HubGroupes. Tous droits réservés.</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
