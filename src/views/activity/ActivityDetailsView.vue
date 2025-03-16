<template>
    <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- En-tête avec image de couverture -->
        <div class="relative h-64 bg-gray-200">
            <img v-if="activity.image" :src="activity.image" :alt="activity.title" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-indigo-100">
                <svg class="h-24 w-24 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>

            <!-- Statut de l'activité -->
            <div class="absolute top-4 right-4">
                <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getStatusClass(activity.status)
                ]">
                    {{ getStatusText(activity.status) }}
                </span>
            </div>
        </div>
        
        <!-- Contenu principal -->
        <div class="p-6">
            <!-- Titre et actions -->
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ activity.title }}</h1>
                    <p class="mt-1 text-sm text-gray-500">
                        Organisé par {{ getCommunityName(activity.communityId) }}
                    </p>
                </div>
                <div class="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <RouterLink v-if="canEdit" :to="`/activities/${activityId}/edit`"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Modifier
                    </RouterLink>
                    <button v-if="canCancel && activity.status !== 'cancelled'" @click="cancelActivity"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <svg class="-ml-1 mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        Annuler
                    </button>
                    <button v-if="!isParticipant && activity.status === 'upcoming'" @click="registerForActivity"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clip-rule="evenodd" />
                        </svg>
                        S'inscrire
                    </button>
                    <button v-else-if="isParticipant && activity.status !== 'past' && activity.status !== 'cancelled'"
                        @click="cancelRegistration"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        Se désinscrire
                    </button>
                </div>
            </div>
            
            <!-- Informations principales -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="md:col-span-2">
                    <h2 class="text-lg font-medium text-gray-900 mb-3">À propos de cette activité</h2>
                    <div class="prose max-w-none text-gray-600">
                        <p>{{ activity.description }}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h2 class="text-lg font-medium text-gray-900 mb-3">Détails</h2>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3 text-sm text-gray-700">
                                <p class="font-medium">Date et heure</p>
                                <p>{{ formatDate(activity.startDate) }}</p>
                                <p>{{ formatTime(activity.startDate) }} - {{ formatTime(activity.endDate) }}</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3 text-sm text-gray-700">
                                <p class="font-medium">Lieu</p>
                                <p>{{ activity.location }}</p>
                                <p v-if="activity.locationType === 'online' || activity.locationType === 'hybrid'">
                                    <a v-if="activity.meetingLink" :href="activity.meetingLink" target="_blank"
                                        class="text-indigo-600 hover:text-indigo-900">
                                        Lien de connexion
                                    </a>
                                    <span v-if="activity.meetingId" class="block">ID: {{ activity.meetingId }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                            <div class="ml-3 text-sm text-gray-700">
                                <p class="font-medium">Participants</p>
                                <p>{{ activity.participants?.length || 0 }} / {{ activity.capacity }}</p>
                                <p v-if="activity.requireRegistration && activity.registrationDeadline">
                                    Inscription avant le {{ formatDate(activity.registrationDeadline) }}
                                </p>
                            </div>
                        </div>
                        <div v-if="activity.registrationType === 'paid'" class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3 text-sm text-gray-700">
                                <p class="font-medium">Prix</p>
                                <p>{{ activity.price }} €</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Onglets -->
            <div class="mb-6">
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button 
                            @click="activeTab = 'participants'" 
                            :class="[
                                'py-4 px-1 border-b-2 font-medium text-sm',
                                activeTab === 'participants'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]"
                        >
                            Participants
                        </button>
                        <button 
                            @click="activeTab = 'discussions'" 
                            :class="[
                                'py-4 px-1 border-b-2 font-medium text-sm',
                                activeTab === 'discussions'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]"
                        >
                            Discussions
                        </button>
                        <button 
                            @click="activeTab = 'materials'" 
                            :class="[
                                'py-4 px-1 border-b-2 font-medium text-sm',
                                activeTab === 'materials'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]"
                        >
                            Matériels
                        </button>
                        <button 
                            v-if="activity.status === 'past'"
                            @click="activeTab = 'summary'" 
                            :class="[
                                'py-4 px-1 border-b-2 font-medium text-sm',
                                activeTab === 'summary'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]"
                        >
                            Compte-rendu
                        </button>
                    </nav>
                </div>
            </div>
            
            <!-- Contenu des onglets -->
            <div class="mt-6">
                <!-- Onglet Participants -->
                <div v-if="activeTab === 'participants'" class="space-y-6">
                    <div v-if="canManageParticipants" class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Liste des participants</h3>
                        <button @click="openAddParticipantModal"
                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clip-rule="evenodd" />
                            </svg>
                            Ajouter un participant
                        </button>
                    </div>
                    
                    <div v-if="activity.participants && activity.participants.length > 0" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nom</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                                    <th v-if="canManageParticipants" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="participant in activity.participants" :key="participant.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {{ participant.firstName }} {{ participant.lastName }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ participant.email }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span :class="[
                                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                            participant.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                            participant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-gray-100 text-gray-800'
                                        ]">
                                            {{ participant.status === 'confirmed' ? 'Confirmé' : 
                                               participant.status === 'pending' ? 'En attente' : 'Annulé' }}
                                        </span>
                                    </td>
                                    <td v-if="canManageParticipants" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button @click="removeParticipant(participant.id)" class="text-red-600 hover:text-red-900">
                                            Retirer
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucun participant pour le moment.</p>
                    </div>
                </div>
                
                <!-- Onglet Discussions -->
                <div v-if="activeTab === 'discussions'" class="space-y-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Discussions</h3>
                        <button @click="openNewDiscussionModal"
                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clip-rule="evenodd" />
                            </svg>
                            Nouvelle discussion
                        </button>
                    </div>
                    
                    <div v-if="activity.discussions && activity.discussions.length > 0" class="space-y-4">
                        <div v-for="discussion in activity.discussions" :key="discussion.id"
                            class="bg-white shadow overflow-hidden rounded-md">
                            <div class="px-4 py-5 sm:px-6">
                                <div class="flex justify-between items-start">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">{{ discussion.title }}</h3>
                                    <span class="text-sm text-gray-500">{{ formatDateTime(discussion.createdAt) }}</span>
                                </div>
                                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                    Par {{ discussion.author.firstName }} {{ discussion.author.lastName }}
                                </p>
                            </div>
                            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <div class="prose max-w-none text-gray-600">
                                    <p>{{ discussion.content }}</p>
                                </div>
                                <div class="mt-4 flex justify-between">
                                    <button @click="openDiscussionReplies(discussion.id)"
                                        class="text-sm text-indigo-600 hover:text-indigo-900">
                                        {{ discussion.replies?.length || 0 }} réponses
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucune discussion pour le moment.</p>
                    </div>
                </div>
                
                <!-- Onglet Matériels -->
                <div v-if="activeTab === 'materials'" class="space-y-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Matériels et ressources</h3>
                        <button v-if="canEdit" @click="openAddMaterialModal"
                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clip-rule="evenodd" />
                            </svg>
                            Ajouter un matériel
                        </button>
                    </div>
                    
                    <div v-if="activity.materials && activity.materials.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div v-for="material in activity.materials" :key="material.id"
                            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                            <div class="flex-shrink-0">
                                <svg class="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <a :href="material.url" target="_blank" class="focus:outline-none">
                                    <span class="absolute inset-0" aria-hidden="true"></span>
                                    <p class="text-sm font-medium text-gray-900">{{ material.title }}</p>
                                    <p class="text-sm text-gray-500 truncate">{{ material.description }}</p>
                                </a>
                            </div>
                            <div v-if="canEdit" class="flex-shrink-0 z-10">
                                <button @click.stop.prevent="removeMaterial(material.id)" class="text-red-600 hover:text-red-900">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucun matériel pour le moment.</p>
                    </div>
                </div>
                
                <!-- Onglet Compte-rendu -->
                <div v-if="activeTab === 'summary' && activity.status === 'past'" class="space-y-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Compte-rendu de l'activité</h3>
                        <button v-if="canEdit && !activity.summary" @click="openAddSummaryModal"
                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clip-rule="evenodd" />
                            </svg>
                            Ajouter un compte-rendu
                        </button>
                        <button v-else-if="canEdit && activity.summary" @click="openEditSummaryModal"
                            class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg class="-ml-0.5 mr-1 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Modifier le compte-rendu
                        </button>
                    </div>
                    
                    <div v-if="activity.summary" class="bg-white shadow overflow-hidden rounded-md">
                        <div class="px-4 py-5 sm:px-6">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg leading-6 font-medium text-gray-900">Résumé de l'activité</h3>
                                <span class="text-sm text-gray-500">{{ formatDateTime(activity.summary.createdAt) }}</span>
                            </div>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                Par {{ activity.summary.author.firstName }} {{ activity.summary.author.lastName }}
                            </p>
                        </div>
                        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <div class="prose max-w-none text-gray-600">
                                <p>{{ activity.summary.content }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Aucun compte-rendu disponible pour le moment.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activityId = route.params.id;
const activity = ref({
    id: activityId,
    title: 'Atelier de programmation Vue.js',
    description: 'Un atelier pratique pour apprendre les bases de Vue.js et créer votre première application.',
    status: 'upcoming',
    startDate: new Date(2025, 3, 20, 14, 0),
    endDate: new Date(2025, 3, 20, 17, 0),
    location: 'Salle de conférence A',
    locationType: 'in-person',
    capacity: 20,
    communityId: '1',
    participants: [
        { id: '1', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@example.com', status: 'confirmed' },
        { id: '2', firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@example.com', status: 'pending' }
    ],
    discussions: [
        {
            id: '1',
            title: 'Question sur les prérequis',
            content: 'Faut-il avoir des connaissances préalables en JavaScript pour participer à cet atelier ?',
            author: { firstName: 'Marie', lastName: 'Martin' },
            createdAt: new Date(2025, 3, 15, 10, 30),
            replies: [
                {
                    id: '1',
                    content: 'Des connaissances de base en JavaScript sont recommandées mais pas obligatoires.',
                    author: { firstName: 'Jean', lastName: 'Dupont' },
                    createdAt: new Date(2025, 3, 15, 11, 15)
                }
            ]
        }
    ],
    materials: [
        {
            id: '1',
            title: 'Guide de démarrage Vue.js',
            description: 'Un document PDF contenant les bases de Vue.js',
            url: 'https://example.com/guide.pdf'
        },
        {
            id: '2',
            title: 'Dépôt GitHub du projet',
            description: 'Code source du projet exemple',
            url: 'https://github.com/example/vue-starter'
        }
    ]
});

const activeTab = ref('participants');
const isLoading = ref(true);

onMounted(async () => {
    try {
        // Simuler un appel API
        // const response = await fetch(`/api/activities/${activityId}`);
        // activity.value = await response.json();
        
        // Pour l'instant, on utilise des données fictives
        setTimeout(() => {
            isLoading.value = false;
        }, 500);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'activité:', error);
    }
});

const canEdit = computed(() => {
    // Vérifier si l'utilisateur est authentifié et est l'organisateur ou un administrateur
    return authStore.user && (
        authStore.user.id === activity.value.organizerId || 
        authStore.user.role === 'admin' ||
        authStore.user.communities?.some(c => c.id === activity.value.communityId && c.role === 'admin')
    );
});

const canCancel = computed(() => {
    // Seul l'organisateur ou un administrateur peut annuler une activité
    return canEdit.value;
});

const canManageParticipants = computed(() => {
    // L'organisateur ou un administrateur peut gérer les participants
    return canEdit.value;
});

const isParticipant = computed(() => {
    // Vérifier si l'utilisateur actuel est un participant
    return authStore.user && activity.value.participants?.some(p => p.id === authStore.user.id);
});

const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr });
};

const formatTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'HH:mm');
};

const formatDateTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

const getStatusClass = (status) => {
    switch (status) {
        case 'upcoming':
            return 'bg-blue-100 text-blue-800';
        case 'ongoing':
            return 'bg-green-100 text-green-800';
        case 'past':
            return 'bg-gray-100 text-gray-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'upcoming':
            return 'À venir';
        case 'ongoing':
            return 'En cours';
        case 'past':
            return 'Terminé';
        case 'cancelled':
            return 'Annulé';
        default:
            return 'Inconnu';
    }
};

const getCommunityName = (communityId) => {
    // Simuler la récupération du nom de la communauté
    return 'Communauté de développeurs Vue.js';
};

const registerForActivity = async () => {
    if (!authStore.user) {
        router.push({ name: 'login', query: { redirect: route.fullPath } });
        return;
    }
    
    try {
        // Simuler un appel API pour l'inscription
        // await fetch(`/api/activities/${activityId}/register`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${authStore.token}`
        //     }
        // });
        
        // Mettre à jour localement
        activity.value.participants.push({
            id: authStore.user.id,
            firstName: authStore.user.firstName,
            lastName: authStore.user.lastName,
            email: authStore.user.email,
            status: 'pending'
        });
        
        alert('Inscription réussie !');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
};

const cancelRegistration = async () => {
    if (!authStore.user) {
        return;
    }
    
    try {
        // Simuler un appel API pour annuler l'inscription
        // await fetch(`/api/activities/${activityId}/unregister`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${authStore.token}`
        //     }
        // });
        
        // Mettre à jour localement
        activity.value.participants = activity.value.participants.filter(p => p.id !== authStore.user.id);
        
        alert('Désinscription réussie.');
    } catch (error) {
        console.error('Erreur lors de la désinscription:', error);
        alert('Erreur lors de la désinscription. Veuillez réessayer.');
    }
};

const cancelActivity = async () => {
    if (!canCancel.value) {
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir annuler cette activité ? Cette action est irréversible.')) {
        return;
    }
    
    try {
        // Simuler un appel API pour annuler l'activité
        // await fetch(`/api/activities/${activityId}/cancel`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${authStore.token}`
        //     }
        // });
        
        // Mettre à jour localement
        activity.value.status = 'cancelled';
        
        alert('L\'activité a été annulée.');
    } catch (error) {
        console.error('Erreur lors de l\'annulation de l\'activité:', error);
        alert('Erreur lors de l\'annulation. Veuillez réessayer.');
    }
};

const removeParticipant = async (participantId) => {
    if (!canManageParticipants.value) {
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir retirer ce participant ?')) {
        return;
    }
    
    try {
        // Simuler un appel API pour retirer le participant
        // await fetch(`/api/activities/${activityId}/participants/${participantId}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${authStore.token}`
        //     }
        // });
        
        // Mettre à jour localement
        activity.value.participants = activity.value.participants.filter(p => p.id !== participantId);
        
        alert('Le participant a été retiré.');
    } catch (error) {
        console.error('Erreur lors du retrait du participant:', error);
        alert('Erreur lors du retrait du participant. Veuillez réessayer.');
    }
};

const openAddParticipantModal = () => {
    alert('Fonctionnalité à implémenter : Ajouter un participant');
};

const openNewDiscussionModal = () => {
    alert('Fonctionnalité à implémenter : Nouvelle discussion');
};

const openDiscussionReplies = (discussionId) => {
    alert(`Fonctionnalité à implémenter : Voir les réponses à la discussion ${discussionId}`);
};

const openAddMaterialModal = () => {
    alert('Fonctionnalité à implémenter : Ajouter un matériel');
};

const removeMaterial = (materialId) => {
    if (!canEdit.value) {
        return;
    }
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
        return;
    }
    
    try {
        // Simuler un appel API pour supprimer le matériel
        // await fetch(`/api/activities/${activityId}/materials/${materialId}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${authStore.token}`
        //     }
        // });
        
        // Mettre à jour localement
        activity.value.materials = activity.value.materials.filter(m => m.id !== materialId);
        
        alert('Le matériel a été supprimé.');
    } catch (error) {
        console.error('Erreur lors de la suppression du matériel:', error);
        alert('Erreur lors de la suppression du matériel. Veuillez réessayer.');
    }
};

const openAddSummaryModal = () => {
    alert('Fonctionnalité à implémenter : Ajouter un compte-rendu');
};

const openEditSummaryModal = () => {
    alert('Fonctionnalité à implémenter : Modifier le compte-rendu');
};
</script>

<style scoped>
.prose {
    max-width: 65ch;
    color: inherit;
}
</style>
