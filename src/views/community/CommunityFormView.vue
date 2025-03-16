<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()
const route = useRoute()
const communityStore = useCommunityStore()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => isEditMode.value ? 'Modifier la communauté' : 'Créer une nouvelle communauté')
const submitButtonText = computed(() => isEditMode.value ? 'Mettre à jour' : 'Créer')

const communityData = reactive({
  name: '',
  description: '',
  type: 'public', // public, private, secret
  category: '',
  location: '',
  website: '',
  coverImage: null,
  logo: null
})

const errors = reactive({
  name: '',
  description: '',
  type: '',
  category: '',
  form: ''
})

const categories = [
  { id: 'sports', name: 'Sports et loisirs' },
  { id: 'culture', name: 'Culture et arts' },
  { id: 'education', name: 'Éducation et formation' },
  { id: 'professional', name: 'Professionnel et business' },
  { id: 'technology', name: 'Technologie et innovation' },
  { id: 'health', name: 'Santé et bien-être' },
  { id: 'environment', name: 'Environnement et écologie' },
  { id: 'social', name: 'Social et humanitaire' },
  { id: 'other', name: 'Autre' }
]

const isLoading = ref(false)
const showSuccessAlert = ref(false)
const successMessage = ref('')

onMounted(async () => {
  if (isEditMode.value) {
    await fetchCommunityDetails()
  }
})

