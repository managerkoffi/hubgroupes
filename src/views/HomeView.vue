<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToRegister = () => {
  router.push('/register');
};

const features = ref([
  {
    title: 'Gérez facilement vos membres',
    description: 'Invitations, suivi et validation en un clic.',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    title: 'Organisez vos activités sans stress',
    description: 'Planifiez, suivez les inscriptions et gérez les paiements.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    title: 'Boostez votre communication',
    description: 'Annonces, notifications, emails et campagnes SMS intégrés.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  },
  {
    title: 'Optimisez vos finances',
    description: 'Gestion des cotisations et reporting simplifié.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]);

const testimonials = ref([
  {
    name: 'Sophie L.',
    role: 'Responsable d\'association',
    content: 'Grâce à HubGroupes, la gestion de notre association est devenue un jeu d\'enfant ! Plus de stress, tout est automatisé.',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    name: 'Thomas M.',
    role: 'Président de club sportif',
    content: 'Nous avons gagné un temps précieux dans la gestion des cotisations et l\'organisation des événements. Je recommande vivement !',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Marie D.',
    role: 'Trésorière de comité',
    content: 'Le suivi financier est devenu simple et transparent. Les rapports générés nous font gagner des heures de travail chaque mois.',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg'
  }
]);
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 md:pr-12 mb-10 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
            Simplifiez la gestion de votre communauté
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            HubGroupes est la solution tout-en-un pour gérer efficacement vos membres, activités, communications et finances.
          </p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button @click="navigateToRegister" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
              Commencer gratuitement
            </button>
            <a href="#features" class="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-indigo-600 font-medium py-3 px-6 rounded-lg border border-indigo-200 shadow-sm transition duration-300 ease-in-out">
              <span>En savoir plus</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div class="md:w-1/2">
          <img src="../assets/images/dashboard.jpg" alt="Dashboard HubGroupes" class="rounded-lg shadow-xl" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">Pourquoi choisir HubGroupes ?</h2>
        <p class="text-center text-gray-600 mb-12">Une solution complète pour gérer tous les aspects de votre communauté</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-900">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demonstration Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 class="text-3xl font-bold mb-6 text-gray-900">Découvrez HubGroupes en action !</h2>
            <p class="text-lg text-gray-600 mb-8">Une interface moderne et intuitive conçue pour vous simplifier la gestion de votre communauté.</p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Tableau de bord personnalisable</span>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Gestion des membres simplifiée</span>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Planification d'activités intuitive</span>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-700">Suivi financier en temps réel</span>
              </li>
            </ul>
          </div>
          <div class="md:w-1/2 md:pl-6">
            <div class="rounded-lg shadow-xl overflow-hidden">
              <img src="../assets/images/interface.jpg" alt="Interface HubGroupes" class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4">Ce que disent nos utilisateurs</h2>
        <p class="text-center text-gray-600 mb-12">Rejoignez plus de 5 000 communautés qui font confiance à HubGroupes</p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="w-14 h-14 rounded-full mr-4 border-2 border-indigo-100" />
              <div>
                <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                <p class="text-gray-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.content }}"</p>
          </div>
        </div>

        <div class="mt-16 flex flex-wrap justify-center gap-10">
          <img src="@/assets/images/client-logo1.jpg" alt="Client Logo" class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <img src="@/assets/images/client-logo2.jpg" alt="Client Logo" class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <img src="@/assets/images/client-logo3.jpg" alt="Client Logo" class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          <img src="@/assets/images/client-logo1.jpg" alt="Client Logo" class="h-16 rounded-lg grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Prêt à simplifier la gestion de votre communauté ?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Rejoignez des milliers d'organisations qui ont transformé leur façon de gérer leurs communautés.</p>
        <button @click="navigateToRegister" class="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 text-lg">
          Essayez HubGroupes gratuitement dès maintenant !
        </button>
        <p class="mt-4 text-indigo-200">Aucune carte de crédit requise • Annulez à tout moment</p>
      </div>
    </section>
  </main>
</template>
