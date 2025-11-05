<template>

    
<article class="blog active" data-page="blog">

  
  <header class="">
    <button @click="goBack">
      <ul class="flex">
        <li class="flex items-center gap-1 mr-4">
          <font-awesome-icon :icon="['fas', 'backward']" size="xl" style="color: #FFD43B;"/>
        </li>
        
        <li>
          <h3 class="h3 flex items-center hover:text-yellow-500">Back</h3>
        </li>
      </ul>
      
    </button>
    <div class="separator-line"></div>
    <!-- <h2 class="h2 article-title">{{ (metadata?.title || 'Article Not Found' ) }}</h2> -->
  </header>
  <section class="blog-posts text-white">
    

    <!-- metadata -->
    <div>
      <ul class="flex items-center justify-between mb-2">
        <li style="user-select: text;" class="">
          <div class="flex items-center gap-1">Upload Time: {{ (metadata?.date.toLocaleDateString()) }}</div>
          <div class="flex items-center gap-1">UUID = {{ metadata?.id }}</div>
        </li>
        <li class="flex gap-4">
          <button class="px-4 py-2 rounded transition-colors duration-500" :disabled="!isDirty"
          :class="isDirty?'bg-yellow-500 text-black':'bg-gray-900 text-gray-600'"
          @click="saveModify"
          >Save</button>

          <button class="px-2 py-2 rounded transition-colors duration-500" :disabled="!isDirty"
          :class="isDirty?'bg-gray-700 text-white':'bg-gray-900 text-gray-600'"
          @click="cancelModify">Cancel</button>
        </li>
      </ul>
      
      <div class="separator-line"></div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg font-bold ">Title:</label>
        <textarea
          v-model="form.metadata.title"
          class="flex-1 w-full p-2 bg-gray-800 text-white border rounded resize-y"
          placeholder="Title"
          rows="1"
        ></textarea>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-lg font-bold">Description:</label>
        <textarea
          v-model="form.metadata.description"
          class="flex-1 w-full p-2 bg-gray-800 text-white border rounded resize-y"
          placeholder="Description"
          rows="2"
        ></textarea>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-lg font-bold">Tags (用逗號分隔):</label>
        <textarea
          v-model="form.metadata.tags"
          class="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded resize-y"
          placeholder="e.g. java, note, tutorial"
          rows="1"
        ></textarea>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-lg font-bold">Image URL:</label>
        <textarea
          v-model="form.metadata.img"
          class="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded resize-y"
          placeholder=""
          rows="1"
        ></textarea>
      </div>
    </div>
    

    <!-- content -->
    <div class="flex flex-col gap-1">
      <ul class="flex items-center justify-between mb-2">
        <li><label class="text-lg font-bold">Content (Markdown):</label></li>
        <li class="flex gap-1 pt-4 ">
          <button
            @click="mode = 'edit'"
            class="m-auto px-2 py-2 rounded transition-colors duration-300 ease-in-out"
            :class="mode === 'edit' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'">Edit</button>
          <button
            @click="mode = 'preview'"
            class="m-auto px-1 py-2 rounded transition-colors duration-300 ease-in-out"
            :class="mode === 'preview' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'">Preview</button>
        </li>
      </ul>

      <div v-if="mode=='edit'">
        <textarea
          v-model="form.content"
          class="w-full h-full p-2 bg-gray-800 text-white border border-gray-600 rounded resize-y"
          placeholder="請輸入文章內容 (Markdown)"
          rows="20"
        ></textarea>
      </div>
      <div v-if="mode!='edit'" class="border-2">
        <MarkdownRenderer class="w-full h-full h-96" :content="liveMarkdown"/>
      </div>
      
    </div>
    
  </section>
  


</article>
</template>


<script setup lang="ts">
import { useRoute, useRouter} from 'vue-router'
import {ref, onMounted, type Ref, computed, nextTick} from 'vue'
import MarkdownRenderer from '../../blog/content/MarkdownRenderer.vue'
import { useBlogStore } from '@/stores/blog'
import { useSEO } from '@/composables/common/useSEO'
import type { BlogPost } from '@/types/blog/blog.types'
import { createBlogPost } from '@/utils/Blog/BlogUtils'
import {v4 as uuidv4} from 'uuid'


