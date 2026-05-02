import { NextResponse } from 'next/server'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validateScanImage(image: File | null): NextResponse | null {
  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 })
  }

  if (image.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Image too large' }, { status: 413 })
  }

  return null
}
