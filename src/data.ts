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
  category: string;
  cardDescription: string;
  heroIngredients: string[];
  benefits: string[];
  bestFor?: string;
  scentProfile?: string;
  howToUse?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Bloom 5.5 Prickly Pear Hyaluronic Serum',
    shortName: 'Prickly Pear Hyaluronic Serum',
    tagline: 'Daily Hydration, Brightening & Barrier Support',
    sizes: [{ label: '1 fl oz', price: 32.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Serum',
    cardDescription: 'Lightweight morning serum with 5% stabilized Vitamin C, hyaluronic acid, and soothing botanicals. Delivers hydration and a brighter, plumper appearance.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Hyaluronic Acid', '5% Vitamin C', 'Ferulic Acid', 'Centella Asiatica', 'Kojic Acid', 'Pearl Powder'],
    benefits: ['Deep lasting hydration and plump appearance', 'Promotes brighter, more even skin tone', 'Antioxidant support with stabilized Vitamin C', 'Soothes and calms with Centella, Aloe & Panthenol', 'Lightweight, fast-absorbing texture'],
    bestFor: 'Dull, dehydrated, or uneven-looking skin. Normal to dry or sensitive skin.',
    howToUse: 'Apply 3–5 drops to clean face and neck in the morning. Allow to absorb fully (1–2 min). Follow with moisturizer and broad-spectrum SPF 30+. Refrigerate for maximum freshness and Vitamin C stability.',
  },
  {
    id: 2,
    name: 'Bloom 5.5 Gentle Radiance Facial Cleanser',
    shortName: 'Gentle Radiance Facial Cleanser',
    tagline: 'Cleanse. Brighten. Soothe. Repeat.',
    sizes: [{ label: '4 fl oz', price: 26.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Face',
    cardDescription: 'Gentle creamy cleanser that removes impurities without stripping. Stable Vitamin C, Lactic Acid, and Pearl Powder deliver mild brightening and barrier support.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Vitamin C (Stable)', 'Lactic Acid', 'Pearl Powder', 'Centella Asiatica', 'Aloe Vera', 'Beta-Glucan'],
    benefits: ['Non-stripping gentle cleanse', 'Mild brightening and polishing action', 'Soothes and calms sensitive skin', 'Barrier-supporting oils and Beta-Glucan', 'Leaves skin soft, never tight'],
    bestFor: 'Sensitive, dry, mature, or barrier-conscious skin.',
    howToUse: 'Apply to damp face, massage gently for 30–60 seconds in circular motions. Rinse thoroughly with lukewarm water. Use morning and night.',
  },
  {
    id: 3,
    name: 'Bloom 5.5 Desert Sage Beard Balm',
    shortName: 'Desert Sage Beard Balm',
    tagline: 'Beard care that goes skin deep',
    sizes: [{ label: '2 oz', price: 18.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Grooming',
    cardDescription: 'Nourishing balm that softens coarse beard hair, tames flyaways, and protects the sensitive skin underneath. Formulated with Prickly Pear, Rosehip, Bakuchiol, and Pearl Powder.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Mango Butter', 'Murumuru Butter', 'Rosehip Seed Oil', 'Bakuchiol', 'Pearl Powder'],
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
    sizes: [{ label: '1 fl oz', price: 19.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Grooming',
    cardDescription: 'Lightweight daily beard oil with Prickly Pear, Jojoba, Argan, and Rosehip. Penetrates quickly to soften hair, add shine, and nourish the skin underneath.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Jojoba Oil', 'Argan Oil', 'Rosehip Seed Oil', 'Pearl Powder', 'Vitamin E'],
    benefits: ['Ultra-lightweight and fast-absorbing', 'Deeply conditions beard without greasiness', 'Adds natural healthy shine and manageability', 'Nourishes skin to reduce itch and flakiness', 'Pearl Powder for subtle healthy luminosity'],
    bestFor: 'All beard types and lengths, especially dry, coarse, or sensitive skin underneath.',
    scentProfile: 'Cedarwood • Sandalwood • Vetiver • Sage (or Unscented)',
    howToUse: 'Apply 3–8 drops (depending on beard length) to clean or damp beard. Warm between palms and work through beard and into skin underneath. Use daily, morning or after washing.',
  },
  {
    id: 5,
    name: 'Bloom 5.5 Desert Veil Lip Balm',
    shortName: 'Desert Veil Lip Balm',
    tagline: 'Nourish. Soften. Glow.',
    sizes: [{ label: '0.15 oz tube', price: 7.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Lip',
    cardDescription: 'Nourishing lip balm with Mango and Shea Butters, Prickly Pear, and Red Raspberry Seed Oil. Pearl Powder adds a soft luminous finish for dry, chapped, or sensitive lips.',
    heroIngredients: ['Mango Butter', 'Shea Butter', 'Prickly Pear Seed Oil', 'Red Raspberry Seed Oil', 'Jojoba Oil', 'Pearl Powder'],
    benefits: ['Intensely nourishes and repairs dry, chapped lips', 'Antioxidant boost from Prickly Pear & Red Raspberry', 'Pearl Powder for soft luminous finish', 'Rich yet comfortable, non-greasy wear', 'Long-lasting hydration and softness'],
    bestFor: 'Dry, chapped, or sensitive lips.',
    howToUse: 'Apply generously to lips as needed, especially in dry or cold weather. Reapply after eating or drinking. Can be used as an overnight lip treatment.',
  },
  {
    id: 6,
    name: 'Bloom 5.5 Midnight Bloom Serum',
    shortName: 'Midnight Bloom Serum',
    tagline: 'Overnight Barrier Support & Luminous Glow',
    sizes: [{ label: '1 fl oz', price: 38.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Serum',
    cardDescription: 'Signature overnight dry-oil serum powered by Prickly Pear, Ceramides, Bakuchiol, and Pearl Powder. Nourishes the skin barrier and delivers a subtle luminous glow by morning.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Ceramides', 'Bakuchiol', 'Rosehip Seed Oil', 'Pearl Powder', 'Hemp Seed Oil', 'Evening Primrose Oil'],
    benefits: ['Supports skin barrier with Ceramides & Hemp Seed Oil', 'Promotes smoother, more radiant skin overnight', 'Powerful antioxidant protection', 'Pearl Powder delivers subtle luminous glow', 'Lightweight dry-oil — zero greasiness'],
    bestFor: 'Dry, mature, and sensitive skin.',
    howToUse: 'Apply 4–6 drops to face and neck. Gently massage with hands or a jade, ice, or steel roller until absorbed. Use nightly. Can layer under moisturizer if desired.',
  },
  {
    id: 7,
    name: 'Bloom 5.5 Radiance Facial Moisturizer',
    shortName: 'Radiance Facial Moisturizer',
    tagline: 'Your daily bloom of radiance',
    sizes: [{ label: '2 fl oz', price: 34.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Face',
    cardDescription: 'Signature daily moisturizer with 5% Niacinamide, Ceramides, Pearl Powder, and cold-pressed Prickly Pear. Lightweight yet nourishing with a natural luminous finish.',
    heroIngredients: ['Prickly Pear Seed Oil', '5% Niacinamide', 'Ceramides', 'Pearl Powder', 'Centella Asiatica', 'Mango Butter', 'Arrowroot Powder'],
    benefits: ['5% Niacinamide brightens and supports skin barrier', 'Ceramides and plant butters deliver nourishing hydration', 'Centella, Panthenol & Beta-Glucan soothe and calm', 'Pearl Powder for natural luminous finish', 'Arrowroot offers subtle mattifying for balanced wear'],
    bestFor: 'Normal to dry, sensitive, or mature skin.',
    howToUse: 'Apply small amount to clean face and neck morning and/or night. Massage until fully absorbed.',
  },
  {
    id: 8,
    name: 'Bloom 5.5 Radiance Facial Moisturizer Lite',
    shortName: 'Radiance Facial Moisturizer Lite',
    tagline: 'Glow without the weight',
    sizes: [{ label: '2 fl oz', price: 32.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Face',
    cardDescription: 'Feather-light daily moisturizer with 5% Niacinamide, gentle Lactic Acid, and Pearl Powder. Fast-absorbing, non-greasy — perfect under makeup or SPF.',
    heroIngredients: ['Prickly Pear Seed Oil', '5% Niacinamide', 'Lactic Acid', 'Pearl Powder', 'Centella Asiatica', 'Aloe Vera', 'Ceramides'],
    benefits: ['5% Niacinamide promotes brighter-looking skin', 'Gentle Lactic Acid smooths skin texture', 'Lightweight, fast-absorbing texture layers under SPF', 'Pearl Powder for luminous finish', 'Non-comedogenic, ideal under makeup'],
    bestFor: 'Normal, combination, or sensitive skin that prefers a lighter texture.',
    howToUse: 'Apply pea-sized amount to face and neck AM/PM after serums. Absorbs quickly; excellent under makeup or SPF.',
  },
  {
    id: 9,
    name: 'Bloom 5.5 Gentle Radiance Facial Exfoliant',
    shortName: 'Gentle Radiance Facial Exfoliant',
    tagline: 'Polish. Renew. Reveal your glow.',
    sizes: [{ label: '4 fl oz', price: 28.99 }],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Face',
    cardDescription: 'Dual-action weekly exfoliant combining Pearl Powder for gentle physical polish with Lactic and Kojic Acids for chemical renewal. Reveals smoother, brighter, more refined skin.',
    heroIngredients: ['Pearl Powder', 'Lactic Acid', 'Kojic Acid', 'Prickly Pear Seed Oil', 'Centella Asiatica', 'Vitamin C (Stable)', 'Beta-Glucan'],
    benefits: ['Dual gentle exfoliation: physical + chemical', 'Helps smooth skin texture and promote radiance', 'Prickly Pear and stable Vitamin C for antioxidants', 'Centella, Aloe & Beta-Glucan soothe and calm', 'Use 1–3x weekly for visible improvement'],
    bestFor: 'Normal to dry, dull, textured, or mature sensitive skin. Use 1–3 times per week.',
    howToUse: 'After cleansing, apply a thin layer to face and neck. Massage gently for 1–2 minutes. Leave on 5–10 minutes then rinse. Use in the evening. Always apply SPF the following morning.',
  },
  {
    id: 10,
    name: 'Bloom 5.5 Desert Bloom Body Butter',
    shortName: 'Desert Bloom Body Butter',
    tagline: 'Whipped. Lightweight. Desert glow.',
    sizes: [
      { label: '4 fl oz', price: 22.99 },
      { label: '8 fl oz', price: 38.99 },
    ],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Body',
    cardDescription: 'Lightweight whipped body butter with increased Prickly Pear, Hemp Seed Oil, Arrowroot, and Pearl Powder. Deeply nourishes without greasiness — leaving skin soft and glowing.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Mango Butter', 'Hemp Seed Oil', 'Arrowroot Powder', 'Pearl Powder', 'Cocoa Butter'],
    benefits: ['Light whipped texture absorbs fast without grease', 'Prickly Pear provides antioxidant glow', 'Hemp Seed Oil adds essential omegas for barrier support', 'Arrowroot for natural matte, smooth finish', 'Pearl Powder adds subtle healthy luminosity'],
    bestFor: 'Dry, sensitive body skin — especially legs, arms, elbows, and hands.',
    howToUse: 'Apply generously to clean, damp or dry skin. Massage until absorbed. Use daily, especially after showering.',
  },
  {
    id: 11,
    name: 'Bloom 5.5 Prickly Pear Body Butter',
    shortName: 'Prickly Pear Body Butter',
    tagline: 'Deep nourishment, zero weight',
    sizes: [
      { label: '4 fl oz', price: 20.99 },
      { label: '8 fl oz', price: 35.99 },
    ],
    image: `${import.meta.env.BASE_URL}bloom__social_icon_darkbg copy.png`,
    category: 'Body',
    cardDescription: 'Signature lightweight whipped body butter with increased Prickly Pear, Hemp Seed Oil, and Arrowroot. Fast-absorbing, non-greasy, and ideal for everyday use — even in warmer weather.',
    heroIngredients: ['Prickly Pear Seed Oil', 'Shea Butter', 'Mango Butter', 'Hemp Seed Oil', 'Arrowroot Powder', 'Cocoa Butter', 'Vitamin E'],
    benefits: ['Lightweight whipped texture absorbs quickly', 'Prickly Pear for antioxidant protection and natural glow', 'Arrowroot for silky matte, non-greasy finish', 'Deep hydration from rich butters in a lighter form', 'Suitable for everyday body use'],
    bestFor: 'Dry, sensitive body skin. Lighter feel than traditional body butters — great for warmer weather.',
    howToUse: 'Apply generously to clean, damp or dry skin. Massage until absorbed. A little goes a long way due to the concentrated butters and oils.',
  },
];

export const categoryColors: Record<string, { bg: string; text: string }> = {
  Serum:    { bg: '#1e3a20', text: '#d4edcc' },
  Body:     { bg: '#5a3a1e', text: '#f5dfc5' },
  Grooming: { bg: '#2a3a4a', text: '#c5d5e5' },
  Lip:      { bg: '#6b2a35', text: '#f5c5cc' },
  Face:     { bg: '#1e3a35', text: '#c5edea' },
};
