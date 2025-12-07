import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface MobileFiltersProps {
    categories: string[];
    subCategories: string[];
    selectedCategory: string;
    selectedSubCategory: string;
    onSelectCategory: (category: string) => void;
    onSelectSubCategory: (subCategory: string) => void;
}

export const MobileFilters = ({
    categories,
    subCategories,
    selectedCategory,
    selectedSubCategory,
    onSelectCategory,
    onSelectSubCategory,
}: MobileFiltersProps) => {
    return (
        <div className="space-y-2 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted/50 border border-border flex-shrink-0">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="h-6 w-px bg-border/50 mx-1 flex-shrink-0" />
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "font-semibold whitespace-nowrap flex-shrink-0 h-9 rounded-full px-4 border border-transparent",
                            selectedCategory === category
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                : "bg-card border-border/50 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {subCategories.length > 0 && subCategories[1] !== undefined && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 pl-4 fade-mask-r">
                    {subCategories.map((subCategory) => (
                        subCategory !== "All" && (
                            <Button
                                key={subCategory}
                                variant="outline"
                                size="sm"
                                onClick={() => onSelectSubCategory(selectedSubCategory === subCategory ? "All" : subCategory)}
                                className={cn(
                                    "rounded-xl text-xs font-medium h-8 px-4 border-border/60 whitespace-nowrap flex-shrink-0",
                                    selectedSubCategory === subCategory
                                        ? "bg-secondary text-secondary-foreground border-secondary"
                                        : "bg-background/50 hover:bg-background"
                                )}
                            >
                                {subCategory}
                            </Button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};
