<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Inviter des membres</h1>
      <p class="mt-2 text-gray-600">Invitez de nouveaux membres à rejoindre votre communauté</p>
    </div>

    <form @submit.prevent="submitInvitations">
      <!-- Sélection de la communauté -->
      <div class="mb-6">
        <label for="community" class="block text-sm font-medium text-gray-700 mb-1">Communauté</label>
        <select
          id="community"
          v-model="selectedCommunity"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="" disabled>Sélectionnez une communauté</option>
          <option v-for="community in communities" :key="community.id" :value="community.id">
            {{ community.name }}
          </option>
        </select>
        <p v-if="errors.community" class="mt-1 text-sm text-red-600">{{ errors.community }}</p>
      </div>

      <!-- Type d'invitation -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Type d'invitation</label>
        <div class="flex space-x-4">
          <div class="flex items-center">
            <input
              id="type-individual"
              v-model="invitationType"
              type="radio"
              value="individual"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label for="type-individual" class="ml-2 block text-sm text-gray-700">
              Invitation individuelle
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="type-bulk"
              v-model="invitationType"
              type="radio"
              value="bulk"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label for="type-bulk" class="ml-2 block text-sm text-gray-700">
              Invitation en masse
            </label>
          </div>
        </div>
      </div>

      <!-- Invitation individuelle -->
      <div v-if="invitationType === 'individual'" class="space-y-4 mb-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            id="name"
            v-model="individualInvite.name"
            type="text"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nom du membre"
            required
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="individualInvite.email"
            type="email"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="email@exemple.com"
            required
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
          <input
            id="phone"
            v-model="individualInvite.phone"
            type="tel"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            id="role"
            v-model="individualInvite.role"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="member">Membre</option>
            <option value="admin">Administrateur</option>
            <option value="moderator">Modérateur</option>
          </select>
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message personnalisé (optionnel)</label>
          <textarea
            id="message"
            v-model="individualInvite.message"
            rows="3"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Message d'invitation personnalisé..."
          ></textarea>
        </div>
      </div>

      <!-- Invitation en masse -->
      <div v-if="invitationType === 'bulk'" class="space-y-4 mb-6">
        <div>
          <label for="bulk-emails" class="block text-sm font-medium text-gray-700 mb-1">Emails (un par ligne)</label>
          <textarea
            id="bulk-emails"
            v-model="bulkInvite.emails"
            rows="5"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="email1@exemple.com&#10;email2@exemple.com&#10;email3@exemple.com"
            required
          ></textarea>
          <p v-if="errors.bulkEmails" class="mt-1 text-sm text-red-600">{{ errors.bulkEmails }}</p>
          <p class="mt-1 text-sm text-gray-500">Vous pouvez également importer un fichier CSV</p>
        </div>
        <div>
          <label for="csv-file" class="block text-sm font-medium text-gray-700 mb-1">Importer un fichier CSV</label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p class="mt-1 text-sm text-gray-500">Format: email,nom,téléphone,rôle</p>
        </div>
        <div>
          <label for="bulk-role" class="block text-sm font-medium text-gray-700 mb-1">Rôle par défaut</label>
          <select
            id="bulk-role"
            v-model="bulkInvite.defaultRole"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="member">Membre</option>
            <option value="admin">Administrateur</option>
            <option value="moderator">Modérateur</option>
          </select>
        </div>
        <div>
          <label for="bulk-message" class="block text-sm font-medium text-gray-700 mb-1">Message commun (optionnel)</label>
          <textarea
            id="bulk-message"
            v-model="bulkInvite.message"
            rows="3"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Message d'invitation commun..."
          ></textarea>
        </div>
      </div>

      <!-- Options d'invitation -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Options d'invitation</h3>
        <div class="space-y-2">
          <div class="flex items-center">
            <input
              id="send-email"
              v-model="inviteOptions.sendEmail"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="send-email" class="ml-2 block text-sm text-gray-700">
              Envoyer une invitation par email
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="send-sms"
              v-model="inviteOptions.sendSMS"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="send-sms" class="ml-2 block text-sm text-gray-700">
              Envoyer une invitation par SMS
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="auto-approve"
              v-model="inviteOptions.autoApprove"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="auto-approve" class="ml-2 block text-sm text-gray-700">
              Approuver automatiquement les inscriptions
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="expire-invite"
              v-model="inviteOptions.expireInvite"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="expire-invite" class="ml-2 block text-sm text-gray-700">
              Définir une date d'expiration
            </label>
          </div>
          <div v-if="inviteOptions.expireInvite" class="ml-6 mt-2">
            <label for="expire-date" class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
            <input
              id="expire-date"
              v-model="inviteOptions.expireDate"
              type="date"
              class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :min="minDate"
              required
            />
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3">
        <RouterLink
          to="/members"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </RouterLink>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <span v-if="loading">Envoi en cours...</span>
          <span v-else>Envoyer les invitations</span>
        </button>
      </div>
    </form>

    <!-- Résultats de l'invitation -->
    <div v-if="invitationResults.length > 0" class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Résultats des invitations</h3>
      <div class="bg-gray-50 p-4 rounded-md">
        <div v-for="(result, index) in invitationResults" :key="index" class="mb-2 last:mb-0">
          <div :class="[
            'flex items-center',
            result.success ? 'text-green-700' : 'text-red-700'
          ]">
            <svg v-if="result.success" class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ result.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/member'
