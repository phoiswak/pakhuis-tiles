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
    image: "/images/tile-14.jpg",
    collectionCount: 4,
  },
  {
    slug: "wall-tiles",
    name: "Wall Tiles",
    description: "Bathroom, kitchen and feature-wall tiles with standout finishes.",
    image: "/images/tile-13.jpg",
    collectionCount: 3,
  },
  {
    slug: "outdoor-tiles",
    name: "Outdoor Tiles",
    description: "Slip-resistant patio, pool and garden tiles built for South African weather.",
    image: "/images/tile-12.jpg",
    collectionCount: 3,
  },
  {
    slug: "commercial-tiles",
    name: "Commercial Tiles",
    description: "High-traffic solutions for offices, retail and industrial projects.",
    image: "/images/tile-05.jpg",
    collectionCount: 3,
  },
  {
    slug: "luxury-collections",
    name: "Luxury Collections",
    description: "Marble-look, wood-look and statement tiles for premium interiors.",
    image: "/images/tile-02.jpg",
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
    image: "/images/tile-14.jpg",
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
    image: "/images/tile-13.jpg",
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
    image: "/images/tile-01.jpg",
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
    image: "/images/tile-04.jpg",
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
    image: "/images/tile-03.jpg",
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
    image: "/images/tile-08.jpg",
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
    image: "/images/tile-19.jpg",
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
    image: "/images/tile-06.jpg",
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
    image: "/images/tile-12.jpg",
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
    image: "/images/tile-09.jpg",
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
    image: "/images/tile-37.jpg",
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
    image: "/images/tile-07.jpg",
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
    image: "/images/tile-08.jpg",
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
    image: "/images/tile-02.jpg",
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
    image: "/images/tile-25.jpg",
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
    image: "/images/tile-17.jpg",
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
    image: "/images/tile-11.jpg",
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
    image: "/images/tile-05.jpg",
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
  { title: "Forest Sand", description: "600×1200mm matt porcelain · RG50043", image: "/images/tile-01.jpg" },
  { title: "Calacatta Gold", description: "600×1200mm matt porcelain · RG50030", image: "/images/tile-02.jpg" },
  { title: "Cloud Grey", description: "600×1200mm matt porcelain · RG50002", image: "/images/tile-03.jpg" },
  { title: "Selina Beige", description: "600×1200mm matt porcelain · RG50059", image: "/images/tile-04.jpg" },
  { title: "Rainfall Nero", description: "600×1200mm matt porcelain · RG50007", image: "/images/tile-05.jpg" },
  { title: "Marvel Speckle White", description: "600×1200mm matt porcelain · RG50050", image: "/images/tile-06.jpg" },
  { title: "Veronda Charcoal", description: "600×1200mm matt porcelain · RG50068", image: "/images/tile-07.jpg" },
  { title: "Stone Crete", description: "600×1200mm matt porcelain · RG50027", image: "/images/tile-08.jpg" },
  { title: "Pebble White", description: "600×1200mm matt porcelain · RG50013", image: "/images/tile-09.jpg" },
  { title: "Urban Beach", description: "600×1200mm matt porcelain · RG50045", image: "/images/tile-10.jpg" },
  { title: "Willow Dark Oak", description: "600×1200mm matt porcelain · RG50138", image: "/images/tile-11.jpg" },
  { title: "Karoo Taupe", description: "600×1200mm matt porcelain · RG50122", image: "/images/tile-12.jpg" },
  { title: "Cloud White", description: "600×1200mm matt porcelain · RG50001", image: "/images/tile-13.jpg" },
  { title: "Rainfall Grey", description: "600×1200mm matt porcelain · RG50005", image: "/images/tile-14.jpg" },
  { title: "French Oak", description: "600×1200mm matt porcelain · RC59007", image: "/images/tile-15.jpg" },
  { title: "French Oak Fishbone", description: "600×1200mm matt porcelain · RC59008", image: "/images/tile-16.jpg" },
  { title: "Tundra Stone Ivory", description: "600×1200mm matt porcelain · RG50081", image: "/images/tile-17.jpg" },
  { title: "Shell Dove", description: "600×1200mm matt porcelain · RG50033", image: "/images/tile-18.jpg" },
  { title: "Urban Mocca", description: "600×1200mm matt porcelain · RG50046", image: "/images/tile-19.jpg" },
  { title: "Screed Concreto", description: "600×1200mm matt porcelain · RG50054", image: "/images/tile-20.jpg" },
  { title: "Polaris White", description: "600×1200mm matt porcelain · RG50029", image: "/images/tile-21.jpg" },
  { title: "Glacier White", description: "600×1200mm matt porcelain · RG50031", image: "/images/tile-22.jpg" },
  { title: "Tatum Grey", description: "600×1200mm matt porcelain · RG50035", image: "/images/tile-23.jpg" },
  { title: "Baltic Grey", description: "600×1200mm matt porcelain · RG50051", image: "/images/tile-24.jpg" },
  { title: "Carrara Veil", description: "600×1200mm matt porcelain · RC59003", image: "/images/tile-25.jpg" },
  { title: "Armani Crystal", description: "600×1200mm matt porcelain · RG50020", image: "/images/tile-26.jpg" },
  { title: "Tundra Stone Silver", description: "600×1200mm matt porcelain · RG50082", image: "/images/tile-27.jpg" },
  { title: "Royal Stone Grey", description: "600×1200mm matt porcelain · RG50079", image: "/images/tile-28.jpg" },
  { title: "Royal Stone Charcoal", description: "600×1200mm matt porcelain · RG50080", image: "/images/tile-29.jpg" },
  { title: "Shell Grey", description: "600×1200mm matt porcelain · RG50032", image: "/images/tile-30.jpg" },
  { title: "Misty Bone", description: "600×1200mm matt porcelain · RG50116", image: "/images/tile-31.jpg" },
  { title: "White Marfil", description: "600×1200mm matt porcelain · RG50087", image: "/images/tile-32.jpg" },
  { title: "Monaco Beige", description: "600×1200mm matt porcelain · RG50060", image: "/images/tile-33.jpg" },
  { title: "Monaco Grey", description: "600×1200mm matt porcelain · RG50061", image: "/images/tile-34.jpg" },
  { title: "Armani Platinum", description: "600×1200mm matt porcelain · RG50023", image: "/images/tile-35.jpg" },
  { title: "Armani Silver", description: "600×1200mm matt porcelain · RG50021", image: "/images/tile-36.jpg" },
  { title: "Rocky Dune", description: "600×1200mm matt porcelain · RC59001", image: "/images/tile-37.jpg" },
  { title: "Screed Grey Concerta", description: "600×1200mm matt porcelain · RG50052", image: "/images/tile-38.jpg" },
  { title: "Urban Honey", description: "600×1200mm matt porcelain · RG50048", image: "/images/tile-39.jpg" },
  { title: "Fishbone Oak", description: "600×1200mm matt porcelain · RG50049", image: "/images/tile-40.jpg" },
  { title: "Pebble Super White", description: "600×1200mm matt porcelain · RG50014", image: "/images/tile-41.jpg" },
];

