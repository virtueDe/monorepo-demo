import path from 'node:path'

export interface VitePluginWatchFileOptions {
  url?: string
  callback?: Function
}

function vitePluginWatchFile(options: VitePluginWatchFileOptions = {}) {
  const {
    url = path.resolve(__dirname, '/src'),
    callback,
  } = options

  console.log('vitePluginWatchFile-options', url, callback)

  return {
    name: 'watch-file',
    configureServer(server) {
      server.watcher.on('change', (file: string) => {
        console.log('vitePluginWatchFile-change', file)
        callback && callback(file)
      })
    },
  }
}

export default vitePluginWatchFile
