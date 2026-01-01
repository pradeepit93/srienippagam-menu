// Data types and helper functions

export interface Sweet {
    id: number;
    name: string;
    category: string;
    subCategory: string;
    image: string;
    imageFile?: string; // Filename for lazy loading
    description: string;
    price: number;
    order: number;
}

interface RawItem {
    id: number;
    image: string;
    name: string;
    category: string;
    subCategory: string;
    description: string;
    price: number;
    order: number;
}

// Load images lazily for better performance
// We still need this map because dynamic imports (import()) need to know potential files at build time
const sweetImages = import.meta.glob('@/assets/sweets/*.{png,jpg,jpeg,svg,webp}', {
    query: {
        format: 'webp',
        w: '600',
        as: 'url'
    }
});
const karamImages = import.meta.glob('@/assets/kaaram/*.{png,jpg,jpeg,svg,webp}', {
    query: {
        format: 'webp',
        w: '600',
        as: 'url'
    }
});
const chatImages = import.meta.glob('@/assets/chat/*.{png,jpg,jpeg,svg,webp}', {
    query: {
        format: 'webp',
        w: '600',
        as: 'url'
    }
});

// Helper to create a filename -> module loader map
const createMap = (glob: Record<string, any>) => {
    const map: Record<string, () => Promise<any>> = {};
    for (const key in glob) {
        const filename = key.split('/').pop()!;
        // Store the loader function for lazy loading
        map[decodeURIComponent(filename)] = glob[key];
        map[filename] = glob[key];
    }
    return map;
};

const sMap = createMap(sweetImages);
const kMap = createMap(karamImages);
const cMap = createMap(chatImages);

export const fetchItems = async (): Promise<Sweet[]> => {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const rawItems: RawItem[] = await response.json();

        return rawItems.map((item) => {
            return {
                id: item.id,
                name: item.name,
                category: item.category,
                subCategory: item.subCategory,
                image: "", // Will be loaded lazily by component using imageFile
                imageFile: item.image, // JSON 'image' field contains the filename
                description: item.description,
                price: item.price,
                order: item.order
            } as Sweet;
        });
    } catch (error) {
        console.error("Error loading items:", error);
        return [];
    }
};

export const categories = ["All", "Sweets", "Karam", "Chat"];

export const getSubCategories = (items: Sweet[], category: string): string[] => {
    if (category === "All") return ["All"];

    const relevantItems = items.filter(item => item.category === category);
    const subCats = new Set(relevantItems.map(item => item.subCategory));
    return ["All", ...Array.from(subCats).sort()];
};

// Helper to get image loader for a specific file
export const getImageLoader = (filename: string, category: string): (() => Promise<any>) | null => {
    let imageMap: Record<string, () => Promise<any>>;

    if (category === 'Sweets') {
        imageMap = sMap;
    } else if (category === 'Karam') {
        imageMap = kMap;
    } else {
        imageMap = cMap;
    }

    return imageMap[filename] || imageMap[decodeURIComponent(filename)] || null;
};


