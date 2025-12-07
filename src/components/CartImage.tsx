import { useState, useEffect } from "react";
import { getImageLoader } from "@/data/items";

interface CartImageProps {
    imageFile?: string;
    category: string;
    alt: string;
    className?: string;
}

export const CartImage = ({ imageFile, category, alt, className }: CartImageProps) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!imageFile) {
            setIsLoading(false);
            return;
        }

        const loadImage = async () => {
            setIsLoading(true);
            try {
                const imageLoader = getImageLoader(imageFile, category);
                if (imageLoader) {
                    const module = await imageLoader();
                    setImageSrc(module.default);
                }
            } catch (error) {
                console.error(`Failed to load cart image for ${alt}`, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [imageFile, category, alt]);

    if (isLoading) {
        return (
            <div className={`bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse ${className}`} />
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
        />
    );
};
