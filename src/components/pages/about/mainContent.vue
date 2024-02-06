<template>
<div class="main-content">

  <!--- #NAVBAR-->
  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item " v-for="item in navbarItems" :key="item">
        <button class="navbar-link hover:text-blue-500" data-nav-link @click="setActive(item)">
          {{item}}
        </button>
      </li>
      <!-- <li class="navbar-item">
        <button class="navbar-link" data-nav-link>Resume</button>
      </li>
      <li class="navbar-item">
        <button class="navbar-link" data-nav-link>Portfolio</button>
      </li>
      <li class="navbar-item">
        <button class="navbar-link" data-nav-link>Blog</button>
      </li>
      <li class="navbar-item">
        <button class="navbar-link" data-nav-link>Contact</button>
      </li> -->
    </ul>
  </nav>

  <!--- #ABOUT-->
  <about v-if="getActive('About')" :class="getActive('About') ? 'active' : ''"/>
  <!-- experience -->
  <experience v-if="getActive('Experience')" :class="getActive('Experience')? 'active' : ''"/>
  <!-- projects -->
  <!-- <projects v-if="getActive('Projects')" :class="getActive('Projects')? 'active' : ''"/> -->

  <!-- - #PORTFOLIO-->
  <portfolio v-if="getActive('Portfolio')" :class="getActive('Portfolio') ? 'active' : ''"/>

  <!-- awards -->
  <!-- <awards v-if="getActive('Awards')" :class="getActive('Awards')? 'active' : ''"/> -->
  <!-- skills -->
  <!-- <skills v-if="getActive('Skills')" :class="getActive('Skills')? 'active' : ''"/> -->

  <!--- #RESUME-->
  <!-- <resume class="" ref="" :class="getActive('Resume')"/> -->

  

  <!--- #BLOG-->
  <!-- <blog class="" ref="" :class="getActive('Blog')"/> -->

  <!--- #CONTACT-->
  <!-- <contact class="active"/> -->

  
</div>
</template>

<script setup lang="ts">

import about from "./content/about.vue";
// import awards from "./content/awards.vue";
import experience from "./content/experience.vue";
// import projects from "./content/projects.vue"
// import skills from "./content/skills.vue"

// import resume from "./content/resume.vue";
import portfolio from "./content/portfolio.vue";
// import blog from "./content/blog.vue";
// import contact from "./content/contact.vue"
import { computed, ref, type Ref } from "vue";

const navbarItems:string[]=[
  // "About", "Experience", "Projects", "Awards", "skills"
  // "About", "Resume", "Portfolio", "Blog", "Contact",
];
const componentSelected:Ref[] = [];

const componentMap = new Map<string, number>();

class ContentRegister{
  public registerContent(name:string){
    navbarItems.push(name);
    componentSelected.push(componentMap.size==0 ? ref(true) : ref(false));
    componentMap.set(name, componentMap.size);
    return this;
  }
}

function getActive(name:string){
  // console.log("result: ", componentSelected[componentMap.get(name)] ? "active" : "")
  let id = componentMap.get(name);
  if(id==undefined)return false;
  return componentSelected[id].value;
}

function setActive(name:string){
  let id:number = componentMap.get(name) || 0;
  // console.log("set active:", name);
  for(let i = 0; i < componentMap.size; i++){
    componentSelected[i].value = false;
  }
  componentSelected[id].value = true;
}

const contentRegister = new ContentRegister();
contentRegister.registerContent("About");
contentRegister.registerContent("Experience");
contentRegister.registerContent("Portfolio");
// contentRegister.registerContent("Awards");
// contentRegister.registerContent("Skills");

              // .registerContent("Resume")
              // .registerContent("Portfolio")
              // .registerContent("Blog");
              // .registerContent("Contact");

// console.log("items", navbarItems);
// console.log("map", componentMap);
// console.log("selected", componentSelected);

</script>
