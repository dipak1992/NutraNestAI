import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * MealEase favicon (32×32)
 * Generated at build time by Next.js App Router
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* House roof — left slope */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 8,
            width: 9,
            height: 2,
            background: 'white',
            borderRadius: 1,
            opacity: 0.55,
            transformOrigin: 'right center',
            transform: 'rotate(-38deg)',
          }}
        />
        {/* House roof — right slope */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            width: 9,
            height: 2,
            background: 'white',
            borderRadius: 1,
            opacity: 0.55,
            transformOrigin: 'left center',
            transform: 'rotate(38deg)',
          }}
        />

        {/* Bowl rim */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 5,
            right: 5,
            height: 2,
            background: 'white',
            borderRadius: 1,
          }}
        />

        {/* Bowl body */}
        <div
          style={{
            position: 'absolute',
            top: 15,
            left: 6,
            right: 6,
            bottom: 3,
            background: 'white',
            borderRadius: '0 0 9px 9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {/* Spoon oval */}
          <div
            style={{
              width: 5,
              height: 4,
              background: '#2E7D32',
              borderRadius: '50%',
            }}
          />
          {/* Orange dot */}
          <div
            style={{
              width: 4,
              height: 4,
              background: '#FF7043',
              borderRadius: '50%',
            }}
          />
          {/* Leaf dot */}
          <div
            style={{
              width: 3,
              height: 3,
              background: '#81C784',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Sparkle — horizontal */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 4,
            width: 5,
            height: 1.5,
            background: 'white',
            borderRadius: 1,
            opacity: 0.8,
          }}
        />
        {/* Sparkle — vertical */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            right: 6,
            width: 1.5,
            height: 5,
            background: 'white',
            borderRadius: 1,
            opacity: 0.8,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
