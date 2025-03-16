import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMemberStore = defineStore('member', () => {
  // État
  const members = ref([])
  const currentMember = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allMembers = computed(() => members.value)
  const activeMembers = computed(() => 
    members.value.filter(member => member.status === 'active')
  )
  const getMemberById = computed(() => (id) => 
    members.value.find(member => member.id === parseInt(id))
  )

  // Actions
  async function fetchMembers(communityId = null) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const url = communityId ? `/communities/${communityId}/members` : '/members'
      // const response = await api.get(url)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          members: [
            {
              id: 1,
              name: 'Jean Dupont',
              email: 'jean.dupont@example.com',
              phone: '+33 6 12 34 56 78',
              status: 'active',
              role: 'admin',
              joinedAt: '2024-01-10',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              communityId: communityId || 1
            },
            {
              id: 2,
              name: 'Marie Martin',
              email: 'marie.martin@example.com',
              phone: '+33 6 23 45 67 89',
              status: 'active',
              role: 'member',
              joinedAt: '2024-01-15',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
              communityId: communityId || 1
            },
            {
              id: 3,
              name: 'Pierre Durand',
              email: 'pierre.durand@example.com',
              phone: '+33 6 34 56 78 90',
              status: 'active',
              role: 'member',
              joinedAt: '2024-02-05',
              avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
              communityId: communityId || 2
            },
            {
              id: 4,
              name: 'Sophie Petit',
              email: 'sophie.petit@example.com',
              phone: '+33 6 45 67 89 01',
              status: 'inactive',
              role: 'member',
              joinedAt: '2024-02-10',
              avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
              communityId: communityId || 2
            }
          ]
        }
      }
      
      // Si un communityId est fourni, filtrer les membres
      if (communityId) {
        members.value = response.data.members.filter(m => m.communityId === parseInt(communityId))
      } else {
        members.value = response.data.members
      }
      
      return members.value
    } catch (err) {
      error.value = err.message || 'Erreur lors de la récupération des membres'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberById(id) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.get(`/members/${id}`)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          member: {
            id: parseInt(id),
            name: `Membre ${id}`,
            email: `membre${id}@example.com`,
            phone: `+33 6 ${id}${id} ${id}${id} ${id}${id} ${id}${id}`,
            status: 'active',
            role: id === '1' ? 'admin' : 'member',
            joinedAt: '2024-01-10',
            avatar: `https://randomuser.me/api/portraits/${parseInt(id) % 2 === 0 ? 'women' : 'men'}/${id}.jpg`,
            address: '123 Rue Principale, Ville',
            birthDate: '1990-01-01',
            bio: `Biographie du membre ${id}`,
            skills: ['Communication', 'Organisation', 'Leadership'],
            interests: ['Sport', 'Culture', 'Technologie'],
            communityId: 1
          }
        }
      }
      
      currentMember.value = response.data.member
      return response.data.member
    } catch (err) {
      error.value = err.message || `Erreur lors de la récupération du membre ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function inviteMember(memberData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post('/members/invite', memberData)
      
      // Pour la démo, on simule une réponse
      const response = {
        data: {
          success: true,
          message: `Invitation envoyée à ${memberData.email}`
        }
      }
      
      return response.data
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'envoi de l\'invitation'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function createMember(memberData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.post('/members', memberData)
      
      // Pour la démo, on simule une réponse
      const newMember = {
        id: members.value.length + 1,
        ...memberData,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 10) + 1}.jpg`
      }
      
      const response = {
        data: {
          member: newMember
        }
      }
      
      members.value.push(response.data.member)
      return response.data.member
    } catch (err) {
      error.value = err.message || 'Erreur lors de la création du membre'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function updateMember(id, memberData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // const response = await api.put(`/members/${id}`, memberData)
      
      // Pour la démo, on simule une mise à jour
      const index = members.value.findIndex(m => m.id === parseInt(id))
      
      if (index !== -1) {
        const updatedMember = {
          ...members.value[index],
          ...memberData
        }
        
        members.value[index] = updatedMember
        
        if (currentMember.value && currentMember.value.id === parseInt(id)) {
          currentMember.value = updatedMember
        }
        
        return updatedMember
      }
      
      throw new Error('Membre non trouvé')
    } catch (err) {
      error.value = err.message || `Erreur lors de la mise à jour du membre ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function deleteMember(id) {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'un appel API (à remplacer par un vrai appel API)
      // await api.delete(`/members/${id}`)
      
      // Pour la démo, on simule une suppression
      const index = members.value.findIndex(m => m.id === parseInt(id))
      
      if (index !== -1) {
        members.value.splice(index, 1)
        
        if (currentMember.value && currentMember.value.id === parseInt(id)) {
          currentMember.value = null
        }
        
        return true
      }
      
      throw new Error('Membre non trouvé')
    } catch (err) {
      error.value = err.message || `Erreur lors de la suppression du membre ${id}`
      throw error.value
    } finally {
      loading.value = false
    }
  }

  function clearCurrentMember() {
    currentMember.value = null
  }

  return {
    // État
    members,
    currentMember,
    loading,
    error,
    
    // Getters
    allMembers,
    activeMembers,
    getMemberById,
    
    // Actions
    fetchMembers,
    fetchMemberById,
    inviteMember,
    createMember,
    updateMember,
    deleteMember,
    clearCurrentMember
  }
})
