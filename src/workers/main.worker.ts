// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/offscreencanvas/index.d.ts" />

import type { HomeEventData, MainWorkerEventData } from '@/interface/worker'
import JSZip from 'jszip'
const worker: Worker = self as any

function getCanvasBlob (bitmap: ImageBitmap): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // worker 中没有 Image
    // const image = new Image()
    // image.src = url
    // image.onload = () => {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    //   // eslint-disable-next-line no-unused-expressions
    //   ctx?.drawImage(image, 0, 0)
    ctx.drawImage(bitmap, 0, 0)
    canvas
      .convertToBlob()
      .then((blob) => {
        resolve(blob)
      })
      .catch(reject) // png
    // }
    // image.onerror = (e: Event | string) => {
    //   reject(e)
    // }
  })
}

async function main (bitmap: ImageBitmap) {
  const blob = await getCanvasBlob(bitmap)
  const event: MainWorkerEventData = {
    type: 'percent',
    percent: 50
  }
  worker.postMessage(event)
  const zip = new JSZip()
  const filename = 'test.png'
  zip.file(filename, blob)
  const content = await zip.generateAsync(
    {
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    },
    ({ percent }) => {
      const event: MainWorkerEventData = {
        type: 'percent',
        percent: 50 + percent / 2
      }
      worker.postMessage(event)
    }
  )
  const finish: MainWorkerEventData = {
    type: 'save',
    content: content
  }
  worker.postMessage(finish, [content])
}

// Respond to message from parent thread
worker.addEventListener('message', (event) => {
  const data: HomeEventData = event.data
  if (data.type === 'zip') {
    main(data.bitmap)
  }
})
