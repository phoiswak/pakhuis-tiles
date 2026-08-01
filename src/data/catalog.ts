export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  collectionCount: number;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  sizeMm: string;
  finish: string;
  material: string;
  pricePerM2: number;
  promoPricePerM2?: number;
  stockStatus: StockStatus;
  isFeatured: boolean;
  isSpecial: boolean;
  categorySlug: string;
};

export const SITE = {
  name: "Pakhuis Tiles",
  tagline: "Premium tiles for every floor, wall & outdoor space",
  address: "Plot 10, Garsfontein Road, Pretoria East, Gauteng",
  phone: "+27 12 000 0000",
  phoneHref: "tel:+27120000000",
  email: "sales@pakhuis.co.za",
  hours: "Mon–Fri 08:00–17:00 · Sat 08:00–14:00",
  deliveryAreas: [
    "Pretoria",
    "Johannesburg",
    "Midrand",
    "Centurion",
    "Gauteng Province",
    "Nationwide Delivery",
  ] as const,
};

export const categories: Category[] = [
  {
    slug: "floor-tiles",
    name: "Floor Tiles",
    description: "Durable porcelain and ceramic floors for homes and commercial spaces.",
    image: "/images/porcelain-grey.jpg",
    collectionCount: 4,
  },
  {
    slug: "wall-tiles",
    name: "Wall Tiles",
    description: "Bathroom, kitchen and feature-wall tiles with standout finishes.",
    image: "/images/bathroom-wall.jpg",
    collectionCount: 3,
  },
  {
    slug: "outdoor-tiles",
    name: "Outdoor Tiles",
    description: "Slip-resistant patio, pool and garden tiles built for South African weather.",
    image: "/images/outdoor-patio.jpg",
    collectionCount: 3,
  },
  {
    slug: "commercial-tiles",
    name: "Commercial Tiles",
    description: "High-traffic solutions for offices, retail and industrial projects.",
    image: "/images/industrial.jpg",
    collectionCount: 3,
  },
  {
    slug: "luxury-collections",
    name: "Luxury Collections",
    description: "Marble-look, wood-look and statement tiles for premium interiors.",
    image: "/images/marble-look.jpg",
    collectionCount: 3,
  },
];