import { useCommunityStore } from '@/stores/community'
import { RouterLink } from 'vue-router'

const router = useRouter()
const memberStore = useMemberStore()
const communityStore = useCommunityStore()

// État local
const selectedCommunity = ref('')
const invitationType = ref('individual')
const individualInvite = ref({
  name: '',
  email: '',
  phone: '',
  role: 'member',
  message: ''
})
const bulkInvite = ref({
  emails: '',
  defaultRole: 'member',
  message: ''
})
const inviteOptions = ref({
  sendEmail: true,
  sendSMS: false,
  autoApprove: false,
  expireInvite: false,
  expireDate: null
})
const errors = ref({})
const loading = ref(false)
const invitationResults = ref([])

// Computed properties
const communities = computed(() => communityStore.communities)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Récupération des données
onMounted(async () => {
  try {
    await communityStore.fetchCommunities()
    // Pré-sélectionner la première communauté si disponible
    if (communities.value.length > 0) {
      selectedCommunity.value = communities.value[0].id
    }
  } catch (error) {
    console.error('Erreur lors du chargement des communautés:', error)
  }
})

// Méthodes
function validateForm() {
  errors.value = {}
  let isValid = true

  if (!selectedCommunity.value) {
    errors.value.community = 'Veuillez sélectionner une communauté'
    isValid = false
  }

  if (invitationType.value === 'individual') {
    if (!individualInvite.value.name) {
      errors.value.name = 'Le nom est requis'
      isValid = false
    }
    if (!individualInvite.value.email) {
      errors.value.email = 'L\'email est requis'
      isValid = false
    } else if (!isValidEmail(individualInvite.value.email)) {
      errors.value.email = 'L\'email n\'est pas valide'
      isValid = false
    }
  } else if (invitationType.value === 'bulk') {
    if (!bulkInvite.value.emails) {
      errors.value.bulkEmails = 'Veuillez entrer au moins un email'
      isValid = false
    } else {
      const emails = bulkInvite.value.emails.split('\n').filter(email => email.trim() !== '')
      if (emails.length === 0) {
        errors.value.bulkEmails = 'Veuillez entrer au moins un email'
        isValid = false
      } else {
        const invalidEmails = emails.filter(email => !isValidEmail(email.trim()))
        if (invalidEmails.length > 0) {
          errors.value.bulkEmails = `${invalidEmails.length} email(s) ne sont pas valides`
          isValid = false
        }
      }
    }
  }

  if (inviteOptions.value.expireInvite && !inviteOptions.value.expireDate) {
    errors.value.expireDate = 'Veuillez sélectionner une date d\'expiration'
    isValid = false
  }

  return isValid
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    const lines = content.split('\n')
    const validLines = lines.filter(line => line.trim() !== '')
    bulkInvite.value.emails = validLines.map(line => {
      const parts = line.split(',')
      return parts[0].trim() // Prendre uniquement l'email
    }).join('\n')
  }
  reader.readAsText(file)
}

async function submitInvitations() {
  if (!validateForm()) return

  loading.value = true
  invitationResults.value = []

  try {
    if (invitationType.value === 'individual') {
      const result = await memberStore.inviteMember({
        communityId: selectedCommunity.value,
        name: individualInvite.value.name,
        email: individualInvite.value.email,
        phone: individualInvite.value.phone,
        role: individualInvite.value.role,
        message: individualInvite.value.message,
        options: inviteOptions.value
      })
      
      invitationResults.value.push({
        success: true,
        message: `Invitation envoyée à ${individualInvite.value.email}`
      })
      
      // Réinitialiser le formulaire
      individualInvite.value = {
        name: '',
        email: '',
        phone: '',
        role: 'member',
        message: ''
      }
    } else if (invitationType.value === 'bulk') {
      const emails = bulkInvite.value.emails.split('\n').filter(email => email.trim() !== '')
      
      const results = await memberStore.inviteMembers({
        communityId: selectedCommunity.value,
        emails: emails,
        defaultRole: bulkInvite.value.defaultRole,
        message: bulkInvite.value.message,
        options: inviteOptions.value
      })
      
      // Simuler des résultats pour la démo
      invitationResults.value = emails.map(email => ({
        success: Math.random() > 0.2, // 80% de réussite
        message: Math.random() > 0.2 
          ? `Invitation envoyée à ${email}` 
          : `Échec de l'envoi à ${email}`
      }))
      
      // Réinitialiser le formulaire
      bulkInvite.value = {
        emails: '',
        defaultRole: 'member',
        message: ''
      }
    }
    
    // Notification de succès
    setTimeout(() => {
      router.push('/members')
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de l\'envoi des invitations:', error)
    invitationResults.value.push({
      success: false,
      message: `Erreur: ${error.message || 'Une erreur est survenue'}`
    })
  } finally {
    loading.value = false
  }
}
</script>
