export class TimeLine{
    private _title:string;
    private _items:TimeLineItem[];
    private _icon:string|undefined = "";
    constructor(title:string, icon?:string, items?:TimeLineItem[]){
        this._title = title;
        this._items = items || [];
        this._icon = icon || "";
    }
    public get items(){return this._items;}
    public get title(){return this._title;}
    public get icon(){return this._icon;}
    public addItem(item:TimeLineItem){
        this.items.push(item);
        return this;
    }
}
export class TimeLineItem{
    private _title:string;
    private _time:string|undefined="";
    private _description:string|undefined="";
    constructor(title:string, time?:string, description?:string){
        this._title = title;
        this._time = time ||  "";
        this._description = description || "";
    }
    public get title() { return this._title; }
    public get time() { return this._time; }
    public get description(){return this._description;}
    
}