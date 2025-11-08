import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import heroImage from "@/assets/hero-sweets.jpg";
import gulabJamunImg from "@/assets/gulab-jamun.jpg";
import jalebiImg from "@/assets/jalebi.jpg";
import barfiImg from "@/assets/barfi.jpg";
import ladooImg from "@/assets/ladoo.jpg";
import kajuKatliImg from "@/assets/kaju-katli.jpg";
import rasgullaImg from "@/assets/rasgulla.jpg";

interface Sweet {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

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

const sweets: Sweet[] = [
  {
    id: 1,
    name: "Gulab Jamun",
    description: "Soft milk-solid balls soaked in fragrant rose-cardamom syrup",
    price: 80,
    category: "Milk-based",
    image: gulabJamunImg,
  },
  {
    id: 2,
    name: "Jalebi",
    description: "Crispy spiral-shaped sweet dipped in saffron sugar syrup",
    price: 60,
    category: "Syrup-based",
    image: jalebiImg,
  },
  {
    id: 3,
    name: "Assorted Barfi",
    description: "Premium milk fudge in flavors of kesar, pista, and coconut",
    price: 120,
    category: "Milk-based",
    image: barfiImg,
  },
  {
    id: 4,
    name: "Besan Ladoo",
    description: "Golden gram flour balls with ghee and aromatic spices",
    price: 90,
    category: "Dry Fruits",
    image: ladooImg,
  },
  {
    id: 5,
    name: "Kaju Katli",
    description: "Premium cashew diamond with edible silver leaf",
    price: 150,
    category: "Dry Fruits",
    image: kajuKatliImg,
  },
  {
    id: 6,
    name: "Rasgulla",
    description: "Spongy cottage cheese balls in light sugar syrup",
    price: 70,
    category: "Milk-based",
    image: rasgullaImg,
  },
];

const categories = ["All", "Milk-based", "Syrup-based", "Dry Fruits"];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredSweets = sweets.filter((sweet) => {
    const matchesCategory = selectedCategory === "All" || sweet.category === selectedCategory;
    const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sweet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      // Create WhatsApp message with proper encoding
      const orderText = cart
        .map(
          (item) =>
            `${encodeURIComponent(item.name)} x ${item.quantity} = ₹${item.price * item.quantity}`
        )
        .join("%0A");
      
      const total = getTotalPrice();
      const message = `Hello! I would like to place an order:%0A%0A${orderText}%0A%0ATotal: ₹${total}`;
      
      // Validate message length (WhatsApp has limits)
      if (message.length > 2000) {
        toast({
          title: "Order too large",
          description: "Please reduce the number of items or place multiple orders.",
          variant: "destructive",
        });
        return;
      }

      const whatsappUrl = `https://wa.me/919876543210?text=${message}`;
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
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Shree Mithai Bhandar
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
            Authentic Indian sweets made with love and tradition since 1985
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="relative shadow-md">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-2">Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Your Cart</SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground">Your cart is empty</p>
                      <p className="text-sm text-muted-foreground mt-2">Add some delicious sweets to get started!</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex gap-4 p-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">₹{item.price}/kg</p>
                              <div className="flex items-center gap-3 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </>
                  )}
                </div>

                {cart.length > 0 && (
                  <SheetFooter className="mt-8 flex-col gap-4">
                    <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-4">
                      <span>Total:</span>
                      <span className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full shadow-lg hover:shadow-xl transition-all text-base"
                      onClick={placeOrder}
                    >
                      Place Order via WhatsApp
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      You'll be redirected to WhatsApp to complete your order
                    </p>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          </div>
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border focus:border-primary"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="category"
                size="lg"
                data-active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className="font-semibold"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSweets.map((sweet) => (
            <Card 
              key={sweet.id}
              className="overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border"
            >
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={sweet.image} 
                    alt={sweet.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold text-foreground">{sweet.name}</h3>
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                    {sweet.category}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {sweet.description}
                </p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ₹{sweet.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/kg</span>
                </div>
                <Button 
                  size="lg"
                  className="shadow-md hover:shadow-lg transition-all"
                  onClick={() => addToCart(sweet)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">No sweets found matching your search.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Shree Mithai Bhandar</h2>
          <p className="text-muted-foreground mb-4">
            Experience the authentic taste of traditional Indian sweets
          </p>
          <p className="text-sm text-muted-foreground">
            📍 123 Sweet Street, Delhi | ☎️ +91 98765 43210 | 🕐 Open Daily 9 AM - 9 PM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
