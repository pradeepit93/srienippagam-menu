import { ShoppingCart, Plus, Minus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CartImage } from "@/components/CartImage";
import { Sweet } from "@/data/items";

export interface CartItem extends Sweet {
    cartId: number;
    quantity: number;
    unitLabel?: string;
}

interface CartSheetContentProps {
    cart: CartItem[];
    setIsCartOpen: (isOpen: boolean) => void;
    updateQuantity: (cartId: number, change: number) => void;
    removeFromCart: (cartId: number) => void;
    customerName: string;
    setCustomerName: (name: string) => void;
    customerAddress: string;
    setCustomerAddress: (address: string) => void;
    isCustomerDetailsOpen: boolean;
    setIsCustomerDetailsOpen: (isOpen: boolean) => void;
    placeOrder: () => void;
}

export const CartSheetContent = ({
    cart,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    customerName,
    setCustomerName,
    customerAddress,
    setCustomerAddress,
    isCustomerDetailsOpen,
    setIsCustomerDetailsOpen,
    placeOrder,
}: CartSheetContentProps) => {
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto mt-6 -mr-4 pr-4">
                {cart.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                        <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Your cart is empty</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                            Looks like you haven't added any sweets yet. Start shopping to fill it up!
                        </p>
                        <Button variant="default" className="mt-6" onClick={() => setIsCartOpen(false)}>
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.cartId}
                                className="flex gap-4 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors"
                            >
                                <div className="h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0 border border-border/30">
                                    <CartImage
                                        imageFile={item.imageFile}
                                        category={item.category}
                                        alt={item.name}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-semibold text-foreground text-sm line-clamp-1 font-serif">
                                                {item.name}
                                            </h4>
                                            <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            ₹{item.price}/{item.unitLabel ?? "kg"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 border border-border/50">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 rounded-md hover:bg-background shadow-sm"
                                                onClick={() => updateQuantity(item.cartId, -1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 rounded-md hover:bg-background shadow-sm"
                                                onClick={() => updateQuantity(item.cartId, 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeFromCart(item.cartId)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className="mt-auto pt-6 border-t border-border bg-background">
                    <div className="space-y-4 mb-6">
                        <Collapsible open={isCustomerDetailsOpen} onOpenChange={setIsCustomerDetailsOpen}>
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2">
                                    <span>Add delivery details (Optional)</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${isCustomerDetailsOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-3">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Your name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <textarea
                                        className="flex min-h-[50px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Delivery address"
                                        value={customerAddress}
                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                            <span>Subtotal ({getTotalItems()} items)</span>
                            <span>₹{getTotalPrice()}</span>
                        </div>
                        <div className="flex justify-between items-center text-base font-bold text-foreground">
                            <span>Total</span>
                            <span className="text-xl font-serif">₹{getTotalPrice()}</span>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="w-full shadow-lg font-bold text-base h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={placeOrder}
                    >
                        Place Order on WhatsApp
                    </Button>
                </div>
            )}
        </>
    );
};
