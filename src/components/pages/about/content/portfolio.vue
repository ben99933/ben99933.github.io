<template>
<article class="portfolio" data-page="portfolio">
    <header>
        <h2 class="h2 article-title">Portfolio</h2>
    </header>
    <section class="projects">
        <ul class="filter-list">
            <li class="filter-item border-orange-300" :class="getCurrentCategory=='All'?'border-b-2':''">
                <button data-filter-btn @click="chooseCategory('All')">All</button>
            </li>
            <!-- projectCategories是computed 他會自己重新呼叫 -->
            <li class="filter-item border-orange-300" :class="getCurrentCategory==category.name?'border-b-2':''"  v-for="category in projectCategories" :key="category.name">
                <button data-filter-btn @click="chooseCategory(category.name)">{{category.name}}</button>
            </li>
        </ul>

        <!-- <div class="filter-select-box">
            <button class="filter-select" data-select>
                <div class="select-value" data-selecct-value>Select category</div>
                <div class="select-icon">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="xl" style="color: #74C0FC;" />
                </div>
            </button>

            <ul class="select-list">
                <li class="select-item" v-for="category in projectCategories" :key="category.name">
                    <button data-select-item @click="chooseCategory('All')">All</button>
                </li>
                <li class="select-item" v-for="category in projectCategories" :key="category.name">
                    <button data-select-item @click="chooseCategory(category.name)">{{category.name}}</button>
                </li>
                
            </ul>
        </div> -->

        <ul class="project-list">
            <li class="project-item  active" data-filter-item data-category="web development" v-for="item in getRenderProjectItems" :key="item.value.name" >
                <a :href="item.value.link" target="_blank">
                    <figure class="project-img">
                        <div class="project-item-icon-box">
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="xl" style="color: #74C0FC;" />
                        </div>
                        <div class=" max-h-40 min-h-40">
                            <img :src="item.value.iconURL" alt="" loading="lazy">
                        </div>
                        
                    </figure>
                    <h1 class="project-title">{{item.value.name}}</h1>
                    <div class="flex flex-wrap">
                        <span class="project-category border-2 bg-blue-500 border-blue-500 !text-white my-1 px-1 rounded-md" 
                        v-for="category in getCategoriesStrings(item.value.categories)" :key="category">
                            {{category}}
                        </span>
                        <!-- <span class="project-category border-2 bg-green-500 border-green-500 !text-white my-1 px-1 rounded-md"
                        v-for="technique in item.value.techniques" :key="technique">
                            {{technique}}
                        </span> -->
                    </div>
                </a>
            </li>
        </ul>
    </section>
</article>
</template>

<script setup lang="ts">
import {type Ref, ref, computed, nextTick} from "vue";
import {ProjectCategory, ProjectItem} from "@/utils/ProjectItem";



function getCategoriesStrings(categorires:Set<ProjectCategory>){
    let array:string[] = [];
    categorires.forEach((category:ProjectCategory)=>{
        array.push(category.name);
    });
    return array;
}

const categoryWebDevelopment = new ProjectCategory("Web development");
const categoryMachineLearnging = new ProjectCategory("Machine Learning");
const categoryTools = new ProjectCategory("Tools");
const categoryAPP = new ProjectCategory("App");

const projectCCUClass = new ProjectItem("CCU Class").setLink("https://github.com/CCU-Class").setIcon("ccuclass.png").addCategory(categoryWebDevelopment);
const projectSapientiaCreatrix = new ProjectItem("Sapientia Creatrix").setLink("https://github.com/Sapientia-Creatrix").setIcon("Sapientia-Creatrix.png").addCategory(categoryWebDevelopment).addCategory(categoryMachineLearnging);
const projectUDPAttacker = new ProjectItem("UDPAttacker").setLink("https://github.com/ben99933/Java-UDP-Flood-Attacker").addCategory(categoryTools);
const projectCarbonMapApp = new ProjectItem("Tawian Carbon Map").setLink("https://github.com/carbon-map").setIcon("carbon-map.png").addCategory(categoryAPP).addCategory(categoryWebDevelopment).addCategory(categoryMachineLearnging);
const projectBookkeeper = new ProjectItem("Bookkeeper").setLink("https://github.com/ben99933/java_bookkeeper").addCategory(categoryTools);

const projectCategories: ProjectCategory[] =[
    categoryWebDevelopment,
    categoryTools,
    categoryAPP,
    categoryMachineLearnging,
];
const projectItems = [
    ref(projectCCUClass),
    ref(projectSapientiaCreatrix),
    ref(projectUDPAttacker),
    ref(projectCarbonMapApp),
    ref(projectBookkeeper),
];

const currentCategory = ref("All");
const getCurrentCategory = computed(()=>{
    return currentCategory.value;
});
async function chooseCategory(categorySelected:string){
    currentCategory.value = categorySelected;
    if(categorySelected=="All"){
        projectItems.forEach((item)=>{
            item.value.display = true;
        })
    }else{
        projectItems.forEach((item)=>{
            item.value.display = false;
        });
        await nextTick();
        projectItems.forEach((item)=>{
            item.value.categories.forEach((category)=>{
                if(category.name==categorySelected){
                    item.value.display = true;
                }
            })
        });
        
    }
}

const getRenderProjectItems = computed(()=>{
    let array:Ref[] = [];
    projectItems.forEach((item)=>{
        if(item.value.display==true)array.push(item);
    });
    return array;
});


</script>

<style lang="scss">

</style>