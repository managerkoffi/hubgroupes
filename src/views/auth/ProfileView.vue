<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const authStore = useAuthStore()

const userProfile = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  form: ''
})

const isLoading = ref(false)
const isPasswordLoading = ref(false)
const showSuccessAlert = ref(false)
const showPasswordSuccessAlert = ref(false)
const activeTab = ref('profile')

onMounted(async () => {
  try {
    const user = await authStore.fetchUserProfile()
    if (user) {
      userProfile.firstName = user.firstName || ''
      userProfile.lastName = user.lastName || ''
      userProfile.email = user.email || ''
      userProfile.phone = user.phone || ''
      userProfile.bio = user.bio || ''
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
  }
})

const validateProfileForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.phone = ''
  errors.bio = ''
  errors.form = ''
  
  // Valider le prénom
  if (!userProfile.firstName) {
    errors.firstName = 'Le prénom est requis'
    isValid = false
  }
  
  // Valider le nom
  if (!userProfile.lastName) {
    errors.lastName = 'Le nom est requis'
    isValid = false
  }
  
  // Valider l'email
  if (!userProfile.email) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(userProfile.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }
  
  // Valider le téléphone (optionnel)
  if (userProfile.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(userProfile.phone)) {
    errors.phone = 'Format de téléphone invalide'
    isValid = false
  }
  
  return isValid
}

const validatePasswordForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmNewPassword = ''
  errors.form = ''
  
  // Valider le mot de passe actuel
  if (!userProfile.currentPassword) {
    errors.currentPassword = 'Le mot de passe actuel est requis'
    isValid = false
  }
  
  // Valider le nouveau mot de passe
  if (!userProfile.newPassword) {
    errors.newPassword = 'Le nouveau mot de passe est requis'
    isValid = false
  } else if (userProfile.newPassword.length < 8) {
    errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }
  
  // Valider la confirmation du nouveau mot de passe
  if (!userProfile.confirmNewPassword) {
    errors.confirmNewPassword = 'Veuillez confirmer votre nouveau mot de passe'
    isValid = false
  } else if (userProfile.newPassword !== userProfile.confirmNewPassword) {
    errors.confirmNewPassword = 'Les mots de passe ne correspondent pas'
    isValid = false
  }
  
  return isValid
}

