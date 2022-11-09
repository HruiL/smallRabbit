import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { join } from "path";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import requireTransform from "vite-plugin-require-transform";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    vue(),
    vueJsx(),
    Components({
      // 指定组件位置，默认是 src/components
      // 表示 components 和 views 目录下的组件不需要引入，就可以直接使用
      dirs: ["src/components", "src/views"],
      // 搜索子目录
      deep: true,
      // 组件的有效文件扩展名
      extensions: ["vue"],
      // 配置文件生成位置 让ts知道组件名称和组件路径的对应关系，防止ts不认识报错
      dts: "components.d.ts",
    }),
    AutoImport({
      // 注册要自动引入的库
      imports: ["vue", "vue-router", "pinia", "@vueuse/core", "vee-validate"],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      dts: "auto-import.d.ts",
    }),
    requireTransform({
      fileRegex: /.ts$|.tsx$|.vue$/,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持在 JavaScript 文件中将 less 作为模块导入
        javascriptEnabled: true,
        modifyVars: {
          hack: `
            true; 
            @import "${join(__dirname, "./src/assets/styles/variables.less")}"; 
            @import "${join(__dirname, "./src/assets/styles/mixin.less")}";
          `,
        },
      },
    },
  },
});
