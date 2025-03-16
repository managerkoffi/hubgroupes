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

const userData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  form: ''
})

const isLoading = ref(false)
const showSuccessAlert = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.form = ''
  
  // Valider le prénom
  if (!userData.firstName) {
    errors.firstName = 'Le prénom est requis'
    isValid = false
  }
  
  // Valider le nom
  if (!userData.lastName) {
    errors.lastName = 'Le nom est requis'
    isValid = false
  }
  
  // Valider l'email
  if (!userData.email) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }
  
  // Valider le mot de passe
  if (!userData.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (userData.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }
  
  // Valider la confirmation du mot de passe
  if (!userData.confirmPassword) {
    errors.confirmPassword = 'Veuillez confirmer votre mot de passe'
    isValid = false
  } else if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errors.form = ''
  
  try {
    await authStore.register({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password
    })
    
    showSuccessAlert.value = true
    
    // Rediriger après un court délai pour montrer le message de succès
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } catch (error) {
    errors.form = error || 'Une erreur est survenue lors de l\'inscription'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Créer un nouveau compte
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ou
        <router-link :to="{ name: 'login' }" class="font-medium text-indigo-600 hover:text-indigo-500">
          connectez-vous à votre compte existant
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard padding="large" shadow="lg">
        <BaseAlert
          v-if="showSuccessAlert"
          type="success"
          message="Inscription réussie ! Vous allez être redirigé vers la page de connexion..."
          :dismissible="false"
          :auto-close="true"
        />
        
        <BaseAlert
          v-if="errors.form"
          type="error"
          message="Erreur lors de l'inscription. Veuillez réessayer."
          :dismissible="true"
        />
        
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="userData.firstName"
              label="Prénom"
              type="text"
              placeholder="Jean"
              :required="true"
              :error="errors.firstName"
            />
            
            <BaseInput
              v-model="userData.lastName"
              label="Nom"
              type="text"
              placeholder="Dupont"
              :required="true"
              :error="errors.lastName"
            />
          </div>
          
          <BaseInput
            v-model="userData.email"
            label="Adresse email"
            type="email"
            placeholder="votre@email.com"
            :required="true"
            :error="errors.email"
          />
          
          <BaseInput
            v-model="userData.password"
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            :required="true"
            :error="errors.password"
          />
          
          <BaseInput
            v-model="userData.confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            :required="true"
            :error="errors.confirmPassword"
          />
          
          <div class="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              required
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              J'accepte les <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">conditions d'utilisation</a> et la <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">politique de confidentialité</a>
            </label>
          </div>
          
          <div>
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="isLoading"
              :full-width="true"
            >
              S'inscrire
            </BaseButton>
          </div>
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Ou s'inscrire avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a
                href="#"
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span class="sr-only">S'inscrire avec Google</span>
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
                <span class="sr-only">S'inscrire avec Facebook</span>
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
