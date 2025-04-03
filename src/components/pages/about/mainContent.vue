<template>
<div class="main-content">

  <!--- #NAVBAR-->
  <nav class="navbar">
    <commonNavbar/>
    <ul class="navbar-list">
      <li class="navbar-item " v-for="item in selectionManager.navbarItems.value" :key="item.name">
        <button class="navbar-link hover:text-blue-500" data-nav-link @click="switchPage(item.name)">
          {{item.localeName}}
        </button>
      </li>
    </ul>
  </nav>
  
  <component v-for="item in selectionManager.navbarItems.value" :key="item.name" :is="item.component" v-show="item.active" :class="item.active ? 'active':''"/>

  <!--- #ABOUT-->
  <!-- <about v-if="selectionManager.getActive()" :class="getActive('About Me') ? 'active' : ''"/> -->
  <!-- experience -->
  <!-- <experience v-if="getActive('Experience')" :class="getActive('Experience')? 'active' : ''"/> -->
  <!-- projects -->
  <!-- <projects v-if="getActive('Projects')" :class="getActive('Projects')? 'active' : ''"/> -->

  <!-- - #PORTFOLIO-->
  <!-- <portfolio v-if="getActive('Portfolio')" :class="getActive('Portfolio') ? 'active' : ''"/> -->

  <!-- awards -->
  <!-- <awards v-if="getActive('Awards')" :class="getActive('Awards')? 'active' : ''"/> -->
  <!-- skills -->
  <!-- <skills v-if="getActive('Skills')" :class="getActive('Skills')? 'active' : ''"/> -->

  <!--- #RESUME-->
  <!-- <resume class="" ref="" :class="getActive('Resume')"/> -->

  

  <!--- #BLOG -->
  <!-- <blog class="" ref="" :class="getActive('Blog')"/> -->

  <!-- #CONTACT -->
  <!-- <contact v-if="getActive('Contact Info')" :class="getActive('Contact Info')? 'active' : ''"/> -->

  
</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

import commonNavbar from '@/components/commonNavbar.vue';

import about from "./content/about.vue";
// import awards from "./content/awards.vue";
import experience from "./content/experience.vue";
// import projects from "./content/projects.vue"
import skills from "./content/skills.vue"
// import resume from "./content/resume.vue";
import portfolio from "./content/portfolio.vue";
// import contact from "./content/contact.vue";
// import blog from "./content/blog.vue";
// import contact from "./content/contact.vue"
import { computed, onMounted, ref, type Ref } from "vue";
import {SelectionManager, NavbarItem} from "@/utils/navbar/SelectionManager";


const selectionManager = new SelectionManager();
selectionManager.registerContent("AboutMe", "Intro", about)
                .registerContent("Experience", "Experience", experience)
                .registerContent("Portfolio", "Portfolio", portfolio)
                .registerContent("Skills", "Skills", skills);

// 切換頁面 + 更新 URL
function switchPage(pageName: string) {
    if (selectionManager.navbarItemMap.value.has(pageName)) {
        selectionManager.setActive(pageName);
        router.replace({ name: 'about', params: { page: pageName } }); // URL: /about/Home
    }
}
onMounted(async()=>{
  switchPage(route.params.page as string);
  document.title = "About Me | ben99933.github.io";
});


</script>
