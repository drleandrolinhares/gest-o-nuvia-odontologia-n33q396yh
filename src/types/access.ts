export type ManualStep = { id: string; text: string; completed?: boolean }

export type TroubleshootingFaq = { id: string; question: string; answer: string }

export type AccessItem = {
  id: string
  platform: string
  url: string
  login: string
  pass: string
  instructions: string
  sector?: string
  access_level?: string
  logo_url?: string
  description?: string
  target_users?: string
  frequency?: string
  video_url?: string
  manual_steps?: ManualStep[]
  troubleshooting?: TroubleshootingFaq[]
  security_note?: string
}
