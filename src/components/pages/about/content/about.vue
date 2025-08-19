<template>
<article class="about" data-page="about">

    <header>
        <h2 class="h2 article-title">About me</h2>
    </header>

    <!-- intro -->
    <section class="about-text">
        <div v-for="text in aboutTexts" :key="text">
            <p>{{text}}</p>
        </div>
        <!-- <p>
        I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media.
        I enjoy turning complex problems into simple, beautiful and intuitive designs.
        </p>

        <p>
        My job is to build your website so that it is functional and user-friendly but at the same time attractive.
        Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. 
        My aim is to bring across your message and identity in the most creative way. I created web design for many famous brand companies.
        </p> -->
    </section>

    <!--- service-->
    <section class="service">
        <h3 class="h3 service-title">What I like to do</h3>
        <ul class="service-list">
            <li class="service-item" v-for="item in serviceItems" :key="item.title">
                <div class="service-icon-box">
                    <font-awesome-icon :icon="item.icon" size="xl" style="color: #FFD43B;" />
                </div>
                <div class="service-content-box">
                    <h4 class="h4 service-item-title">{{item.title}}</h4>
                    <p class="service-item-text">
                        {{item.content}}
                    </p>
                </div>
            </li>
        </ul>
    </section>


    <!--- testimonials-->
    <!-- <section class="testimonials">
        <h3 class="h3 testimonials-title">Testimonials</h3>
        <ul class="testimonials-list has-scrollbar">
        <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
            <figure class="testimonials-avatar-box">
                <img src="./assets/images/avatar-1.png" alt="Daniel lewis" width="60" data-testimonials-avatar>
            </figure>
            <h4 class="h4 testimonials-item-title" data-testimonials-title>Daniel lewis</h4>
            <div class="testimonials-text" data-testimonials-text>
                <p>
                Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                lot of experience
                and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                consectetur adipiscing
                elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                </p>
            </div>
            </div>
        </li>
        <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
            <figure class="testimonials-avatar-box">
                <img src="./assets/images/avatar-2.png" alt="Jessica miller" width="60" data-testimonials-avatar>
            </figure>
            <h4 class="h4 testimonials-item-title" data-testimonials-title>Jessica miller</h4>
            <div class="testimonials-text" data-testimonials-text>
                <p>
                Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                lot of experience
                and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                consectetur adipiscing
                elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                </p>
            </div>
            </div>
        </li>
        <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
            <figure class="testimonials-avatar-box">
                <img src="./assets/images/avatar-3.png" alt="Emily evans" width="60" data-testimonials-avatar>
            </figure>
            <h4 class="h4 testimonials-item-title" data-testimonials-title>Emily evans</h4>
            <div class="testimonials-text" data-testimonials-text>
                <p>
                Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                lot of experience
                and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                consectetur adipiscing
                elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                </p>
            </div>
            </div>
        </li>
        <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
            <figure class="testimonials-avatar-box">
                <img src="./assets/images/avatar-4.png" alt="Henry william" width="60" data-testimonials-avatar>
            </figure>
            <h4 class="h4 testimonials-item-title" data-testimonials-title>Henry william</h4>
            <div class="testimonials-text" data-testimonials-text>
                <p>
                Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                lot of experience
                and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                consectetur adipiscing
                elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                </p>
            </div>
            </div>
        </li>
        </ul>
    </section> -->

    <!--- testimonials modal-->
    <!-- <div class="modal-container" data-modal-container>
        <div class="overlay" data-overlay></div>
        <section class="testimonials-modal">
        <button class="modal-close-btn" data-modal-close-btn>
            <ion-icon name="close-outline"></ion-icon>
        </button>
        <div class="modal-img-wrapper">
            <figure class="modal-avatar-box">
            <img src="./assets/images/avatar-1.png" alt="Daniel lewis" width="80" data-modal-img>
            </figure>
            <img src="./assets/images/icon-quote.svg" alt="quote icon">
        </div>
        <div class="modal-content">
            <h4 class="h3 modal-title" data-modal-title>Daniel lewis</h4>
            <time datetime="2021-06-14">14 June, 2021</time>
            <div data-modal-text>
            <p>
                Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                lot of experience
                and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                consectetur adipiscing
                elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
            </p>
            </div>
        </div>
        </section>
    </div> -->

    <!---clients-->
    <!-- <section class="clients">
        <h3 class="h3 clients-title">Clients</h3>
        <ul class="clients-list has-scrollbar">
        <li class="clients-item">
            <a href="#">
            <img src="./assets/images/logo-1-color.png" alt="client logo">
            </a>
        </li>
        <li class="clients-item">
            <a href="#">
            <img src="./assets/images/logo-2-color.png" alt="client logo">
            </a>
        </li>
        <li class="clients-item">
            <a href="#">
            <img src="./assets/images/logo-3-color.png" alt="client logo">
            </a>
        </li>
        <li class="clients-item">
            <a href="#">
            <img src="./assets/images/logo-4-color.png" alt="client logo">
            </a>
        </li>
        <li class="clients-item">
            <a href="#">
            <img src="./assets/images/logo-5-color.png" alt="client logo">
            </a>
        </li>
        <li class="clients-item">
            <a href="#">
            <img src="./assets/images/logo-6-color.png" alt="client logo">
            </a>
        </li>
        </ul>
    </section> -->
</article>
</template>

<script setup lang="ts">
class AboutServiceItem{
    private _title:string;
    private _icon?:string="fa-solid fa-circle-question";
    private _content?:string="";
    constructor(title:string){
        this._title = title;
    }
    public setIcon(path:string){
        this._icon = path;
        return this;
    }
    public setContent(content:string){
        this._content = content;
        return this;
    }
    public get title(){return this._title;}
    public get icon(){return this._icon;}
    public get content(){return this._content;}
}

const serviceItems:AboutServiceItem[] = [
    new AboutServiceItem("Software Development").setIcon("fa-solid fa-laptop-code"),
    new AboutServiceItem("Web Development").setIcon("fa-solid fa-code"),
    new AboutServiceItem("Game Development / Modding").setIcon("fa-brands fa-unity"),
    new AboutServiceItem("Competitive programming").setIcon("fa-solid fa-medal"),
];


/**
   嗨，大家好！我是Chi-Lung Yang，一位對資訊科技充滿熱情的資訊工程學生。
   目前就讀於National Chung Cheng University，專攻資訊工程領域，並且對這個領域的發展充滿好奇心。
   在我的學術背景中，我接觸了不同層面的資訊工程領域，包括軟體開發、資料科學和網路技術。
   這種多元的學習經驗讓我能夠看到資訊工程的各種應用和可能性。
   我喜歡挑戰自己，尋找解決問題的創新方法，同時也享受與同儕合作的過程。

   我期待能夠在資訊科技領域中不斷成長，掌握新技術，並將所學應用於實際的專案中。
   謝謝你來到我的個人網頁，我希望這裡能夠展現我對資訊工程的熱情和學習心得。
   如果有任何問題或合作的機會，請隨時與我聯絡！
*/
const aboutTexts:string[]=[
    "Hi, I'm Chi-Lung Yang, a passionate computer science student at National Chung Cheng University. My academic journey has exposed me to various facets of information engineering, including software development, machine learning, and network technology.",
    "Thriving on challenges, constantly seeking innovative solutions, and enjoying collaborative efforts with peers. My goal is to grow continually in the information technology field, mastering new technologies, and applying my skills to real-world projects.",
    "Thanks for browsing by my webpage. It's a glimpse into my enthusiasm for computer science. Feel free to reach out for any questions or collaboration opportunities!",

];




</script>