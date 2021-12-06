<template>
  <div>
    <button @click="download">Download</button>
    <progress
      max="100"
      :value="percent"
    >{{ percent }}%</progress>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!@/workers/main.worker'
import TestImage from '@/assets/big-img.jpg'
import type { MainWorkerEventData, HomeEventData } from '@/interface/worker'
const worker = new Worker()

worker.onmessage = (event) => {
  const data: MainWorkerEventData = event.data
  console.log(data)
}

export default defineComponent({
  name: 'Home',
  components: {},
  data () {
    return {
      percent: 0
    }
  },
  methods: {
    download () {
      const message: HomeEventData = {
        type: 'zip',
        imgUrl: TestImage
      }
      worker.postMessage(message)
    }
  }
})
</script>
