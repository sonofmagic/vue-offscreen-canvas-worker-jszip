export interface MainWorkerRequestEventData {
  type: 'zip' | 'main'
  bitmap?: ImageBitmap
  arraybuffer?: ArrayBuffer
}

export interface MainWorkerResponseEventData {
  type: 'percent' | 'save'
  percent?: number
  content?: ArrayBuffer
}
