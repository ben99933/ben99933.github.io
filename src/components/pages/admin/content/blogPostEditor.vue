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
      <div class="flex flex-col gap-2">
        <label class="text-lg font-bold">AES Key (留空表示不加密):</label>
        <div class="flex gap-2">
          <input
            :type="showKey ? 'text' : 'password'"
            v-model="form.metadata.aesKey"
            class="flex-1 p-2 bg-gray-800 text-white border border-gray-600 rounded"
            placeholder="輸入加密金鑰，留空則不加密"
            autocomplete="off"
          />
          <button
            type="button"
            @click="generateAesKey"
            class="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded transition-colors duration-300"
            title="生成隨機金鑰"
          >
            <font-awesome-icon icon="fa-solid fa-key" style="color: #000000;" />
             Generate
          </button>

          <button
            type="button"
            @click="toggleShowKey"
            class="w-12 px-2 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-300"
            title="顯示/隱藏金鑰"
          >
            <div class="flex justify-center">
              <font-awesome-icon v-if="showKey" icon="fa-solid fa-eye" class="w-4 h-4" />
              <font-awesome-icon v-else icon="fa-solid fa-eye-slash" class="w-4 h-4" />
            </div>
            
          </button>
        </div>
        
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
const showKey = ref(false)

const isDirty = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(formOrigin.value);
});

/**
 * 生成隨機 AES Key (32 字元)
 */
function generateAesKey() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = 32
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  
  let key = ''
  for (let i = 0; i < length; i++) {
    key += charset[randomValues[i] % charset.length]
  }
  
  form.value.metadata.aesKey = key
  showKey.value = true  // 自動顯示生成的 key
}

function toggleShowKey() {
  showKey.value = !showKey.value
}

const form = ref<{
  metadata:{
    title:string,
    tags:string,
    description:string,
    img:string,
    aesKey:string
  },
  content:string
}>({
  metadata:{
    title:"",
    tags:"",
    description:"",
    img:"",
    aesKey:"",
  },
  content:"",
})

const formOrigin = ref<typeof form.value | null>({
  metadata:{
    title:"",
    tags:"",
    description:"",
    img:"",
    aesKey:"",
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

const MIN_KEY_LENGTH = 16
const MAX_KEY_LENGTH = 64

/**
 * 驗證 AES Key 格式
 * @returns 錯誤訊息，若無錯誤則返回 null
 */
function validateAesKey(): string | null {
  const key = form.value.metadata.aesKey
  
  // 空白 key 是允許的（表示不加密）
  if (!key || key.trim() === '') {
    return null
  }
  
  // 檢查長度
  if (key.length < MIN_KEY_LENGTH) {
    return `AES Key 長度至少需要 ${MIN_KEY_LENGTH} 字元（目前 ${key.length} 字元）`
  }
  
  if (key.length > MAX_KEY_LENGTH) {
    return `AES Key 長度不可超過 ${MAX_KEY_LENGTH} 字元（目前 ${key.length} 字元）`
  }
  
  // 檢查字元（只允許英數字和部分特殊符號）
  const validPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/
  if (!validPattern.test(key)) {
    return 'AES Key 包含無效字元，只允許英數字和常見特殊符號'
  }
  
  return null
}

async function saveModify(){
  if (!isDirty.value) return;
  
  // 驗證 AES Key
  const keyError = validateAesKey()
  if (keyError) {
    alert(keyError)
    return
  }
  
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
            img: form.value.metadata.img,
            aesKey: form.value.metadata.aesKey
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
  const queryId = route.query.id as string;
  month.value = route.query.month as string;
  
  // 如果 id 為 'new' 或 '+'，直接創建新文章
  const isNewPost = queryId === 'new' || queryId === '+';
  
  if (isNewPost) {
    // 創建新文章
    const uuid: string = uuidv4() as string;
    const date: Date = new Date();
    const meta = {
      UUID: uuid,
      title: "",
      date: date.toISOString(),
      tags: [],
      description: "",
      img: "",
      aesKey: ""
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
        aesKey: "",
      },
      content: "",
    }
    formOrigin.value = JSON.parse(JSON.stringify(form.value));
    return;
  }
  
  // 載入既有文章
  postId.value = queryId;
  const blogStore = useBlogStore();
  const repository = blogStore.getRepository();
  
  try {
    metadata.value = await repository.getPost(postId.value, month.value);
    const text = await repository.getPostContent(postId.value, month.value, metadata.value?.aesKey);
    
    markdownContent.value = text;
    markdownContentOriginal.value = text;
    form.value = {
      metadata: {
        title: metadata.value?.title ?? "",
        tags: Array.from(metadata.value?.tags ?? []).join(", "),
        description: metadata.value?.description ?? "",
        img: metadata.value?.imageFileName ?? "",
        aesKey: metadata.value?.aesKey ?? "",
      },
      content: text,
    }
    formOrigin.value = JSON.parse(JSON.stringify(form.value));
  } catch (error) {
    console.error("Error loading post:", error);
    // 文章不存在，導向回首頁
    router.replace('/admin/home');
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
