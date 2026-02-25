import { createServerFn } from '@tanstack/react-start'

import sharp from 'sharp'

export const addDpiMetadata = createServerFn({
  method: 'POST',
})
  .inputValidator((d: { imageUri: string; dpi: number }) => d)
  .handler(async ({ data }) => {
    // Strip the data URI prefix
    const base64Data = data.imageUri.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Inject DPI metadata
    const modifiedBuffer = await sharp(buffer)
      .withMetadata({ density: data.dpi })
      .toBuffer()

    const base64 = modifiedBuffer.toString('base64')
    return `data:image/png;base64,${base64}`
  })
