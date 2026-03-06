const COLORS = ["#8b5cf6", "#d946ef", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export interface TemplateItem {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  imageQuery: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
}

const CATEGORIES: Record<string, string[]> = {
  Restaurants: ["Pizza", "Burger", "Cafe", "Sushi", "Bakery", "Steakhouse"],
  Beauty: ["Hair Salon", "Beauty Salon", "Nail Salon", "Spa", "Barber"],
  Health: ["Dentist", "Clinic", "Doctor", "Pharmacy", "Physiotherapy"],
  Business: ["Law Firm", "Consulting", "Accounting", "Marketing Agency", "Startup"],
  Services: ["Construction", "Car Wash", "Cleaning", "Moving", "Repair"],
  "Real Estate": ["Realtor", "Property Agency", "Rental"],
  Fitness: ["Gym", "Personal Trainer", "Yoga Studio", "Crossfit"],
  Events: ["Wedding", "Photographer", "Event Planner"],
  Online: ["Online Store", "Course Website", "SaaS Landing Page"],
};

/** Unique Unsplash photo IDs per subcategory (4 per subcategory for variants) */
const UNSPLASH_PHOTOS: Record<string, string[]> = {
  Pizza: ["1513104890138-7c749659a591", "1565299624946-b28f40a0ae38", "1555396273-367ea4eb4db5", "1517248135467-4c7edcad34c4"],
  Burger: ["1568901346375-23c9450c58cd", "1553979454-d9f441f5371c", "1565299624946-b28f40a0ae38", "1513104890138-7c749659a591"],
  Cafe: ["1495474472287-4d71bcdd2085", "1501339847302-ac426a4a7cbb", "1495474472287-4d71bcdd2085", "1501339847302-ac426a4a7cbb"],
  Sushi: ["1579871494447-9811df80d66c", "1553621042-dcdf7290f838", "1565299624946-b28f40a0ae38", "1517248135467-4c7edcad34c4"],
  Bakery: ["1509440159596-0249088772ff", "1555507036-ab1f4038808a", "1509440159596-0249088772ff", "1555507036-ab1f4038808a"],
  Steakhouse: ["1558030006-4505e387e479", "1544025162-d76694265947", "1555396273-367ea4eb4db5", "1517248135467-4c7edcad34c4"],
  "Hair Salon": ["1560066984-138dadb4c035", "1522337360788-8b13dee7a37e", "1604654894610-df63cfec228d", "1585747860715-2ba2906ecd72"],
  "Beauty Salon": ["1604654894610-df63cfec228d", "1522337360788-8b13dee7a37e", "1560066984-138dadb4c035", "1544161512-82a84a648df3"],
  "Nail Salon": ["1585747860715-2ba2906ecd72", "1604654894610-df63cfec228d", "1522337360788-8b13dee7a37e", "1560066984-138dadb4c035"],
  Spa: ["1544161512-82a84a648df3", "1540555700478-4be29c2c77e0", "1544161512-82a84a648df3", "1540555700478-4be29c2c77e0"],
  Barber: ["1599351431202-1e0f0137899a", "1585747860715-2ba2906ecd72", "1560066984-138dadb4c035", "1522337360788-8b13dee7a37e"],
  Dentist: ["1629909613654-28e377c37b09", "1579684385127-4eb5b5ca42ea", "1559839734-2b71ea197ec2", "1587854692152-cbe660dbde88"],
  Clinic: ["1579684385127-4eb5b5ca42ea", "1559839734-2b71ea197ec2", "1629909613654-28e377c37b09", "1576091160550-2173dba999ef"],
  Doctor: ["1559839734-2b71ea197ec2", "1576091160550-2173dba999ef", "1579684385127-4eb5b5ca42ea", "1587854692152-cbe660dbde88"],
  Pharmacy: ["1587854692152-cbe660dbde88", "1559839734-2b71ea197ec2", "1629909613654-28e377c37b09", "1579684385127-4eb5b5ca42ea"],
  Physiotherapy: ["1576091160550-2173dba999ef", "1579684385127-4eb5b5ca42ea", "1559839734-2b71ea197ec2", "1629909613654-28e377c37b09"],
  "Law Firm": ["1589829545856-d10d557cf95f", "1552664730-d307ca884321", "1554224311-bf64fc8f64b4", "1497366216548-37526070297c"],
  Consulting: ["1552664730-d307ca884321", "1554224311-bf64fc8f64b4", "1589829545856-d10d557cf95f", "1557804506-72a10a27c16a"],
  Accounting: ["1554224311-bf64fc8f64b4", "1497366216548-37526070297c", "1552664730-d307ca884321", "1589829545856-d10d557cf95f"],
  "Marketing Agency": ["1557804506-72a10a27c16a", "1497366216548-37526070297c", "1554224311-bf64fc8f64b4", "1552664730-d307ca884321"],
  Startup: ["1497366216548-37526070297c", "1557804506-72a10a27c16a", "1554224311-bf64fc8f64b4", "1589829545856-d10d557cf95f"],
  Construction: ["1504307651254-35680f356dfd", "1503388748771-0a7f38f4c38f", "1504911539028-03348a060cea", "1513467535981-fd5190f5b5b5"],
  "Car Wash": ["1607860108855-64acf2078ed9", "1486262715619-67b85e0b08d3", "1600585154340-beef1a7a4dfa", "1551836022-d5d88e9218df"],
  Cleaning: ["1581578731548-c64695cc6952", "1600585154340-beef1a7a4dfa", "1504307651254-35680f356dfd", "1607860108855-64acf2078ed9"],
  Moving: ["1600585154340-beef1a7a4dfa", "1504307651254-35680f356dfd", "1581578731548-c64695cc6952", "1503388748771-0a7f38f4c38f"],
  Repair: ["1504307651254-35680f356dfd", "1581092160563-2d5b2b2b2b2b", "1600585154340-beef1a7a4dfa", "1503388748771-0a7f38f4c38f"],
  Realtor: ["1560518883-ce09059eeffa", "1600566753190-17f0baa2a6c3", "1600585154340-beef1a7a4dfa", "1560518883-ce09059eeffa"],
  "Property Agency": ["1600566753190-17f0baa2a6c3", "1560518883-ce09059eeffa", "1600566753190-17f0baa2a6c3", "1560518883-ce09059eeffa"],
  Rental: ["1600566753190-17f0baa2a6c3", "1560518883-ce09059eeffa", "1560518883-ce09059eeffa", "1600566753190-17f0baa2a6c3"],
  Gym: ["1534438327276-14e5300c3a48", "1571019613454-1cb2f99b2d8b", "1544367567-0f2fcb009e0b", "1517836357043-004497bf074a"],
  "Personal Trainer": ["1571019613454-1cb2f99b2d8b", "1544367567-0f2fcb009e0b", "1534438327276-14e5300c3a48", "1517836357043-004497bf074a"],
  "Yoga Studio": ["1544367567-0f2fcb009e0b", "1517836357043-004497bf074a", "1571019613454-1cb2f99b2d8b", "1534438327276-14e5300c3a48"],
  Crossfit: ["1517836357043-004497bf074a", "1534438327276-14e5300c3a48", "1544367567-0f2fcb009e0b", "1571019613454-1cb2f99b2d8b"],
  Wedding: ["1519741497674-611481863552", "1465494676196-af5eddf8eb8c", "1516035069371-29a1b244cc32", "1540575467063-499bf5ba2e27"],
  Photographer: ["1516035069371-29a1b244cc32", "1542038788-4028e44ebd3b", "1519741497674-611481863552", "1465494676196-af5eddf8eb8c"],
  "Event Planner": ["1540575467063-499bf5ba2e27", "1519741497674-611481863552", "1516035069371-29a1b244cc32", "1542038788-4028e44ebd3b"],
  "Online Store": ["1556742049-2cf7163dcf1d", "1497366216548-37526070297c", "1516321318423-f06f85e504b3", "1460925895907-af938abdeb43"],
  "Course Website": ["1516321318423-f06f85e504b3", "1460925895907-af938abdeb43", "1556742049-2cf7163dcf1d", "1497366216548-37526070297c"],
  "SaaS Landing Page": ["1460925895907-af938abdeb43", "1556742049-2cf7163dcf1d", "1516321318423-f06f85e504b3", "1556742049-2cf7163dcf1d"],
};

const FALLBACK_PHOTO = "1517248135467-4c7edcad34c4";

export function getTemplateImageUrl(t: TemplateItem): string {
  const photos = UNSPLASH_PHOTOS[t.subcategory];
  const match = t.id.match(/_(\d+)$/);
  const variantIndex = match ? Math.min(parseInt(match[1], 10) - 1, 3) : 0;
  const photoId = photos?.[variantIndex] ?? photos?.[0] ?? FALLBACK_PHOTO;
  return `https://images.unsplash.com/photo-${photoId}?w=600&q=85`;
}

/** Fallback image when Unsplash fails to load */
export const TEMPLATE_FALLBACK_IMAGE = `https://images.unsplash.com/photo-${FALLBACK_PHOTO}?w=600&q=85`;

const IMAGE_QUERIES: Record<string, string> = {
  Pizza: "pizza restaurant interior",
  Burger: "burger restaurant food",
  Cafe: "coffee shop interior",
  Sushi: "sushi restaurant",
  Bakery: "bakery bread",
  Steakhouse: "steakhouse dining",
  "Hair Salon": "hair salon interior",
  "Beauty Salon": "beauty salon interior",
  "Nail Salon": "nail salon interior",
  Spa: "spa wellness interior",
  Barber: "barber shop interior",
  Dentist: "dental clinic interior",
  Clinic: "medical clinic interior",
  Doctor: "doctor office",
  Pharmacy: "pharmacy interior",
  Physiotherapy: "physiotherapy clinic",
  "Law Firm": "law office interior",
  Consulting: "consulting office",
  Accounting: "accounting office",
  "Marketing Agency": "marketing agency office",
  Startup: "startup office",
  Construction: "construction site",
  "Car Wash": "car wash service",
  Cleaning: "cleaning service",
  Moving: "moving company",
  Repair: "repair shop",
  Realtor: "real estate house",
  "Property Agency": "property real estate",
  Rental: "apartment rental",
  Gym: "fitness gym equipment",
  "Personal Trainer": "personal trainer fitness",
  "Yoga Studio": "yoga studio",
  Crossfit: "crossfit gym",
  Wedding: "wedding celebration",
  Photographer: "photography studio",
  "Event Planner": "event planning",
  "Online Store": "online shopping",
  "Course Website": "online course",
  "SaaS Landing Page": "saas software",
};

function generateTemplates(): TemplateItem[] {
  const templates: TemplateItem[] = [];
  let idx = 0;

  for (const [category, subcategories] of Object.entries(CATEGORIES)) {
    for (const sub of subcategories) {
      const queries = IMAGE_QUERIES[sub] || sub.toLowerCase();
      for (let v = 0; v < 4; v++) {
        const id = `${category.toLowerCase().replace(/\s/g, "_")}_${sub.toLowerCase().replace(/\s/g, "_")}_${v + 1}`;
        templates.push({
          id,
          category,
          subcategory: sub,
          name: v === 0 ? sub : `${sub} (Style ${v + 1})`,
          imageQuery: queries,
          primaryColor: COLORS[idx % COLORS.length],
          heroTitle: `Welcome to ${sub}`,
          heroSubtitle: v === 0 ? `Quality ${sub} services` : `Your trusted ${sub}`,
        });
        idx++;
      }
    }
  }

  return templates;
}

export const TEMPLATES = generateTemplates();

export function getTemplatesByCategory(category: string) {
  return TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateById(id: string) {
  return TEMPLATES.find((t) => t.id === id);
}

export function getFeaturedTemplates(count = 6) {
  const featured = ["Pizza", "Hair Salon", "Dentist", "Gym", "Law Firm", "Realtor"];
  return TEMPLATES.filter((t) => featured.includes(t.subcategory) && t.id.endsWith("_1")).slice(0, count);
}

export function getCategories() {
  return Object.keys(CATEGORIES);
}
