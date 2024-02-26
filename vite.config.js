/*
 * @Description: 一个 Vite 的配置文件，用于配置 Vite 项目的构建和开发选项
 * @FilePath: \SkyBox-FE\vite.config.js
 * @Author: WhimsyQuester rongquanhuang01@gmail.com
 * @Date: 2023-11-14 11:54:47
 * @LastEditors: WhimsyQuester rongquanhuang01@gmail.com
 * @LastEditTime: 2023-11-14 17:17:34
 * Copyright (c) 2023 by WhimsyQuester , All Rights Reserved. 
 */
import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()], define: {
        'process.env': {}
    }, resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }, // 开发服务器的选项
    server: {
        port: 1024, // 服务器监听的端口号
        hmr: true,  // 开启热模块替换，使得在开发过程中可以实时更新修改的模块
        proxy: {    // 配置了代理设置
            "/api": {
                target: "http://localhost:7090", changeOrigin: true, pathRewrite: {
                    "^api": "/api"
                }
            }
        }
    }, // 构建选项，用于生成生产环境的代码
    build: {
        // 设置一个警告阈值，当一个 chunk 的大小超过 3000 字节时会发出警告
        chunkSizeWarningLimit: 3000, // 配置 Rollup 的选项，用于自定义打包过程
        rollupOptions: {
            // 配置输出选项，用于指定生成的文件的命名方式
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }, // 用于指定生成的 chunk 文件的命名方式
        chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
            return `js/${fileName}/[name].[hash].js`;
        }
    }
})

