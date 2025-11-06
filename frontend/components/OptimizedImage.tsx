import Image from 'next/image';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fallback?: React.ReactNode;
}

/**
 * Optimized image component that handles Next.js Image optimization
 * with fallback for missing images
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  objectFit = 'cover',
  fallback,
}: OptimizedImageProps) {
  // If no image, show fallback
  if (!src) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-gray-400 text-4xl">🖼️</div>
      </div>
    );
  }

  // For fill mode
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={{ objectFit }}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  // For fixed dimensions
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit }}
        priority={priority}
      />
    );
  }

  // Fallback to regular img tag if dimensions not provided
  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}
