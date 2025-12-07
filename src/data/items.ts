
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
    { file: "Aathira_Paan.png", category: "Sweets", price: 450 },
    { file: "Athirasam.jpg", category: "Sweets", price: 400 },
    { file: "Baby_Milk_Cake.png", category: "Sweets", price: 550 },
    { file: "Badam_Burfi.jpg", category: "Sweets", price: 700 },
    { file: "Badam_Milk.jpg", category: "Sweets", price: 200 },
    { file: "Badam_Mysore_Pak.png", category: "Sweets", price: 650 },
    { file: "Badusha.png", category: "Sweets", price: 420 },
    { file: "Banaras_Soan_Papdi.png", category: "Sweets", price: 400 },
    { file: "Blackcurrant_Chenpauv.png", category: "Sweets", price: 600 },
    { file: "Bombay_Milk_Halwa.png", category: "Sweets", price: 480 },
    { file: "Boondi_Laddu.png", category: "Sweets", price: 350 },
    { file: "Carrot_Halwa.jpg", category: "Sweets", price: 450 },
    { file: "Carrot_Mysore_Pak.jpg", category: "Sweets", price: 500 },
    { file: "Cashew_Cake.png", category: "Sweets", price: 750 },
    { file: "Chandira_Kala.png", category: "Sweets", price: 480 },
    { file: "Country_Sugar_Kambu_Laddu.jpg", category: "Sweets", price: 380 },
    { file: "Dates_Halwa.png", category: "Sweets", price: 520 },
    { file: "Dry_Jamun.png", category: "Sweets", price: 460 },
    { file: "Elaneer_Payasam.jpg", category: "Sweets", price: 150 },
    { file: "Ellu_Urundai.png", category: "Sweets", price: 320 },
    { file: "Gaja_Carrot_Cake.png", category: "Sweets", price: 550 },
    { file: "Guava_Mysorepak.jpg", category: "Sweets", price: 580 },
    { file: "Honey_Dew_Sweet.jpg", category: "Sweets", price: 600 },
    { file: "Ilaneer_Alwa.png", category: "Sweets", price: 500 },
    { file: "Jackfruit_Mysore_Pak.png", category: "Sweets", price: 600 },
    { file: "Jilebi.jpg", category: "Sweets", price: 300 },
    { file: "Kaja_Kathali.png", category: "Sweets", price: 750 },
    { file: "Kaju_Athi_Cake.png", category: "Sweets", price: 800 },
    { file: "Kaju_Pista_Roll.png", category: "Sweets", price: 850 },
    { file: "Kalakand.png", category: "Sweets", price: 600 },
    { file: "Karupatti_Bombay_Jilebi.jpg", category: "Sweets", price: 450 },
    { file: "Karupatti_Halwa.jpg", category: "Sweets", price: 550 },
    { file: "Karupatti_Jilebi.jpg", category: "Sweets", price: 450 },
    { file: "Karupatti_Kaju_Katli.jpg", category: "Sweets", price: 850 },
    { file: "Karupatti_Moongar_Laddu.png", category: "Sweets", price: 480 },
    { file: "Karupatti_Thengai_Burfi.png", category: "Sweets", price: 450 },
    { file: "Karuppatti_Burfi.jpg", category: "Sweets", price: 450 },
    { file: "Kesar_Badam_Cake.png", category: "Sweets", price: 700 },
    { file: "Kesar_Chenna_Sweet.png", category: "Sweets", price: 650 },
    { file: "Klaasic_Mysore_Pak.png", category: "Sweets", price: 600 },
    { file: "Kothumai_Halwa.jpg", category: "Sweets", price: 420 },
    { file: "Makkan_Peda.png", category: "Sweets", price: 460 },
    { file: "Malai_Barfi.png", category: "Sweets", price: 500 },
    { file: "Malai_Sandwich.png", category: "Sweets", price: 550 },
    { file: "Milk_Peda.png", category: "Sweets", price: 440 },
    { file: "Mini_Jamun.jpg", category: "Sweets", price: 400 },
    { file: "Mini_Rasagulla.jpg", category: "Sweets", price: 400 },
    { file: "Modi_Pak__Ring_Pak.png", category: "Sweets", price: 480 },
    { file: "Motichoor_Laddu.png", category: "Sweets", price: 360 },
    { file: "Mysore_Pak.jpg", category: "Sweets", price: 500 },
    { file: "Naatu_Sakkarai_Paasi_Arisi_Laddu.jpg", category: "Sweets", price: 390 },
    { file: "Nattu_sakkarai_Ragi_Laddu.jpg", category: "Sweets", price: 390 },
    { file: "Nattu_sakkarai_karuppu_Urad_Laddu.jpg", category: "Sweets", price: 390 },
    { file: "Ney_Appam.jpg", category: "Sweets", price: 250 },
    { file: "Ney_Mysore_Pak.png", category: "Sweets", price: 650 },
    { file: "Orange_Rasgulla.png", category: "Sweets", price: 450 },
    { file: "Paneer_Jamun.png", category: "Sweets", price: 480 },
    { file: "Paruppu_Opputtu.png", category: "Sweets", price: 300 },
    { file: "Pineapple_Kesari.jpg", category: "Sweets", price: 350 },
    { file: "Pista_Burfi.jpg", category: "Sweets", price: 750 },
    { file: "Pori_Urundai.png", category: "Sweets", price: 200 },
    { file: "Rasberi_Rasgulla.png", category: "Sweets", price: 450 },
    { file: "Rasmalai.jpg", category: "Sweets", price: 500 },
    { file: "Rava_Laddu.png", category: "Sweets", price: 340 },
    { file: "Real_Mango_Roll.png", category: "Sweets", price: 600 },
    { file: "Real_Pineapple_Roll.png", category: "Sweets", price: 600 },
    { file: "Red_Banana_Mysore_Pak.jpg", category: "Sweets", price: 620 },
    { file: "Sam_Sam.png", category: "Sweets", price: 450 },
    { file: "Sampakali.png", category: "Sweets", price: 500 },
    { file: "Sevaalai_pala.jpg", category: "Sweets", price: 300 },
    { file: "Sugarcane_Milk_Halwa.png", category: "Sweets", price: 480 },
    { file: "Then_Mittai.png", category: "Sweets", price: 200 },
    { file: "Thengai_Appam.png", category: "Sweets", price: 280 },
    { file: "White_Aathira_Paan.png", category: "Sweets", price: 460 },
    { file: "Yellow_Agra_Pan.png", category: "Sweets", price: 460 },
    { file: "elaneer_halwa.jpg", category: "Sweets", price: 510 },
    { file: "karupatti_mysurpa.jpg", category: "Sweets", price: 600 },
    { file: "nattu_sakkarai_solam_laddu.jpg", category: "Sweets", price: 400 },
    { file: "orange_agra_paan.png", category: "Sweets", price: 460 },
    { file: "paneer_jalebi.jpg", category: "Sweets", price: 420 },
    { file: "கேசர்_பேடா.png", category: "Sweets", price: 600 },

    // --- KARAM ---
    { file: "Bombay_Mixture.jpg", category: "Karam", price: 320 },
    { file: "Butter_Murukku.jpg", category: "Karam", price: 340 },
    { file: "Butter_Pepper_Sev.jpg", category: "Karam", price: 350 },
    { file: "Carrot_Chips.png", category: "Karam", price: 360 },
    { file: "Chettinad_Mixture.jpg", category: "Karam", price: 340 },
    { file: "Coconut_Milk_Murukku.png", category: "Karam", price: 360 },
    { file: "Corn_Flakes_Mixture.jpg", category: "Karam", price: 320 },
    { file: "Finger_Chips.png", category: "Karam", price: 280 },
    { file: "Flattened_Rice_Mixture.jpg", category: "Karam", price: 300 },
    { file: "Garlic_Murukku.jpg", category: "Karam", price: 330 },
    { file: "Ginger_Thattai_Murukku.jpg", category: "Karam", price: 330 },
    { file: "Handmade_Murukku.png", category: "Karam", price: 350 },
    { file: "Manapparai_Murukku.jpg", category: "Karam", price: 340 },
    { file: "Masala_Kadalai.png", category: "Karam", price: 300 },
    { file: "Milagu_Ring_Murukku.jpg", category: "Karam", price: 350 },
    { file: "Mini_Kai_Murukku.jpg", category: "Karam", price: 360 },
    { file: "Onion_Murukku.jpg", category: "Karam", price: 320 },
    { file: "Onion_Rings.jpg", category: "Karam", price: 280 },
    { file: "Pagava_Chips.png", category: "Karam", price: 300 },
    { file: "Pepper_Cashew.jpg", category: "Karam", price: 700 },
    { file: "Pepper_Kara_Sev.jpg", category: "Karam", price: 340 },
    { file: "Pepper_Thattai_Murukku.jpg", category: "Karam", price: 340 },
    { file: "Ragi_Murukku.jpg", category: "Karam", price: 350 },
    { file: "Red_Rice_Sev.jpg", category: "Karam", price: 360 },
    { file: "Rice_Ribbon_Pakoda.png", category: "Karam", price: 320 },
    { file: "Sattur_Sev.jpg", category: "Karam", price: 330 },
    { file: "Sesame_Murukku.jpg", category: "Karam", price: 340 },
    { file: "Spicy_Seedai.jpg", category: "Karam", price: 320 },
    { file: "Spicy_Thattai_Murukku.jpg", category: "Karam", price: 330 },
    { file: "Tomato_Murukku.png", category: "Karam", price: 340 },
    { file: "Urad_Dal_Murukku.png", category: "Karam", price: 350 },
    { file: "Wheel_Chips.jpg", category: "Karam", price: 280 },

    // --- CHAT ---
    { file: "Ada_Set.png", category: "Chat", price: 80 },
    { file: "Bhel_Puri.png", category: "Chat", price: 70 },
    { file: "Bombay_Bhel_Puri.png", category: "Chat", price: 90 },
    { file: "Cheese_Pav_Bhaji.png", category: "Chat", price: 120 },
    { file: "Dahi_Katori_Chaat.jpg", category: "Chat", price: 100 },
    { file: "Dahi_Papdi_Chaat.png", category: "Chat", price: 100 },
    { file: "Dahi_Puri.png", category: "Chat", price: 90 },
    { file: "Fruit_Bhel_Puri.png", category: "Chat", price: 110 },
    { file: "Halu_Tikki.jpg", category: "Chat", price: 80 },
    { file: "Masala_Cutlet.jpg", category: "Chat", price: 70 },
    { file: "Masala_Katori_Chaat.jpg", category: "Chat", price: 90 },
    { file: "Masala_Puri.png", category: "Chat", price: 70 },
    { file: "Masala_Samosa_Chaat.jpg", category: "Chat", price: 90 },
    { file: "Paneer_Pav_Bhaji.png", category: "Chat", price: 130 },
    { file: "Rasagulla_Chaat_(Curd_version).jpg", category: "Chat", price: 120 },
    { file: "Rasagulla_Chaat_(Masala_Style).jpg", category: "Chat", price: 120 },
    { file: "Sev_Puri.jpg", category: "Chat", price: 80 },
    { file: "Vada_Pav.jpg", category: "Chat", price: 60 },
    { file: "Veg_Cutlet.png", category: "Chat", price: 60 },
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