export const blogPosts = [
  {
    slug: "how-many-tiles-do-i-need",
    title: "How many tiles do I need? A simple m² guide",
    excerpt:
      "Measure once, order with the right wastage allowance, and avoid mid-project shortages.",
    image: "/images/tile-35.jpg",
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
    image: "/images/tile-02.jpg",
    content: `Porcelain is denser and less porous than ceramic, so it handles bathrooms, kitchens and outdoor spaces with ease. Ceramic is often more affordable and works beautifully on indoor walls and lower-traffic floors.

If you are unsure, visit our Pretoria East showroom — our consultants will match the right body, finish and size to your project and budget.`,
  },
  {
    slug: "choosing-outdoor-tiles-gauteng",
    title: "Choosing outdoor tiles for Gauteng weather",
    excerpt:
      "Look for textured grip, UV-stable colour and frost resistance for patios and pool surrounds.",
    image: "/images/tile-12.jpg",
    content: `Gauteng summers are harsh on outdoor surfaces. Choose porcelain outdoor tiles with a textured or anti-slip finish (R11 or better for pool edges), and avoid polished surfaces outside.

Our Karoo Sandstone and Lagoon Pool Edge ranges are stocked specifically for local patio and pool projects.`,
  },
];

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    const category = getCategory(product.categorySlug);
    const haystack = [
      product.name,
      product.sku,
      product.description,
      product.sizeMm,
      product.finish,
      product.material,
      product.categorySlug,
      category?.name ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}

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
