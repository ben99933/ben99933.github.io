<template>
<article class="resume" data-page="skills">
    <header>
        <h2 class="h2 article-title">Skills</h2>
    </header>
    <section class="timeline" v-for="category in skillCategories" :key="category.title">
        <div class="title-wrapper">
            <h3 class="h3">{{category.title}}</h3>
        </div>
        <div class="flex flex-wrap">
            <div class="mx-1 mb-1" v-for="item in category.items" :key="item.name">
                <img class="w-auto h-10 rounded-3xl" :src="item.icon" alt="">
            </div>
        </div>
    </section>
</article>
</template>

<script setup lang="ts">

class SkillCategory{
    private _title:string;
    private _items: Array<SkillItem> = [];
    constructor(title:string,items?: Array<SkillItem>){
        this._title = title;
        this._items = items || [];
    }
    public get items(){return this._items;}
    public get title(){return this._title;}
    public addItem(item: SkillItem){
        this.items.push(item);
        return this;
    }
}

class SkillItem{
    private _name:string = "";
    private _icon:string = "";
    constructor (name:string, icon?:string){
        this._name = name;
        this._icon = icon || "";
    }
    public get name(){return this._name;}
    public get icon(){return this._icon;}
}

const skillCategories:Array<SkillCategory> = [];
const skillLanguages:SkillCategory = new SkillCategory("Languages")
                                            .addItem(new SkillItem("Python", "https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"))
                                            .addItem(new SkillItem("Java", "https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"))
                                            .addItem(new SkillItem("Typescript", "https://img.shields.io/badge/typescript%20-%23007ACC.svg?&style=for-the-badge&logo=typescript&logoColor=white"))
                                            .addItem(new SkillItem("JavaScript", "https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"))
                                            .addItem(new SkillItem("C#", "https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=csharp&logoColor=white"))
                                            .addItem(new SkillItem("C", "https://img.shields.io/badge/C++%20-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white"));
const skillWeb:SkillCategory = new SkillCategory("Web Development")
                                            .addItem(new SkillItem("VueJs", "https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D"))
                                            .addItem(new SkillItem("ExpressJs", "https://img.shields.io/badge/express.js%20-%23404d59.svg?&style=for-the-badge"))
                                            .addItem(new SkillItem("NodeJs", "https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"))
                                            .addItem(new SkillItem("Tailwind", "https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"))
                                            ;
const skillSoftTool = new SkillCategory("SKill & Tools")
                                            .addItem(new SkillItem("Git", "https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white"))
                                            .addItem(new SkillItem("Linux", "https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black"))
                                            .addItem(new SkillItem("Docker", "https://img.shields.io/badge/docker-%230db7ed.svg?&style=for-the-badge&logo=docker&logoColor=white"))
                                            .addItem(new SkillItem("Github Actions", "https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white"));
const skillML = new SkillCategory("Machine Learning")
                                            .addItem(new SkillItem("TensorFlow", "https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white"))
                                            .addItem(new SkillItem("PyTorch", "https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white"));
const skillDB = new SkillCategory("Database")
                                            .addItem(new SkillItem("MySQL", "https://img.shields.io/badge/mysql-%2300f.svg?&style=for-the-badge&logo=mysql&logoColor=white"))
                                            .addItem(new SkillItem("MariaDB", "https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white"))
                                            .addItem(new SkillItem("PostgreSQL", "https://img.shields.io/badge/postgres-%23316192.svg?&style=for-the-badge&logo=postgresql&logoColor=white"));

skillCategories.push(skillLanguages);
skillCategories.push(skillWeb);
skillCategories.push(skillSoftTool);
skillCategories.push(skillML);
skillCategories.push(skillDB);



</script>