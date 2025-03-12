export class BlogPostItem{
    private _categories: Set<BlogPostCategory> = new Set<BlogPostCategory>();
    private _img:string = "";
    private _description:string = "";
    constructor(public title: string, public date: Date, public link:string){
        
    }

    public addCategory(category: BlogPostCategory): BlogPostItem{
        this._categories.add(category);
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
    public get categories(): Set<BlogPostCategory>{
        return this._categories;
    }
    public set description(description: string){
        this._description = description;
    }
    
}

export class BlogPostCategory{
    constructor(public name: string){
        
    }
}

//singleton 
export class BlogPostCategoryRegister{
    private static register: BlogPostCategoryRegister;
    public categories: BlogPostCategory[] = [];
    private constructor(){

    }
    public static getInstance(): BlogPostCategoryRegister{
        if (this.register == null){
            this.register = new BlogPostCategoryRegister();
        }
        return this.register;
    }
}
export class BlogPostItemRegister{
    private static register: BlogPostItemRegister;
    public items: BlogPostItem[] = [];
    
    private constructor(){

    }
    public static getInstance(): BlogPostItemRegister{
        if(this.register == null){
            this.register = new BlogPostItemRegister();
        }
        return this.register;
    }
}