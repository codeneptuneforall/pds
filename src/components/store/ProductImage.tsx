import React, { useState } from 'react';
import { ImageOffIcon } from 'lucide-react';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

/** Image with a loading skeleton and a graceful error placeholder. */
export function ProductImage({ src, alt, className = '', imgClassName = '' }: ProductImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`relative overflow-hidden bg-sandstone ${className}`}>
      {status === 'loading' && <div className="absolute inset-0 animate-pulse bg-sandstone" />}
      {status === 'error' ?
      <div className="absolute inset-0 flex flex-col items-center justify-center text-charcoal/55">
          <ImageOffIcon className="h-6 w-6" />
          <span className="mt-2 text-xs">Image unavailable</span>
        </div> :

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-smooth ${
        status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${
        imgClassName}`} />

      }
    </div>);

}