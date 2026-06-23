export interface ProductSize {
  label: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  shortName: string;
  tagline: string;
  sizes: ProductSize[];
  image: string;
  sizeImages?: string[];
  imageBg?: string;
  section: 'Face Care' | 'Body Care' | "Men's Care" | 'Sets & Merch';
  category: string;
  cardDescription: string;
  shortDescription?: string;
  longDescription?: string;
  heroIngredients: string[];
  ingredients?: string;
  benefits: string[];
  keyBenefits?: string[];
  bestFor?: string;
  scentProfile?: string;
  howToUse?: string;
  isSet?: boolean;
  setIncludes?: string[];
  availableNote?: string;
}

const BRAND_ICON = '/bloom__social_icon_darkbg copy.png';

export const products: Product[] = [
  // ─── Sets & Merch ─────────────────────────────────────────────────────────────
  {
    id: 100,
    name: "Bloom 5.5 Women's Summer Set",
    shortName: "Women's Summer Set",
    tagline: 'Summer Savings for Active Outdoor Days',
    sizes: [{ label: 'Set', price: 72.00 }],
    image: BRAND_ICON,
    section: 'Sets & Merch',
    category: 'Set',
    isSet: true,
    setIncludes: [
      'Desert Bloom Body Butter 8 oz.',
      'Radiance Facial Moisturizer 1 oz.',
      'Midnight Bloom Serum 1 oz.',
      'Gua Sha (available August 15)',
      'Lightweight Drawstring Travel Bag (available August 15)',
    ],
    availableNote: 'Gua Sha and Travel Bag available August 15.',
    cardDescription: "A premium summer skincare set with Prickly Pear Seed Oil-powered body butter, facial moisturizer, and overnight serum, plus a Gua Sha and travel bag — all at 10% savings.",
    shortDescription: "A premium summer skincare set with Prickly Pear Seed Oil-powered body butter, facial moisturizer, and overnight serum, plus a Gua Sha and travel bag; all at 10% savings.",
    longDescription: `Embrace summer with Bloom 5.5's Women's Summer Set, a premium clean-athletic skincare kit built for sun, sweat, wind, and long days outside. This set includes Desert Bloom Body Butter (8 oz), Radiance Facial Moisturizer (1 oz), Midnight Bloom Serum (1 oz), a Gua Sha tool, and a lightweight drawstring travel bag; all at 10% savings.\n\nThe set is powered by cold-pressed Prickly Pear Seed Oil, the hero ingredient across all three skincare products, delivering antioxidant-rich care and fast absorption for a healthy-looking glow and comfortable feel. Desert Bloom Body Butter refreshes skin after workouts, outdoor sports, hiking, swimming, or sun exposure with lightweight hydration and a non-greasy, soft-matte finish. Radiance Facial Moisturizer hydrates and smooths the look of skin with a refined luminous finish, while Midnight Bloom Serum nourishes overnight for softer, more radiant-looking skin by morning.\n\nThe Gua Sha tool supports a simple, on-the-go facial routine for a polished, relaxed look, and the lightweight drawstring bag keeps everything organized for gym, travel, or camp. Perfect for weekend athletes, outdoor enthusiasts, and anyone who spends summers active in the sun, this set helps you stay refreshed, groomed, and ready for anything.`,
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Niacinamide', 'Ceramides', 'Bakuchiol', 'Pearl Powder'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a healthy-looking glow and comfortable skin with fast-absorbing, antioxidant-rich care.',
      'Body butter refreshes skin after sun, sweat, and movement with lightweight hydration and a non-greasy finish.',
      'Facial moisturizer and overnight serum hydrate and smooth the look of skin for a radiant, polished finish.',
    ],
    benefits: [
      'Prickly Pear Seed Oil supports a healthy-looking glow',
      'Body butter refreshes after sun, sweat, and movement',
      'Facial moisturizer delivers refined luminous hydration',
      'Overnight serum nourishes for softer skin by morning',
      'Gua Sha and travel bag included (available Aug 15)',
    ],
  },
  {
    id: 101,
    name: "Bloom 5.5 Men's Summer Set",
    shortName: "Men's Summer Set",
    tagline: 'Summer Savings for Active Outdoor Days',
    sizes: [{ label: 'Set', price: 63.00 }],
    image: BRAND_ICON,
    section: 'Sets & Merch',
    category: 'Set',
    isSet: true,
    setIncludes: [
      'Desert Sage Beard Balm 2 oz.',
      'Desert Sage Beard Oil 1 oz.',
      'Desert Bloom Body Butter 8 oz.',
      'Lightweight Drawstring Travel Bag (available August 15)',
    ],
    availableNote: 'Travel Bag available August 15.',
    cardDescription: "A premium summer grooming set with Prickly Pear Seed Oil-powered beard oil, beard balm, and body butter for active men, plus a lightweight drawstring travel bag; all at 10% savings.",
    shortDescription: "A premium summer grooming set with Prickly Pear Seed Oil-powered beard oil, beard balm, and body butter for active men, plus a light-weight drawstring travel bag; all at 10% savings.",
    longDescription: `Get ready for summer fun with Bloom 5.5's Men's Summer Set, a premium clean-athletic grooming kit built for sun, sweat, wind, and long days outside. This set includes Desert Sage Beard Balm (2 oz), Desert Sage Beard Oil (1 oz), Desert Bloom Body Butter (8 oz), and a to-go bag, all at 10% savings.\n\nThe set is powered by cold-pressed Prickly Pear Seed Oil, the hero ingredient across all three products, delivering antioxidant-rich care and fast absorption for a healthy-looking glow and comfortable feel. Desert Sage Beard Oil conditions coarse hair, softens bristles, and helps keep the skin underneath feeling smooth and balanced. Desert Sage Beard Balm tames flyaways, adds manageability, and leaves the beard looking polished and well-groomed. Desert Bloom Body Butter refreshes skin after workouts, outdoor sports, hiking, swimming, or sun exposure with lightweight hydration and a non-greasy, soft-matte finish.\n\nPerfect for weekend athletes, outdoor workers, and anyone who spends summers active in the sun, this set helps you stay groomed, comfortable, and ready for anything. Use daily on beard and body, and pack the travel bag for gym, travel, or camp.`,
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Jojoba Oil', 'Argan Oil', 'Bakuchiol', 'Pearl Powder'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a healthy-looking beard and skin with fast-absorbing, antioxidant-rich care.',
      'Beard oil and balm soften, condition, and tame flyaways for a polished look after workouts and outdoor activities.',
      'Body butter refreshes skin after sun, sweat, and movement with lightweight hydration and a non-greasy finish.',
    ],
    benefits: [
      'Prickly Pear Seed Oil supports a healthy-looking beard and skin',
      'Beard oil conditions and softens coarse hair daily',
      'Beard balm tames flyaways for a polished, groomed look',
      'Body butter refreshes after sun, sweat, and movement',
      'Lightweight travel bag included (available Aug 15)',
    ],
  },

  // ─── Body Care ─────────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Bloom 5.5 Desert Bloom Body Butter',
    shortName: 'Desert Bloom Body Butter',
    tagline: 'Whipped. Lightweight. Desert glow.',
    sizes: [
      { label: '4 fl oz', price: 22.00 },
      { label: '8 fl oz', price: 35.00 },
    ],
    image: '/images/products/Desert_Bloom_BB_4_oz_White.png',
    sizeImages: [
      '/images/products/Desert_Bloom_BB_4_oz_White.png',
      '/images/products/Desert_Bloom_BB_8_oz_White.png',
    ],
    section: 'Body Care',
    category: 'Body',
    cardDescription: 'A premium whipped body formula powered by Prickly Pear Seed Oil, crafted for active routines and clean, everyday care. It absorbs fast, feels weightless, and leaves skin soft, smooth, and comfortably conditioned.',
    shortDescription: 'A premium whipped body formula powered by Prickly Pear Seed Oil, crafted for active routines and clean, everyday care. It absorbs fast, feels weightless, and leaves skin soft, smooth, and comfortably conditioned with a refined matte finish.',
    longDescription: `Desert Bloom Body Butter is Bloom 5.5's lightweight whipped body formula, centered around Prickly Pear Seed Oil to help skin look radiant, refreshed, and deeply nourished. Its airy texture absorbs quickly, delivering lasting moisture with a smooth, non-greasy finish that feels comfortable and breathable on the skin.\n\nPrickly Pear Seed Oil is the hero ingredient, prized for its antioxidant-rich profile and ability to help support a healthy-looking glow. Shea, Mango, and Cocoa Butters help soften and condition the skin, while Jojoba Seed Oil adds lightweight hydration for a balanced, supple feel.\n\nIdeal for active lifestyles, this formula is well suited for skin that wants a moisture boost after workouts, outdoor time, or exposure to dry, windy conditions. Arrowroot Powder helps maintain a soft-matte finish, reducing the appearance of shine, while Tocopherol (Vitamin E) helps condition the skin for a smooth, healthy-looking feel.`,
    ingredients: 'Butyrospermum Parkii (Shea) Butter, Mangifera Indica (Mango) Seed Butter, Theobroma Cacao (Cocoa) Butter, Opuntia Ficus-Indica Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Cannabis Sativa (Hemp) Seed Oil, Arrowroot Powder, Tocopherol.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Mango Butter', 'Hemp Seed Oil', 'Arrowroot Powder', 'Pearl Powder', 'Cocoa Butter'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps skin look refreshed, radiant, and restored after movement and exposure.',
      'Shea, Mango, and Cocoa Butters soften and condition without a heavy feel.',
      'Quick-absorbing and non-greasy, with a soft-matte finish that fits seamlessly into post-workout and outdoor routines.',
    ],
    benefits: ['Light whipped texture absorbs fast without grease', 'Prickly Pear provides antioxidant glow', 'Hemp Seed Oil adds essential omegas for barrier support', 'Arrowroot for natural matte, smooth finish', 'Pearl Powder adds subtle healthy luminosity'],
    bestFor: 'Dry, sensitive body skin — especially legs, arms, elbows, and hands.',
    howToUse: 'Apply generously to clean, damp or dry skin. Massage until absorbed. Use daily, especially after showering.',
  },
  // ─── Men's Care ─────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Bloom 5.5 Desert Sage Beard Balm',
    shortName: 'Desert Sage Beard Balm',
    tagline: 'Beard care that goes skin deep',
    sizes: [{ label: '2 oz', price: 20.00 }],
    image: '/images/products/Desert_Sage_Beard_Balm_Transparent.png',
    section: "Men's Care",
    category: 'Grooming',
    cardDescription: 'A premium beard balm powered by Prickly Pear Seed Oil to soften coarse hair, tame flyaways, and leave beard and skin feeling smooth, conditioned, and polished.',
    shortDescription: 'A premium beard balm powered by Prickly Pear Seed Oil to soften coarse hair, tame flyaways, and leave beard and skin feeling smooth, conditioned, and polished.',
    longDescription: `Desert Sage Beard Balm is Bloom 5.5's premium whipped beard balm, powered by cold-pressed Prickly Pear Seed Oil for a refined, non-greasy finish and a well-groomed look. This multi-tasking formula conditions coarse beard hair, smooths flyaways, and leaves both beard and skin feeling soft, comfortable, and cared for.\n\nPrickly Pear Seed Oil is the hero ingredient, bringing a lightweight, antioxidant-rich touch that helps support a healthy-looking beard and the skin underneath. Shea, Murumuru, and Mango Butters help soften and condition, while Jojoba and Rosehip Seed Oils add smooth glide and lightweight nourishment without a heavy feel.\n\nBakuchiol and Tocopherol help round out the formula with a modern, skin-conscious finish, while Pearl Powder adds subtle luminosity for a clean, polished look. Choose the woodsy essential oil blend for a rugged scent profile.\n\nIdeal for all beard lengths and skin types, especially dry or sensitive skin, this balm works well for daily grooming and control. Warm a small amount in the palms and work through beard and skin for a soft, smooth, conditioned finish.`,
    ingredients: 'Cera Alba (Beeswax), Butyrospermum Parkii (Shea) Butter, Mangifera Indica (Mango) Seed Butter, Astrocaryum Murumuru Seed Butter, Opuntia Ficus-Indica Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Rosa Canina (Rosehip) Seed Oil, Tocopherol, Bakuchiol, Pearl Powder, [Essential Oils: Cedarwood, Sandalwood, Vetiver, Salvia Officinalis (Sage)].',
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Mango Butter', 'Murumuru Butter', 'Rosehip Seed Oil', 'Bakuchiol', 'Pearl Powder'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a healthy-looking beard and comfortable skin with a lightweight, antioxidant-rich feel.',
      'Shea, Murumuru, and Mango Butters help soften coarse hair and improve manageability without a greasy finish.',
      'Jojoba, Rosehip, and Bakuchiol help condition the skin underneath while adding a smooth, polished look.',
    ],
    benefits: ['Deeply conditions coarse and dry beard hair', 'Softens bristles and helps reduce itch', 'Tames flyaways with light hold', 'Nourishes and protects skin underneath', 'Pearl Powder adds subtle healthy luminosity'],
    bestFor: 'All beard types and lengths, especially those with dry, coarse, or sensitive skin underneath.',
    scentProfile: 'Cedarwood • Sandalwood • Vetiver • Sage (or Unscented)',
    howToUse: 'Warm a small amount between palms. Work through beard and into the skin underneath. Style as desired. Use daily or as needed.',
  },
  {
    id: 4,
    name: 'Bloom 5.5 Desert Sage Beard Oil',
    shortName: 'Desert Sage Beard Oil',
    tagline: 'Daily armor for your beard',
    sizes: [{ label: '1 fl oz', price: 15.00 }],
    image: '/images/products/Desert_Sage_Beard_Oil_Transparent.png',
    section: "Men's Care",
    category: 'Grooming',
    cardDescription: 'A lightweight daily beard oil powered by Prickly Pear Seed Oil to soften hair, nourish skin, and add a natural sheen with a fast-absorbing, non-greasy finish.',
    shortDescription: 'A lightweight daily beard oil powered by Prickly Pear Seed Oil to soften hair, nourish skin, and add a natural sheen with a fast-absorbing, non-greasy finish.',
    longDescription: `Desert Sage Beard Oil is Bloom 5.5's lightweight daily conditioning oil for beards of all lengths, powered by a high concentration of cold-pressed Prickly Pear Seed Oil for a refined, fast-absorbing finish and a healthy-looking glow. This formula penetrates quickly to nourish both beard hair and the skin underneath, leaving the beard feeling soft, smooth, and well-managed.\n\nPrickly Pear Seed Oil is the hero ingredient, bringing an antioxidant-rich touch that helps support a healthy-looking beard and comfortable skin. Jojoba mimics the skin's natural lipids to help condition without heaviness, while Argan adds softness and a natural sheen, and Rosehip contributes a gentle, nutrient-focused finish.\n\nSuper Fine Pearl Powder lends a subtle luminosity for a clean, polished look. The formula is designed for daily use on clean or damp beards, working well alone or layered under Desert Sage Beard Balm for added control and conditioning. With a rugged, masculine essential oil blend of Cedarwood, Sandalwood, Vetiver, and Sage, this oil delivers a refined sporty scent profile for modern grooming routines.`,
    ingredients: 'Opuntia Ficus-Indica Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Argania Spinosa (Argan) Kernel Oil, Rosa Canina (Rosehip) Seed Oil, Tocopherol, Pearl Powder, [Essential Oils: Cedarwood, Sandalwood, Vetiver, Salvia Officinalis (Sage)].',
    heroIngredients: ['Prickly Pear Seed Oil', 'Jojoba Oil', 'Argan Oil', 'Rosehip Seed Oil', 'Pearl Powder', 'Vitamin E'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a healthy-looking beard and comfortable skin with a fast-absorbing, antioxidant-rich feel.',
      'Jojoba, Argan, and Rosehip help condition hair and skin while adding softness and a natural sheen.',
      'Pearl Powder adds subtle luminosity for a polished look, perfect for daily grooming or layering under beard balm.',
    ],
    benefits: ['Ultra-lightweight and fast-absorbing', 'Deeply conditions beard without greasiness', 'Adds natural healthy shine and manageability', 'Nourishes skin to reduce itch and flakiness', 'Pearl Powder for subtle healthy luminosity'],
    bestFor: 'All beard types and lengths, especially dry, coarse, or sensitive skin underneath.',
    scentProfile: 'Cedarwood • Sandalwood • Vetiver • Sage (or Unscented)',
    howToUse: 'Apply 3–8 drops (depending on beard length) to clean or damp beard. Warm between palms and work through beard and into skin underneath. Use daily, morning or after washing.',
  },

  // ─── Face Care ─────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Bloom 5.5 Desert Veil Lip Balm',
    shortName: 'Desert Veil Lip Balm',
    tagline: 'Nourish. Soften. Glow.',
    sizes: [{ label: '0.13 oz tube', price: 7.99 }],
    image: BRAND_ICON,
    section: 'Face Care',
    category: 'Lip',
    cardDescription: 'Nourishing lip balm with Mango and Shea Butters, Prickly Pear, and Red Raspberry Seed Oil. Pearl Powder adds a soft luminous finish for dry, chapped, or sensitive lips.',
    heroIngredients: ['Mango Butter', 'Shea Butter', 'Prickly Pear Seed Oil', 'Red Raspberry Seed Oil', 'Jojoba Oil', 'Pearl Powder'],
    benefits: ['Intensely nourishes and repairs dry, chapped lips', 'Antioxidant boost from Prickly Pear & Red Raspberry', 'Pearl Powder for soft luminous finish', 'Rich yet comfortable, non-greasy wear', 'Long-lasting hydration and softness'],
    bestFor: 'Dry, chapped, or sensitive lips.',
    howToUse: 'Apply generously to lips as needed. Reapply after eating or drinking. Can be used as an overnight lip treatment.',
  },
  {
    id: 6,
    name: 'Bloom 5.5 Midnight Bloom Serum',
    shortName: 'Midnight Bloom Serum',
    tagline: 'Overnight Barrier Support & Luminous Glow',
    sizes: [{ label: '1 fl oz Airless Pump', price: 25.00 }],
    image: '/images/products/Midnight_Bloom_Serum.png',
    section: 'Face Care',
    category: 'Serum',
    cardDescription: 'A lightweight overnight dry-oil serum powered by Prickly Pear Seed Oil, Ceramides, and Bakuchiol for soft, radiant-looking skin with a smooth, non-greasy finish.',
    shortDescription: 'A lightweight overnight dry-oil serum powered by Prickly Pear Seed Oil, Ceramides, and Bakuchiol for soft, radiant-looking skin with a smooth, non-greasy finish.',
    longDescription: `Midnight Bloom Serum is Bloom 5.5's signature anhydrous overnight serum, powered by cold-pressed Prickly Pear Seed Oil for a silky, fast-absorbing finish and a healthy-looking glow. This lightweight dry oil is designed to nourish the skin overnight without heaviness or residue, making it ideal for skin that wants refined moisture and a smooth, luminous feel.\n\nPrickly Pear Seed Oil is the hero ingredient, bringing a nutrient-rich, antioxidant-focused touch that helps skin look refreshed and radiant by morning. Ceramide Complex helps support a healthy-looking skin barrier, while Squalane, Hemp Seed Oil, Jojoba Seed Oil, Evening Primrose Oil, and Rosehip Seed Oil deliver a balanced blend of lightweight conditioning oils.\n\nBakuchiol and Retinyl Palmitate help improve the appearance of skin texture and tone, while Pearl Powder adds a soft radiant finish without shimmer or glitter. The result is a comfortable overnight serum that feels elegant on the skin and fits seamlessly into a clean, modern routine.\n\nApply nightly to face and neck, either on its own or layered with moisturizer for added comfort.`,
    ingredients: 'Opuntia Ficus-Indica (Prickly Pear) Seed Oil, Cannabis Sativa (Hemp) Seed Oil, Squalane, Simmondsia Chinensis (Jojoba) Seed Oil, Oenothera Biennis (Evening Primrose) Seed Oil, Rosa Canina (Rosehip) Seed Oil, Ceramide Complex, Tocopherol, Bakuchiol, Pearl Powder, Retinyl Palmitate.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Ceramides', 'Bakuchiol', 'Rosehip Seed Oil', 'Pearl Powder', 'Hemp Seed Oil', 'Evening Primrose Oil'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a radiant, healthy-looking glow with a fast-absorbing, lightweight feel.',
      'Ceramide Complex, Squalane, and botanical oils help condition skin and support a smooth, comfortable finish.',
      'Bakuchiol and Pearl Powder help refine the look of skin texture while adding soft luminosity without heaviness.',
    ],
    benefits: ['Supports skin barrier with Ceramides & Hemp Seed Oil', 'Promotes smoother, more radiant skin overnight', 'Powerful antioxidant protection', 'Pearl Powder delivers subtle luminous glow', 'Lightweight dry-oil — zero greasiness'],
    bestFor: 'Dry, mature, and sensitive skin.',
    howToUse: 'Apply 4–6 drops to face and neck. Gently massage with hands or a jade, ice, or steel roller until absorbed. Use nightly. Can layer under moisturizer if desired.',
  },
  {
    id: 7,
    name: 'Bloom 5.5 Radiance Facial Moisturizer',
    shortName: 'Radiance Facial Moisturizer',
    tagline: 'Your daily bloom of radiance',
    sizes: [{ label: '1 fl oz Airless Pump', price: 20.00 }],
    image: '/images/products/Radiance_Moisturizer.png',
    section: 'Face Care',
    category: 'Face',
    cardDescription: 'A lightweight daily moisturizer powered by Prickly Pear Seed Oil, Niacinamide, and skin-supporting Ceramides for hydrated, soft-looking skin with a refined luminous finish.',
    shortDescription: 'A lightweight daily moisturizer powered by Prickly Pear Seed Oil, Niacinamide, and skin-supporting Ceramides for hydrated, soft-looking skin with a refined luminous finish.',
    longDescription: `Bloom 5.5 Radiance Facial Moisturizer is a premium daily cream powered by cold-pressed Prickly Pear Seed Oil and designed to deliver lightweight hydration with a smooth, luminous finish. Formulated at skin's natural pH, it helps support a healthy-looking complexion while absorbing comfortably without heaviness or grease.\n\nNiacinamide helps improve the appearance of skin tone and texture, while skin-identical Ceramides, Mango Butter, and Cocoa Butter help condition and soften. Prickly Pear Seed Oil remains the hero ingredient, bringing a refined, antioxidant-rich touch that supports a radiant, healthy-looking glow.\n\nSoothing ingredients including Centella Asiatica, Panthenol, Allantoin, and Beta-Glucan help comfort the skin, while Super Fine Pearl Powder adds a soft luminous effect and Arrowroot Powder helps keep shine in check. Lavender Hydrosol lends a subtle, calming aroma for a clean, elevated finish.\n\nIdeal for morning and night, this versatile moisturizer layers well under makeup or wears beautifully on its own. It leaves skin feeling hydrated, balanced, and polished with a fresh, naturally radiant look.`,
    ingredients: 'Lavandula Angustifolia (Lavender) Flower Water, Opuntia Ficus-Indica Seed Oil, Squalane, Glycerin, Niacinamide, Butyrospermum Parkii (Mango) Butter, Theobroma Cacao (Cocoa) Butter, Simmondsia Chinensis (Jojoba) Seed Oil, Ricinus Communis (Castor) Seed Oil, Oenothera Biennis (Evening Primrose) Oil, Cetearyl Alcohol, Emulsifying Wax NF, Panthenol, Allantoin, Beta-Glucan, Centella Asiatica Extract, Arrowroot Powder, Pearl Powder, Leuconostoc/Radish Root Ferment Filtrate, Tocopherol, Ceramide NP.',
    heroIngredients: ['Prickly Pear Seed Oil', '5% Niacinamide', 'Ceramides', 'Pearl Powder', 'Centella Asiatica', 'Mango Butter', 'Arrowroot Powder'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a radiant, healthy-looking glow with an antioxidant-rich touch.',
      'Niacinamide and Ceramides help improve the look of skin tone, texture, and overall smoothness.',
      'Lightweight, quick-absorbing hydration leaves skin feeling soft, balanced, and comfortably moisturized.',
    ],
    benefits: ['5% Niacinamide brightens and supports skin barrier', 'Ceramides and plant butters deliver nourishing hydration', 'Centella, Panthenol & Beta-Glucan soothe and calm', 'Pearl Powder for natural luminous finish', 'Arrowroot offers subtle mattifying for balanced wear'],
    bestFor: 'Normal to dry, sensitive, or mature skin.',
    howToUse: 'Apply small amount to clean face and neck morning and/or night. Massage until fully absorbed.',
  },
  {
    id: 8,
    name: 'Bloom 5.5 Radiance Lite Facial Moisturizer',
    shortName: 'Radiance Lite Facial Moisturizer',
    tagline: 'Glow without the weight',
    sizes: [{ label: '1 fl oz Airless Pump', price: 20.00 }],
    image: '/images/products/Radiance_Lite_Moisturizer.png',
    section: 'Face Care',
    category: 'Face',
    cardDescription: 'A feather-light daily moisturizer powered by Prickly Pear Seed Oil, Niacinamide, and skin-conditioning botanicals for hydrated, smooth-looking skin with a refined luminous finish.',
    shortDescription: 'A feather-light daily moisturizer powered by Prickly Pear Seed Oil, Niacinamide, and skin-conditioning botanicals for hydrated, smooth-looking skin with a refined luminous finish.',
    longDescription: `Radiance Facial Moisturizer Lite is Bloom 5.5's feather-light daily moisturizer, powered by cold-pressed Prickly Pear Seed Oil for a fresh, radiant, and comfortably hydrated feel. This fast-absorbing formula delivers lightweight moisture and a refined luminous finish without a greasy or heavy feel.\n\nPrickly Pear Seed Oil is the hero ingredient, bringing a nutrient-rich touch that helps skin look healthy and revitalized. Niacinamide, Squalane, and Glycerin help support a smooth, balanced appearance, while botanical butters help condition the skin and maintain a soft, supple feel.\n\nSoothing ingredients including Aloe Vera, Centella Asiatica, Panthenol, Allantoin, and Beta-Glucan help comfort the skin, while Lactic Acid helps refine the look of texture. Super Fine Pearl Powder adds a subtle glow, and Arrowroot Powder helps keep shine in check for a clean, polished finish.\n\nIdeal for normal, combination, sensitive, or acne-prone skin, this daily moisturizer layers well after serums and wears beautifully morning or night.`,
    ingredients: 'Lavandula Angustifolia (Lavender) Flower Water, Aloe Barbadensis Leaf Juice, Opuntia Ficus-Indica Seed Oil, Squalane, Glycerin, Niacinamide, Simmondsia Chinensis (Jojoba) Seed Oil, Astrocaryum Murumuru Seed Butter, Theobroma Grandiflorum (Cupuacu) Seed Butter, Oenothera Biennis (Evening Primrose) Oil, Cetearyl Alcohol, Emulsifying Wax NF, Panthenol, Centella Asiatica Extract, Allantoin, Beta-Glucan, Lactic Acid, Arrowroot Powder, Leuconostoc/Radish Root Ferment Filtrate, Tocopherol, Pearl Powder.',
    heroIngredients: ['Prickly Pear Seed Oil', '5% Niacinamide', 'Lactic Acid', 'Pearl Powder', 'Centella Asiatica', 'Aloe Vera', 'Ceramides'],
    keyBenefits: [
      'Prickly Pear Seed Oil helps support a radiant, healthy-looking complexion with a nutrient-rich, lightweight feel.',
      'Niacinamide, Squalane, and Glycerin help hydrate and smooth the look of skin without heaviness.',
      'Aloe Vera, Centella Asiatica, and Panthenol help comfort the skin while Pearl Powder adds a soft luminous finish.',
    ],
    benefits: ['5% Niacinamide promotes brighter-looking skin', 'Gentle Lactic Acid smooths skin texture', 'Lightweight, fast-absorbing texture layers under SPF', 'Pearl Powder for luminous finish', 'Non-comedogenic, ideal under makeup'],
    bestFor: 'Normal, combination, sensitive, or acne-prone skin.',
    howToUse: 'Apply pea-sized amount to face and neck AM/PM after serums. Absorbs quickly; excellent under makeup or SPF.',
  },
];

export const sectionTabs = ["All", "Sets & Merch", "Body Care", "Men's Care", "Face Care"] as const;
export type SectionTab = typeof sectionTabs[number];

export const categoryColors: Record<string, { bg: string; text: string }> = {
  Serum:    { bg: '#1e3a20', text: '#d4edcc' },
  Body:     { bg: '#5a3a1e', text: '#f5dfc5' },
  Grooming: { bg: '#2a3a4a', text: '#c5d5e5' },
  Lip:      { bg: '#6b2a35', text: '#f5c5cc' },
  Face:     { bg: '#1e3a35', text: '#c5edea' },
  Set:      { bg: '#7a5c1e', text: '#faecd5' },
};
