import { BlogPostTagRegister, BlogPostItem, BlogPostItemRegister,BlogPostFactory } from "@/utils/Blog/BlogPostItem";
import { ref } from "vue";
export const isBlogReady = ref(false);

export async function loadAllBlogPostMetadata(indexPath:string = '/blogDB/index.json'){
    const indexRes = await fetch(indexPath);
    const filenames: string[] = await indexRes.json();

    for (const filename of filenames) {
        try {
            const metadataRes = await fetch("/blogDB/metadata/" + filename);
            const metadata = await metadataRes.json();

            const postItem = new BlogPostItem(metadata.title, new Date(metadata.date), metadata.UUID);

            for (const tagName of metadata.tags as string[]) {
                const tag = BlogPostTagRegister.getInstance().addTag(tagName);
                postItem.addTag(tag);
            }

            if (typeof metadata.img === 'string' && metadata.img.length > 0) {
                postItem.setImg(metadata.img);
            }

            postItem.description = metadata.description;

            BlogPostItemRegister.getInstance().registerItem(postItem);
        } catch (err) {
            console.error(`Failed to load metadata: ${filename}`, err);
        }
    }
    isBlogReady.value = true;
}

export async function loadMetadata(queryId:string, queryMonth:string){
    let result:BlogPostItem | null = null;
    try{

        // console.log(`quertId=${queryId}, queryMonth=${queryMonth}`);
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
        if (typeof queryId === "string" && uuidRegex.test(queryId) && typeof queryMonth === "string" && monthRegex.test(queryMonth)){
        const metaRes = await fetch(`/blogDB/metadata/${queryMonth}/${queryId}.json`);
        // console.losg(`metaRes=${metaRes}`);
        const meta = await metaRes.json();
        
        result = BlogPostFactory.createFromMetadata(meta);
        
        }else{
        console.warn("worng id or month");
        }
    }catch(e){
        console.warn(e)
    }
    return result;
  
}

export async function loadMarkdown(month:string, postId:string){
    let result:string = "";
    try{
        const res = await fetch(`/blogDB/post/${month}/${postId}.md`)
        const text = await res.text();
        result = text
    }catch(e){
        console.error(e);
    }
    return result;
}

