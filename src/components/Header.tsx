import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    cartItemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartContent: React.ReactNode;
}

export const Header = ({
    searchQuery,
    setSearchQuery,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    cartContent,
}: HeaderProps) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
                <div
                    className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSearchQuery("");
                        if (window.location.pathname !== "/") {
                            window.location.href = "/";
                        }
                    }}
                >
                    {/* Mobile Logo / Brand */}
                    <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-primary">
                        Sri Enippagam
                    </h2>
                </div>

                {/* Desktop Search */}
                <div className="hidden md:block flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search for sweets, snacks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 md:h-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary text-sm shadow-sm"
                        />
                    </div>
                </div>

                {/* Cart & Actions */}
                <div className="flex items-center gap-2">
                    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="relative h-9 w-9 hover:bg-muted/50"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] font-bold ring-2 ring-background animate-in zoom-in-50 duration-300">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col h-full">
                            <SheetHeader>
                                <SheetTitle className="text-xl md:text-2xl font-serif">
                                    Your Cart
                                </SheetTitle>
                            </SheetHeader>
                            {cartContent}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Mobile Search - Visible only on mobile below header */}
            <div className="md:hidden border-t border-border/40 bg-background/95 px-4 py-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search sweets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 w-full bg-muted/50 border-transparent focus:bg-background focus:border-primary text-sm shadow-sm"
                    />
                </div>
            </div>
        </header>
    );
};
