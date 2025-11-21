import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import './Image.css';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
    aspectRatio?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    loading?: 'lazy' | 'eager';
    rounded?: boolean;
    circle?: boolean;
}

/**
 * Componente Image - Imagem otimizada
 * Recursos: lazy loading, fallback, aspect ratio, estados de carregamento
 */
export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    fallbackSrc,
    aspectRatio,
    objectFit = 'cover',
    loading = 'lazy',
    rounded = false,
    circle = false,
    className = '',
    style,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            setHasError(true);
        }
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const containerClass = [
        'image-container',
        rounded && 'image-container--rounded',
        circle && 'image-container--circle',
        className
    ].filter(Boolean).join(' ');

    const imageClass = [
        'image',
        !isLoaded && 'image--loading',
        hasError && 'image--error'
    ].filter(Boolean).join(' ');

    const containerStyle = {
        ...style,
        aspectRatio: aspectRatio
    };

    const imageStyle = {
        objectFit: objectFit
    };

    if (hasError) {
        return (
            <div className={`${containerClass} image-container--error`} style={containerStyle}>
                <div className="image-placeholder">
                    <span>Erro ao carregar imagem</span>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClass} style={containerStyle}>
            <img
                src={imgSrc}
                alt={alt}
                className={imageClass}
                style={imageStyle}
                loading={loading}
                onError={handleError}
                onLoad={handleLoad}
                {...props}
            />
            {!isLoaded && (
                <div className="image-skeleton" />
            )}
        </div>
    );
};