export const products: Product[] = [
  {
    slug: "urban-grey-porcelain",
    sku: "PT-FL-001",
    name: "Urban Grey Porcelain",
    description:
      "A versatile large-format porcelain with a refined concrete-look finish. Ideal for open-plan living areas and commercial floors that need a modern, low-maintenance surface.",
    image: "/images/porcelain-grey.jpg",
    sizeMm: "600x1200mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 389,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: false,
    categorySlug: "floor-tiles",
  },
  {
    slug: "classic-white-ceramic",
    sku: "PT-FL-002",
    name: "Classic White Ceramic",
    description:
      "Bright, clean ceramic flooring that opens up smaller rooms. A reliable everyday tile at a sharp monthly special price.",
    image: "/images/ceramic-white.jpg",
    sizeMm: "600x600mm",
    finish: "Gloss",
    material: "Ceramic",
    pricePerM2: 249,
    promoPricePerM2: 199,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: true,
    categorySlug: "floor-tiles",
  },
  {
    slug: "sahara-matt-beige",
    sku: "PT-FL-003",
    name: "Sahara Matt Beige",
    description:
      "Warm beige porcelain with a soft matt surface that hides dust and works beautifully with timber and brass accents.",
    image: "/images/polished-cream.jpg",
    sizeMm: "600x600mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 299,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "floor-tiles",
  },
  {
    slug: "ivory-polished-gloss",
    sku: "PT-FL-004",
    name: "Ivory Polished Gloss",
    description:
      "A luminous ivory porcelain that reflects light and elevates entrance halls, bathrooms and showroom floors.",
    image: "/images/polished-cream.jpg",
    sizeMm: "800x800mm",
    finish: "Polished",
    material: "Porcelain",
    pricePerM2: 459,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: false,
    categorySlug: "floor-tiles",
  },
  {
    slug: "storm-grey-matt",
    sku: "PT-FL-005",
    name: "Storm Grey Matt",
    description:
      "Deep charcoal-grey porcelain for contemporary kitchens and open-plan living. Soft matt grip underfoot.",
    image: "/images/porcelain-grey.jpg",
    sizeMm: "600x600mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 349,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "floor-tiles",
  },
  {
    slug: "sage-subway-bathroom",
    sku: "PT-WL-001",
    name: "Sage Subway Bathroom Tile",
    description:
      "Soft sage subway tiles that bring calm colour to bathrooms and powder rooms without overwhelming the space.",
    image: "/images/bathroom-wall.jpg",
    sizeMm: "75x300mm",
    finish: "Gloss",
    material: "Ceramic",
    pricePerM2: 329,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: false,
    categorySlug: "wall-tiles",
  },
  {
    slug: "terracotta-kitchen-glaze",
    sku: "PT-WL-002",
    name: "Terracotta Kitchen Glaze",
    description:
      "Hand-glaze character in a practical kitchen format. Perfect for splashbacks and feature walls.",
    image: "/images/kitchen-wall.jpg",
    sizeMm: "100x100mm",
    finish: "Gloss",
    material: "Ceramic",
    pricePerM2: 359,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: false,
    categorySlug: "wall-tiles",
  },
  {
    slug: "marrakesh-decor-tile",
    sku: "PT-WL-003",
    name: "Marrakesh Décor Tile",
    description:
      "Patterned décor tiles inspired by North African motifs — use sparingly as a feature or full feature wall.",
    image: "/images/bathroom-wall.jpg",
    sizeMm: "200x200mm",
    finish: "Gloss",
    material: "Ceramic",
    pricePerM2: 489,
    stockStatus: "LOW_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "wall-tiles",
  },
  {
    slug: "karoo-sandstone-patio",
    sku: "PT-OD-001",
    name: "Karoo Sandstone Patio",
    description:
      "Outdoor porcelain with a natural sandstone look and textured grip for patios, walkways and braai areas.",
    image: "/images/outdoor-patio.jpg",
    sizeMm: "600x600mm",
    finish: "Textured",
    material: "Porcelain",
    pricePerM2: 319,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: false,
    categorySlug: "outdoor-tiles",
  },
  {
    slug: "lagoon-pool-edge",
    sku: "PT-OD-002",
    name: "Lagoon Pool Edge",
    description:
      "Slip-resistant pool surround tile in a cool lagoon tone. Built for wet areas and Gauteng sun.",
    image: "/images/outdoor-patio.jpg",
    sizeMm: "300x600mm",
    finish: "Anti-slip",
    material: "Porcelain",
    pricePerM2: 379,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "outdoor-tiles",
  },
  {
    slug: "garden-stone-path",
    sku: "PT-OD-003",
    name: "Garden Stone Path",
    description:
      "Rugged outdoor tile for garden paths and courtyards with a natural stone appearance.",
    image: "/images/outdoor-patio.jpg",
    sizeMm: "400x400mm",
    finish: "Textured",
    material: "Porcelain",
    pricePerM2: 289,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "outdoor-tiles",
  },
  {
    slug: "forge-industrial-charcoal",
    sku: "PT-CM-001",
    name: "Forge Industrial Charcoal",
    description:
      "Heavy-duty charcoal porcelain for warehouses, workshops and high-traffic retail floors.",
    image: "/images/industrial.jpg",
    sizeMm: "600x600mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 279,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "commercial-tiles",
  },
  {
    slug: "metro-office-grey",
    sku: "PT-CM-002",
    name: "Metro Office Grey",
    description:
      "Neutral commercial flooring designed for offices and corridors — durable, quiet and easy to clean.",
    image: "/images/industrial.jpg",
    sizeMm: "600x1200mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 339,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "commercial-tiles",
  },
  {
    slug: "atrium-retail-polish",
    sku: "PT-CM-003",
    name: "Atrium Retail Polish",
    description:
      "Polished commercial porcelain that lifts retail atriums and showroom floors with a high-end sheen.",
    image: "/images/marble-look.jpg",
    sizeMm: "800x800mm",
    finish: "Polished",
    material: "Porcelain",
    pricePerM2: 429,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "commercial-tiles",
  },
  {
    slug: "carrara-marble-look",
    sku: "PT-LX-001",
    name: "Carrara Marble-Look",
    description:
      "Luxury marble-look porcelain with soft grey veining. The showroom favourite for bathrooms and living areas.",
    image: "/images/marble-look.jpg",
    sizeMm: "800x800mm",
    finish: "Polished",
    material: "Porcelain",
    pricePerM2: 549,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: false,
    categorySlug: "luxury-collections",
  },
  {
    slug: "travertine-stone-look",
    sku: "PT-LX-002",
    name: "Travertine Stone-Look",
    description:
      "Soft travertine character without the maintenance of natural stone. Warm and timeless.",
    image: "/images/polished-cream.jpg",
    sizeMm: "600x1200mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 519,
    stockStatus: "IN_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "luxury-collections",
  },
  {
    slug: "oakland-wood-plank",
    sku: "PT-LX-003",
    name: "Oakland Wood Plank",
    description:
      "Wood-look porcelain planks with authentic grain. Perfect where timber won’t survive wet areas or pets.",
    image: "/images/wood-look.jpg",
    sizeMm: "200x1200mm",
    finish: "Matt",
    material: "Porcelain",
    pricePerM2: 419,
    promoPricePerM2: 359,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isSpecial: true,
    categorySlug: "luxury-collections",
  },
  {
    slug: "noir-marble-statement",
    sku: "PT-LX-004",
    name: "Noir Marble Statement",
    description:
      "Dramatic black marble-look porcelain for bold feature floors and walls in luxury homes.",
    image: "/images/marble-look.jpg",
    sizeMm: "800x800mm",
    finish: "Polished",
    material: "Porcelain",
    pricePerM2: 629,
    stockStatus: "LOW_STOCK",
    isFeatured: false,
    isSpecial: false,
    categorySlug: "luxury-collections",
  },
];

