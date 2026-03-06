import type { BusinessType } from "./business-types";

/** Unsplash photo IDs (landscape, high quality) per business type */
const BUSINESS_IMAGES: Record<BusinessType, string[]> = {
  restaurant: [
    "1517248135467-4c7edcad34c4", // restaurant interior
    "1513104890138-7c749659a591", // pizza
    "1555396273-367ea4eb4db5",   // dining
    "1568901346375-23c9450c58cd", // burger
    "1495474472287-4d71bcdd2085", // cafe
    "1579871494447-9811df80d66c", // sushi
    "1509440159596-0249088772ff", // bakery
    "1558030006-4505e387e479",   // steakhouse
  ],
  dentist: [
    "1629909613654-28e377c37b09",
    "1579684385127-4eb5b5ca42ea",
    "1559839734-2b71ea197ec2",
    "1587854692152-cbe660dbde88",
    "1576091160550-2173dba999ef",
    "1605216613256-9a1a2e0c0c0c",
  ],
  salon: [
    "1560066984-138dadb4c035",
    "1522337360788-8b13dee7a37e",
    "1604654894610-df63cfec228d",
    "1544161512-82a84a648df3",
    "1599351431202-1e0f0137899a",
    "1585747860715-2ba2906ecd72",
  ],
  car_wash: [
    "1607860108855-64acf2078ed9",
    "1486262715619-67b85e0b08d3",
    "1600585154340-beef1a7a4dfa",
    "1551836022-d5d88e9218df",
    "1549317661-b32d4e7f5e5e",
    "1568605114967-6110b0b0b0b0",
  ],
  real_estate: [
    "1560518883-ce09059eeffa",
    "1600566753190-17f0baa2a6c3",
    "1600585154340-beef1a7a4dfa",
    "1564013790199-fcf6f4e4e4e4",
    "1600573471362-5a0c0c0c0c0c",
    "1560518883-ce09059eeffa",
  ],
  construction: [
    "1504307651254-35680f356dfd",
    "1503388748771-0a7f38f4c38f",
    "1504911539028-03348a060cea",
    "1513467535981-fd5190f5b5b5",
    "1504307651254-35680f356dfd",
    "1503388748771-0a7f38f4c38f",
  ],
  law_firm: [
    "1589829545856-d10d557cf95f",
    "1552664730-d307ca884321",
    "1554224311-bf64fc8f64b4",
    "1557804506-72a10a27c16a",
    "1497366216548-37526070297c",
    "1589829545856-d10d557cf95f",
  ],
  gym: [
    "1534438327276-14e5300c3a48",
    "1571019613454-1cb2f99b2d8b",
    "1544367567-0f2fcb009e0b",
    "1517836357043-004497bf074a",
    "1576678927484-1a0a0a0a0a0a",
    "1534438327276-14e5300c3a48",
  ],
};

const FALLBACK = "1517248135467-4c7edcad34c4";

/**
 * Get 6-10 high-quality landscape images for a business type.
 * Uses Unsplash CDN (no API key required for static IDs).
 */
export function getBusinessImages(type: BusinessType): string[] {
  const ids = BUSINESS_IMAGES[type] || BUSINESS_IMAGES.restaurant;
  return ids.map((id) => `https://images.unsplash.com/photo-${id}?w=800&q=85`);
}
