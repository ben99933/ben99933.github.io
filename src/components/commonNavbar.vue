<template>
<ul class="navbar-list  justify-start items-start">
    <li class="navbar-item" v-for="item in commonNavbarItems" :key="item.name">
        <a :href="item.link">
            <button class="navbar-link hover:text-blue-500" data-nav-link>
                {{item.name}}
            </button>   
        </a>
        
    </li>
</ul>
</template>


<script setup lang="ts">


class CommonNavbarItem {
    constructor(public name: string, public link: string) {}
}
const commonNavbarItems:CommonNavbarItem[]=[];
commonNavbarItems.push(new CommonNavbarItem("Blog", "#/blog/home"));
commonNavbarItems.push(new CommonNavbarItem("About Me", "#/about/AboutMe"));
if(import.meta.env.DEV)commonNavbarItems.push(new CommonNavbarItem("Admin", "#/admin/home"));




</script>