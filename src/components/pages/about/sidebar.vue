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
                <div class="icon-box">
                    <font-awesome-icon :icon="item.icon" style="color:#74C0FC" size="xl"/>
                </div>
                <div class="contact-info">
                    <p class="contact-title">{{item.title}}</p>
                    <a :href="item.link" class="contact-link">{{item.value}}</a>
                </div>
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
    constructor(title:string, value:string, link:string , icon?:string[]){
        this._title = title;
        this._value = value;
        this._link = link;
        this._icon = icon;
    }
    public get title(){return this._title;}
    public get value(){return this._value;}
    public get link(){return this._link;}
    public get icon(){return this._icon;}
}

const contactItems:ContactItem[]=[
    new ContactItem("Github", "ben99933", "https://github.com/ben99933", ['fab', 'square-github']),
    new ContactItem("LinkedIn", "Chi-Lung Yang","https://www.linkedin.com/in/chi-lung-yang-662858220/",['fab', 'linkedin']),
];

</script>