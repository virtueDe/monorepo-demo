import path from 'node:path'

export interface VitePluginWatchFileOptions {
  path: string | string[]
  callback?: (path: string) => void
}

function toArray<T>(arr: T | T[] | undefined): T[] {
  if (!arr)
    return []
  if (Array.isArray(arr))
    return arr
  return [arr]
}

function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number = 350): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    if (timeout !== null)
      clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(this, args)
    }, waitFor)
  }
}

function isPathWithinRange(targetPathArr: string[], sourcePath: string) {
  return targetPathArr.some((item) => {
    const fullPathA = path.resolve(item)
    const fullPathB = path.resolve(sourcePath)
    return fullPathB.startsWith(fullPathA)
  })
}

function vitePluginWatchFile(options: VitePluginWatchFileOptions) {
  const {
    path: _path,
    callback,
  } = options

  return {
    name: 'watch-file',
    configureServer(server) {
      const listener = debounce((file) => {
        if (isPathWithinRange(toArray(_path), file))
          callback && callback(file)
      }, 500)

      server.watcher.on('change', (file: string) => {
        listener(file)
      })

      server.watcher.on('unlink', (file: string) => {
        listener(file)
      })

      server.watcher.on('add', (file: string) => {
        listener(file)
      })
    },
  }
}

export default vitePluginWatchFile
