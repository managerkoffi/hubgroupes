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
  phoneNumber: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: '',
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
  errors.phoneNumber = ''
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

  // Valider le numéro de téléphone
  if (!userData.phoneNumber) {
    errors.phoneNumber = 'Le numéro de téléphone est requis'
    isValid = false
  } else if (!/^(\+\d{1,3})?\d{9,10}$/.test(userData.phoneNumber.replace(/\s/g, ''))) {
    errors.phoneNumber = 'Format de numéro de téléphone invalide'
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
      phoneNumber: userData.phoneNumber,
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

  <div class=" sm:mx-auto sm:w-full sm:max-w-md">

    <BaseCard padding="large" shadow="lg">
      <div class="sm:mx-auto sm:w-full sm:max-w-md mb-5">
        <h2 class=" text-center text-3xl font-bold tracking-tight text-gray-900">
          <span class="text-indigo-600">HubGroupes</span>
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Créez un nouveau compte
        </p>
      </div>
      <BaseAlert v-if="showSuccessAlert" type="success"
        message="Inscription réussie ! Vous allez être redirigé vers la page de connexion..." :dismissible="false"
        :auto-close="true" />

      <BaseAlert v-if="errors.form" type="error" message="Erreur lors de l'inscription. Veuillez réessayer."
        :dismissible="true" />

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div class="grid grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-2">
          <BaseInput v-model="userData.firstName" label="Prénom" type="text" placeholder="Jean" :required="true"
            :error="errors.firstName" />

          <BaseInput v-model="userData.lastName" label="Nom" type="text" placeholder="Dupont" :required="true"
            :error="errors.lastName" />
        </div>

        <BaseInput v-model="userData.phoneNumber" label="Numéro de téléphone" type="tel" placeholder="+33 6 12 34 56 78"
          :required="true" :error="errors.phoneNumber" />

        <div class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <BaseInput v-model="userData.password" label="Mot de passe" type="password" placeholder="••••••••"
            :required="true" :error="errors.password" />

          <BaseInput v-model="userData.confirmPassword" label="Confirmer le mot de passe" type="password"
            placeholder="••••••••" :required="true" :error="errors.confirmPassword" />
        </div>

        <div>
          <BaseButton type="submit" variant="primary" size="lg" :loading="isLoading" :full-width="true">
            S'inscrire
          </BaseButton>
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 mb-2">
          Déjà inscrit ? <router-link :to="{ name: 'login' }" class="font-medium text-indigo-600 hover:text-indigo-500">Connectez-vous</router-link>
        </p>
        <p class="text-xs text-gray-500">
          &copy; 2025 HubGroupes - La plateforme de gestion de communautés
        </p>
      </div>
    </BaseCard>
  </div>
</template>
