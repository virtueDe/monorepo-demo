import path from 'node:path'
import { exec } from 'node:child_process'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import packageJson from './package.json'

import vitePluginWatchFile from './vite-plugins/watch-file/index'

function getPackageName() {
  const nameArr = packageJson.name.split('/')
  return nameArr[nameArr.length - 1]
}

function getPackageNameCamelCase() {
  try {
    return getPackageName().replace(/-./g, char => char[1].toUpperCase())
  }
  catch (err) {
    throw new Error('Name property in package.json is missing.')
  }
}

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife.js`,
}

const formats = Object.keys(fileName) as Array<keyof typeof fileName>

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
    }),
    vitePluginWatchFile({
      path: path.resolve(__dirname, 'src/'),
      callback: () => {
        exec('pnpm build', (error, stdout) => {
          if (error)
            console.error(`Error executing command script: ${error}`)
          else
            // eslint-disable-next-line no-console
            console.log(`Command script output: ${stdout}`)
        })
      },
    }),
  ],
  base: './',
  build: {
    outDir: './dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: getPackageNameCamelCase(),
      formats,
      fileName: format => fileName[format],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@@', replacement: path.resolve(__dirname) },
    ],
  },
})
