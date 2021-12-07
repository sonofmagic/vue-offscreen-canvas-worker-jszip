// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/offscreencanvas/index.d.ts" />

import type {
  MainWorkerRequestEventData,
  MainWorkerResponseEventData
} from '@/interface/worker'
import JSZip from 'jszip'
const worker: Worker = self as any

// worker 中没有 Image
function getCanvasBlob(bitmap: ImageBitmap): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    ctx.drawImage(bitmap, 0, 0)
    canvas.convertToBlob().then(resolve).catch(reject) // png
  })
}

async function doZip(blob: Blob) {
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
      const event: MainWorkerResponseEventData = {
        type: 'percent',
        percent: 50 + percent / 2
      }
      worker.postMessage(event)
    }
  )
  const finish: MainWorkerResponseEventData = {
    type: 'save',
    content: content
  }
  worker.postMessage(finish, [content])
}

async function main(bitmap: ImageBitmap) {
  const blob = await getCanvasBlob(bitmap)
  const event: MainWorkerResponseEventData = {
    type: 'percent',
    percent: 50
  }
  worker.postMessage(event)
  await doZip(blob)
}

// Respond to message from parent thread
worker.addEventListener(
  'message',
  (event: MessageEvent<MainWorkerRequestEventData>) => {
    const data = event.data
    if (data.type === 'main') {
      main(data.bitmap!)
    } else if (data.type === 'zip') {
      const blob = new Blob([data.arraybuffer as ArrayBuffer])
      doZip(blob)
    }
  }
)
