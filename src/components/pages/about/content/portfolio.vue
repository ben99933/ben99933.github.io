<template>
<article class="portfolio" data-page="portfolio">
    <header>
        <h2 class="h2 article-title">Portfolio</h2>
    </header>
    <section class="projects">
        <ul class="filter-list flex flex-wrap gap-2">
            <!-- All -->
            <li class="filter-item border-orange-300"
                :class="getCurrentCategory === 'All' ? 'border-b-2' : ''" >
                <button @click="chooseCategory('All')">All</button>
            </li>

            <!-- 熱門分類 -->
            <li class="filter-item border-orange-300" v-for="category in sortedCategories.slice(0, MAX_VISIBLE_CATEGORIES)" :key="category.name" :class="getCurrentCategory === category.name ? 'border-b-2' : ''" >
                <button @click="chooseCategory(category.name)">
                {{ category.name }}
                </button>
            </li>

            <!-- 更多按鈕 -->
            <li v-if="categories.size >= MAX_VISIBLE_CATEGORIES" class="filter-item border-orange-300 ml-auto">
                <button @click="showAllCategories = !showAllCategories" class="p-1 border-solid rounded-full border-2  border-orange-300 items-center">
                    <ul v-if="!showAllCategories" class="flex flex-wrap gap-2 mx-2 items-center">
                        <li class="flex-auto font-extrabold font-mono">More</li>
                        <li><font-awesome-icon :icon="['fas', 'caret-down']" size="2xl" style="color: #FFD43B" /></li>
                    </ul>
                    <ul v-else class="flex flex-wrap gap-2 mx-2 items-center">
                        <li class="flex-auto font-extrabold font-mono">Less</li>
                        <li><font-awesome-icon :icon="['fas', 'caret-up']" size="2xl" style="color: #FFD43B" /></li>
                    </ul>
                    
                </button>
            </li>
        </ul>

        <!-- 展開部分加上 transition -->
        <transition name="slide-fade">
            <ul v-if="showAllCategories" class="filter-list flex flex-wrap gap-2 mt-2" >
                <li class="filter-item border-orange-300" v-for="category in sortedCategories.slice(MAX_VISIBLE_CATEGORIES)" :key="category.name" :class="getCurrentCategory === category.name ? 'border-b-2' : ''">
                    <button @click="chooseCategory(category.name)">
                        {{ category.name }}
                    </button>
                </li>
            </ul>
        </transition>


        
        <div class="separator-line"></div>

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
                    
                    <figure class="project-img max-h-40 min-h-40 border-2 border-orange-300">
                        <div class="project-item-icon-box">
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="xl" style="color: #74C0FC;" />
                        </div>
                        <div class="">
                            <img :src="item.value.iconURL" alt="" loading="lazy" class="">
                        </div>
                    </figure>
                    <h1 class="project-title">{{item.value.name}}</h1>

                    <!-- category -->
                    <div class="flex flex-wrap gap-1">
                        <!-- 顯示前 3 個 -->
                        <span class="project-category border-2 bg-blue-500 border-blue-500 !text-white my-1 px-1 rounded-md" 
                        v-for="category in getCategoriesStrings(item.value.categories).slice(0, 3)" :key="category">
                            {{category}}
                        </span>
                        <!-- 顯示 +N more -->
                        <span
                            v-if="getCategoriesStrings(item.value.categories).length > 3"
                            class="project-category border-2 bg-blue-500 border-blue-500 !text-white my-1 px-1 rounded-md"
                            :title="getCategoriesStrings(item.value.categories).slice(3).join(', ')"
                        >
                            +{{ getCategoriesStrings(item.value.categories).length - 3 }} more
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
import {type Ref, ref, computed, nextTick, onMounted} from "vue";
import {ProjectCategory, ProjectItem} from "@/utils/ProjectItem";
import { delay } from "@/utils/Time";

const categories = ref(new Map<string,ProjectCategory>());
const projectCategories = computed(()=>{
    return Array.from(categories.value.values());
});
const currentCategory = ref("All");
const getCurrentCategory = computed(()=>{
    return currentCategory.value;
});


// 只顯示前幾個個類別，點擊後顯示全部類別
const showAllCategories = ref(false);
const MAX_VISIBLE_CATEGORIES = 4; // 最大顯示的類別數量
const sortedCategories = computed(() => {
    const frequency = new Map<string, number>();
    projectItems.value.forEach((item) => {
        item.value.categories.forEach((category) => {
            frequency.set(category.name, (frequency.get(category.name) || 0) + 1);
        });
    });
    return Array.from(categories.value.values()).sort((a, b) => (frequency.get(b.name) || 0) - (frequency.get(a.name) || 0));
});
const visibleCategories = computed(() => {
  return showAllCategories.value
    ? sortedCategories.value
    : sortedCategories.value.slice(0, MAX_VISIBLE_CATEGORIES);
});

const projectItems = ref<Ref<ProjectItem>[]>([]);
    
onMounted(async () => {
    const res = await fetch("/projects.json");
    const jsonData = await res.json();
    // console.log(jsonData);
    
    const result: Ref<ProjectItem>[] = [];

    jsonData.forEach((itemData: any) => {
        const project = new ProjectItem(itemData.name).setLink(itemData.link);
        if((itemData.icon as string).length > 0)project.setIcon(itemData.icon);
            

        itemData.categories.forEach((category: string) => {
            if (!categories.value.has(category)) {
                const newCategory = new ProjectCategory(category);
                categories.value.set(category, newCategory);
            }
            project.addCategory(categories.value.get(category) as ProjectCategory);
        });

        project.display = true;
        result.push(ref(project) as Ref<ProjectItem>);
        
    });

    // 可以加 shuffle
    result.sort(() => Math.random() - 0.5);

    projectItems.value.splice(0, projectItems.value.length, ...result); // 寫入

});


function getCategoriesStrings(categories:Set<ProjectCategory>){
    return Array.from(categories).map((category:ProjectCategory) => category.name);
}
async function chooseCategory(categorySelected:string){
    currentCategory.value = categorySelected;
    if(categorySelected=="All"){
        projectItems.value.forEach((item)=>{
            item.value.display = true;
        })
    }else{
        projectItems.value.forEach((item)=>{
            item.value.display = false;
        });
        await nextTick();
        for(var projItem of projectItems.value){
            
            for(var category of projItem.value.categories){
                if(category.name==categorySelected){
                    projItem.value.display = true;
                    // await delay(25);
                }
            }
            
        }
        // projectItems.forEach((item)=>{
        //     item.value.categories.forEach((category)=>{
        //         if(category.name==categorySelected){
        //             item.value.display = true;
        //         }
        //     })
        // });
        
    }
}

const getRenderProjectItems = computed(()=>{
    // let array:Ref[] = [];
    // projectItems.value.forEach((item)=>{
    //     if(item.value.display==true)array.push(item);
    // });
    // return array;
    return projectItems.value.filter((item)=>item.value.display);
});


</script>

<style lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px; // 依你的預估高度調整
  opacity: 1;
  transform: translateY(0);
}
</style>