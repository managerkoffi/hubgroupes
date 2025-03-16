<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Finances</h1>
            <p class="mt-1 text-sm text-gray-600">Gérez les finances de vos communautés et suivez vos revenus.</p>
        </div>

        <!-- Résumé financier -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white shadow rounded-lg p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-gray-500">Revenus totaux</p>
                        <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(financialSummary.totalRevenue) }}</p>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Ce mois-ci</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatCurrency(financialSummary.currentMonthRevenue) }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <p class="text-sm text-gray-500">Mois dernier</p>
                        <div class="flex items-center">
                            <p class="text-sm font-medium text-gray-900">{{ formatCurrency(financialSummary.previousMonthRevenue) }}</p>
                            <span v-if="revenueGrowth > 0" class="ml-2 flex items-center text-sm font-medium text-green-600">
                                <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                                </svg>
                                {{ revenueGrowth }}%
                            </span>
                            <span v-else-if="revenueGrowth < 0" class="ml-2 flex items-center text-sm font-medium text-red-600">
                                <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                                </svg>
                                {{ Math.abs(revenueGrowth) }}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-gray-500">Membres payants</p>
                        <p class="text-2xl font-semibold text-gray-900">{{ financialSummary.totalPaidMembers }}</p>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Nouveaux ce mois-ci</p>
                        <p class="text-sm font-medium text-gray-900">{{ financialSummary.newPaidMembersThisMonth }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <p class="text-sm text-gray-500">Taux de conversion</p>
                        <p class="text-sm font-medium text-gray-900">{{ financialSummary.conversionRate }}%</p>
                    </div>
                </div>
            </div>

            <div class="bg-white shadow rounded-lg p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div class="ml-5">
                        <p class="text-sm font-medium text-gray-500">Revenu mensuel récurrent</p>
                        <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(financialSummary.mrr) }}</p>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Revenu annuel récurrent</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatCurrency(financialSummary.arr) }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <p class="text-sm text-gray-500">Taux de rétention</p>
                        <p class="text-sm font-medium text-gray-900">{{ financialSummary.retentionRate }}%</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Graphique des revenus -->
        <div class="bg-white shadow rounded-lg p-6 mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Évolution des revenus</h2>
            <div class="h-80">
                <!-- Placeholder pour le graphique -->
                <div class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p class="text-gray-500">Graphique des revenus (à implémenter avec une bibliothèque de graphiques)</p>
                </div>
            </div>
        </div>

        <!-- Transactions récentes -->
        <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-lg font-medium text-gray-900">Transactions récentes</h2>
                <p class="mt-1 text-sm text-gray-500">Liste des transactions récentes de vos communautés.</p>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communauté</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membre</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="transaction in transactions" :key="transaction.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(transaction.date) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ transaction.description }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.community }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.member }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'">
                                {{ formatCurrency(transaction.amount) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                ]">
                                    {{ getStatusText(transaction.status) }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Voir toutes les transactions
                </button>
            </div>
        </div>

        <!-- Communautés les plus rentables -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-lg font-medium text-gray-900">Communautés les plus rentables</h2>
                <p class="mt-1 text-sm text-gray-500">Classement des communautés par revenus générés.</p>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communauté</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membres payants</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus ce mois</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus totaux</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Croissance</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="community in topCommunities" :key="community.id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img v-if="community.image" :src="community.image" class="h-10 w-10 rounded-full" :alt="community.name" />
                                        <div v-else class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span class="text-indigo-800 font-medium text-sm">{{ community.name.charAt(0) }}</span>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ community.name }}</div>
                                        <div class="text-sm text-gray-500">{{ community.members }} membres</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ community.paidMembers }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(community.currentMonthRevenue) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(community.totalRevenue) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex items-center">
                                    <span v-if="community.growth > 0" class="text-green-600">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                    <span v-else-if="community.growth < 0" class="text-red-600">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                    <span v-else class="text-gray-500">
                                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                    <span :class="[
                                        'ml-1',
                                        community.growth > 0 ? 'text-green-600' : 
                                        community.growth < 0 ? 'text-red-600' : 
                                        'text-gray-500'
                                    ]">
                                        {{ Math.abs(community.growth) }}%
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
    name: 'FinanceView',
    setup() {
        const financialSummary = ref({
            totalRevenue: 12500.75,
            currentMonthRevenue: 2350.50,
            previousMonthRevenue: 2100.25,
            totalPaidMembers: 145,
            newPaidMembersThisMonth: 12,
            conversionRate: 8.5,
            mrr: 2350.50,
            arr: 28206.00,
            retentionRate: 92.3
        });

        const revenueGrowth = computed(() => {
            if (!financialSummary.value.previousMonthRevenue) return 0;
            const growth = ((financialSummary.value.currentMonthRevenue - financialSummary.value.previousMonthRevenue) / financialSummary.value.previousMonthRevenue) * 100;
            return Math.round(growth * 10) / 10; // Arrondi à 1 décimale
        });

        const transactions = ref([
            {
                id: '1',
                date: '2023-04-15T10:30:00Z',
                description: 'Abonnement Premium',
                community: 'Communauté de développeurs Vue.js',
                member: 'Marie Martin',
                amount: 29.99,
                status: 'completed'
            },
            {
                id: '2',
                date: '2023-04-14T15:45:00Z',
                description: 'Achat d\'extension',
                community: 'JavaScript Enthusiasts',
                member: 'Pierre Durand',
                amount: 19.99,
                status: 'completed'
            },
            {
                id: '3',
                date: '2023-04-13T09:20:00Z',
                description: 'Abonnement Basic',
                community: 'Club de lecture',
                member: 'Sophie Lefebvre',
                amount: 9.99,
                status: 'completed'
            },
            {
                id: '4',
                date: '2023-04-12T14:10:00Z',
                description: 'Remboursement',
                community: 'Groupe de fitness',
                member: 'Thomas Dubois',
                amount: -19.99,
                status: 'completed'
            },
            {
                id: '5',
                date: '2023-04-11T11:05:00Z',
                description: 'Abonnement Enterprise',
                community: 'Association des entrepreneurs',
                member: 'Julie Moreau',
                amount: 99.99,
                status: 'pending'
            }
        ]);

        const topCommunities = ref([
            {
                id: '1',
                name: 'Communauté de développeurs Vue.js',
                image: null,
                members: 320,
                paidMembers: 45,
                currentMonthRevenue: 1349.55,
                totalRevenue: 5240.85,
                growth: 12.5
            },
            {
                id: '2',
                name: 'JavaScript Enthusiasts',
                image: null,
                members: 280,
                paidMembers: 38,
                currentMonthRevenue: 759.62,
                totalRevenue: 3120.38,
                growth: 8.2
            },
            {
                id: '3',
                name: 'Association des entrepreneurs',
                image: null,
                members: 150,
                paidMembers: 25,
                currentMonthRevenue: 499.95,
                totalRevenue: 1999.80,
                growth: 15.3
            },
            {
                id: '4',
                name: 'Club de lecture',
                image: null,
                members: 210,
                paidMembers: 22,
                currentMonthRevenue: 219.78,
                totalRevenue: 879.12,
                growth: -2.1
            },
            {
                id: '5',
                name: 'Groupe de fitness',
                image: null,
                members: 180,
                paidMembers: 15,
                currentMonthRevenue: 149.85,
                totalRevenue: 599.40,
                growth: 0
            }
        ]);

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        };

        const getStatusText = (status) => {
            switch (status) {
                case 'completed':
                    return 'Complété';
                case 'pending':
                    return 'En attente';
                case 'failed':
                    return 'Échoué';
                default:
                    return status;
            }
        };

        onMounted(() => {
            // Charger les données financières
            console.log('Chargement des données financières');
        });

        return {
            financialSummary,
            revenueGrowth,
            transactions,
            topCommunities,
            formatCurrency,
            formatDate,
            getStatusText
        };
    }
};
</script>
