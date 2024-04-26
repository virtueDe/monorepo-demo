import { exec } from 'node:child_process'
import { createServer } from 'vite'
import chokidar from 'chokidar'

// const chokidar = require('chokidar')

async function startServer() {
  // 创建 Vite 服务器
  const server = await createServer()

  // 启动 Vite 服务器
  await server.listen()

  // 监听文件更改
  chokidar.watch('./src').on('change', (path) => {
    console.log(`File ${path} changed. Running command script...`)

    // 执行命令脚本
    exec('pnpm build', (error, stdout) => {
      if (error)
        console.error(`Error executing command script: ${error}`)
      else
        console.log(`Command script output: ${stdout}`)
    })
  })
}

startServer().catch((error) => {
  console.error('Error starting Vite server:', error)
})
