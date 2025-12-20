import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Sweet, getImageLoader } from "@/data/items";
import { useState, useEffect, useRef } from "react";

interface ProductCardProps {
    sweet: Sweet;
    onAddToCart: (sweet: Sweet, options?: { quantity?: number; unitPrice?: number; unitLabel?: string }) => void;
}

export const ProductCard = ({ sweet, onAddToCart }: ProductCardProps) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [weight, setWeight] = useState<number>(1); // 1 = 1kg, 0.5 = 500g, 0.25 = 250g
    const [quantity, setQuantity] = useState<number>(1);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect(); // Stop observing once in view
                    }
                });
            },
            {
                rootMargin: "50px", // Start loading 50px before entering viewport
                threshold: 0.01,
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    // Load image when in view
    useEffect(() => {
        if (!isInView || !sweet.imageFile) return;

        const loadImage = async () => {
            setIsLoading(true);
            try {
                const imageLoader = getImageLoader(sweet.imageFile!, sweet.category);
                if (imageLoader) {
                    const module = await imageLoader();
                    setImageSrc(module.default);
                }
            } catch (error) {
                console.error(`Failed to load image for ${sweet.name}`, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [isInView, sweet.imageFile, sweet.category, sweet.name]);

    return (
        <Card
            ref={cardRef}
            className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 border-border/40 flex flex-col h-full bg-card"
        >
            <CardHeader className="p-0 relative z-0">
                <div className="h-48 overflow-hidden bg-white flex items-center justify-center relative p-3">
                    {isLoading ? (
                        // Skeleton loader
                        <div className="w-full h-full bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse rounded-lg" />
                    ) : (
                        <img
                            src={imageSrc}
                            alt={sweet.name}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-300 pointer-events-none" />
                </div>
            </CardHeader>

            <CardContent className="p-4 flex-grow">
                <div className="mb-1.5">
                    {sweet.subCategory !== 'Other' && (
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block mb-1">
                            {sweet.subCategory}
                        </span>
                    )}
                    <h3 className="text-base font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {sweet.name}
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8 mb-1">
                    {sweet.description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2 mt-auto border-t border-border/30 bg-muted/5 min-h-[3.5rem]">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Price</span>
                    <div className="flex items-baseline gap-2">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-lg font-bold text-foreground font-serif">
                                ₹{Math.round(sweet.price * weight)}
                            </span>
                            <span className="text-muted-foreground text-[10px]">/{weight === 1 ? 'kg' : `${weight * 1000}g`}</span>
                        </div>

                        {sweet.category === 'Chat' ? (
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-xs px-2 py-1 border border-border/30 bg-white rounded hover:bg-muted/50"
                                >
                                    -
                                </button>
                                <span className="text-xs px-2 min-w-[2rem] text-center">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-xs px-2 py-1 border border-border/30 bg-white rounded hover:bg-muted/50"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-pressed={weight === 0.25}
                                    onClick={() => setWeight(0.25)}
                                    className={
                                        (weight === 0.25
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-white text-foreground border-border/30') +
                                        ' text-xs px-3 py-1 rounded border'
                                    }
                                >
                                    250g
                                </button>

                                <button
                                    type="button"
                                    aria-pressed={weight === 0.5}
                                    onClick={() => setWeight(0.5)}
                                    className={
                                        (weight === 0.5
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-white text-foreground border-border/30') +
                                        ' text-xs px-3 py-1 rounded border'
                                    }
                                >
                                    500g
                                </button>

                                <button
                                    type="button"
                                    aria-pressed={weight === 1}
                                    onClick={() => setWeight(1)}
                                    className={
                                        (weight === 1
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-white text-foreground border-border/30') +
                                        ' text-xs px-3 py-1 rounded border'
                                    }
                                >
                                    1kg
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    size="sm"
                    className="h-9 shadow-sm hover:shadow-md transition-all font-semibold text-xs px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                        if (sweet.category === 'Chat') {
                            // For chat items, plates are discrete units (price per plate)
                            onAddToCart(sweet, { quantity: quantity, unitPrice: sweet.price, unitLabel: 'plate' });
                        } else {
                            const unitPrice = Math.round(sweet.price * weight);
                            const unitLabel = weight === 1 ? 'kg' : `${weight * 1000}g`;
                            onAddToCart(sweet, { quantity: 1, unitPrice, unitLabel });
                        }
                    }}
                >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    Add
                </Button>
            </CardFooter>
        </Card>
    );
};
