export interface MainWorkerRequestEventData {
  type: 'zip'
  bitmap: ImageBitmap
}

export interface MainWorkerResponseEventData {
  type: 'percent' | 'save'
  percent?: number
  content?: ArrayBuffer
}
