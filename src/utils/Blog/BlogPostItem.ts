import { ref , type Ref} from "vue";

export class BlogPostItem{
    private _tags: Set<BlogPostTag> = new Set<BlogPostTag>();
    private _img:string = "";
    private _description:string = "";
    constructor(public title: string, public postDate: Date, public uuid:string){
        
    }

    public addTag(tag: BlogPostTag): BlogPostItem{
        this._tags.add(tag);
        return this;
    }
    public setImg(img: string): BlogPostItem{
        this._img = img;
        return this;
    }
    public setDescription(description: string): BlogPostItem{
        this._description = description;
        return this;
    }
    public get img(): string{
        return this._img;
    }
    public get imgUrl(): string{
        return new URL(`../../assets/images/blog/${this.img}`, import.meta.url).href;
    }
    public get tags(): Set<BlogPostTag>{
        return this._tags;
    }
    public set description(description: string){
        this._description = description;
    }
    public get description(): string{
        return this._description;
    }

    
}

export class BlogPostTag{
    constructor(public name: string){
        
    }
}

//singleton 
export class BlogPostTagRegister{
    private static register: BlogPostTagRegister;
    public tags: Ref<Map<string, BlogPostTag>> = ref(new Map<string, BlogPostTag>());
    private constructor(){

    }
    public static getInstance(): BlogPostTagRegister{
        if (this.register == null){
            this.register = new BlogPostTagRegister();
        }
        return this.register;
    }
    public addTag(name: string): BlogPostTag{
        let tag = this.tags.value.get(name);
        if(tag == null){
            tag = new BlogPostTag(name);
            this.tags.value.set(name, tag);
        }
        return tag;
    }
    public getTag(name: string): BlogPostTag | null{
        return this.tags.value.get(name) ?? null;
    }
}
export class BlogPostItemRegister{
    private static register: BlogPostItemRegister;
    public items: Ref<Map<string, BlogPostItem>>= ref(new Map<string, BlogPostItem>()) as Ref<Map<string, BlogPostItem>>; 
    
    private constructor(){
        
    }
    public static getInstance(): BlogPostItemRegister{
        if(this.register == null){
            this.register = new BlogPostItemRegister();
        }
        return this.register;
    }
    public registerItem(item: BlogPostItem): BlogPostItem{
        this.items.value.set(item.uuid, item);
        return item;
    }
    public removeItem(uuid: string): boolean {
        return this.items.value.delete(uuid);
    }
}


export interface BlogPostMetadata {
    title: string;
    date: string;
    UUID: string;
    description?: string;
    img?: string;
    tags?: string[];
  }
export class BlogPostFactory {
    static createFromMetadata(meta: BlogPostMetadata): BlogPostItem {
      const post = new BlogPostItem(meta.title, new Date(meta.date), meta.UUID);
      if (meta.description) post.description = meta.description;
      if (meta.img) post.setImg(meta.img);
  
      if (Array.isArray(meta.tags)) {
        for (const tag of meta.tags) {
          post.addTag(BlogPostTagRegister.getInstance().addTag(tag));
        }
      }
  
      return post;
    }
  }