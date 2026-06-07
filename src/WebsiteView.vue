<script setup lang="ts">
import AboutSection from "./sections/AboutSection.vue";
import ContactSection from "./sections/ContactSection.vue";
import EducationSection from "./sections/EducationSection.vue";
import ExperienceSection from "./sections/ExperienceSection.vue";
import WorkSection from "./sections/WorkSection.vue";
import WritingSection from "./sections/WritingSection.vue";

defineEmits<{ terminal: [] }>();
</script>

<template>
  <main class="website">
    <nav>
      <strong>savina</strong>
      <button @click="$emit('terminal')">terminal</button>
    </nav>

    <header>
      <h1>Hi, I'm Savina.</h1>
      <p>I build thoughtful software and simple, useful experiences.</p>
    </header>

    <div class="website-sections">
      <AboutSection />
      <WorkSection />
      <ExperienceSection />
      <EducationSection />
      <WritingSection />
      <ContactSection />
    </div>
  </main>
</template>
