<template>
  <div>
    <h2>WithoutWorker</h2>
    <button @click="download">Download</button>
    <progress
      max="100"
      :value="percent"
    >{{ percent }}%</progress>
    <canvas v-show="false" ref="canvasEl"></canvas>
  </div>
</template>

<script lang="ts">
// WithoutWorker总耗时10575.50ms
import { defineComponent, ref } from 'vue'
import JSZip from 'jszip'
import TestImage from '@/assets/big-img.jpg'

import { saveAs } from 'file-saver'

export default defineComponent({
  name: 'Home',
  components: {},
  setup () {
    const percent = ref(0)
    const canvasEl = ref<HTMLCanvasElement>()

    let t0: number
    let t1: number

    const download = async () => {
      t0 = performance.now()
      const image = new Image()
      image.src = TestImage
      const zip = new JSZip()
      await new Promise((resolve) => {
        image.onload = () => {
          const canvas = canvasEl.value!
          const ctx = canvas.getContext('2d')!
          canvas.width = image.naturalWidth
          canvas.height = image.naturalHeight
          ctx.drawImage(image, 0, 0)
          canvas.toBlob((blob) => {
            zip.file('test.png', blob!)
            resolve(blob)
          })
        }
      })
      percent.value = 50
      const content = await zip.generateAsync(
        {
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        },
        (metadata) => {
          percent.value = 50 + metadata.percent / 2
        }
      )
      saveAs(content, 'WithoutWorker.zip')
      t1 = performance.now()
      console.log(`WithoutWorker总耗时${(t1 - t0).toFixed(2)}ms`)
    }
    return {
      percent,
      download,
      canvasEl
    }
  }
})
</script>
