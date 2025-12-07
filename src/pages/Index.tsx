import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { items as sweets, categories, Sweet, getSubCategories } from "@/data/items";
import { ProductCard } from "@/components/ProductCard";
import { MobileFilters } from "@/components/MobileFilters";
import { CartImage } from "@/components/CartImage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface CartItem extends Sweet {
  quantity: number;
}

// Validation schema for order data
const orderSchema = z.object({
  items: z.array(z.object({
    name: z.string().max(100),
    quantity: z.number().min(1).max(100),
    price: z.number().min(0),
  })).min(1, "Cart cannot be empty"),
  total: z.number().min(0),
});

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);

  // We can pick a random image for the hero or keep it hardcoded if we want a specific one
  // For now let's just use the first item's image or a fallback
  const heroImage = sweets.length > 0 ? sweets[0].image : "";

  const availableSubCategories = useMemo(() => {
    return getSubCategories(selectedCategory);
  }, [selectedCategory]);

  const filteredSweets = sweets.filter((sweet) => {
    const matchesCategory = selectedCategory === "All" || sweet.category === selectedCategory;
    const matchesSubCategory = selectedCategory === "All" || selectedSubCategory === "All" || sweet.subCategory === selectedSubCategory;
    const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sweet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  }).sort((a, b) => a.order - b.order);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory("All"); // Reset subcategory when main category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (sweet: Sweet) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === sweet.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === sweet.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...sweet, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${sweet.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
      // Validate order data
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotalPrice(),
      };

      orderSchema.parse(orderData);

      // Create WhatsApp message string (without encoding yet)
      const orderItems = cart
        .map(
          (item, index) =>
            `${index + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
        )
        .join("\n");

      const total = getTotalPrice();
      const messageText = `*New Order Request* 🛍️\n------------------\n*Items:*\n${orderItems}\n\n*Total Amount: ₹${total}* 💰\n\n*Customer Details:*\nName: ${customerName || 'Not Provided'}\nAddress: ${customerAddress || 'Not Provided'}\n------------------\n_Sent via Sri Enippagam Web App_`;

      // Validate message length (WhatsApp has limits)
      if (messageText.length > 2000) {
        toast({
          title: "Order too large",
          description: "Please reduce the number of items or place multiple orders.",
          variant: "destructive",
        });
        return;
      }

      const whatsappUrl = `https://wa.me/917010213381?text=${encodeURIComponent(messageText)}`;
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

  return (
    <div className="min-h-screen bg-background">

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Mobile Logo / Brand */}
            <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                <Button size="icon" variant="ghost" className="relative h-9 w-9 hover:bg-muted/50">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] font-bold ring-2 ring-background animate-in zoom-in-50 duration-300">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col h-full">
                <SheetHeader>
                  <SheetTitle className="text-xl md:text-2xl font-serif">Your Cart</SheetTitle>
                </SheetHeader>

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
                      <Button
                        variant="default"
                        className="mt-6"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors">
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
                                <h4 className="font-semibold text-foreground text-sm line-clamp-1 font-serif">{item.name}</h4>
                                <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">₹{item.price}/kg</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 border border-border/50">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 rounded-md hover:bg-background shadow-sm"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 rounded-md hover:bg-background shadow-sm"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromCart(item.id)}
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
                            <ChevronDown className={`h-4 w-4 transition-transform ${isCustomerDetailsOpen ? 'rotate-180' : ''}`} />
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
                        <span className="text-xl font-serif">
                          ₹{getTotalPrice()}
                        </span>
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

      {/* Hero Section - Compact on desktop */}
      <section className="relative h-[150px] md:h-[200px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-saffron mb-2 drop-shadow-lg [text-shadow:_0_2px_12px_hsl(25_95%_53%_/_0.4)]">
            The Taste of Tradition
          </h1>
          <p className="text-sm md:text-lg text-golden max-w-2xl drop-shadow-md font-medium [text-shadow:_0_1px_8px_hsl(45_100%_60%_/_0.3)]">
            Authentic Indian sweets & snacks handcrafted for every celebration.
          </p>
        </div>
      </section>


      <main className="container mx-auto px-4 py-6">
        {/* Top Filters */}
        <div className="sticky top-[105px] md:top-16 z-40 bg-background pt-2 -mx-4 px-4 mb-6">
          <MobileFilters
            categories={categories}
            subCategories={availableSubCategories}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectCategory={handleCategoryChange}
            onSelectSubCategory={handleSubCategoryChange}
          />
        </div>

        {/* Product Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            {selectedSubCategory !== 'All' && <span className="text-muted-foreground text-sm md:text-base font-normal ml-2">/ {selectedSubCategory}</span>}
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {filteredSweets.length} Items
          </span>
        </div>

        {filteredSweets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredSweets.map((sweet) => (
              <ProductCard
                key={sweet.id}
                sweet={sweet}
                onAddToCart={addToCart}
              />
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
            <Button variant="outline" size="sm" className="mt-4" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-lg font-bold text-foreground mb-2">Sri Enippagam</h2>
              <p className="text-muted-foreground text-xs max-w-xs mx-auto md:mx-0">
                Delivering happiness since 1985. Authentic recipes, premium ingredients.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Quick Links</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><button onClick={() => handleCategoryChange('All')} className="hover:text-primary transition-colors">Home</button></li>
                <li><button onClick={() => handleCategoryChange('Sweets')} className="hover:text-primary transition-colors">Sweets</button></li>
                <li><button onClick={() => handleCategoryChange('Karam')} className="hover:text-primary transition-colors">Snacks</button></li>
              </ul>
            </div>

            <div className="text-center md:text-right">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Contact Us</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>📍 New Scheme Rd, Pollachi, Tamil Nadu 642001</p>
                <p>☎️ +91 70102 13381</p>
                <p>📧 order@srienippagam.com</p>
                <p>🕐 Open Daily 9 AM - 9 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-6 pt-6 text-center text-[10px] text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Sri Enippagam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
