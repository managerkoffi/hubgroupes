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
    <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div class="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 md:pr-12 mb-10 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">Gérez vos communautés comme un pro !</h1>
          <p class="text-xl md:text-2xl mb-8 text-indigo-100">Une plateforme complète pour organiser vos membres, activités et cotisations en toute simplicité.</p>
          <button @click="navigateToRegister" class="bg-white text-indigo-600 hover:bg-indigo-100 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105">
            🚀 Inscrivez-vous gratuitement
          </button>
        </div>
        <div class="md:w-1/2">
          <div class="bg-white p-2 rounded-lg shadow-2xl">
            <img src="https://via.placeholder.com/600x400?text=HubGroupes+Dashboard" alt="HubGroupes Dashboard" class="rounded w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Pourquoi choisir HubGroupes ?</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demonstration Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0">
            <h2 class="text-3xl font-bold mb-6">Découvrez HubGroupes en action !</h2>
            <p class="text-lg text-gray-600 mb-6">Une interface moderne et intuitive conçue pour vous simplifier la gestion de votre communauté.</p>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Tableau de bord personnalisable</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Gestion des membres simplifiée</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Planification d'activités intuitive</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Suivi financier en temps réel</span>
              </li>
            </ul>
          </div>
          <div class="md:w-1/2 md:pl-12">
            <div class="bg-gray-800 p-2 rounded-lg shadow-2xl">
              <img src="https://via.placeholder.com/600x400?text=Interface+HubGroupes" alt="Interface HubGroupes" class="rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">Ce que disent nos utilisateurs</h2>
        <p class="text-center text-gray-600 mb-12">Rejoignez plus de 5 000 communautés qui font confiance à HubGroupes</p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 class="font-semibold">{{ testimonial.name }}</h4>
                <p class="text-gray-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.content }}"</p>
          </div>
        </div>

        <div class="mt-16 flex flex-wrap justify-center gap-8">
          <img src="https://via.placeholder.com/150x50?text=Client+Logo" alt="Client Logo" class="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://via.placeholder.com/150x50?text=Client+Logo" alt="Client Logo" class="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://via.placeholder.com/150x50?text=Client+Logo" alt="Client Logo" class="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://via.placeholder.com/150x50?text=Client+Logo" alt="Client Logo" class="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://via.placeholder.com/150x50?text=Client+Logo" alt="Client Logo" class="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div class="container mx-auto px-4 text-center">
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
