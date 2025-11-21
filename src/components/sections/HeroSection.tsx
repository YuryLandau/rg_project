import type { ReactNode } from 'react';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    overlay?: boolean;
    overlayOpacity?: number;
    actions?: ReactNode;
    alignment?: 'left' | 'center' | 'right';
    minHeight?: string;
}

/**
 * Componente HeroSection - Seção principal/destaque
 * Seção: Hero/Banner
 * Responsável por: Apresentação principal, call-to-action
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    description,
    backgroundImage,
    backgroundVideo,
    overlay = true,
    overlayOpacity = 0.5,
    actions,
    alignment = 'center',
    minHeight = '500px'
}) => {
    const alignmentClasses = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    };

    return (
        <section className="relative overflow-hidden" style={{ minHeight }}>
            {/* Background Layer */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
                </div>
            )}

            {backgroundVideo && (
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* Overlay Layer */}
            {overlay && <div className="absolute inset-0 z-10" style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }} />}

            {/* Content Layer */}
            <div className={`relative z-20 flex flex-col justify-center px-6 min-h-[inherit] ${alignmentClasses[alignment]}`}>
                <div className="max-w-4xl mx-auto w-full py-20">
                    {subtitle && <p className="text-primary text-lg md:text-xl font-semibold mb-4">{subtitle}</p>}
                    {title && <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">{title}</h1>}
                    {description && <p className="text-white text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl mx-auto">{description}</p>}
                    {actions && <div className="flex flex-wrap gap-4 justify-center">{actions}</div>}
                </div>
            </div>
        </section>
    );
};