export const testimonials = [
  {
    quote:
      "Pakhuis Tiles helped us tile our whole house. The quotation was quick, the advice was honest, and the prices beat every other supplier we tried.",
    name: "Annelie van der Merwe",
    place: "Pretoria East",
  },
  {
    quote:
      "Excellent service from start to finish. They calculated exactly how many tiles we needed and delivered the next day.",
    name: "Sipho Ndlovu",
    place: "Centurion",
  },
  {
    quote:
      "As a contractor, I order from Pakhuis Tiles weekly. Their stock availability and turnaround on quotes keeps my projects on schedule.",
    name: "Marius Botha",
    place: "Midrand",
  },
  {
    quote:
      "The showroom is beautiful and the team really knows their products. Our bathroom looks like a magazine spread!",
    name: "Lerato Mokoena",
    place: "Johannesburg",
  },
];

export const galleryItems = [
  {
    title: "Pretoria East family home",
    description: "Full-house porcelain floors in Urban Grey.",
    image: "/images/porcelain-grey.jpg",
    location: "Garsfontein",
  },
  {
    title: "Sage bathroom refresh",
    description: "Subway walls with Ivory polished floors.",
    image: "/images/bathroom-wall.jpg",
    location: "Centurion",
  },
  {
    title: "Karoo patio & braai",
    description: "Outdoor sandstone-look with anti-slip finish.",
    image: "/images/outdoor-patio.jpg",
    location: "Midrand",
  },
  {
    title: "Retail showroom atrium",
    description: "Commercial polished porcelain for high traffic.",
    image: "/images/industrial.jpg",
    location: "Johannesburg",
  },
  {
    title: "Carrara ensuite",
    description: "Marble-look luxury suite for a new build.",
    image: "/images/marble-look.jpg",
    location: "Waterkloof",
  },
  {
    title: "Oakland open-plan living",
    description: "Wood-look planks through kitchen and lounge.",
    image: "/images/wood-look.jpg",
    location: "Menlyn",
  },
];

export const blogPosts = [
  {
    slug: "how-many-tiles-do-i-need",
    title: "How many tiles do I need? A simple m² guide",
    excerpt:
      "Measure once, order with the right wastage allowance, and avoid mid-project shortages.",
    image: "/images/hero-showroom.jpg",
    content: `Measuring for tiles is straightforward once you know the formula.

1. Measure the length and width of each room in metres.
2. Multiply length × width to get square metres.
3. Add 10% for cuts and breakages (15% for diagonal or herringbone layouts).
4. Round up to full boxes based on the tile's coverage per box.

Use our free Tile Calculator to do the maths in seconds, then request a quote with those quantities attached.`,
  },
  {
    slug: "porcelain-vs-ceramic",
    title: "Porcelain vs ceramic: which tile is right for you?",
    excerpt:
      "Porcelain wins for wet areas and outdoors. Ceramic shines on walls and lighter-traffic floors.",
    image: "/images/porcelain-grey.jpg",
    content: `Porcelain is denser and less porous than ceramic, so it handles bathrooms, kitchens and outdoor spaces with ease. Ceramic is often more affordable and works beautifully on indoor walls and lower-traffic floors.

If you are unsure, visit our Pretoria East showroom — our consultants will match the right body, finish and size to your project and budget.`,
  },
  {
    slug: "choosing-outdoor-tiles-gauteng",
    title: "Choosing outdoor tiles for Gauteng weather",
    excerpt:
      "Look for textured grip, UV-stable colour and frost resistance for patios and pool surrounds.",
    image: "/images/outdoor-patio.jpg",
    content: `Gauteng summers are harsh on outdoor surfaces. Choose porcelain outdoor tiles with a textured or anti-slip finish (R11 or better for pool edges), and avoid polished surfaces outside.

Our Karoo Sandstone and Lagoon Pool Edge ranges are stocked specifically for local patio and pool projects.`,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.categorySlug === slug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

export function getSpecials() {
  return products.filter((p) => p.isSpecial || p.promoPricePerM2 != null);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function effectivePrice(product: Product) {
  return product.promoPricePerM2 ?? product.pricePerM2;
}
