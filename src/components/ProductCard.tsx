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
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "50px",
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

    const weightOptions = [
        { value: 0.25, label: '250g' },
        { value: 0.5, label: '500g' },
        { value: 1, label: '1kg' },
    ];

    return (
        <Card
            ref={cardRef}
            className="group overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-card rounded-xl"
        >
            {/* Image Section */}
            <CardHeader className="p-0 relative">
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center relative">
                    {isLoading ? (
                        <div className="w-full h-full bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 animate-pulse" />
                    ) : (
                        <img
                            src={imageSrc}
                            alt={sweet.name}
                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    )}
                </div>
            </CardHeader>

            {/* Content Section */}
            <CardContent className="p-5 flex-grow flex flex-col gap-2">
                {/* Category Badge */}
                <div className="h-4">
                    {sweet.subCategory !== 'Other' && (
                        <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                            {sweet.subCategory}
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-serif font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                    {sweet.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
                    {sweet.description}
                </p>
            </CardContent>

            {/* Footer Section */}
            <CardFooter className="p-5 pt-4 flex flex-col gap-4 mt-auto border-t border-border/40 bg-muted/30">
                {/* Price Row */}
                <div className="flex items-end justify-between w-full">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                            Price
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground font-serif tracking-tight">
                                ₹{Math.round(sweet.price * weight)}
                            </span>
                            <span className="text-muted-foreground text-xs font-medium">
                                /{weight === 1 ? 'kg' : `${weight * 1000}g`}
                            </span>
                        </div>
                    </div>

                    {/* Weight Selector / Quantity */}
                    {sweet.category === 'Chat' ? (
                        <div className="flex items-center gap-0.5 bg-background border border-border/60 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md hover:bg-muted transition-colors"
                            >
                                −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md hover:bg-muted transition-colors"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-background border border-border/60 rounded-lg p-1">
                            {weightOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={weight === option.value}
                                    onClick={() => setWeight(option.value)}
                                    className={`
                                        px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                                        ${weight === option.value
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }
                                    `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Button */}
                <Button
                    className="w-full h-11 shadow-sm hover:shadow-lg transition-all duration-300 font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                    onClick={() => {
                        if (sweet.category === 'Chat') {
                            onAddToCart(sweet, { quantity: quantity, unitPrice: sweet.price, unitLabel: 'plate' });
                        } else {
                            const unitPrice = Math.round(sweet.price * weight);
                            const unitLabel = weight === 1 ? 'kg' : `${weight * 1000}g`;
                            onAddToCart(sweet, { quantity: 1, unitPrice, unitLabel });
                        }
                    }}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};