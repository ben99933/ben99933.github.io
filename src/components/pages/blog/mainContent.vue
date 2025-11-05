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


    <!--- #CONTENT-->
    <blogPost v-if="isPostView" :key="route.fullPath"  :class="isPostView ? 'active' : ''"/>
    <div v-if="!isPostView">
        <div v-for="item in selectionManager.navbarItems.value" :key="item.name" >
            <component v-bind:is="item.component" v-if="item.active" :class="item.active && !isPostView ? 'active' : ''"/>
        </div>
    </div>
    
    
</div>
</template>

<script setup lang="ts">
import commonNavbar from '@/components/commonNavbar.vue';
import blogHome from "@/components/pages/blog/content/blogHome.vue";
import blogPost from "@/components/pages/blog/content/BlogPost.vue"
import blogArchives from './content/blogArchives.vue';
// import blogTagsList from './content/blogTagsList.vue';
import { SelectionManager } from '@/utils/navbar/SelectionManager';
import { onMounted, computed} from 'vue';
import { useRouter, useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute();


const selectionManager = new SelectionManager();
selectionManager.registerContent("home", "Home", blogHome);
selectionManager.registerContent("archive", "Archive", blogArchives);

const isPostView = computed(() => {
    console.log(route.params.page)
    return route.params.page === 'view' && !!route.query.id && !!route.query.month;
});


// 切換頁面 + 更新 URL
function switchPage(pageName: string) {
    if (selectionManager.navbarItemMap.value.has(pageName)) {
        selectionManager.setActive(pageName);
        router.replace({ name: 'Blog', params: { page: pageName } }); 
    }
}
onMounted(async()=>{
    switchPage(route.params.page as string);
    document.title = "Blog | ben99933.github.io";
});


</script>