import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    categories: string[];
    subCategories: string[];
    selectedCategory: string;
    selectedSubCategory: string;
    onSelectCategory: (category: string) => void;
    onSelectSubCategory: (subCategory: string) => void;
}

export const FilterSidebar = ({
    categories,
    subCategories,
    selectedCategory,
    selectedSubCategory,
    onSelectCategory,
    onSelectSubCategory,
}: FilterSidebarProps) => {
    return (
        <div className="space-y-6 sticky top-20">
            <div>
                <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                    Categories
                </h3>
                <div className="space-y-1">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectCategory(category)}
                            className={cn(
                                "w-full justify-start text-sm font-medium h-9 px-3 transition-colors rounded-md",
                                selectedCategory === category
                                    ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {subCategories.length > 0 && subCategories[1] !== undefined && (
                <div>
                    <h3 className="text-xs font-semibold mb-2 text-foreground/80 uppercase tracking-wider">
                        Refine by
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {subCategories.map((subCategory) => (
                            subCategory !== "All" && (
                                <Button
                                    key={subCategory}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onSelectSubCategory(subCategory)}
                                    className={cn(
                                        "rounded-full text-[11px] font-medium h-6 px-2.5 border-border/60",
                                        selectedSubCategory === subCategory
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                            : "text-muted-foreground hover:text-foreground bg-transparent"
                                    )}
                                >
                                    {subCategory}
                                </Button>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