const updateProfile = async () => {
  if (!validateProfileForm()) return
  
  isLoading.value = true
  errors.form = ''
  
  try {
    await authStore.updateProfile({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      bio: userProfile.bio
    })
    
    showSuccessAlert.value = true
    
    // Masquer l'alerte après un délai
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  } catch (error) {
    errors.form = error || 'Une erreur est survenue lors de la mise à jour du profil'
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  if (!validatePasswordForm()) return
  
  isPasswordLoading.value = true
  errors.form = ''
  
  try {
    await authStore.updatePassword({
      currentPassword: userProfile.currentPassword,
      newPassword: userProfile.newPassword
    })
    
    // Réinitialiser les champs de mot de passe
    userProfile.currentPassword = ''
    userProfile.newPassword = ''
    userProfile.confirmNewPassword = ''
    
    showPasswordSuccessAlert.value = true
    
    // Masquer l'alerte après un délai
    setTimeout(() => {
      showPasswordSuccessAlert.value = false
    }, 3000)
  } catch (error) {
    errors.form = error || 'Une erreur est survenue lors de la mise à jour du mot de passe'
  } finally {
    isPasswordLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
    
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar avec photo de profil et navigation -->
      <div class="w-full md:w-1/4">
        <BaseCard>
          <div class="flex flex-col items-center">
            <div class="relative">
              <img
                class="h-32 w-32 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Photo de profil"
              />
              <button
                type="button"
                class="absolute bottom-0 right-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Modifier la photo</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
            <h2 class="mt-4 text-xl font-medium text-gray-900">{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
            <p class="text-sm text-gray-500">{{ userProfile.email }}</p>
          </div>
          
          <div class="mt-6 border-t border-gray-200 pt-4">
            <nav class="flex flex-col space-y-1">
              <button
                @click="activeTab = 'profile'"
                class="px-3 py-2 text-sm font-medium rounded-md"
                :class="activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
              >
                Informations personnelles
              </button>
              <button
                @click="activeTab = 'security'"
                class="px-3 py-2 text-sm font-medium rounded-md"
                :class="activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
              >
                Sécurité
              </button>
              <button
                @click="activeTab = 'notifications'"
                class="px-3 py-2 text-sm font-medium rounded-md"
                :class="activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
              >
                Notifications
              </button>
              <button
                @click="activeTab = 'billing'"
                class="px-3 py-2 text-sm font-medium rounded-md"
                :class="activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
              >
                Facturation
              </button>
            </nav>
          </div>
        </BaseCard>
      </div>
      
      <!-- Contenu principal -->
      <div class="w-full md:w-3/4">
        <!-- Informations personnelles -->
        <BaseCard v-if="activeTab === 'profile'" title="Informations personnelles">
          <BaseAlert
            v-if="showSuccessAlert"
            type="success"
            message="Vos informations ont été mises à jour avec succès !"
            :auto-close="true"
          />
          
          <BaseAlert
            v-if="errors.form && activeTab === 'profile'"
            type="error"
            :message="errors.form"
          />
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <BaseInput
                v-model="userProfile.firstName"
                label="Prénom"
                type="text"
                :required="true"
                :error="errors.firstName"
              />
              
              <BaseInput
                v-model="userProfile.lastName"
                label="Nom"
                type="text"
                :required="true"
                :error="errors.lastName"
              />
            </div>
            
            <BaseInput
              v-model="userProfile.email"
              label="Adresse email"
              type="email"
              :required="true"
              :error="errors.email"
            />
            
            <BaseInput
              v-model="userProfile.phone"
              label="Téléphone"
              type="tel"
              :error="errors.phone"
            />
            
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <div class="mt-1">
                <textarea
                  id="bio"
                  v-model="userProfile.bio"
                  rows="4"
                  class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  :class="{ 'border-red-500': errors.bio }"
                ></textarea>
              </div>
              <p v-if="errors.bio" class="mt-1 text-sm text-red-600">{{ errors.bio }}</p>
            </div>
            
            <div class="flex justify-end">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="isLoading"
              >
                Enregistrer les modifications
              </BaseButton>
            </div>
          </form>
        </BaseCard>
        
        <!-- Sécurité -->
        <BaseCard v-if="activeTab === 'security'" title="Sécurité">
          <BaseAlert
            v-if="showPasswordSuccessAlert"
            type="success"
            message="Votre mot de passe a été mis à jour avec succès !"
            :auto-close="true"
          />
          
          <BaseAlert
            v-if="errors.form && activeTab === 'security'"
            type="error"
            :message="errors.form"
          />
          
          <form @submit.prevent="updatePassword" class="space-y-6">
            <BaseInput
              v-model="userProfile.currentPassword"
              label="Mot de passe actuel"
              type="password"
              :required="true"
              :error="errors.currentPassword"
            />
            
            <BaseInput
              v-model="userProfile.newPassword"
              label="Nouveau mot de passe"
              type="password"
              :required="true"
              :error="errors.newPassword"
            />
            
            <BaseInput
              v-model="userProfile.confirmNewPassword"
              label="Confirmer le nouveau mot de passe"
              type="password"
              :required="true"
              :error="errors.confirmNewPassword"
            />
            
            <div class="flex justify-end">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="isPasswordLoading"
              >
                Mettre à jour le mot de passe
              </BaseButton>
            </div>
          </form>
          
          <div class="mt-8 border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900">Sessions actives</h3>
            <p class="mt-1 text-sm text-gray-500">Si nécessaire, vous pouvez vous déconnecter de toutes vos autres sessions de navigateur sur tous vos appareils.</p>
            
            <div class="mt-4">
              <BaseButton
                variant="danger"
              >
                Se déconnecter des autres sessions
              </BaseButton>
            </div>
          </div>
          
          <div class="mt-8 border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-red-600">Zone de danger</h3>
            <p class="mt-1 text-sm text-gray-500">Une fois que vous supprimez votre compte, toutes vos ressources et données seront définitivement supprimées.</p>
            
            <div class="mt-4">
              <BaseButton
                variant="danger"
              >
                Supprimer mon compte
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Notifications -->
        <BaseCard v-if="activeTab === 'notifications'" title="Notifications">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Notifications par email</h3>
              <p class="mt-1 text-sm text-gray-500">Choisissez les types de notifications que vous souhaitez recevoir par email.</p>
              
              <div class="mt-4 space-y-4">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="comments" class="font-medium text-gray-700">Commentaires</label>
                    <p class="text-gray-500">Recevez une notification lorsque quelqu'un commente sur votre profil.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="events"
                      name="events"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="events" class="font-medium text-gray-700">Événements</label>
                    <p class="text-gray-500">Recevez une notification lorsqu'un événement est créé ou modifié.</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="messages"
                      name="messages"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="messages" class="font-medium text-gray-700">Messages</label>
                    <p class="text-gray-500">Recevez une notification lorsque vous recevez un message.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900">Notifications push</h3>
              <p class="mt-1 text-sm text-gray-500">Configurez les notifications push sur votre appareil mobile.</p>
              
              <div class="mt-4">
                <div class="flex items-center">
                  <button
                    type="button"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    role="switch"
                    aria-checked="false"
                  >
                    <span class="sr-only">Activer les notifications push</span>
                    <span class="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                      <span class="opacity-0 duration-100 ease-out absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                        <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                          <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span class="opacity-100 duration-200 ease-in absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden="true">
                        <svg class="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                  <span class="ml-3">
                    <span class="text-sm font-medium text-gray-900">Activer les notifications push</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <BaseButton
                variant="primary"
              >
                Enregistrer les préférences
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Facturation -->
        <BaseCard v-if="activeTab === 'billing'" title="Facturation">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Plan actuel</h3>
              <div class="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <div>
                  <p class="text-sm font-medium text-gray-900">Plan Gratuit</p>
                  <p class="text-sm text-gray-500">Accès aux fonctionnalités de base</p>
                </div>
                <BaseButton
                  variant="secondary"
                  size="sm"
                >
                  Mettre à niveau
                </BaseButton>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900">Méthode de paiement</h3>
              <p class="mt-1 text-sm text-gray-500">Aucune méthode de paiement enregistrée</p>
              
              <div class="mt-4">
                <BaseButton
                  variant="secondary"
                  size="sm"
                >
                  Ajouter une méthode de paiement
                </BaseButton>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900">Historique de facturation</h3>
              <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore de factures</p>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
