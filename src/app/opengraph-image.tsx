import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const alt = 'Ahmed Sobhy — Senior Performance Media Buyer';
// 1.91:1, the ratio LinkedIn / X / Facebook / WhatsApp all crop to.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Inlined as a data URI: ImageResponse cannot resolve a site-relative path, and
// at build time there is no origin to fetch an absolute one from.
const portrait = `data:image/jpeg;base64,${fs
  .readFileSync(path.join(process.cwd(), 'public', 'ahmed-portrait.jpg'))
  .toString('base64')}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#171F26',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '0 64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 4,
              color: '#75F0F0',
              marginBottom: 28,
            }}
          >
            SOBHY.MARKETING
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 74,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Ahmed Sobhy
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontWeight: 600,
              color: '#4D99E6',
              marginTop: 10,
              letterSpacing: -1,
            }}
          >
            Senior Performance Media Buyer
          </div>
          <div
            style={{
              display: 'flex',
              width: 96,
              height: 4,
              backgroundColor: '#4D99E6',
              margin: '36px 0',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#9AA7B4',
              lineHeight: 1.4,
            }}
          >
            Scaling e-commerce revenue across Egypt, UAE & GCC.
          </div>
        </div>

        <div style={{ display: 'flex', width: 440, height: '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait}
            alt=""
            width={440}
            height={630}
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
