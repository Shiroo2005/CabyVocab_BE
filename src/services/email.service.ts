import { env } from 'process'
import { Resend } from 'resend'
import { Code } from 'typeorm'
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
  subject = 'Please verify email for CapyVocab App!',
  template,
  body
}: SendVerifyMailOptions) => {
  // create verify email token
  const code = generateVerificationCode()

  await sendEmail({ to, subject, template, variables: { code, name: body.name } })

  return code
}

export const sendChangePassword = async ({
  to,
  subject = 'Please verify email for CapyVocab App!',
  template,
  body
}: {
  to: string
  subject?: string
  template: string
  body: { code: string; email: string }
}) => {
  await sendEmail({ to, subject, template, variables: { code: body.code, email: body.email } })

  return body.code
}
