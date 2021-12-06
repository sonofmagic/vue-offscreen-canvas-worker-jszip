export interface HomeEventData {
  type: 'zip'
  bitmap: ImageBitmap
}

export interface MainWorkerEventData {
  type: 'percent' | 'save'
  percent?: number
  content?: ArrayBuffer
}
