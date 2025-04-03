import { computed, markRaw, ref, type Component, type Ref } from "vue";
export class SelectionManager{
    public navbarItems:Ref<NavbarItem[]>;
    public navbarItemMap:Ref<Map<string, NavbarItem>>;
    constructor(){
        this.navbarItems = ref([]);
        this.navbarItemMap = ref(new Map<string, NavbarItem>());
    }
    public registerContent(name:string, localeName:string, componentName:Component){
        this.navbarItemMap.value.set(name, new NavbarItem(name, localeName, componentName));
        (this.navbarItems.value as NavbarItem[]).push(this.navbarItemMap.value.get(name) as NavbarItem);
        if(this.navbarItems.value.length === 1){
            this.setActive(name);
        }
        return this;
    }
    public getActive(name:string){
        return this.navbarItems.value.find(item => item.name === name)?.active;
    }
    public setActive(name:string){
        this.navbarItems.value.forEach(item => {
            item.active = item.name === name;
        });
    }
    
}

export class NavbarItem{
    public active:boolean;
    public _component:Component;
    constructor(public name:string, public localeName:string, component:Component){
        this.active = false;
        this._component = markRaw(component);
    }
    public get component(){
        return this._component;
    }
}

