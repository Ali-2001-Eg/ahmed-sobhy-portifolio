import { ImageResponse } from 'next/og';
import { GrowthMark } from '@/components/brand/GrowthMark';

// iOS home-screen icon. iOS applies its own corner mask.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<GrowthMark scale={2.8} />, { ...size });
}
