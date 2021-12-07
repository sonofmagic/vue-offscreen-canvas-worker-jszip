<template>
  <div>
    <h2>UseWorker</h2>
    <button
      :disabled="disabled"
      @click="download"
    >Download</button>
    <progress
      max="100"
      :value="percent"
    >{{ percent }}%</progress>
    <div>
      <div>isSupportWorker:{{isSupportWorker}}</div>
      <div>isSupportOffscreenCanvas:{{isSupportOffscreenCanvas}}</div>
    </div>
    <canvas
      v-show="false"
      ref="canvasEl"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Worker from 'worker-loader!@/workers/main.worker'
import type {
  MainWorkerRequestEventData,
  MainWorkerResponseEventData
} from '@/interface/worker'
import { BigImage as TestImage } from './fixtures'
import { saveAs, isSupportWorker, isSupportOffscreenCanvas } from './util'
// UseWorker总耗时9860.20ms
export default defineComponent({
  name: 'Home',
  components: {},
  setup() {
    const percent = ref(0)
    const disabled = ref(false)
    const canvasEl = ref<HTMLCanvasElement>()
    const worker = new Worker()
    let t0: number
    let t1: number
    worker.onmessage = (event: MessageEvent<MainWorkerResponseEventData>) => {
      const data = event.data
      // console.log(data)
      if (data.type === 'save') {
        const blob = new Blob([data.content as ArrayBuffer])
        saveAs(blob, 'UseWorker.zip')
        t1 = performance.now()
        console.log(`UseWorker总耗时${(t1 - t0).toFixed(2)}ms`)
        disabled.value = false
      } else if (data.type === 'percent') {
        percent.value = data.percent ?? 0
      }
    }
    const download = () => {
      disabled.value = true
      t0 = performance.now()
      const image = new Image()
      image.src = TestImage
      image.onload = () => {
        if (isSupportOffscreenCanvas) {
          createImageBitmap(image).then((bitmap) => {
            const message: MainWorkerRequestEventData = {
              type: 'main',
              bitmap
            }
            worker.postMessage(message, [bitmap])
          })
        } else {
          const canvas = canvasEl.value!
          const ctx = canvas.getContext('2d')!
          canvas.width = image.naturalWidth
          canvas.height = image.naturalHeight
          ctx.drawImage(image, 0, 0)
          canvas.toBlob((blob) => {
            blob!.arrayBuffer().then((ab) => {
              const message: MainWorkerRequestEventData = {
                type: 'zip',
                arraybuffer: ab
              }
              worker.postMessage(message, [ab])
            })
          })
        }
      }
    }
    return {
      percent,
      download,
      disabled,
      canvasEl,
      isSupportWorker,
      isSupportOffscreenCanvas
    }
  }
})
</script>
