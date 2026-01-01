
interface FooterProps {
    onNavigate: (category: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
    return (
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
                            <li>
                                <button
                                    onClick={() => onNavigate("All")}
                                    className="hover:text-primary transition-colors"
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate("Sweets")}
                                    className="hover:text-primary transition-colors"
                                >
                                    Sweets
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate("Karam")}
                                    className="hover:text-primary transition-colors"
                                >
                                    Snacks
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center md:text-right">
                        <h3 className="font-semibold text-foreground mb-2 text-sm">Contact Us</h3>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>📍 New Scheme Rd, Pollachi, Tamil Nadu 642001</p>
                            <p>☎️ +91 88701 44490</p>
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
    );
};
