export type Speaker = {
  id: string
  name: string
}

export type TagType = "question" | "answer" | "competitor" | "tool" | "pain-point" | "current-process" | "ideal-process"

export type Tag = {
  type: TagType
  label: string
}

export type Utterance = {
  id: string
  speakerId: string
  speakerName: string
  text: string
  timestamp: string
  tags: Tag[]
  linkedUtterances?: string[]
}
