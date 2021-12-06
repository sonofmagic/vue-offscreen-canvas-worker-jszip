export interface HomeEventData {
  type: 'zip'
  imgUrl: string
}

export interface MainWorkerEventData {
  type: 'percent' | 'save'
  percent?: number
  blob?: Blob
}
