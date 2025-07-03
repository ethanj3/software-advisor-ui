import type { NextApiRequest, NextApiResponse } from 'next'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { pitchText } = req.body as { pitchText: string }
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun(pitchText)] })
      ]
    }]
  })
  const buffer = await Packer.toBuffer(doc)
  res.setHeader('Content-Disposition', 'attachment; filename=Pitch.docx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.send(buffer)
}
