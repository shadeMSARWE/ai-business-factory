export const BUSINESS_TYPES = [
  "restaurant",
  "dentist",
  "salon",
  "car_wash",
  "real_estate",
  "construction",
  "law_firm",
  "gym",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

const KEYWORDS: Record<BusinessType, string[]> = {
  restaurant: ["restaurant", "pizza", "cafe", "coffee", "bar", "bistro", "dining", "food", "kitchen"],
  dentist: ["dentist", "dental", "teeth", "orthodontist", "oral"],
  salon: ["salon", "hair", "barber", "beauty", "spa", "nails", "stylist"],
  car_wash: ["car wash", "carwash", "auto", "detailing", "vehicle"],
  real_estate: ["real estate", "realtor", "property", "housing", "apartment", "house"],
  construction: ["construction", "contractor", "building", "renovation", "remodel"],
  law_firm: ["law", "lawyer", "attorney", "legal", "firm"],
  gym: ["gym", "fitness", "workout", "training", "exercise"],
};

export function detectBusinessType(prompt: string): BusinessType {
  const lower = prompt.toLowerCase();
  let bestMatch: BusinessType = "restaurant";
  let maxScore = 0;

  for (const [type, words] of Object.entries(KEYWORDS)) {
    const score = words.filter((w) => lower.includes(w)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = type as BusinessType;
    }
  }

  return bestMatch;
}

export type SectionType = "menu" | "reservation" | "practice_areas" | "case_studies" | "services_grid" | "appointment" | "membership" | "class_schedule" | "default";

export const TEMPLATE_DEFAULTS: Record<
  BusinessType,
  {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    services: { title: string; description: string }[];
    testimonials: { name: string; text: string; role: string }[];
    extraSections?: { type: SectionType; title: string }[];
  }
> = {
  restaurant: {
    heroTitle: "Welcome to Our Restaurant",
    heroSubtitle: "Fresh ingredients, authentic flavors, unforgettable dining",
    aboutTitle: "Our Story",
    services: [
      { title: "Dine In", description: "Experience our cozy atmosphere and full menu." },
      { title: "Takeout", description: "Order your favorites to go." },
      { title: "Catering", description: "Perfect for events and celebrations." },
    ],
    testimonials: [
      { name: "Sarah M.", text: "Best food in town! The pasta was incredible.", role: "Regular" },
      { name: "Mike D.", text: "Great atmosphere and friendly staff.", role: "Customer" },
    ],
    extraSections: [
      { type: "menu", title: "Our Menu" },
      { type: "reservation", title: "Reserve a Table" },
    ],
  },
  dentist: {
    heroTitle: "Your Smile, Our Priority",
    heroSubtitle: "Professional dental care for the whole family",
    aboutTitle: "About Our Practice",
    services: [
      { title: "General Dentistry", description: "Checkups, cleanings, and preventive care." },
      { title: "Cosmetic Dentistry", description: "Whitening, veneers, and smile makeovers." },
      { title: "Emergency Care", description: "Same-day appointments when you need us." },
    ],
    testimonials: [
      { name: "Lisa K.", text: "Finally found a dentist I trust. Highly recommend!", role: "Patient" },
      { name: "John P.", text: "Painless and professional. Great experience.", role: "Patient" },
    ],
    extraSections: [
      { type: "services_grid", title: "Our Services" },
      { type: "appointment", title: "Book an Appointment" },
    ],
  },
  salon: {
    heroTitle: "Look Your Best",
    heroSubtitle: "Expert cuts, styling, and beauty services",
    aboutTitle: "Our Salon",
    services: [
      { title: "Haircuts", description: "Precision cuts for every style." },
      { title: "Styling", description: "Special occasions and everyday looks." },
      { title: "Color", description: "Highlights, balayage, and full color." },
    ],
    testimonials: [
      { name: "Emma R.", text: "Love my new cut! Will definitely be back.", role: "Client" },
      { name: "Jessica L.", text: "Best colorist in the city. Amazing results.", role: "Client" },
    ],
  },
  car_wash: {
    heroTitle: "Sparkle & Shine",
    heroSubtitle: "Professional car wash and detailing services",
    aboutTitle: "About Us",
    services: [
      { title: "Exterior Wash", description: "Quick and thorough exterior cleaning." },
      { title: "Interior Detail", description: "Deep clean and vacuum." },
      { title: "Full Detail", description: "Complete inside and out care." },
    ],
    testimonials: [
      { name: "Tom B.", text: "My car has never looked better. Fast service!", role: "Customer" },
      { name: "Chris M.", text: "Professional and affordable. Highly recommend.", role: "Customer" },
    ],
  },
  real_estate: {
    heroTitle: "Find Your Dream Home",
    heroSubtitle: "Expert guidance for buyers and sellers",
    aboutTitle: "About Our Agency",
    services: [
      { title: "Buy", description: "Find your perfect property with our expert guidance." },
      { title: "Sell", description: "We'll get you the best price for your home." },
      { title: "Rent", description: "Quality rental properties and management." },
    ],
    testimonials: [
      { name: "David S.", text: "Found our dream home in record time. Thank you!", role: "Buyer" },
      { name: "Rachel T.", text: "Sold our house above asking. Professional and responsive.", role: "Seller" },
    ],
  },
  construction: {
    heroTitle: "Building Quality, Building Trust",
    heroSubtitle: "Licensed contractors for residential and commercial",
    aboutTitle: "Our Company",
    services: [
      { title: "New Construction", description: "From foundation to finish." },
      { title: "Renovations", description: "Kitchens, bathrooms, and more." },
      { title: "Repairs", description: "Quick and reliable fix solutions." },
    ],
    testimonials: [
      { name: "James W.", text: "Professional work, on time and on budget.", role: "Client" },
      { name: "Maria G.", text: "Transformed our kitchen. Exceeded expectations.", role: "Client" },
    ],
  },
  law_firm: {
    heroTitle: "Expert Legal Representation",
    heroSubtitle: "Dedicated to protecting your rights and interests",
    aboutTitle: "Our Firm",
    services: [
      { title: "Personal Injury", description: "Compensation for your injuries." },
      { title: "Family Law", description: "Divorce, custody, and support." },
      { title: "Business Law", description: "Contracts and corporate matters." },
    ],
    testimonials: [
      { name: "Robert H.", text: "Got the settlement I deserved. Professional and caring.", role: "Client" },
      { name: "Susan K.", text: "Navigated my divorce with compassion. Highly recommend.", role: "Client" },
    ],
    extraSections: [
      { type: "practice_areas", title: "Practice Areas" },
      { type: "case_studies", title: "Case Studies" },
    ],
  },
  gym: {
    heroTitle: "Transform Your Body",
    heroSubtitle: "State-of-the-art fitness for all levels",
    aboutTitle: "Our Facility",
    services: [
      { title: "Strength Training", description: "Free weights and machines." },
      { title: "Cardio", description: "Treadmills, bikes, and more." },
      { title: "Classes", description: "Yoga, spin, and group fitness." },
    ],
    testimonials: [
      { name: "Alex F.", text: "Best gym in town. Clean and motivating atmosphere.", role: "Member" },
      { name: "Nina P.", text: "Lost 20 lbs in 3 months. Incredible results!", role: "Member" },
    ],
    extraSections: [
      { type: "membership", title: "Membership Plans" },
      { type: "class_schedule", title: "Class Schedule" },
    ],
  },
};
