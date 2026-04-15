import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * MealEase Apple touch icon (180×180)
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
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
            top: 36,
            left: 48,
            width: 50,
            height: 8,
            background: 'white',
            borderRadius: 4,
            opacity: 0.55,
            transformOrigin: 'right center',
            transform: 'rotate(-35deg)',
          }}
        />
        {/* House roof — right slope */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            right: 48,
            width: 50,
            height: 8,
            background: 'white',
            borderRadius: 4,
            opacity: 0.55,
            transformOrigin: 'left center',
            transform: 'rotate(35deg)',
          }}
        />

        {/* Bowl rim */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 26,
            right: 26,
            height: 12,
            background: 'white',
            borderRadius: 6,
          }}
        />

        {/* Bowl body */}
        <div
          style={{
            position: 'absolute',
            top: 88,
            left: 28,
            right: 28,
            bottom: 16,
            background: 'white',
            borderRadius: '0 0 60px 60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {/* Spoon oval */}
          <div
            style={{
              width: 28,
              height: 22,
              background: '#2E7D32',
              borderRadius: '50%',
              marginLeft: -4,
            }}
          />
          {/* Orange carrot */}
          <div
            style={{
              width: 22,
              height: 22,
              background: '#FF7043',
              borderRadius: '50%',
            }}
          />
          {/* Leaf */}
          <div
            style={{
              width: 20,
              height: 16,
              background: '#81C784',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Sparkle top-right — horizontal bar */}
        <div
          style={{
            position: 'absolute',
            top: 29,
            right: 21,
            width: 18,
            height: 3,
            background: 'white',
            borderRadius: 2,
            opacity: 0.8,
          }}
        />
        {/* Sparkle top-right — vertical bar */}
        <div
          style={{
            position: 'absolute',
            top: 22,
            right: 28,
            width: 3,
            height: 18,
            background: 'white',
            borderRadius: 2,
            opacity: 0.8,
          }}
        />

        {/* Sparkle top-left — horizontal */}
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 23,
            width: 12,
            height: 2,
            background: 'white',
            borderRadius: 2,
            opacity: 0.5,
          }}
        />
        {/* Sparkle top-left — vertical */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            width: 2,
            height: 12,
            background: 'white',
            borderRadius: 2,
            opacity: 0.5,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
