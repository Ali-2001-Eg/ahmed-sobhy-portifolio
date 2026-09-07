'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, ImageOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { isAllowedImageHost } from '@/lib/image-hosts';

/**
 * URL input with a live thumbnail, so a bad link is obvious here rather than as
 * a broken image on the public site.
 *
 * The preview is a plain <img>, not next/image: it must be able to render a URL
 * whose host is NOT allowlisted, precisely so we can warn about it.
 */
export function ImageUrlField({
  value,
  onChange,
  placeholder = 'https://...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const url = value?.trim() ?? '';
  const hostAllowed = url ? isAllowedImageHost(url) : true;

  React.useEffect(() => {
    if (!url) return setStatus('idle');
    setStatus('loading');
  }, [url]);

  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-start">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/10 bg-background/60">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
              onLoad={() => setStatus('ok')}
              onError={() => setStatus('error')}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            type="url"
            inputMode="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-background/50"
          />
          {url && status === 'error' && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" /> This link didn&apos;t load. Make sure it is
              the direct image URL (ends in .jpg / .png / .webp), not the share page.
            </p>
          )}
          {url && status === 'ok' && !hostAllowed && (
            <p className="flex items-center gap-1.5 text-xs text-yellow-500">
              <AlertTriangle className="h-3.5 w-3.5" /> This host isn&apos;t on the site&apos;s
              allowlist, so the image will not appear publicly. Use Cloudinary, ImgBB or
              Postimages.
            </p>
          )}
          {url && status === 'ok' && hostAllowed && (
            <p className="flex items-center gap-1.5 text-xs text-secondary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Looks good — this will show on the site.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
