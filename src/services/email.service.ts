import { env } from 'process'
import { Resend } from 'resend'
import { SendMailOptions } from '~/dto/res/email/emailOption.res'
import { SendVerifyMailOptions } from '~/dto/res/email/verifyEmail.res'
import { generateVerificationCode, renderEmailTemplate } from '~/utils/email'

const resend = new Resend(env.RESEND_API_KEY)

export const sendEmail = async ({ to, subject, template, variables = {} }: SendMailOptions) => {
  const html = await renderEmailTemplate(template, variables)
  const fromEmail = `CabyVocab App <${process.env.FROM_EMAIL}>`

  const { error } = await resend.emails.send({ from: fromEmail, to, subject, html })

  if (error) throw error
}

export const sendVerifyEmail = async ({
  to,
  subject = 'Please verify email for Astro Vocab Website!',
  template,
  body
}: SendVerifyMailOptions) => {
  // create verify email token
  const code = generateVerificationCode()

  await sendEmail({ to, subject, template, variables: { code, name: body.name } })

  return code
}
