import { ImageResponse } from 'next/og';
import { GrowthMark } from '@/components/brand/GrowthMark';

// Generated at build time, so there is no binary asset to keep in sync with the
// brand colours in globals.css.
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<GrowthMark />, { ...size });
}
