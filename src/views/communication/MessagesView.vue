<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
            <p class="mt-1 text-sm text-gray-600">Gérez vos conversations avec les autres membres.</p>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3">
                <!-- Liste des conversations -->
                <div class="border-r border-gray-200">
                    <div class="p-4 border-b border-gray-200">
                        <div class="relative">
                            <input
                                type="text"
                                v-model="searchQuery"
                                placeholder="Rechercher une conversation..."
                                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-y-auto h-[calc(100vh-300px)]">
                        <div v-if="loading" class="flex justify-center py-12">
                            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>

                        <div v-else-if="filteredConversations.length === 0" class="text-center py-12">
                            <p class="text-gray-500">Aucune conversation trouvée.</p>
                        </div>

                        <div v-else>
                            <button
                                v-for="conversation in filteredConversations"
                                :key="conversation.id"
                                @click="selectConversation(conversation)"
                                class="w-full text-left px-4 py-3 border-b border-gray-200 hover:bg-gray-50 focus:outline-none"
                                :class="{ 'bg-indigo-50': selectedConversation && selectedConversation.id === conversation.id }"
                            >
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <img v-if="conversation.participant.avatar" :src="conversation.participant.avatar" alt="" class="h-10 w-10 rounded-full" />
                                        <div v-else class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span class="text-indigo-800 font-medium text-sm">
                                                {{ getInitials(conversation.participant.firstName, conversation.participant.lastName) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="ml-3 flex-1">
                                        <div class="flex items-center justify-between">
                                            <p class="text-sm font-medium text-gray-900">
                                                {{ conversation.participant.firstName }} {{ conversation.participant.lastName }}
                                            </p>
                                            <p class="text-xs text-gray-500">
                                                {{ formatDate(conversation.lastMessageDate) }}
                                            </p>
                                        </div>
                                        <p class="text-sm text-gray-500 truncate">
                                            {{ conversation.lastMessage }}
                                        </p>
                                    </div>
                                    <div v-if="conversation.unreadCount > 0" class="ml-2 flex-shrink-0">
                                        <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white text-xs">
                                            {{ conversation.unreadCount }}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Conversation actuelle -->
                <div class="col-span-2 flex flex-col h-[calc(100vh-300px)]">
                    <div v-if="!selectedConversation" class="flex-1 flex items-center justify-center bg-gray-50">
                        <div class="text-center">
                            <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune conversation sélectionnée</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Sélectionnez une conversation pour commencer à discuter.
                            </p>
                        </div>
                    </div>

                    <template v-else>
                        <!-- En-tête de la conversation -->
                        <div class="p-4 border-b border-gray-200 flex items-center">
                            <div class="flex-shrink-0">
                                <img v-if="selectedConversation.participant.avatar" :src="selectedConversation.participant.avatar" alt="" class="h-10 w-10 rounded-full" />
                                <div v-else class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span class="text-indigo-800 font-medium text-sm">
                                        {{ getInitials(selectedConversation.participant.firstName, selectedConversation.participant.lastName) }}
                                    </span>
                                </div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900">
                                    {{ selectedConversation.participant.firstName }} {{ selectedConversation.participant.lastName }}
                                </p>
                                <p v-if="selectedConversation.participant.isOnline" class="text-xs text-green-600">
                                    En ligne
                                </p>
                                <p v-else class="text-xs text-gray-500">
                                    Dernière connexion {{ formatDate(selectedConversation.participant.lastSeen) }}
                                </p>
                            </div>
                        </div>

                        <!-- Messages -->
                        <div class="flex-1 p-4 overflow-y-auto bg-gray-50">
                            <div v-if="loadingMessages" class="flex justify-center py-12">
                                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="message in messages" :key="message.id" class="flex" :class="{ 'justify-end': message.isSent }">
                                    <div class="max-w-xs sm:max-w-md px-4 py-2 rounded-lg" :class="message.isSent ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-200'">
                                        <p>{{ message.content }}</p>
                                        <p class="text-xs mt-1" :class="message.isSent ? 'text-indigo-200' : 'text-gray-500'">
                                            {{ formatTime(message.timestamp) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Formulaire d'envoi de message -->
                        <div class="p-4 border-t border-gray-200">
                            <form @submit.prevent="sendMessage">
                                <div class="flex">
                                    <input
                                        type="text"
                                        v-model="newMessage"
                                        placeholder="Écrivez votre message..."
                                        class="flex-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        type="submit"
                                        :disabled="!newMessage.trim()"
                                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
    name: 'MessagesView',
    setup() {
        const loading = ref(true);
        const loadingMessages = ref(false);
        const conversations = ref([]);
        const selectedConversation = ref(null);
        const messages = ref([]);
        const searchQuery = ref('');
        const newMessage = ref('');

        const filteredConversations = computed(() => {
            if (!searchQuery.value) return conversations.value;
            const query = searchQuery.value.toLowerCase();
            return conversations.value.filter(conv => {
                const fullName = `${conv.participant.firstName} ${conv.participant.lastName}`.toLowerCase();
                return fullName.includes(query) || conv.lastMessage.toLowerCase().includes(query);
            });
        });

        const fetchConversations = async () => {
            loading.value = true;
            try {
                // Simulation d'un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Données fictives
                conversations.value = [
                    {
                        id: '1',
                        participant: {
                            id: '2',
                            firstName: 'Marie',
                            lastName: 'Martin',
                            avatar: null,
                            isOnline: true,
                            lastSeen: null
                        },
                        lastMessage: 'Bonjour, comment ça va aujourd\'hui ?',
                        lastMessageDate: '2023-04-15T10:30:00Z',
                        unreadCount: 2
                    },
                    {
                        id: '2',
                        participant: {
                            id: '3',
                            firstName: 'Pierre',
                            lastName: 'Durand',
                            avatar: null,
                            isOnline: false,
                            lastSeen: '2023-04-14T18:45:00Z'
                        },
                        lastMessage: 'Merci pour ton aide sur le projet !',
                        lastMessageDate: '2023-04-14T15:20:00Z',
                        unreadCount: 0
                    },
                    {
                        id: '3',
                        participant: {
                            id: '4',
                            firstName: 'Sophie',
                            lastName: 'Lefebvre',
                            avatar: null,
                            isOnline: false,
                            lastSeen: '2023-04-13T22:10:00Z'
                        },
                        lastMessage: 'À quelle heure commence la réunion demain ?',
                        lastMessageDate: '2023-04-13T14:05:00Z',
                        unreadCount: 0
                    }
                ];
            } catch (error) {
                console.error('Erreur lors du chargement des conversations:', error);
            } finally {
                loading.value = false;
            }
        };

        const fetchMessages = async (conversationId) => {
            loadingMessages.value = true;
            try {
                // Simulation d'un appel API
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Données fictives
                if (conversationId === '1') {
                    messages.value = [
                        {
                            id: '1',
                            content: 'Bonjour Marie, comment ça va ?',
                            timestamp: '2023-04-15T10:25:00Z',
                            isSent: true
                        },
                        {
                            id: '2',
                            content: 'Bonjour ! Ça va bien, merci. Et toi ?',
                            timestamp: '2023-04-15T10:27:00Z',
                            isSent: false
                        },
                        {
                            id: '3',
                            content: 'Très bien aussi. As-tu avancé sur le projet ?',
                            timestamp: '2023-04-15T10:28:00Z',
                            isSent: true
                        },
                        {
                            id: '4',
                            content: 'Oui, j\'ai terminé la première partie. Je t\'envoie ça dans l\'après-midi.',
                            timestamp: '2023-04-15T10:29:00Z',
                            isSent: false
                        },
                        {
                            id: '5',
                            content: 'Bonjour, comment ça va aujourd\'hui ?',
                            timestamp: '2023-04-15T10:30:00Z',
                            isSent: false
                        }
                    ];
                } else if (conversationId === '2') {
                    messages.value = [
                        {
                            id: '1',
                            content: 'Salut Pierre, j\'ai une question sur le code que tu as partagé hier.',
                            timestamp: '2023-04-14T15:10:00Z',
                            isSent: true
                        },
                        {
                            id: '2',
                            content: 'Bien sûr, je t\'écoute !',
                            timestamp: '2023-04-14T15:12:00Z',
                            isSent: false
                        },
                        {
                            id: '3',
                            content: 'Comment as-tu géré l\'authentification dans le composant ?',
                            timestamp: '2023-04-14T15:15:00Z',
                            isSent: true
                        },
                        {
                            id: '4',
                            content: 'J\'ai utilisé le store Pinia avec des actions pour gérer les appels API. Je peux te montrer un exemple si tu veux.',
                            timestamp: '2023-04-14T15:18:00Z',
                            isSent: false
                        },
                        {
                            id: '5',
                            content: 'Ce serait parfait, merci !',
                            timestamp: '2023-04-14T15:19:00Z',
                            isSent: true
                        },
                        {
                            id: '6',
                            content: 'Merci pour ton aide sur le projet !',
                            timestamp: '2023-04-14T15:20:00Z',
                            isSent: false
                        }
                    ];
                } else if (conversationId === '3') {
                    messages.value = [
                        {
                            id: '1',
                            content: 'Bonjour Sophie, comment se passe la préparation pour la présentation ?',
                            timestamp: '2023-04-13T14:00:00Z',
                            isSent: true
                        },
                        {
                            id: '2',
                            content: 'Bonjour ! Ça avance bien, j\'ai presque terminé les slides.',
                            timestamp: '2023-04-13T14:02:00Z',
                            isSent: false
                        },
                        {
                            id: '3',
                            content: 'Super ! N\'oublie pas d\'inclure les résultats du dernier sprint.',
                            timestamp: '2023-04-13T14:03:00Z',
                            isSent: true
                        },
                        {
                            id: '4',
                            content: 'C\'est noté. À quelle heure commence la réunion demain ?',
                            timestamp: '2023-04-13T14:05:00Z',
                            isSent: false
                        }
                    ];
                } else {
                    messages.value = [];
                }
            } catch (error) {
                console.error('Erreur lors du chargement des messages:', error);
            } finally {
                loadingMessages.value = false;
            }
        };

        const selectConversation = (conversation) => {
            selectedConversation.value = conversation;
            fetchMessages(conversation.id);
            
            // Marquer comme lu
            if (conversation.unreadCount > 0) {
                conversation.unreadCount = 0;
            }
        };

        const sendMessage = () => {
            if (!newMessage.value.trim() || !selectedConversation.value) return;
            
            // Ajouter le message à la conversation
            const newMessageObj = {
                id: Date.now().toString(),
                content: newMessage.value,
                timestamp: new Date().toISOString(),
                isSent: true
            };
            
            messages.value.push(newMessageObj);
            
            // Mettre à jour la dernière conversation
            selectedConversation.value.lastMessage = newMessage.value;
            selectedConversation.value.lastMessageDate = new Date().toISOString();
            
            // Réinitialiser le champ de saisie
            newMessage.value = '';
            
            // Simuler une réponse après un délai
            setTimeout(() => {
                const response = {
                    id: Date.now().toString(),
                    content: 'Merci pour votre message ! Je vous répondrai dès que possible.',
                    timestamp: new Date().toISOString(),
                    isSent: false
                };
                
                messages.value.push(response);
                selectedConversation.value.lastMessage = response.content;
                selectedConversation.value.lastMessageDate = response.timestamp;
            }, 2000);
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            
            const date = new Date(dateString);
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (date.toDateString() === now.toDateString()) {
                return 'Aujourd\'hui';
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Hier';
            } else {
                const options = { day: 'numeric', month: 'short' };
                return date.toLocaleDateString('fr-FR', options);
            }
        };

        const formatTime = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        };

        const getInitials = (firstName, lastName) => {
            return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
        };

        onMounted(() => {
            fetchConversations();
        });

        return {
            loading,
            loadingMessages,
            conversations,
            filteredConversations,
            selectedConversation,
            messages,
            searchQuery,
            newMessage,
            selectConversation,
            sendMessage,
            formatDate,
            formatTime,
            getInitials
        };
    }
};
</script>
