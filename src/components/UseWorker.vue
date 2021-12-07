<template>
  <div>
    <h2>UseWorker</h2>
    <button @click="download">Download</button>
    <progress max="100" :value="percent">{{ percent }}%</progress>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Worker from 'worker-loader!@/workers/main.worker'
import type {
  MainWorkerRequestEventData,
  MainWorkerResponseEventData
} from '@/interface/worker'
import { TestImage } from './fixtures'
import { saveAs } from './util'
// UseWorker总耗时9860.20ms
export default defineComponent({
  name: 'Home',
  components: {},
  setup() {
    const percent = ref(0)
    const worker = new Worker()
    let t0: number
    let t1: number
    worker.onmessage = (event: MessageEvent<MainWorkerResponseEventData>) => {
      const data = event.data
      // console.log(data)
      if (data.type === 'save') {
        const blob = new Blob([data.content as ArrayBuffer])
        saveAs(blob, 'test.zip')
        t1 = performance.now()
        console.log(`UseWorker总耗时${(t1 - t0).toFixed(2)}ms`)
      } else if (data.type === 'percent') {
        percent.value = data.percent ?? 0
      }
    }
    const download = () => {
      t0 = performance.now()
      const image = new Image()
      image.src = TestImage
      image.onload = () => {
        createImageBitmap(image).then((bitmap) => {
          const message: MainWorkerRequestEventData = {
            type: 'zip',
            bitmap
          }
          worker.postMessage(message, [bitmap])
        })
      }
    }
    return {
      percent,
      download
    }
  }
})
</script>
