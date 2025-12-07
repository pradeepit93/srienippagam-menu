
export interface Sweet {
    id: number;
    name: string;
    category: string;
    subCategory: string;
    image: string;
    description: string;
    price: number;
    order: number;
}

// Load images eagerly
const sweetImages = import.meta.glob('@/assets/sweets/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const karamImages = import.meta.glob('@/assets/kaaram/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const chatImages = import.meta.glob('@/assets/chat/*.{png,jpg,jpeg,svg,webp}', { eager: true });

// Helper to create a filename -> module map
const createMap = (glob: Record<string, any>) => {
    const map: Record<string, string> = {};
    for (const key in glob) {
        const filename = key.split('/').pop()!;
        // Handle URL encoded filenames if necessary, but usually glob keys are decoded or raw
        // We act conservative and try both decoded and raw matching if needed, 
        // but here we just store by filename.
        map[decodeURIComponent(filename)] = (glob[key] as any).default;
        map[filename] = (glob[key] as any).default;
    }
    return map;
};

const sMap = createMap(sweetImages);
const kMap = createMap(karamImages);
const cMap = createMap(chatImages);

const getSubCategory = (name: string, category: string): string => {
    const lowerName = name.toLowerCase();

    if (category === 'Sweets') {
        if (lowerName.includes('mysore') || lowerName.includes('mysurpa')) return 'Mysore Pak';
        if (lowerName.includes('halwa') || lowerName.includes('alwa')) return 'Halwa';
        if (lowerName.includes('laddu')) return 'Laddu';
        if (lowerName.includes('burfi') || lowerName.includes('barfi')) return 'Burfi';
        if (lowerName.includes('jamun')) return 'Jamun';
        if (lowerName.includes('jalebi') || lowerName.includes('jilebi')) return 'Jalebi';
        if (lowerName.includes('peda')) return 'Peda';
        if (lowerName.includes('cake')) return 'Cake';
        if (lowerName.includes('roll')) return 'Roll';
        if (lowerName.includes('rasgulla') || lowerName.includes('rasmalai') || lowerName.includes('bengali')) return 'Bengali Sweets';
        if (lowerName.includes('ghee')) return 'Ghee Sweets';
        return 'Traditional Sweets';
    }

    if (category === 'Karam') {
        if (lowerName.includes('murukku')) return 'Murukku';
        if (lowerName.includes('mixture')) return 'Mixture';
        if (lowerName.includes('sev')) return 'Sev';
        if (lowerName.includes('chips')) return 'Chips';
        if (lowerName.includes('thattai')) return 'Thattai';
        if (lowerName.includes('seedai')) return 'Seedai';
        if (lowerName.includes('pakoda')) return 'Pakoda';
        return 'Savories';
    }

    if (category === 'Chat') {
        if (lowerName.includes('puri')) return 'Puri';
        if (lowerName.includes('pav')) return 'Pav Bhaji';
        if (lowerName.includes('cutlet')) return 'Cutlet';
        if (lowerName.includes('chaat')) return 'Chaat';
        return 'Chat Items';
    }

    return 'Other';
};

const formatName = (path: string): string => {
    const filename = path.split('/').pop()?.split('.')[0] || '';
    let cleanName = decodeURIComponent(filename);
    cleanName = cleanName.replace(/[-_]/g, ' ');
    return cleanName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
};

// Raw Data Definitions - This acts as the "JSON" source
// You can reorder items here to change their display order.
const rawItems: { file: string; category: string; price?: number }[] = [
    // --- SWEETS ---
    { file: "Aathira Paan.png", category: "Sweets", price: 450 },
    { file: "Athirasam.jpg", category: "Sweets", price: 400 },
    { file: "Baby Milk Cake.png", category: "Sweets", price: 550 },
    { file: "Badam Burfi.jpg", category: "Sweets", price: 700 },
    { file: "Badam Milk.jpg", category: "Sweets", price: 200 },
    { file: "Badam Mysore Pak.png", category: "Sweets", price: 650 },
    { file: "Badusha.png", category: "Sweets", price: 420 },
    { file: "Banaras Soan Papdi.png", category: "Sweets", price: 400 },
    { file: "Blackcurrant Chenpauv.png", category: "Sweets", price: 600 },
    { file: "Bombay Milk Halwa.png", category: "Sweets", price: 480 },
    { file: "Boondi Laddu.png", category: "Sweets", price: 350 },
    { file: "Carrot Halwa.jpg", category: "Sweets", price: 450 },
    { file: "Carrot Mysore Pak.jpg", category: "Sweets", price: 500 },
    { file: "Cashew Cake.png", category: "Sweets", price: 750 },
    { file: "Chandira Kala.png", category: "Sweets", price: 480 },
    { file: "Country Sugar Kambu Laddu.jpg", category: "Sweets", price: 380 },
    { file: "Dates Halwa.png", category: "Sweets", price: 520 },
    { file: "Dry Jamun.png", category: "Sweets", price: 460 },
    { file: "Elaneer Payasam.jpg", category: "Sweets", price: 150 },
    { file: "Ellu Urundai.png", category: "Sweets", price: 320 },
    { file: "Gaja Carrot Cake.png", category: "Sweets", price: 550 },
    { file: "Guava Mysorepak.jpg", category: "Sweets", price: 580 },
    { file: "Honey Dew Sweet.jpg", category: "Sweets", price: 600 },
    { file: "Ilaneer Alwa.png", category: "Sweets", price: 500 },
    { file: "Jackfruit Mysore Pak.png", category: "Sweets", price: 600 },
    { file: "Jilebi.jpg", category: "Sweets", price: 300 },
    { file: "Kaja Kathali.png", category: "Sweets", price: 750 },
    { file: "Kaju Athi Cake.png", category: "Sweets", price: 800 },
    { file: "Kaju Pista Roll.png", category: "Sweets", price: 850 },
    { file: "Kalakand.png", category: "Sweets", price: 600 },
    { file: "Karupatti Bombay Jilebi.jpg", category: "Sweets", price: 450 },
    { file: "Karupatti Halwa.jpg", category: "Sweets", price: 550 },
    { file: "Karupatti Jilebi.jpg", category: "Sweets", price: 450 },
    { file: "Karupatti Kaju Katli.jpg", category: "Sweets", price: 850 },
    { file: "Karupatti Moongar Laddu.png", category: "Sweets", price: 480 },
    { file: "Karupatti Thengai Burfi.png", category: "Sweets", price: 450 },
    { file: "Karuppatti Burfi.jpg", category: "Sweets", price: 450 },
    { file: "Kesar Badam Cake.png", category: "Sweets", price: 700 },
    { file: "Kesar Chenna Sweet.png", category: "Sweets", price: 650 },
    { file: "Klaasic Mysore Pak.png", category: "Sweets", price: 600 },
    { file: "Kothumai Halwa.jpg", category: "Sweets", price: 420 },
    { file: "Makkan Peda.png", category: "Sweets", price: 460 },
    { file: "Malai Barfi.png", category: "Sweets", price: 500 },
    { file: "Malai Sandwich.png", category: "Sweets", price: 550 },
    { file: "Milk Peda.png", category: "Sweets", price: 440 },
    { file: "Mini Jamun.jpg", category: "Sweets", price: 400 },
    { file: "Mini Rasagulla.jpg", category: "Sweets", price: 400 },
    { file: "Modi Pak  Ring Pak.png", category: "Sweets", price: 480 },
    { file: "Motichoor Laddu.png", category: "Sweets", price: 360 },
    { file: "Mysore Pak.jpg", category: "Sweets", price: 500 },
    { file: "Naatu Sakkarai Paasi Arisi Laddu.jpg", category: "Sweets", price: 390 },
    { file: "Nattu sakkarai Ragi Laddu.jpg", category: "Sweets", price: 390 },
    { file: "Nattu sakkarai karuppu Urad Laddu.jpg", category: "Sweets", price: 390 },
    { file: "Ney Appam.jpg", category: "Sweets", price: 250 },
    { file: "Ney Mysore Pak.png", category: "Sweets", price: 650 },
    { file: "Orange Rasgulla.png", category: "Sweets", price: 450 },
    { file: "Paneer Jamun.png", category: "Sweets", price: 480 },
    { file: "Paruppu Opputtu.png", category: "Sweets", price: 300 },
    { file: "Pineapple Kesari.jpg", category: "Sweets", price: 350 },
    { file: "Pista Burfi.jpg", category: "Sweets", price: 750 },
    { file: "Pori Urundai.png", category: "Sweets", price: 200 },
    { file: "Rasberi Rasgulla.png", category: "Sweets", price: 450 },
    { file: "Rasmalai.jpg", category: "Sweets", price: 500 },
    { file: "Rava Laddu.png", category: "Sweets", price: 340 },
    { file: "Real Mango Roll.png", category: "Sweets", price: 600 },
    { file: "Real Pineapple Roll.png", category: "Sweets", price: 600 },
    { file: "Red Banana Mysore Pak.jpg", category: "Sweets", price: 620 },
    { file: "Sam Sam.png", category: "Sweets", price: 450 },
    { file: "Sampakali.png", category: "Sweets", price: 500 },
    { file: "Sevaalai pala.jpg", category: "Sweets", price: 300 },
    { file: "Sugarcane Milk Halwa.png", category: "Sweets", price: 480 },
    { file: "Then Mittai.png", category: "Sweets", price: 200 },
    { file: "Thengai Appam.png", category: "Sweets", price: 280 },
    { file: "White Aathira Paan.png", category: "Sweets", price: 460 },
    { file: "Yellow Agra Pan.png", category: "Sweets", price: 460 },
    { file: "elaneer halwa.jpg", category: "Sweets", price: 510 },
    { file: "karupatti mysurpa.jpg", category: "Sweets", price: 600 },
    { file: "nattu sakkarai solam laddu.jpg", category: "Sweets", price: 400 },
    { file: "orange agra paan.png", category: "Sweets", price: 460 },
    { file: "paneer jalebi.jpg", category: "Sweets", price: 420 },
    { file: "கேசர் பேடா.png", category: "Sweets", price: 600 },

    // --- KARAM ---
    { file: "Bombay Mixture.jpg", category: "Karam", price: 320 },
    { file: "Butter Murukku.jpg", category: "Karam", price: 340 },
    { file: "Butter Pepper Sev.jpg", category: "Karam", price: 350 },
    { file: "Carrot Chips.png", category: "Karam", price: 360 },
    { file: "Chettinad Mixture.jpg", category: "Karam", price: 340 },
    { file: "Coconut Milk Murukku.png", category: "Karam", price: 360 },
    { file: "Corn Flakes Mixture.jpg", category: "Karam", price: 320 },
    { file: "Finger Chips.png", category: "Karam", price: 280 },
    { file: "Flattened Rice Mixture.jpg", category: "Karam", price: 300 },
    { file: "Garlic Murukku.jpg", category: "Karam", price: 330 },
    { file: "Ginger Thattai Murukku.jpg", category: "Karam", price: 330 },
    { file: "Handmade Murukku.png", category: "Karam", price: 350 },
    { file: "Manapparai Murukku.jpg", category: "Karam", price: 340 },
    { file: "Masala Kadalai.png", category: "Karam", price: 300 },
    { file: "Milagu Ring Murukku.jpg", category: "Karam", price: 350 },
    { file: "Mini Kai Murukku.jpg", category: "Karam", price: 360 },
    { file: "Onion Murukku.jpg", category: "Karam", price: 320 },
    { file: "Onion Rings.jpg", category: "Karam", price: 280 },
    { file: "Pagava Chips.png", category: "Karam", price: 300 },
    { file: "Pepper Cashew.jpg", category: "Karam", price: 700 },
    { file: "Pepper Kara Sev.jpg", category: "Karam", price: 340 },
    { file: "Pepper Thattai Murukku.jpg", category: "Karam", price: 340 },
    { file: "Ragi Murukku.jpg", category: "Karam", price: 350 },
    { file: "Red Rice Sev.jpg", category: "Karam", price: 360 },
    { file: "Rice Ribbon Pakoda.png", category: "Karam", price: 320 },
    { file: "Sattur Sev.jpg", category: "Karam", price: 330 },
    { file: "Sesame Murukku.jpg", category: "Karam", price: 340 },
    { file: "Spicy Seedai.jpg", category: "Karam", price: 320 },
    { file: "Spicy Thattai Murukku.jpg", category: "Karam", price: 330 },
    { file: "Tomato Murukku.png", category: "Karam", price: 340 },
    { file: "Urad Dal Murukku.png", category: "Karam", price: 350 },
    { file: "Wheel Chips.jpg", category: "Karam", price: 280 },

    // --- CHAT ---
    { file: "Ada Set.png", category: "Chat", price: 80 },
    { file: "Bhel Puri.png", category: "Chat", price: 70 },
    { file: "Bombay Bhel Puri.png", category: "Chat", price: 90 },
    { file: "Cheese Pav Bhaji.png", category: "Chat", price: 120 },
    { file: "Dahi Katori Chaat.jpg", category: "Chat", price: 100 },
    { file: "Dahi Papdi Chaat.png", category: "Chat", price: 100 },
    { file: "Dahi Puri.png", category: "Chat", price: 90 },
    { file: "Fruit Bhel Puri.png", category: "Chat", price: 110 },
    { file: "Halu Tikki.jpg", category: "Chat", price: 80 },
    { file: "Masala Cutlet.jpg", category: "Chat", price: 70 },
    { file: "Masala Katori Chaat.jpg", category: "Chat", price: 90 },
    { file: "Masala Puri.png", category: "Chat", price: 70 },
    { file: "Masala Samosa Chaat.jpg", category: "Chat", price: 90 },
    { file: "Paneer Pav Bhaji.png", category: "Chat", price: 130 },
    { file: "Rasagulla Chaat (Curd version).jpg", category: "Chat", price: 120 },
    { file: "Rasagulla Chaat (Masala Style).jpg", category: "Chat", price: 120 },
    { file: "Sev Puri.jpg", category: "Chat", price: 80 },
    { file: "Vada Pav.jpg", category: "Chat", price: 60 },
    { file: "Veg Cutlet.png", category: "Chat", price: 60 },
];

export const items: Sweet[] = rawItems.map((item, index) => {
    const name = formatName(item.file);
    let imageMap: Record<string, string>;
    let defaultPrice = 100;
    let description = "";

    if (item.category === 'Sweets') {
        imageMap = sMap;
        defaultPrice = 450;
        description = `Delicious homemade ${name} made with premium ghee and ingredients.`;
    } else if (item.category === 'Karam') {
        imageMap = kMap;
        defaultPrice = 350;
        description = `Crunchy and spicy ${name}, perfect for tea time snacks.`;
    } else {
        imageMap = cMap;
        defaultPrice = 80;
        description = `Authentic ${name} with tangy and spicy flavors.`;
    }

    // Try finding image with decoding or exact match
    let image = imageMap[item.file] || imageMap[decodeURIComponent(item.file)];
    if (!image) {
        console.warn(`Image not found for ${item.file}`);
        image = ""; // Placeholder or empty
    }

    return {
        id: index + 1,
        name: name,
        category: item.category,
        subCategory: getSubCategory(name, item.category),
        image: image,
        description: description,
        price: item.price || defaultPrice,
        order: index + 1
    };
});

export const categories = ["All", "Sweets", "Karam", "Chat"];

export const getSubCategories = (category: string): string[] => {
    if (category === "All") return ["All"];

    const relevantItems = items.filter(item => item.category === category);
    const subCats = new Set(relevantItems.map(item => item.subCategory));
    return ["All", ...Array.from(subCats).sort()];
};
