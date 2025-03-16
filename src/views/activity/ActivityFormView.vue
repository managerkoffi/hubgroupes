<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Modifier l\'activité' : 'Créer une nouvelle activité' }}</h1>
      <p class="mt-2 text-gray-600">{{ isEditMode ? 'Modifiez les détails de votre activité' : 'Complétez le formulaire pour créer une nouvelle activité' }}</p>
    </div>

    <form @submit.prevent="submitForm">
      <!-- Informations générales -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Informations générales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-1 md:col-span-2">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre de l'activité *</label>
            <input
              id="title"
              v-model="activity.title"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Titre de l'activité"
              required
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>
          
          <div class="col-span-1 md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              id="description"
              v-model="activity.description"
              rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Description détaillée de l'activité"
              required
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>
          
          <div>
            <label for="community" class="block text-sm font-medium text-gray-700 mb-1">Communauté *</label>
            <select
              id="community"
              v-model="activity.communityId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="" disabled>Sélectionnez une communauté</option>
              <option v-for="community in communities" :key="community.id" :value="community.id">
                {{ community.name }}
              </option>
            </select>
            <p v-if="errors.communityId" class="mt-1 text-sm text-red-600">{{ errors.communityId }}</p>
          </div>
          
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type d'activité *</label>
            <select
              id="type"
              v-model="activity.type"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="" disabled>Sélectionnez un type</option>
              <option value="meeting">Réunion</option>
              <option value="workshop">Atelier</option>
              <option value="training">Formation</option>
              <option value="event">Événement</option>
              <option value="conference">Conférence</option>
              <option value="other">Autre</option>
            </select>
            <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
          </div>
          
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image (optionnel)</label>
            <div class="flex items-center">
              <input
                id="image"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">Format recommandé: JPG, PNG. Max 2MB.</p>
          </div>
          
          <div>
            <label for="capacity" class="block text-sm font-medium text-gray-700 mb-1">Capacité maximale *</label>
            <input
              id="capacity"
              v-model.number="activity.capacity"
              type="number"
              min="1"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nombre maximum de participants"
              required
            />
            <p v-if="errors.capacity" class="mt-1 text-sm text-red-600">{{ errors.capacity }}</p>
          </div>
        </div>
      </div>

      <!-- Date et lieu -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Date et lieu</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
            <input
              id="startDate"
              v-model="activity.startDate"
              type="datetime-local"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p v-if="errors.startDate" class="mt-1 text-sm text-red-600">{{ errors.startDate }}</p>
          </div>
          
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
            <input
              id="endDate"
              v-model="activity.endDate"
              type="datetime-local"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p v-if="errors.endDate" class="mt-1 text-sm text-red-600">{{ errors.endDate }}</p>
          </div>
          
          <div>
            <label for="locationType" class="block text-sm font-medium text-gray-700 mb-1">Type de lieu *</label>
            <select
              id="locationType"
              v-model="activity.locationType"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="physical">Présentiel</option>
              <option value="online">En ligne</option>
              <option value="hybrid">Hybride</option>
            </select>
          </div>
          
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
            <input
              id="location"
              v-model="activity.location"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :placeholder="activity.locationType === 'online' ? 'Lien de la réunion (Zoom, Teams, etc.)' : 'Adresse physique'"
              required
            />
            <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location }}</p>
          </div>
          
          <div v-if="activity.locationType === 'online' || activity.locationType === 'hybrid'">
            <label for="meetingLink" class="block text-sm font-medium text-gray-700 mb-1">Lien de connexion</label>
            <input
              id="meetingLink"
              v-model="activity.meetingLink"
              type="url"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://zoom.us/j/123456789"
            />
          </div>
          
          <div v-if="activity.locationType === 'online' || activity.locationType === 'hybrid'">
            <label for="meetingId" class="block text-sm font-medium text-gray-700 mb-1">ID de réunion (optionnel)</label>
            <input
              id="meetingId"
              v-model="activity.meetingId"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="123 456 789"
            />
          </div>
        </div>
      </div>

      <!-- Options d'inscription -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Options d'inscription</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              id="requireRegistration"
              v-model="activity.requireRegistration"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="requireRegistration" class="ml-2 block text-sm text-gray-700">
              Inscription obligatoire
            </label>
          </div>
          
          <div v-if="activity.requireRegistration" class="ml-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="registrationDeadline" class="block text-sm font-medium text-gray-700 mb-1">Date limite d'inscription</label>
              <input
                id="registrationDeadline"
                v-model="activity.registrationDeadline"
                type="datetime-local"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label for="registrationType" class="block text-sm font-medium text-gray-700 mb-1">Type d'inscription</label>
              <select
                id="registrationType"
                v-model="activity.registrationType"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="free">Gratuit</option>
                <option value="paid">Payant</option>
              </select>
            </div>
            
            <div v-if="activity.registrationType === 'paid'">
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                id="price"
                v-model.number="activity.price"
                type="number"
                min="0"
                step="0.01"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label for="allowWaitlist" class="block text-sm font-medium text-gray-700 mb-1">Liste d'attente</label>
              <div class="flex items-center">
                <input
                  id="allowWaitlist"
                  v-model="activity.allowWaitlist"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="allowWaitlist" class="ml-2 block text-sm text-gray-700">
                  Activer la liste d'attente
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <input
              id="isPrivate"
              v-model="activity.isPrivate"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isPrivate" class="ml-2 block text-sm text-gray-700">
              Activité privée (visible uniquement par les membres invités)
            </label>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              id="sendNotifications"
              v-model="activity.sendNotifications"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="sendNotifications" class="ml-2 block text-sm text-gray-700">
              Envoyer des notifications aux membres
            </label>
          </div>
          
          <div v-if="activity.sendNotifications" class="ml-6 space-y-4">
            <div class="flex items-center">
              <input
                id="notifyEmail"
                v-model="activity.notifyEmail"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="notifyEmail" class="ml-2 block text-sm text-gray-700">
                Notification par email
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                id="notifySMS"
                v-model="activity.notifySMS"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="notifySMS" class="ml-2 block text-sm text-gray-700">
                Notification par SMS
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                id="notifyReminder"
                v-model="activity.notifyReminder"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="notifyReminder" class="ml-2 block text-sm text-gray-700">
                Envoyer un rappel avant l'activité
              </label>
            </div>
            
            <div v-if="activity.notifyReminder" class="ml-6">
              <label for="reminderTime" class="block text-sm font-medium text-gray-700 mb-1">Temps avant l'activité</label>
              <select
                id="reminderTime"
                v-model="activity.reminderTime"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="1h">1 heure avant</option>
                <option value="3h">3 heures avant</option>
                <option value="6h">6 heures avant</option>
                <option value="12h">12 heures avant</option>
                <option value="24h">1 jour avant</option>
                <option value="48h">2 jours avant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3">
        <RouterLink
          to="/activities"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </RouterLink>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <span v-if="loading">Enregistrement...</span>
          <span v-else>{{ isEditMode ? 'Mettre à jour' : 'Créer l\'activité' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import { useCommunityStore } from '@/stores/community'
import { RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activityStore = useActivityStore()
const communityStore = useCommunityStore()

// État local
const activityId = computed(() => route.params.id)
const isEditMode = computed(() => !!activityId.value)
const loading = ref(false)
const errors = ref({})

// Initialisation de l'activité
const activity = ref({
  title: '',
  description: '',
  communityId: '',
  type: '',
  image: null,
  capacity: 20,
  startDate: '',
  endDate: '',
  locationType: 'physical',
  location: '',
  meetingLink: '',
  meetingId: '',
  requireRegistration: true,
  registrationDeadline: '',
  registrationType: 'free',
  price: 0,
  allowWaitlist: true,
  isPrivate: false,
  sendNotifications: true,
  notifyEmail: true,
  notifySMS: false,
  notifyReminder: true,
  reminderTime: '24h',
  status: 'upcoming'
})

// Computed properties
const communities = computed(() => communityStore.communities)

// Récupération des données
onMounted(async () => {
  try {
    await communityStore.fetchCommunities()
    
    // Si mode édition, charger les données de l'activité
    if (isEditMode.value) {
      loading.value = true
      const activityData = await activityStore.fetchActivity(activityId.value)
      
      if (activityData) {
        // Remplir le formulaire avec les données existantes
        Object.keys(activity.value).forEach(key => {
          if (activityData[key] !== undefined) {
            activity.value[key] = activityData[key]
          }
        })
        
        // Formater les dates pour l'input datetime-local
        if (activity.value.startDate) {
          activity.value.startDate = formatDateForInput(activity.value.startDate)
        }
        if (activity.value.endDate) {
          activity.value.endDate = formatDateForInput(activity.value.endDate)
        }
        if (activity.value.registrationDeadline) {
          activity.value.registrationDeadline = formatDateForInput(activity.value.registrationDeadline)
        }
      }
      loading.value = false
    } else {
      // Initialiser les dates pour une nouvelle activité
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      activity.value.startDate = formatDateForInput(tomorrow)
      
      const endDate = new Date(tomorrow)
      endDate.setHours(endDate.getHours() + 2)
      activity.value.endDate = formatDateForInput(endDate)
      
      // Pré-sélectionner la première communauté si disponible
      if (communities.value.length > 0) {
        activity.value.communityId = communities.value[0].id
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    loading.value = false
  }
})

// Méthodes
function formatDateForInput(dateString) {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

function validateForm() {
  errors.value = {}
  let isValid = true

  // Validation du titre
  if (!activity.value.title.trim()) {
    errors.value.title = 'Le titre est requis'
    isValid = false
  }

  // Validation de la description
  if (!activity.value.description.trim()) {
    errors.value.description = 'La description est requise'
    isValid = false
  }

  // Validation de la communauté
  if (!activity.value.communityId) {
    errors.value.communityId = 'La communauté est requise'
    isValid = false
  }

  // Validation du type
  if (!activity.value.type) {
    errors.value.type = 'Le type d\'activité est requis'
    isValid = false
  }

  // Validation de la capacité
  if (!activity.value.capacity || activity.value.capacity <= 0) {
    errors.value.capacity = 'La capacité doit être un nombre positif'
    isValid = false
  }

  // Validation des dates
  if (!activity.value.startDate) {
    errors.value.startDate = 'La date de début est requise'
    isValid = false
  }

  if (!activity.value.endDate) {
    errors.value.endDate = 'La date de fin est requise'
    isValid = false
  }

  if (activity.value.startDate && activity.value.endDate) {
    const start = new Date(activity.value.startDate)
    const end = new Date(activity.value.endDate)
    
    if (end <= start) {
      errors.value.endDate = 'La date de fin doit être postérieure à la date de début'
      isValid = false
    }
  }

  // Validation du lieu
  if (!activity.value.location) {
    errors.value.location = 'Le lieu est requis'
    isValid = false
  }

  return isValid
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Vérifier le type de fichier
  if (!file.type.match('image.*')) {
    alert('Veuillez sélectionner une image')
    return
  }
  
  // Vérifier la taille du fichier (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('L\'image ne doit pas dépasser 2MB')
    return
  }
  
  // Simuler le stockage de l'image (dans une application réelle, on l'enverrait au serveur)
  const reader = new FileReader()
  reader.onload = (e) => {
    activity.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}

async function submitForm() {
  if (!validateForm()) {
    // Faire défiler jusqu'à la première erreur
    const firstErrorElement = document.querySelector('.text-red-600')
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  loading.value = true

  try {
    if (isEditMode.value) {
      await activityStore.updateActivity({
        id: activityId.value,
        ...activity.value
      })
      // Rediriger vers la page de détails de l'activité
      router.push(`/activities/${activityId.value}`)
    } else {
      const newActivity = await activityStore.createActivity(activity.value)
      // Rediriger vers la page de détails de la nouvelle activité
      router.push(`/activities/${newActivity.id}`)
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'activité:', error)
    alert(`Une erreur est survenue: ${error.message || 'Veuillez réessayer'}`)
  } finally {
    loading.value = false
  }
}
</script>
