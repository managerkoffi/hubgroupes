import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivityStore = defineStore('activity', () => {
  // État
  const activities = ref([])
  const currentActivity = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allActivities = computed(() => activities.value)
  const upcomingActivities = computed(() => 
    activities.value.filter(activity => new Date(activity.date) >= new Date())
  )
  const pastActivities = computed(() => 
    activities.value.filter(activity => new Date(activity.date) < new Date())
  )
  const getActivityById = computed(() => (id) => 
    activities.value.find(activity => activity.id === parseInt(id))
  )

  // Actions
  async function fetchActivities(communityId = null) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const url = communityId ? `/communities/${communityId}/activities` : '/activities'
      // const response = await api.get(url)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          activities: [
            {
              id: 1,
              title: 'Tournoi de Tennis',
              description: 'Tournoi amical ouvert à tous les niveaux',
              date: '2025-04-15',
              time: '14:00',
              location: 'Courts de tennis municipaux',
              status: 'upcoming',
              maxParticipants: 20,
              currentParticipants: 12,
              organizer: 'Jean Dupont',
              communityId: 1,
              image: 'https://placehold.co/600x400?text=Tennis'
            },
            {
              id: 2,
              title: 'Exposition d\'Art',
              description: 'Exposition des œuvres des membres de l\'association',
              date: '2025-05-10',
              time: '10:00',
              location: 'Galerie municipale',
              status: 'upcoming',
              maxParticipants: 50,
              currentParticipants: 25,
              organizer: 'Marie Martin',
              communityId: 2,
              image: 'https://placehold.co/600x400?text=Art'
            },
            {
              id: 3,
              title: 'Club de Lecture - Mars',
              description: 'Discussion autour du livre "Les Misérables"',
              date: '2025-03-05',
              time: '18:30',
              location: 'Bibliothèque centrale',
              status: 'past',
              maxParticipants: 15,
              currentParticipants: 15,
              organizer: 'Sophie Petit',
              communityId: 3,
              image: 'https://placehold.co/600x400?text=Lecture'
            }
          ]
        }
      }
      
      // Si un communityId est fourni, filtrer les activités
      if (communityId) {
        activities.value = response.data.activities.filter(a => a.communityId === parseInt(communityId))
      } else {
        activities.value = response.data.activities
      }
      
      return activities.value
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des activités'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function fetchActivityById(id) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get(`/activities/${id}`)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          activity: {
            id: parseInt(id),
            title: `Activité ${id}`,
            description: `Description détaillée de l'activité ${id}. Cette activité est organisée pour tous les membres de la communauté.`,
            date: '2025-04-15',
            time: '14:00',
            endTime: '17:00',
            location: 'Lieu de l\'activité',
            status: 'upcoming',
            maxParticipants: 20,
            currentParticipants: 12,
            organizer: 'Jean Dupont',
            organizerId: 1,
            communityId: 1,
            image: `https://placehold.co/600x400?text=Activité${id}`,
            price: 10,
            currency: 'EUR',
            tags: ['Sport', 'Loisir', 'Plein air'],
            participants: [
              { id: 1, name: 'Jean Dupont', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
              { id: 2, name: 'Marie Martin', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
              { id: 3, name: 'Pierre Durand', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }
            ],
            reports: [
              {
                id: 1,
                title: 'Compte-rendu de l\'activité',
                content: 'L\'activité s\'est très bien déroulée avec une forte participation.',
                author: 'Jean Dupont',
                date: '2025-04-16',
                images: ['https://placehold.co/600x400?text=Report1', 'https://placehold.co/600x400?text=Report2']
              }
            ]
          }
        }
      }
      
      currentActivity.value = response.data.activity
      return response.data.activity
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération de l'activité ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function createActivity(activityData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post('/activities', activityData)
      
      // Pour la démo, on simule une réponse
      const newActivity = {
        id: activities.value.length + 1,
        ...activityData,
        status: 'upcoming',
        currentParticipants: 1,
        image: activityData.image || `https://placehold.co/600x400?text=${encodeURIComponent(activityData.title)}`
      }
      
      const response = {
        data: {
          activity: newActivity
        }
      }
      
      activities.value.push(response.data.activity)
      return response.data.activity
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création de l\'activité'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function updateActivity(id, activityData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.put(`/activities/${id}`, activityData)
      
      // Pour la démo, on simule une mise à jour
      const index = activities.value.findIndex(a => a.id === parseInt(id))
      
      if (index !== -1) {
        const updatedActivity = {
          ...activities.value[index],
          ...activityData
        }
        
        activities.value[index] = updatedActivity
        
        if (currentActivity.value && currentActivity.value.id === parseInt(id)) {
          currentActivity.value = updatedActivity
        }
        
        return updatedActivity
      }
      
      throw new Error('Activité non trouvée')
    } catch (err) {
      error.value = err.message || `Erreur lors de la mise à jour de l'activité ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function deleteActivity(id) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // await api.delete(`/activities/${id}`)
      
      // Pour la démo, on simule une suppression
      const index = activities.value.findIndex(a => a.id === parseInt(id))
      
      if (index !== -1) {
        activities.value.splice(index, 1)
        
        if (currentActivity.value && currentActivity.value.id === parseInt(id)) {
          currentActivity.value = null
        }
        
        return true
      }
      
      throw new Error('Activité non trouvée')
    } catch (err) {
      error.value = err.message || `Erreur lors de la suppression de l'activité ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function joinActivity(activityId) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post(`/activities/${activityId}/join`)
      
      // Pour la démo, on simule une réponse
      const index = activities.value.findIndex(a => a.id === parseInt(activityId))
      
      if (index !== -1) {
        activities.value[index].currentParticipants += 1
        
        if (currentActivity.value && currentActivity.value.id === parseInt(activityId)) {
          currentActivity.value.currentParticipants += 1
        }
        
        return {
          success: true,
          message: 'Vous avez rejoint l\'activité avec succès'
        }
      }
      
      throw new Error('Activité non trouvée')
    } catch (err) {
      error.value = err.message || `Erreur lors de l'inscription à l'activité ${activityId}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function leaveActivity(activityId) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post(`/activities/${activityId}/leave`)
      
      // Pour la démo, on simule une réponse
      const index = activities.value.findIndex(a => a.id === parseInt(activityId))
      
      if (index !== -1 && activities.value[index].currentParticipants > 0) {
        activities.value[index].currentParticipants -= 1
        
        if (currentActivity.value && currentActivity.value.id === parseInt(activityId)) {
          currentActivity.value.currentParticipants -= 1
        }
        
        return {
          success: true,
          message: 'Vous avez quitté l\'activité avec succès'
        }
      }
      
      throw new Error('Activité non trouvée ou aucun participant')
    } catch (err) {
      error.value = err.message || `Erreur lors de la désinscription de l'activité ${activityId}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function addActivityReport(activityId, reportData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post(`/activities/${activityId}/reports`, reportData)
      
      // Pour la démo, on simule une réponse
      if (currentActivity.value && currentActivity.value.id === parseInt(activityId)) {
        const newReport = {
          id: (currentActivity.value.reports?.length || 0) + 1,
          ...reportData,
          date: new Date().toISOString().split('T')[0]
        }
        
        if (!currentActivity.value.reports) {
          currentActivity.value.reports = []
        }
        
        currentActivity.value.reports.push(newReport)
        
        return newReport
      }
      
      throw new Error('Activité non trouvée ou non chargée')
    } catch (err) {
      error.value = err.message || `Erreur lors de l'ajout du compte-rendu pour l'activité ${activityId}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  function clearCurrentActivity() {
    currentActivity.value = null
  }

  return {
    // État
    activities,
    currentActivity,
    loading,
    error,
    
    // Getters
    allActivities,
    upcomingActivities,
    pastActivities,
    getActivityById,
    
    // Actions
    fetchActivities,
    fetchActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    joinActivity,
    leaveActivity,
    addActivityReport,
    clearCurrentActivity
  }
})
