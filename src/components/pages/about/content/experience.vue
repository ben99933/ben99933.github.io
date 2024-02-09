<template>
<article class="resume" data-page="experience">
    <header>
        <h2 class="h2 article-title">Experience</h2>
    </header>
    <section class="timeline" v-for="timeline in timeLines" :key="timeline.title">
        <div class="title-wrapper">
        <div class="icon-box">
            <font-awesome-icon :icon="timeline.icon" size="xl" style="color: #FFD43B;" />
        </div>
            <h3 class="h3">{{timeline.title}}</h3>
        </div>
        <ol class="timeline-list">
            <li class="timeline-item" v-for="item in timeline.items" :key="item.title">
                <h4 class="h4 timeline-item-title">{{item.title}}</h4>
                <span>{{item.time}}</span>
                <p class="timeline-text">{{item.description}}</p>
            </li>
        </ol>
    </section>
</article>
</template>

<script setup lang="ts">
import {TimeLine,TimeLineItem} from "@/utils/TimeLine";

const timeLines: Array<TimeLine> = [];

const timeLineEducation:TimeLine = new TimeLine("Education", "fa-solid fa-school")
                                        .addItem(new TimeLineItem(
                                            "National Chung Cheng University",
                                            "2021-2025",
                                            "Computer Science and Information Engineering"
                                        ));

const timeLineExperience:TimeLine = new TimeLine("Experience", "fa-solid fa-file-lines")
                                        .addItem(new TimeLineItem(
                                            "CCU Competitive Programming club (CCUPCDS)",
                                            "2022-2025",
                                            "Member of Instruction Team"
                                        ));

const timeLineContest:TimeLine = new TimeLine("Contest","fa-solid fa-award")
                                        .addItem(new TimeLineItem(
                                            "2023 ICPC Asia Taiwan Online Programming Contest",
                                            "Bronze Medal"
                                        )).addItem(new TimeLineItem(
                                            "2023 National Collegiate Programming Contest",
                                            "Honorable Mention Award"
                                        ))
                                        .addItem(new TimeLineItem(
                                            "Collegiate Programming Examination 2023 April",
                                            "Rank 7.8%",
                                        ))
                                        .addItem(new TimeLineItem(
                                            "International ICT Innovative Services Awards 2023",
                                            "Finalist"
                                        ))
                                        .addItem(new TimeLineItem(
                                            "2024 TSMC Career Hack",
                                            "Finalist"
                                        ));

timeLines.push(timeLineEducation);
timeLines.push(timeLineExperience);
timeLines.push(timeLineContest);
</script>