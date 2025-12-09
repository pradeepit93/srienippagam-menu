import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    badge?: string;
    ctaText: string;
    ctaAction: () => void;
}

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        image: "/festival_special_banner.png",
        title: "Festival Special Sweets",
        subtitle: "Celebrate every moment with our authentic traditional sweets",
        badge: "Limited Time",
        ctaText: "Shop Festival Collection",
        ctaAction: () => window.scrollTo({ top: 300, behavior: 'smooth' })
    },
    {
        id: 2,
        image: "/seasonal_collection_banner.png",
        title: "Season's Best Collection",
        subtitle: "Handpicked premium sweets made with finest ingredients",
        badge: "New Arrivals",
        ctaText: "Explore Collection",
        ctaAction: () => window.scrollTo({ top: 300, behavior: 'smooth' })
    },
    {
        id: 3,
        image: "/special_offers_banner.png",
        title: "Special Offers",
        subtitle: "Get up to 20% off on selected sweets and snacks",
        badge: "Save Big",
        ctaText: "View Offers",
        ctaAction: () => window.scrollTo({ top: 300, behavior: 'smooth' })
    }
];

export const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    return (
        <section
            className="relative h-[280px] md:h-[400px] overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Slides Container */}
            <div className="relative h-full w-full">
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                            ? 'opacity-100 translate-x-0'
                            : index < currentSlide
                                ? 'opacity-0 -translate-x-full'
                                : 'opacity-0 translate-x-full'
                            }`}
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover mix-blend-overlay opacity-40"
                                onError={(e) => {
                                    // Fallback to gradient if image fails to load
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>

                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '30px 30px'
                        }}></div>

                        {/* Content */}
                        <div className="relative h-full container mx-auto px-4 flex items-center">
                            <div className="max-w-2xl text-white animate-in fade-in slide-in-from-left-8 duration-700">
                                {slide.badge && (
                                    <span className="inline-block px-3 py-1 mb-3 md:mb-4 text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                        {slide.badge}
                                    </span>
                                )}
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-4 drop-shadow-2xl leading-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-sm md:text-lg lg:text-xl mb-5 md:mb-6 text-white/95 drop-shadow-lg max-w-xl">
                                    {slide.subtitle}
                                </p>
                                <button
                                    onClick={slide.ctaAction}
                                    className="group/btn px-6 py-2.5 md:px-8 md:py-3 bg-white hover:bg-white/95 text-primary font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                                >
                                    <span className="text-sm md:text-base">{slide.ctaText}</span>
                                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Shimmer border */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 shimmer-green"></div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 border-l-2 border-t-2 border-white/20 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 border-r-2 border-t-2 border-white/20 rounded-tr-lg"></div>
        </section>
    );
};
