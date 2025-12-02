<template>
  <div class="portfolio">
    <section class="introduction">
      <h1>Your Name</h1>
      <p>Welcome to my portfolio. I'm a passionate developer...</p>
    </section>

    <section class="skills">
      <h2>Skills</h2>
      <div class="skills-grid">
        <div class="skill-card" v-for="skill in skills" :key="skill">
          {{ skill }}
        </div>
      </div>
    </section>

    <section class="experience">
      <h2>Experience</h2>
      <div class="experience-item" v-for="job in experience" :key="job.id">
        <h3>{{ job.title }}</h3>
        <p class="company">{{ job.company }}</p>
        <p class="duration">{{ job.startDate }} - {{ job.endDate }}</p>
        <p>{{ job.description }}</p>
      </div>
    </section>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Footer from '../../components/Footer.vue';
const skills = ['Vue.js', 'TypeScript', 'Nuxt.js', 'CSS', 'JavaScript'];

  const experience = [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Company',
      startDate: '2022',
      endDate: 'Present',
      description: 'Led development of multiple projects...'
    },
    {
      id: 2,
      title: 'Developer',
      company: 'Another Company',
      startDate: '2020',
      endDate: '2022',
      description: 'Developed web applications...'
    }
  ];
</script>

<style scoped>
  .portfolio {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  section {
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .skill-card {
    background: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .experience-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-left: 4px solid #007bff;
  }

  .company {
    font-weight: bold;
    color: #666;
  }

  .duration {
    font-size: 0.9rem;
    color: #999;
  }
  </style>