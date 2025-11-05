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
    <postEditor v-if="isPostView" :key="route.fullPath"  :class="isPostView ? 'active' : ''"/>
    <div v-if="!isPostView">
        <div v-for="item in selectionManager.navbarItems.value" :key="item.name" >
            <component v-bind:is="item.component" v-if="item.active" :class="item.active && !isPostView ? 'active' : ''"/>
        </div>
    </div>
    
    
</div>
</template>

<script setup lang="ts">
import commonNavbar from '@/components/commonNavbar.vue';
import AdminHome from "@/components/pages/admin/content/AdminHome.vue";
import postEditor from "@/components/pages/admin/content/blogPostEditor.vue"

// import blogTagsList from './content/blogTagsList.vue';
import { SelectionManager } from '@/utils/navbar/SelectionManager';
import { onMounted, computed} from 'vue';
import { useRouter, useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute();


const selectionManager = new SelectionManager();
selectionManager.registerContent("home", "Home", AdminHome);

const isPostView = computed(() => {
    console.log(route.params.page)
    return route.params.page === 'view' && !!route.query.id && !!route.query.month;
});


// 切換頁面 + 更新 URL
function switchPage(pageName: string) {
    if (selectionManager.navbarItemMap.value.has(pageName)) {
        selectionManager.setActive(pageName);
        router.replace({ name: 'admin', params: { page: pageName } });
    }else {
        console.warn(`Page ${pageName} not found in navbar items.`);
    }
}
onMounted(async()=>{
    switchPage(route.params.page as string);
    document.title = "Admin | ben99933.github.io";
});


</script>