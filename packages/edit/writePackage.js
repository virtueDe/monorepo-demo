import { readFileSync, writeFileSync } from 'node:fs'

// const { readFileSync, writeFileSync } = require('node:fs')

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
function getPackageName() {
  const nameArr = packageJson.name.split('/')
  return nameArr[nameArr.length - 1]
}
const packageName = getPackageName()

const newMain = `./dist/${packageName}.js`
const newModule = `./dist/${packageName}.mjs`
// const newExports = `./${packageName}.js`

packageJson.main = newMain
packageJson.module = newModule

// 写入修改后的package.json文件
writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
// packageData.exports = { './': newExports }
// "exports": {
//   ".": {
//     "import": "./dist/vite-vanilla-ts-lib-starter.mjs",
//     "require": "./dist/vite-vanilla-ts-lib-starter.cjs"
//   },
//   "./dist/": {
//     "import": "./dist/",
//     "require": "./dist/"
//   }
// },
