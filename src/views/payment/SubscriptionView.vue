<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Abonnements</h1>
            <p class="mt-1 text-sm text-gray-600">Gérez vos abonnements et options de paiement.</p>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-lg leading-6 font-medium text-gray-900">Votre abonnement actuel</h2>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Détails et statut de votre abonnement.</p>
            </div>
            <div class="border-t border-gray-200">
                <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Plan</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {{ currentSubscription.plan }}
                            </span>
                        </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Statut</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span :class="[
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                currentSubscription.status === 'active' ? 'bg-green-100 text-green-800' :
                                currentSubscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            ]">
                                {{ getStatusText(currentSubscription.status) }}
                            </span>
                        </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Date de début</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(currentSubscription.startDate) }}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Prochaine facturation</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(currentSubscription.nextBillingDate) }}</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Montant</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatCurrency(currentSubscription.amount) }} / mois</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Méthode de paiement</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <div class="flex items-center">
                                <svg class="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 4H2c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h20c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H2V8h20v10zm-7-1h-6v-2h6v2z" />
                                </svg>
                                <div class="ml-3">
                                    <p class="text-sm font-medium text-gray-900">{{ paymentMethod.type }} se terminant par {{ paymentMethod.lastFour }}</p>
                                    <p class="text-sm text-gray-500">Expire le {{ paymentMethod.expiryMonth }}/{{ paymentMethod.expiryYear }}</p>
                                </div>
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Changer de plan</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="plan in availablePlans" :key="plan.id" class="bg-white shadow overflow-hidden rounded-lg border-2"
                    :class="{ 'border-indigo-500': plan.id === currentSubscription.planId, 'border-transparent': plan.id !== currentSubscription.planId }">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ plan.name }}</h3>
                        <div class="mt-4 flex items-baseline">
                            <span class="text-2xl font-extrabold text-gray-900">{{ formatCurrency(plan.price) }}</span>
                            <span class="ml-1 text-sm font-medium text-gray-500">/mois</span>
                        </div>
                        <p class="mt-4 text-sm text-gray-500">{{ plan.description }}</p>
                        <ul class="mt-4 space-y-2">
                            <li v-for="(feature, index) in plan.features" :key="index" class="flex items-start">
                                <svg class="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <span class="ml-2 text-sm text-gray-500">{{ feature }}</span>
                            </li>
                        </ul>
                        <div class="mt-6">
                            <button
                                v-if="plan.id === currentSubscription.planId"
                                disabled
                                class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                            >
                                Plan actuel
                            </button>
                            <button
                                v-else
                                @click="changePlan(plan.id)"
                                class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sélectionner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Historique des paiements</h2>
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Montant</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="payment in paymentHistory" :key="payment.id">
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ formatDate(payment.date) }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ payment.description }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatCurrency(payment.amount) }}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                ]">
                                    {{ getPaymentStatusText(payment.status) }}
                                </span>
                            </td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                    v-if="payment.receiptUrl"
                                    @click="downloadReceipt(payment.receiptUrl)"
                                    class="text-indigo-600 hover:text-indigo-900"
                                >
                                    Reçu
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'SubscriptionView',
    setup() {
        const currentSubscription = ref({
            planId: 'pro',
            plan: 'Pro',
            status: 'active',
            startDate: '2023-01-15',
            nextBillingDate: '2023-05-15',
            amount: 29.99
        });

        const paymentMethod = ref({
            type: 'Visa',
            lastFour: '4242',
            expiryMonth: '12',
            expiryYear: '2025'
        });

        const availablePlans = ref([
            {
                id: 'basic',
                name: 'Basic',
                price: 9.99,
                description: 'Parfait pour les petites communautés',
                features: [
                    'Jusqu\'à 3 communautés',
                    'Jusqu\'à 50 membres par communauté',
                    'Stockage de 5 Go',
                    'Support par email'
                ]
            },
            {
                id: 'pro',
                name: 'Pro',
                price: 29.99,
                description: 'Idéal pour les communautés en croissance',
                features: [
                    'Jusqu\'à 10 communautés',
                    'Jusqu\'à 200 membres par communauté',
                    'Stockage de 20 Go',
                    'Support prioritaire',
                    'Analyses avancées'
                ]
            },
            {
                id: 'enterprise',
                name: 'Enterprise',
                price: 99.99,
                description: 'Pour les grandes organisations',
                features: [
                    'Communautés illimitées',
                    'Membres illimités',
                    'Stockage de 100 Go',
                    'Support 24/7',
                    'Analyses avancées',
                    'API personnalisée',
                    'SSO et intégrations'
                ]
            }
        ]);

        const paymentHistory = ref([
            {
                id: '1',
                date: '2023-04-15',
                description: 'Abonnement Pro - Avril 2023',
                amount: 29.99,
                status: 'completed',
                receiptUrl: '#'
            },
            {
                id: '2',
                date: '2023-03-15',
                description: 'Abonnement Pro - Mars 2023',
                amount: 29.99,
                status: 'completed',
                receiptUrl: '#'
            },
            {
                id: '3',
                date: '2023-02-15',
                description: 'Abonnement Pro - Février 2023',
                amount: 29.99,
                status: 'completed',
                receiptUrl: '#'
            },
            {
                id: '4',
                date: '2023-01-15',
                description: 'Abonnement Pro - Janvier 2023',
                amount: 29.99,
                status: 'completed',
                receiptUrl: '#'
            }
        ]);

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        };

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
        };

        const getStatusText = (status) => {
            switch (status) {
                case 'active':
                    return 'Actif';
                case 'pending':
                    return 'En attente';
                case 'cancelled':
                    return 'Annulé';
                default:
                    return status;
            }
        };

        const getPaymentStatusText = (status) => {
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

        const changePlan = (planId) => {
            console.log('Changement de plan vers:', planId);
            // Logique pour changer de plan
            alert('Fonctionnalité en cours de développement');
        };

        const downloadReceipt = (url) => {
            console.log('Téléchargement du reçu:', url);
            // Logique pour télécharger le reçu
            alert('Fonctionnalité en cours de développement');
        };

        onMounted(() => {
            // Charger les données d'abonnement
            console.log('Chargement des données d\'abonnement');
        });

        return {
            currentSubscription,
            paymentMethod,
            availablePlans,
            paymentHistory,
            formatDate,
            formatCurrency,
            getStatusText,
            getPaymentStatusText,
            changePlan,
            downloadReceipt
        };
    }
};
</script>