const fetchCommunityDetails = async () => {
  isLoading.value = true
  try {
    const communityId = route.params.id
    const community = await communityStore.fetchCommunityById(communityId)
    
    if (community) {
      communityData.name = community.name || ''
      communityData.description = community.description || ''
      communityData.type = community.type || 'public'
      communityData.category = community.category || ''
      communityData.location = community.location || ''
      communityData.website = community.website || ''
      // Les images seront gérées séparément
    }
  } catch (error) {
    errors.form = 'Erreur lors du chargement des détails de la communauté'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  let isValid = true
  
  // Réinitialiser les erreurs
  errors.name = ''
  errors.description = ''
  errors.type = ''
  errors.category = ''
  errors.form = ''
  
  // Valider le nom
  if (!communityData.name) {
    errors.name = 'Le nom de la communauté est requis'
    isValid = false
  } else if (communityData.name.length < 3) {
    errors.name = 'Le nom doit contenir au moins 3 caractères'
    isValid = false
  }
  
  // Valider la description
  if (!communityData.description) {
    errors.description = 'La description est requise'
    isValid = false
  } else if (communityData.description.length < 10) {
    errors.description = 'La description doit contenir au moins 10 caractères'
    isValid = false
  }
  
  // Valider le type
  if (!communityData.type) {
    errors.type = 'Le type de communauté est requis'
    isValid = false
  }
  
  // Valider la catégorie
  if (!communityData.category) {
    errors.category = 'La catégorie est requise'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errors.form = ''
  
  try {
    if (isEditMode.value) {
      await communityStore.updateCommunity(route.params.id, communityData)
      successMessage.value = 'La communauté a été mise à jour avec succès !'
    } else {
      await communityStore.createCommunity(communityData)
      successMessage.value = 'La communauté a été créée avec succès !'
    }
    
    showSuccessAlert.value = true
    
    // Rediriger après un court délai pour montrer le message de succès
    setTimeout(() => {
      router.push({ name: 'community-list' })
    }, 1500)
  } catch (error) {
    errors.form = error || `Une erreur est survenue lors de ${isEditMode.value ? 'la mise à jour' : 'la création'} de la communauté`
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'community-list' })
}

const handleImageUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Vérifier le type de fichier
  if (!file.type.includes('image/')) {
    errors.form = 'Le fichier doit être une image'
    return
  }
  
  // Vérifier la taille du fichier (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.form = 'L\'image ne doit pas dépasser 5MB'
    return
  }
  
  // Créer un URL pour prévisualiser l'image
  const reader = new FileReader()
  reader.onload = (e) => {
    if (type === 'cover') {
      communityData.coverImage = e.target.result
    } else if (type === 'logo') {
      communityData.logo = e.target.result
    }
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-6">
      <button 
        @click="handleCancel" 
        class="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
    </div>

    <BaseCard padding="large" shadow="md">
      <BaseAlert
        v-if="showSuccessAlert"
        type="success"
        :message="successMessage"
        :dismissible="false"
        :auto-close="true"
      />
      
      <BaseAlert
        v-if="errors.form"
        type="error"
        :message="errors.form"
      />
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informations de base -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Informations de base</h2>
          
          <BaseInput
            v-model="communityData.name"
            label="Nom de la communauté"
            type="text"
            placeholder="Ex: Club de Tennis de Paris"
            :required="true"
            :error="errors.name"
          />
          
          <div class="mt-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <div class="mt-1">
              <textarea
                id="description"
                v-model="communityData.description"
                rows="4"
                placeholder="Décrivez votre communauté en quelques phrases..."
                class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.description }"
              ></textarea>
            </div>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Type de communauté</label>
            <div class="mt-2 space-y-4">
              <div class="flex items-center">
                <input
                  id="type-public"
                  v-model="communityData.type"
                  name="community-type"
                  type="radio"
                  value="public"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="type-public" class="ml-3 block text-sm font-medium text-gray-700">
                  Publique
                  <span class="block text-sm text-gray-500">Tout le monde peut voir et rejoindre cette communauté</span>
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="type-private"
                  v-model="communityData.type"
                  name="community-type"
                  type="radio"
                  value="private"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="type-private" class="ml-3 block text-sm font-medium text-gray-700">
                  Privée
                  <span class="block text-sm text-gray-500">Tout le monde peut voir cette communauté, mais seuls les membres invités peuvent la rejoindre</span>
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  id="type-secret"
                  v-model="communityData.type"
                  name="community-type"
                  type="radio"
                  value="secret"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="type-secret" class="ml-3 block text-sm font-medium text-gray-700">
                  Secrète
                  <span class="block text-sm text-gray-500">Seuls les membres peuvent voir et accéder à cette communauté</span>
                </label>
              </div>
            </div>
            <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
          </div>
          
          <div class="mt-4">
            <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              id="category"
              v-model="communityData.category"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              :class="{ 'border-red-500': errors.category }"
            >
              <option value="" disabled>Sélectionnez une catégorie</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
          </div>
        </div>
        
        <!-- Informations supplémentaires -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires (optionnel)</h2>
          
          <BaseInput
            v-model="communityData.location"
            label="Lieu"
            type="text"
            placeholder="Ex: Paris, France"
          />
          
          <BaseInput
            v-model="communityData.website"
            label="Site web"
            type="url"
            placeholder="Ex: https://www.monsite.com"
            class="mt-4"
          />
        </div>
        
        <!-- Images -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Images</h2>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Image de couverture</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <div v-if="communityData.coverImage" class="mb-4">
                  <img :src="communityData.coverImage" alt="Aperçu de l'image de couverture" class="mx-auto h-40 object-cover rounded" />
                </div>
                <svg
                  v-else
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="cover-image-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Télécharger une image</span>
                    <input
                      id="cover-image-upload"
                      name="cover-image-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleImageUpload($event, 'cover')"
                    />
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Logo</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <div v-if="communityData.logo" class="mb-4">
                  <img :src="communityData.logo" alt="Aperçu du logo" class="mx-auto h-24 w-24 object-cover rounded-full" />
                </div>
                <svg
                  v-else
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="logo-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Télécharger un logo</span>
                    <input
                      id="logo-upload"
                      name="logo-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleImageUpload($event, 'logo')"
                    />
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boutons d'action -->
        <div class="flex justify-end space-x-3 pt-6">
          <BaseButton
            type="button"
            variant="secondary"
            @click="handleCancel"
          >
            Annuler
          </BaseButton>
          
          <BaseButton
            type="submit"
            variant="primary"
            :loading="isLoading"
          >
            {{ submitButtonText }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
