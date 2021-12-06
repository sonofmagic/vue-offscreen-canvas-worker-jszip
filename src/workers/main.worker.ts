import type { HomeEventData } from '@/interface/worker'
const ctx: Worker = self as any
// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
  const data: HomeEventData = event.data

  console.log(event)
})
