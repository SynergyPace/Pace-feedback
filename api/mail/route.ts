import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const { type, to, naam, opdrachtnaam, link } = await request.json()

  if (type === 'uitnodiging') {
    const { error } = await resend.emails.send({
      from: 'Pace Synergy <assessment@pace-synergy.nl>',
      to: [to],
      subject: `Uitnodiging: Synergy Assessment — ${opdrachtnaam}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1B3A5C;">Synergy Assessment</h2>
          <p>Hallo${naam ? ` ${naam}` : ''},</p>
          <p>Je bent uitgenodigd om deel te nemen aan het Synergy Assessment voor <strong>${opdrachtnaam}</strong>.</p>
          <p>Dit assessment geeft inzicht in hoe de samenwerking binnen het team verloopt. Invullen duurt ongeveer 5–7 minuten.</p>
          <div style="margin: 32px 0;">
            <a href="${link}" style="background-color: #E8734A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Assessment invullen →
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">Of kopieer deze link: ${link}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #888; font-size: 12px;">© Pace Synergy — scan.s-pace.nl</p>
        </div>
      `
    })
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (type === 'bevestiging') {
    const { error } = await resend.emails.send({
      from: 'Pace Synergy <assessment@pace-synergy.nl>',
      to: [to],
      subject: 'Bedankt voor het invullen van het Synergy Assessment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1B3A5C;">Bedankt!</h2>
          <p>Hallo${naam ? ` ${naam}` : ''},</p>
          <p>Je antwoorden voor het Synergy Assessment (<strong>${opdrachtnaam}</strong>) zijn ontvangen.</p>
          <p>De resultaten worden na afloop door Pace Synergy met je gedeeld.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #888; font-size: 12px;">© Pace Synergy — scan.s-pace.nl</p>
        </div>
      `
    })
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Onbekend type' }, { status: 400 })
}
