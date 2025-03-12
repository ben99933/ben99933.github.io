
export class ProjectCategory{
    private _name:string;
    public static categories:ProjectCategory[] =[];
    public projectItems:ProjectItem[] = [];
    constructor(name:string){
        this._name = name;
    }
    public get name(){return this._name;}
    static getCategoryFromString(name:string){
        for(let i = 0;i<this.categories.length;i++){
            if(this.categories[i].name==name)return this.categories[i];
        }
        return null;
    }
    
}
export class ProjectItem{
    private _name:string;
    private _categories:Set<ProjectCategory>;
    private _iconSrc:string = this.defaultIcon;
    private _link:string = "#";
    private _techniques: string[] = [];
    private _descriptions:string[] = [];
    public display:boolean = true;
    constructor(name:string){
        this._name = name;
        this._categories = new Set<ProjectCategory>();
    }
    public setIcon(icon:string){
        this._iconSrc = icon;
        return this;
    }
    public setLink(link:string){
        this._link = link;
        return this;
    }
    public addCategory(category:ProjectCategory){
        this._categories.add(category);
        category.projectItems.push(this);
        return this;
    }
    public addTechnique(technique:string){
        this.techniques.push(technique);
        return this;
    }
    public get name(){return this._name;}
    public get categories(){return this._categories;}
    public get iconSrc(){
        return this._iconSrc;
    }
    public get link(){return this._link;}
    public get techniques(){return this._techniques;}
    public get defaultIcon(){
        return "default.png";
    }
    public get iconURL(){
        return new URL(`../assets/images/projects/${this.iconSrc}`, import.meta.url).href;
    }
    public get descriptions(){return this._descriptions;}

}