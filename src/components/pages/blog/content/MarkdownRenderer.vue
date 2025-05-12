<template>
    <div class=" markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
//@ts-ignore
import markdownItKatex from 'markdown-it-katex'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown-dark.css'


const props = defineProps<{
    content: string
    language?: string
}>()

const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: (str: string, lang: string): string => {
        if (lang && hljs.getLanguage(lang)) {
        try {
            const lines = str.trimEnd().split("\n")
            const highlighted = lines.map((line, idx) => {
            const html = hljs.highlight(line, { language: lang, ignoreIllegals: true }).value
            return `<div class="code-line flex"><span class="line-number select-none pr-4 text-gray-500">${idx + 1}</span><span class="line-content">${html}</span></div>`
            })
            return `<pre class="hljs rounded-lg p-4 overflow-x-auto bg-gray-900 text-sm" ><code style="user-select: text !important;">${highlighted.join("\n")}</code></pre>
            `
        } catch (__) {}
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
}).use(markdownItKatex)

const renderedHtml = computed(() => md.render(props.content))

</script>

<style>
.markdown-body {
    font-family: 'Fira Code', monospace;
    color: white;
    line-height: 1.6;
    background-color: transparent !important;
}
.markdown-body .katex span {
  display: initial !important;
  writing-mode: horizontal-tb !important;
}


.code-line {
    white-space: pre;
}
.line-number {
    width: 2em;
    text-align: right;
    user-select: none;
}

</style>
