import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readdirSync, existsSync } from 'fs'

function getLessonEntries() {
  const subjectsDir = resolve(__dirname, 'subjects')
  return Object.fromEntries(
    readdirSync(subjectsDir)
      .filter((name) => existsSync(resolve(subjectsDir, name, 'index.html')))
      .map((name) => [name, resolve(subjectsDir, name, 'index.html')])
  )
}

const NAV_HTML = `
<style>
  .jo-nav{position:fixed;top:0;left:0;right:0;z-index:9999;
    background:#1d4ed8;padding:8px 18px;display:flex;align-items:center;gap:14px;
    box-shadow:0 2px 8px rgba(0,0,0,.18);
    font-family:'Noto Sans Lao','Phetsarath OT',system-ui,sans-serif}
  .jo-nav a{color:#fff;text-decoration:none;font-size:14px;
    display:flex;align-items:center;gap:6px;opacity:.88;transition:opacity .15s}
  .jo-nav a:hover{opacity:1}
  .jo-nav-spacer{height:44px}
</style>
<nav class="jo-nav">
  <a href="/">&#8592; ໜ້າຫຼັກ</a>
</nav>
<div class="jo-nav-spacer"></div>`

function injectLessonNav() {
  return {
    name: 'inject-lesson-nav',
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string, ctx: { filename: string }) {
        if (!ctx.filename.includes(`subjects`)) return html
        return html.replace(/<body[^>]*>/, (tag) => `${tag}${NAV_HTML}`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectLessonNav()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...getLessonEntries(),
      },
    },
  },
})
