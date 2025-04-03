<script setup lang="ts">
import { BlogPostTag, BlogPostTagRegister, BlogPostItem, BlogPostItemRegister } from "@/utils/Blog/BlogPostItem";
import { onMounted } from "vue";
import { RouterLink, RouterView } from 'vue-router'
import { loadAllBlogPostMetadata } from "./utils/Blog/BlogPostItemService";

onMounted(async()=>{
    loadAllBlogPostMetadata();
})

</script>

<template>
  <RouterView />
</template>

<style>


</style>

