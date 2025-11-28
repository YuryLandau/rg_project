import type { ReactNode } from 'react';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    backgroundVideo?: string; // full background video
    overlay?: boolean;
    overlayOpacity?: number;
    actions?: ReactNode;
    alignment?: 'left' | 'center' | 'right';
    minHeight?: string;
    /** Versão simplificada para destacar download mais recente */
    version?: string; // ex: "1.5.3"
    versionDate?: string; // ex: "10/11/2025"
    versionSize?: string; // ex: "24 MB"
    downloadHref?: string; // link para baixar direto ou página
    /** Vídeo demonstrativo curto exibido ao lado do conteúdo (não como background) */
    videoSrc?: string; // caminho local para o vídeo (ex: /images/video_3.mp4)
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
    minHeight = '500px',
    version,
    versionDate,
    versionSize,
    downloadHref,
    videoSrc
}) => {
    const alignmentClasses = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    };

    const showVersionBox = !!version;
    const hasSideVideo = !!videoSrc;

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
            <div className={`relative z-20 flex flex-col justify-center px-6 min-h-[inherit]`}>
                <div className={`mx-auto w-full py-16 ${hasSideVideo ? 'max-w-7xl' : 'max-w-4xl'} ${alignmentClasses[alignment]}`}>
                    <div className={hasSideVideo ? 'grid md:grid-cols-2 gap-10 items-center' : ''}>
                        <div>
                            {subtitle && <p className="text-primary text-lg md:text-xl font-semibold mb-4">{subtitle}</p>}
                            {title && <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">{title}</h1>}
                            {description && <p className={`text-white text-lg md:text-xl mb-6 drop-shadow-md ${hasSideVideo ? '' : 'max-w-2xl mx-auto'}`}>{description}</p>}
                            {showVersionBox && (
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-8 inline-flex flex-col sm:flex-row sm:items-center gap-2 text-white text-sm">
                                    <span className="font-semibold">Última Versão:</span>
                                    <span>{version}{versionSize ? ` • ${versionSize}` : ''}{versionDate ? ` • Atualizado em ${versionDate}` : ''}</span>
                                </div>
                            )}
                            {actions && <div className="flex flex-wrap gap-4 justify-start md:justify-start">{actions}</div>}
                        </div>
                        {hasSideVideo && (
                            <div className="relative w-full">
                                <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        controls={false}
                                        className="w-full h-full object-cover"
                                    >
                                        <source src={videoSrc} type="video/mp4" />
                                    </video>
                                </div>
                                {downloadHref && showVersionBox && (
                                    <div className="absolute -bottom-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                        v{version}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
