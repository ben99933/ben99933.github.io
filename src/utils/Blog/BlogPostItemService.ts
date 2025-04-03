import { BlogPostTagRegister, BlogPostItem, BlogPostItemRegister } from "@/utils/Blog/BlogPostItem";
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

