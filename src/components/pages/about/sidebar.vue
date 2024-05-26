<template>
<aside class="sidebar active" data-sidebar>
    <div class="sidebar-info">
        <figure class="avatar-box">
            <img src="/src/assets/images/my-avatar.png" alt="Richard hanrick" width="80">
        </figure>
        <div class="info-content">
            <h1 class="name" title="Richard hanrick">Chi-Lung Yang</h1>

            <!-- <p class="title">Web developer</p> -->
        </div>
        <!-- <button class="info_more-btn" data-sidebar-btn>
            <span>Show Contacts</span>
            <ion-icon name="chevron-down"></ion-icon>
        </button> -->
    </div>
    <div class="sidebar-info_more">
        <div class="separator"></div>
        <ul class="contacts-list">
            <li class="contact-item" v-for="item in contactItems" :key="item.title">
                <a :href="item.link" class="icon-box">
                    <font-awesome-icon :icon="item.icon" :style="item.style" size="xl"/>
                </a>
                <!-- <div class="icon-box">
                    
                    <font-awesome-icon :icon="item.icon" :style="item.style" size="xl"/>
                </div> -->
                <a :href="item.link" class="contact-info">
                    <p class="contact-title">{{item.title}}</p>
                    <!-- <a :href="item.link" class="contact-link">{{item.value}}</a> -->
                    <p class="contact-link">{{item.value}}</p>
                </a>
                
            </li>
        </ul>
    </div>
</aside>
</template>

<script setup lang="ts">

class ContactItem{
    private _title:string;
    private _value:string;
    private _link:string;
    private _icon :string[] | undefined;
    private _color :string | undefined;
    constructor(title:string, value:string, link:string , icon?:string[], color?:string){
        this._title = title;
        this._value = value;
        this._link = link;
        this._icon = icon;
        this._color = color;
    }
    public get title(){return this._title;}
    public get value(){return this._value;}
    public get link(){return this._link;}
    public get icon(){return this._icon;}
    public get color(){
        return this._color;
    }
    public get style(){
        return {
            color : this._color || "#74C0FC"
        };
    }
}

const contactItems:ContactItem[]=[
    new ContactItem("Github", "ben99933", "https://github.com/ben99933", ['fab', 'square-github'], "#7066ee"),
    new ContactItem("LinkedIn", "Chi-Lung Yang","https://www.linkedin.com/in/chi-lung-yang-662858220/",['fab', 'linkedin']),
];

</script>