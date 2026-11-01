import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface PhotoFrameProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel: string;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({ src, alt, className = '', fallbackLabel }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-100 via-cyan-50 to-amber-50 text-sky-700 ${className}`}
        role="img"
        aria-label={fallbackLabel}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/80 border border-sky-100 flex items-center justify-center">
          <ImageOff className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-bold tracking-wide px-3 text-center">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};