const mode = ref<'edit' | 'preview'>('edit')

const isDirty = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(formOrigin.value);
});



const form = ref<{
  metadata:{
    title:string,
    tags:string,
    description:string,
    img:string
  },
  content:string
}>({
  metadata:{
    title:"",
    tags:"",
    description:"",
    img:"",
  },
  content:"",
})

const formOrigin = ref<typeof form.value | null>({
  metadata:{
    title:"",
    tags:"",
    description:"",
    img:"",
  },
  content:"",
});



const liveMarkdown = computed(() => form.value.content);

const route = useRoute()
const router = useRouter();
const postId: Ref<string> = ref('')
const month: Ref<string> = ref('')

const metadata: Ref<BlogPost | null> = ref(null);
const markdownContent = ref("");
const markdownContentOriginal = ref("");


function goBack() {
  const referrer = document.referrer;
  const sameOrigin = referrer && new URL(referrer).origin === window.location.origin;
    
  if (window.history.length > 1 && sameOrigin) {
    router.back(); // 如果有上一頁，返回
  } else {
    router.push('/admin/home');
  }
}

function cancelModify(){
  form.value = JSON.parse(JSON.stringify(formOrigin.value));
}

async function saveModify(){
  if (!isDirty.value) return;
  console.log("save")
  
  // 發送請求到後端保存修改
  try{
    console.log("http://localhost:3030/api/blog, post");
    console.log(`metadata:`, metadata.value);
    const postdata = {
          metadata: {
            UUID: metadata.value!.id,
            title: form.value.metadata.title,
            date: metadata.value!.date.toISOString().slice(0, 10),
            tags: Array.from(form.value.metadata.tags.split(",")).map(tag => tag.trim()),
            description: form.value.metadata.description,
            img: form.value.metadata.img
            
          },
          content: form.value.content
        }
    console.log("postdata:", postdata);
    const response = await fetch("http://localhost:3030/api/blog",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
      }
    )
    console.log('Response:', response);
    formOrigin.value = JSON.parse(JSON.stringify(form.value));
  }catch (error) {
    console.error("Error saving changes:", error);
  }

}

async function updateSEO(metadata:BlogPost) {
  if(metadata){
    await nextTick();
    document.title = "";
    await nextTick();
    
    document.title = `${metadata.title} | ben99933.github.io`;
    const description = metadata.description || metadata.title || "ben99933.github.io";

    description
    let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    meta.content = description;
    
    
  }
}
async function loadpost() {
  postId.value = route.query.id as string;
  month.value = route.query.month as string;
  
  const blogStore = useBlogStore();
  const repository = blogStore.getRepository();
  
  try {
    metadata.value = await repository.getPost(postId.value, month.value);
    const text = await repository.getPostContent(postId.value, month.value);
    
    markdownContent.value = text;
    markdownContentOriginal.value = text;
    form.value = {
      metadata: {
        title: metadata.value?.title ?? "",
        tags: Array.from(metadata.value?.tags ?? []).join(", "),
        description: metadata.value?.description ?? "",
        img: metadata.value?.imageFileName ?? "",
      },
      content: text,
    }
    formOrigin.value = JSON.parse(JSON.stringify(form.value));
  } catch (error) {
    // 創建新文章
    const uuid: string = uuidv4() as string;
    const date: Date = new Date();
    const meta = {
      UUID: uuid,
      title: "",
      date: date.toISOString(),
      tags: [],
      description: "",
      img: ""
    };
    metadata.value = createBlogPost(meta);
    postId.value = uuid;
    month.value = date.toISOString().slice(0, 7);
    
    markdownContent.value = "";
    markdownContentOriginal.value = "";
    form.value = {
      metadata: {
        title: "",
        tags: "",
        description: "",
        img: "",
      },
      content: "",
    }
    formOrigin.value = JSON.parse(JSON.stringify(form.value));
    
    // 更改網址
    router.replace({query:{ month: month.value, id: postId.value } });
  }
}

onMounted(async () => {
  // console.log("mounted");
  await loadpost();
  await updateSEO(metadata.value as BlogPost);
});

</script>


<style>


</style>