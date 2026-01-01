
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { categories, Sweet, getSubCategories, fetchItems } from "@/data/items";
import { ProductCard } from "@/components/ProductCard";
import { MobileFilters } from "@/components/MobileFilters";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSheetContent, CartItem } from "@/components/CartSheet";
import { SEO } from "@/components/SEO";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Validation schema for order data
const orderSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().max(100),
        quantity: z.number().min(1).max(100),
        price: z.number().min(0),
      }),
    )
    .min(1, "Cart cannot be empty"),
  total: z.number().min(0),
});

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const selectedSubCategory = searchParams.get("subCategory") || "All";

  // Temporary state for search (we might not want to reflect every keystroke in URL)
  const [searchQuery, setSearchQuery] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);

  // Fetch items using React Query
  const { data: sweets = [], isLoading, isError } = useQuery({
    queryKey: ['sweets'],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const availableSubCategories = useMemo(() => {
    return getSubCategories(sweets, selectedCategory);
  }, [sweets, selectedCategory]);

  const filteredSweets = useMemo(() => {
    return sweets
      .filter((sweet) => {
        const matchesCategory = selectedCategory === "All" || sweet.category === selectedCategory;
        const matchesSubCategory =
          selectedCategory === "All" || selectedSubCategory === "All" || sweet.subCategory === selectedSubCategory;
        const matchesSearch =
          sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sweet.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSubCategory && matchesSearch;
      })
      .sort((a, b) => a.order - b.order);
  }, [sweets, selectedCategory, selectedSubCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSearchParams(prev => {
      prev.set("category", category);
      prev.set("subCategory", "All"); // Reset subcategory
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setSearchParams(prev => {
      prev.set("subCategory", subCategory);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (
    sweet: Sweet,
    options?: { quantity?: number; unitPrice?: number; unitLabel?: string },
  ) => {
    const unitPrice = options?.unitPrice ?? sweet.price;
    const addQuantity = options?.quantity ?? 1;
    const unitLabel = options?.unitLabel ?? (sweet.category === 'Chat' ? 'plate' : 'kg');

    setCart((prevCart) => {
      // Try to match existing by id and unitLabel
      const existingItem = prevCart.find((item) => item.id === sweet.id && item.unitLabel === unitLabel);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === sweet.id && item.unitLabel === unitLabel
            ? { ...item, quantity: item.quantity + addQuantity }
            : item,
        );
      }

      // Add new cart line
      const cartId = Date.now() + Math.floor(Math.random() * 1000);
      return [...prevCart, { ...sweet, price: unitPrice, quantity: addQuantity, unitLabel, cartId }];
    });

    toast({
      title: 'Added to cart',
      description: `${sweet.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (cartId: number, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.cartId === cartId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (cartId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

      const orderData = {
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotalPrice(),
      };

      orderSchema.parse(orderData);

      const orderItems = cart
        .map((item, index) => `${index + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity} `)
        .join("\n");

      const total = getTotalPrice();
      const messageText = `* New Order Request * 🛍️\n------------------\n * Items:*\n${orderItems} \n\n * Total Amount: ₹${total}* 💰\n\n * Customer Details:*\nName: ${customerName || "Not Provided"} \nAddress: ${customerAddress || "Not Provided"} \n------------------\n_Sent via Sri Enippagam Web App_`;

      if (messageText.length > 2000) {
        toast({
          title: "Order too large",
          description: "Please reduce the number of items or place multiple orders.",
          variant: "destructive",
        });
        return;
      }

      const whatsappUrl = `https://wa.me/918870144490?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Redirecting to WhatsApp",
        description: "Complete your order on WhatsApp.",
      });

      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      toast({
        title: "Order validation failed",
        description: "Please check your cart and try again.",
        variant: "destructive",
      });
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-6">
          <h2 className="text-2xl font-bold text-destructive">Unable to Load Menu</h2>
          <p className="text-muted-foreground">We couldn't load the menu items. Please check your internet connection and try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={selectedCategory === "All" ? "Sri Enippagam - Authentic Indian Sweets" : `${selectedCategory} - Sri Enippagam`}
        description={`Browse our ${selectedCategory} collection. Authentic traditional taste.`}
      />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={cartItemCount}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartContent={
          <CartSheetContent
            cart={cart}
            setIsCartOpen={setIsCartOpen}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            isCustomerDetailsOpen={isCustomerDetailsOpen}
            setIsCustomerDetailsOpen={setIsCustomerDetailsOpen}
            placeOrder={placeOrder}
          />
        }
      />

      <HeroCarousel />

      <main className="container mx-auto px-4 py-6">
        <div className="sticky top-[105px] md:top-[64px] z-40 bg-background pt-2 -mx-4 px-4 mb-6">
          <MobileFilters
            categories={categories}
            subCategories={availableSubCategories}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectCategory={handleCategoryChange}
            onSelectSubCategory={handleSubCategoryChange}
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
            {selectedSubCategory !== "All" && (
              <span className="text-muted-foreground text-sm md:text-base font-normal ml-2">
                / {selectedSubCategory}
              </span>
            )}
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {filteredSweets.length} Items
          </span>
        </div>

        {filteredSweets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredSweets.map((sweet) => (
              <ProductCard key={sweet.id} sweet={sweet} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't find any items matching your current filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                handleCategoryChange("All");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer onNavigate={handleCategoryChange} />
    </div>
  );
};

export default Index;
