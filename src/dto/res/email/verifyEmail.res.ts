export interface SendVerifyMailOptions {
  to: string
  subject?: string
  template: string
  body: { userId: number; name: string }
}
