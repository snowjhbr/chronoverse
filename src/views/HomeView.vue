<script setup>
import Communities from '@/components/Communities.vue';
import Events from '@/components/Events.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import Hero from '@/components/Hero.vue';
import Itens from '@/components/Itens.vue';
import Nivel from '@/components/Nivel.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import Timeline from '@/components/Timeline.vue';

</script>

<template>
  <main class="max-w-7xl w-full mx-auto min-h-screen h-full">
    <Header />
    <section class="mt-6 p-2.5 grid grid-cols-3 gap-5">
      <div>
        <ProfileCard />
        <Nivel />
        <Itens />
        <Footer />
      </div>

      <div>
        <Hero />
      </div>
      
      <div>
        <Timeline />
        <Events />
        <Communities />
      </div>
    </section>
  </main>
</template>
