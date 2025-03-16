<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const credentials = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  form: ''
})

const isLoading = ref(false)
const showSuccessAlert = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.email = ''
  errors.password = ''
  errors.form = ''
  
  // Valider l'email
  if (!credentials.email) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }
  
  // Valider le mot de passe
  if (!credentials.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (credentials.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errors.form = ''
  
  try {
    await authStore.login(credentials)
    showSuccessAlert.value = true
    
    // Rediriger après un court délai pour montrer le message de succès
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 1500)
  } catch (error) {
    errors.form = error || 'Une erreur est survenue lors de la connexion'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Connexion à votre compte
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link :to="{ name: 'register' }" class="font-medium text-indigo-600 hover:text-indigo-500">
          créez un nouveau compte
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard padding="large" shadow="lg">
        <BaseAlert
          v-if="showSuccessAlert"
          type="success"
          message="Connexion réussie ! Redirection en cours..."
          :dismissible="false"
          :auto-close="true"
        />
        
        <BaseAlert
          v-if="errors.form"
          type="error"
          message="Erreur de connexion. Veuillez vérifier vos identifiants."
          :dismissible="true"
        />
        
        <form class="space-y-6" @submit.prevent="handleLogin">
          <BaseInput
            v-model="credentials.email"
            label="Adresse email"
            type="email"
            placeholder="votre@email.com"
            :required="true"
            :error="errors.email"
          />
          
          <BaseInput
            v-model="credentials.password"
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            :required="true"
            :error="errors.password"
          />
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
          
          <div>
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="isLoading"
              :full-width="true"
            >
              Se connecter
            </BaseButton>
          </div>
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a
                href="#"
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span class="sr-only">Se connecter avec Google</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
              </a>
            </div>

            <div>
              <a
                href="#"
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span class="sr-only">Se connecter avec Facebook</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
