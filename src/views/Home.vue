<template>
  <div>
    <div>
      <UseWorker></UseWorker>
    </div>
    <div>
      <WithoutWorker></WithoutWorker>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UseWorker from '@/components/UseWorker.vue'
import WithoutWorker from '@/components/WithoutWorker.vue'
export default defineComponent({
  name: 'Home',
  components: { UseWorker, WithoutWorker }
})
</script>
