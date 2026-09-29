import type { TemplateId } from "@/templates/types";

/**
 * Industry knowledge per niche: realistic naming, services, and the kind of
 * things customers actually say. Used by the mock Places provider, by the
 * offline copywriter, and to recommend a template family.
 */
export interface NicheProfile {
  key: string;
  category: string;
  aliases: string[];
  recommendedTemplate: TemplateId;
  nameStems: string[];
  nameSuffixes: string[];
  services: { name: string; description: string }[];
  /** The one thing people come for — the Legacy template's "hero product". */
  signature: { name: string; description: string };
  trustPoints: { title: string; detail: string }[];
  reviewTemplates: string[];
  hours: string;
  ctaVerb: string;
}

export const NICHES: NicheProfile[] = [
  {
    key: "plumber",
    category: "Plumber",
    aliases: ["plumbers", "plumbing", "drain", "water heater"],
    recommendedTemplate: "modern",
    nameStems: ["Reliable", "Keystone", "Clearwater", "Summit", "Hanley", "Brennan", "True Flow", "Northside"],
    nameSuffixes: ["Plumbing", "Plumbing & Drain", "Plumbing Co.", "Plumbing Services"],
    services: [
      { name: "Emergency repairs", description: "Burst pipes, major leaks and no-water calls handled the same day." },
      { name: "Drain cleaning", description: "Kitchen, bath and main-line clogs cleared properly, not just pushed further down." },
      { name: "Water heaters", description: "Tank and tankless installs, flushes and repairs with honest replace-or-repair advice." },
      { name: "Fixture installs", description: "Faucets, toilets, disposals and shut-off valves fitted cleanly and tested." },
    ],
    signature: { name: "Same-day leak repair", description: "Most leaks found and fixed on the first visit." },
    trustPoints: [
      { title: "Licensed & insured", detail: "Fully licensed, bonded and insured on every job." },
      { title: "Upfront, flat-rate pricing", detail: "You approve the price before any work starts." },
      { title: "Same-day appointments", detail: "Call before noon and we'll usually be there today." },
    ],
    reviewTemplates: [
      "{first} came out the same afternoon and fixed our leaking water heater. Explained everything and the price was exactly what was quoted.",
      "Called at 7am with a burst pipe and they were here within the hour. Clean, fast, and genuinely nice people.",
      "Honest plumber — told us we didn't need a new unit, just a part. Saved us hundreds.",
      "Cleared a main line clog two other companies couldn't. Showed us the camera footage too.",
    ],
    hours: "Mon–Sat 7am–7pm · 24/7 emergency line",
    ctaVerb: "Book a plumber",
  },
  {
    key: "electrician",
    category: "Electrician",
    aliases: ["electricians", "electrical", "electric"],
    recommendedTemplate: "modern",
    nameStems: ["Bright Line", "Volt", "Current", "Ironwood", "Mercer", "Signal", "Patel"],
    nameSuffixes: ["Electric", "Electrical", "Electrical Services"],
    services: [
      { name: "Panel upgrades", description: "Safe, code-compliant panel replacements sized for how you actually use power." },
      { name: "Lighting", description: "Recessed, under-cabinet and outdoor lighting planned and installed." },
      { name: "EV chargers", description: "Level 2 charger installs with permits handled for you." },
      { name: "Troubleshooting", description: "Tripping breakers, dead outlets and flickering lights traced to the source." },
    ],
    signature: { name: "Panel upgrades", description: "Modern, safe power for older homes." },
    trustPoints: [
      { title: "Licensed master electrician", detail: "Every job overseen by a licensed master electrician." },
      { title: "Permits handled", detail: "We pull the permits and book the inspection." },
      { title: "Clean, respectful crews", detail: "Shoe covers on, dust sheets down, tidy when we leave." },
    ],
    reviewTemplates: [
      "{first} rewired half our kitchen and left it cleaner than they found it. Passed inspection first time.",
      "Quick response for a breaker that kept tripping. Found the real issue in 20 minutes.",
      "Installed our EV charger and walked us through everything. Fair price, great work.",
    ],
    hours: "Mon–Fri 7:30am–6pm",
    ctaVerb: "Get a quote",
  },
  {
    key: "restaurant",
    category: "Restaurant",
    aliases: ["restaurants", "diner", "bistro", "eatery", "trattoria", "grill"],
    recommendedTemplate: "legacy",
    nameStems: ["Rosa's", "The Old Mill", "Marchetti's", "Golden Lantern", "Sal & Nina's", "The Corner Table", "Hadley's"],
    nameSuffixes: ["Kitchen", "Trattoria", "Restaurant", "Family Restaurant", "Grill"],
    services: [
      { name: "Dinner service", description: "A menu built on recipes that haven't changed because they didn't need to." },
      { name: "Private dining", description: "The back room seats up to 30 for birthdays, rehearsals and long lunches." },
      { name: "Catering", description: "Family-style trays of the dishes regulars order most, ready to collect." },
      { name: "Takeaway", description: "Call ahead and it's hot and packed when you walk in." },
    ],
    signature: { name: "The house lasagna", description: "Twelve layers, slow-baked every morning, the same way since day one." },
    trustPoints: [
      { title: "Family owned", detail: "Still run by the family that started it." },
      { title: "Made from scratch daily", detail: "Sauces, pasta and bread made in-house every morning." },
      { title: "A neighbourhood fixture", detail: "The place locals bring visiting family." },
    ],
    reviewTemplates: [
      "We've been coming here for twenty years. The lasagna is still the best thing in town and {first} still remembers our order.",
      "Tastes like someone's grandmother made it — because she did. Warm, generous, never rushed.",
      "Hosted my dad's 70th in the back room. Food was incredible and the staff made it feel like family.",
      "No frills, just honest food done perfectly. Portions are enormous.",
    ],
    hours: "Tue–Sun 5pm–10pm · Sat & Sun lunch from noon",
    ctaVerb: "Reserve a table",
  },
  {
    key: "cafe",
    category: "Café",
    aliases: ["cafe", "cafes", "coffee", "coffee shop", "espresso", "café"],
    recommendedTemplate: "bold",
    nameStems: ["Common", "Little Owl", "Field", "Ritual", "Oddly", "Paper Moon", "Slow"],
    nameSuffixes: ["Coffee", "Café", "Coffee House", "Espresso Bar"],
    services: [
      { name: "Espresso bar", description: "A rotating single-origin alongside a house blend we've dialled in for milk." },
      { name: "Kitchen", description: "Toasts, bowls and pastries baked in small batches through the morning." },
      { name: "Beans to go", description: "Freshly roasted bags ground to order for whatever you brew with at home." },
      { name: "Space to stay", description: "Big tables, good light, reliable Wi-Fi and no one rushing you out." },
    ],
    signature: { name: "The house cortado", description: "Balanced, sweet and the reason people come back." },
    trustPoints: [
      { title: "Roasted locally", detail: "Beans roasted a few miles away, a few days ago." },
      { title: "Pastries baked in-house", detail: "Out of the oven every morning from 6am." },
      { title: "Laptop friendly", detail: "Plenty of outlets, fast Wi-Fi and no time limits." },
    ],
    reviewTemplates: [
      "Best flat white in the neighbourhood, and {first} behind the bar actually cares about getting it right.",
      "My favourite place to work in the mornings. Great light, great music, better coffee.",
      "The almond croissant alone is worth the trip. Gets busy on weekends for good reason.",
    ],
    hours: "Daily 7am–4pm",
    ctaVerb: "Visit us",
  },
  {
    key: "bakery",
    category: "Bakery",
    aliases: ["bakeries", "bakery", "patisserie", "bread", "cakes"],
    recommendedTemplate: "legacy",
    nameStems: ["Hearth", "Mother's", "Kowalski's", "Sunrise", "Flour & Stone", "Aunt Bea's"],
    nameSuffixes: ["Bakery", "Bakehouse", "Bake Shop", "Patisserie"],
    services: [
      { name: "Daily bread", description: "Sourdough, rye and challah baked before dawn and gone by mid-afternoon." },
      { name: "Celebration cakes", description: "Custom cakes for birthdays and weddings, ordered a week ahead." },
      { name: "Pastries", description: "Laminated by hand — croissants, danishes and the Saturday specials." },
      { name: "Wholesale", description: "Supplying local cafés and restaurants with bread every morning." },
    ],
    signature: { name: "Country sourdough", description: "A 36-hour ferment from a starter older than most of our customers." },
    trustPoints: [
      { title: "Baked fresh every morning", detail: "Ovens on at 3am so the shelves are full by opening." },
      { title: "Family recipes", detail: "Recipes handed down, not looked up." },
      { title: "Local flour", detail: "Milled by a regional farm we've worked with for years." },
    ],
    reviewTemplates: [
      "The sourdough is unreal. {first} told us the starter is older than the shop itself.",
      "They made our wedding cake and people are still talking about it.",
      "Get there early on Saturdays — the cardamom buns sell out by ten.",
    ],
    hours: "Tue–Sun 6:30am–2pm",
    ctaVerb: "Order ahead",
  },
  {
    key: "salon",
    category: "Hair Salon",
    aliases: ["salons", "salon", "hair", "hairdresser", "stylist", "beauty"],
    recommendedTemplate: "bold",
    nameStems: ["Mane", "Studio Nine", "Juniper", "Lux", "Velvet", "Arden"],
    nameSuffixes: ["Salon", "Hair Studio", "Hair Co.", "Salon & Spa"],
    services: [
      { name: "Cuts & styling", description: "Precision cuts built around how you actually wear your hair day to day." },
      { name: "Colour", description: "Balayage, glosses and full colour, with a consultation before anything's mixed." },
      { name: "Treatments", description: "Bond repair and deep conditioning for hair that's been through a lot." },
      { name: "Occasions", description: "Wedding and event styling, in the salon or on location." },
    ],
    signature: { name: "Signature balayage", description: "Soft, lived-in colour that grows out beautifully." },
    trustPoints: [
      { title: "Senior stylists", detail: "Every stylist has at least eight years behind the chair." },
      { title: "Consultation first", detail: "We talk through what you want before we start." },
      { title: "Premium products only", detail: "Professional colour and care lines, nothing diluted." },
    ],
    reviewTemplates: [
      "{first} is the only person I trust with my colour. Always listens and it always grows out perfectly.",
      "Such a calm, beautiful space. Best haircut I've had in years.",
      "Did my bridal hair and it held all night. Couldn't recommend more.",
    ],
    hours: "Tue–Sat 9am–7pm",
    ctaVerb: "Book an appointment",
  },
  {
    key: "barber",
    category: "Barber Shop",
    aliases: ["barbers", "barber", "barbershop"],
    recommendedTemplate: "legacy",
    nameStems: ["Old Town", "Sharp", "Kingsway", "Tony's", "Gentry", "Main Street"],
    nameSuffixes: ["Barbers", "Barber Shop", "Barber Co."],
    services: [
      { name: "Classic cuts", description: "Scissor and clipper work, finished with a hot towel and straight-razor neckline." },
      { name: "Hot towel shave", description: "The full ritual — steam, lather, straight razor, balm." },
      { name: "Beard work", description: "Shaping and line-ups that suit your face, not a trend." },
      { name: "Kids' cuts", description: "Patient barbers and a lollipop at the end." },
    ],
    signature: { name: "The hot towel shave", description: "Twenty minutes of the best part of your week." },
    trustPoints: [
      { title: "Walk-ins welcome", detail: "No app, no deposit — just come in." },
      { title: "Three generations of barbers", detail: "The craft learned in this same shop." },
      { title: "Straight-razor finish", detail: "Every cut finished with a hot towel and razor line." },
    ],
    reviewTemplates: [
      "Been getting my hair cut by {first} for fifteen years. Wouldn't go anywhere else.",
      "Proper old-school barber shop. The hot towel shave is worth every penny.",
      "Took my son for his first haircut and they made it a great experience.",
    ],
    hours: "Mon–Sat 8am–6pm",
    ctaVerb: "Book a chair",
  },
  {
    key: "dentist",
    category: "Dentist",
    aliases: ["dentists", "dental", "dentist", "orthodontist"],
    recommendedTemplate: "modern",
    nameStems: ["Parkside", "Bright", "Gentle", "Lakeview", "Maple", "Harbor"],
    nameSuffixes: ["Dental", "Family Dentistry", "Dental Care", "Dental Studio"],
    services: [
      { name: "Check-ups & cleans", description: "Thorough, unhurried cleanings and exams, twice a year." },
      { name: "Cosmetic", description: "Whitening, bonding and veneers planned around a natural result." },
      { name: "Restorative", description: "Fillings, crowns and implants done with minimal fuss." },
      { name: "Emergency visits", description: "Same-day appointments held back for pain and breakages." },
    ],
    signature: { name: "Gentle family dentistry", description: "Care that makes nervous patients comfortable." },
    trustPoints: [
      { title: "Accepting new patients", detail: "New patients usually seen within a week." },
      { title: "Most insurance accepted", detail: "We file the claim so you don't have to." },
      { title: "Anxious patients welcome", detail: "Unhurried appointments and options to keep you comfortable." },
    ],
    reviewTemplates: [
      "I've been terrified of dentists my whole life. Dr. {first} was patient and honestly made it painless.",
      "Front desk sorted my insurance in five minutes. Clean, modern office and on time.",
      "Got me in the same day for a cracked tooth. Can't thank them enough.",
    ],
    hours: "Mon–Thu 8am–5pm · Fri 8am–1pm",
    ctaVerb: "Book a visit",
  },
  {
    key: "florist",
    category: "Florist",
    aliases: ["florists", "florist", "flowers", "flower shop"],
    recommendedTemplate: "bold",
    nameStems: ["Wild", "Petal & Stem", "Bloom", "Fern", "Marigold", "Posy"],
    nameSuffixes: ["Flowers", "Florist", "Floral Studio"],
    services: [
      { name: "Everyday bouquets", description: "Seasonal, loose and a little wild — wrapped while you wait." },
      { name: "Weddings", description: "From a single bouquet to full venue installations." },
      { name: "Sympathy", description: "Thoughtful arrangements delivered with care and discretion." },
      { name: "Subscriptions", description: "Fresh flowers at your door or front desk every week." },
    ],
    signature: { name: "The market bouquet", description: "Whatever's best that morning, arranged by hand." },
    trustPoints: [
      { title: "Same-day delivery", detail: "Order before 1pm for delivery the same day." },
      { title: "Seasonal & local stems", detail: "Bought from growers at the market each morning." },
      { title: "Weddings & events", detail: "From a single bouquet to full venue installs." },
    ],
    reviewTemplates: [
      "{first} did our wedding flowers and they were beyond anything we imagined.",
      "Ordered a sympathy arrangement for my aunt — delivered same day and absolutely beautiful.",
      "My weekly treat. Nothing like supermarket flowers.",
    ],
    hours: "Mon–Sat 9am–6pm",
    ctaVerb: "Order flowers",
  },
  {
    key: "auto",
    category: "Auto Repair",
    aliases: ["mechanic", "mechanics", "auto", "auto repair", "car repair", "garage", "tyres", "tires"],
    recommendedTemplate: "modern",
    nameStems: ["Precision", "Dave's", "Eastside", "Torque", "Honest", "Route 9"],
    nameSuffixes: ["Auto", "Auto Repair", "Automotive", "Garage"],
    services: [
      { name: "Diagnostics", description: "Warning lights read properly, with a clear explanation before any work starts." },
      { name: "Brakes", description: "Pads, rotors and fluid — checked, quoted and fixed the same day." },
      { name: "Servicing", description: "Oil, filters and inspections to manufacturer schedule, without the dealer price." },
      { name: "Tyres", description: "Fitting, balancing and alignment on most makes." },
    ],
    signature: { name: "Honest diagnostics", description: "We tell you what it needs — and what it doesn't." },
    trustPoints: [
      { title: "ASE-certified technicians", detail: "Trained, certified mechanics on every vehicle." },
      { title: "12-month warranty on work", detail: "Parts and labour covered for a full year." },
      { title: "No surprise bills", detail: "We call before doing anything you didn't approve." },
    ],
    reviewTemplates: [
      "Dealer quoted me $1,400. {first} fixed it for a third of that and showed me the old part.",
      "Finally a mechanic I trust. Straight answers, fair prices, done when they said.",
      "Got my brakes done while I waited. Friendly and quick.",
    ],
    hours: "Mon–Fri 8am–6pm · Sat 8am–1pm",
    ctaVerb: "Book a service",
  },
  {
    key: "fitness",
    category: "Fitness Studio",
    aliases: ["gym", "gyms", "fitness", "yoga", "pilates", "studio", "personal trainer"],
    recommendedTemplate: "bold",
    nameStems: ["Forge", "Kinetic", "Grounded", "Northline", "Tempo", "Lift"],
    nameSuffixes: ["Studio", "Fitness", "Strength Club", "Movement"],
    services: [
      { name: "Small-group training", description: "Coached sessions capped at eight, so form never gets ignored." },
      { name: "Personal training", description: "One-to-one programming built around your goals and schedule." },
      { name: "Mobility", description: "Classes that make everything else you do feel better." },
      { name: "Open gym", description: "Members-only access to the floor outside class times." },
    ],
    signature: { name: "Small-group strength", description: "Coaching attention at a group price." },
    trustPoints: [
      { title: "Certified coaches", detail: "Every coach certified and trained in-house." },
      { title: "Classes capped at 8", detail: "Small enough that your form actually gets coached." },
      { title: "First week free", detail: "Try any class for a week before you commit." },
    ],
    reviewTemplates: [
      "{first} is the best coach I've ever had. Stronger at 45 than I was at 25.",
      "Small classes mean you actually get coached. Friendly community, zero ego.",
      "I've tried every gym in town. This is the one I've stuck with.",
    ],
    hours: "Mon–Fri 6am–8pm · Sat 8am–12pm",
    ctaVerb: "Book a free class",
  },
];

const GENERIC: NicheProfile = {
  key: "generic",
  category: "Local Business",
  aliases: [],
  recommendedTemplate: "modern",
  nameStems: ["Main Street", "Parkview", "Riverside", "Elm & Oak", "Hometown", "Cornerstone"],
  nameSuffixes: ["& Co.", "Services", "Company", "Studio"],
  services: [
    { name: "Consultations", description: "A proper conversation first, so we understand exactly what you need." },
    { name: "Core services", description: "The work we're known for, done carefully and on schedule." },
    { name: "Ongoing care", description: "Follow-ups and maintenance so things stay right long after." },
  ],
  signature: { name: "Personal service", description: "The owner still answers the phone." },
  trustPoints: [
      { title: "Locally owned", detail: "Owned and run by people who live here." },
      { title: "Highly rated", detail: "Consistently rated by customers across town." },
      { title: "Straightforward pricing", detail: "Clear prices, agreed before we begin." },
    ],
  reviewTemplates: [
    "{first} went above and beyond. Would recommend to anyone.",
    "Reliable, friendly and fairly priced. Exactly what you want from a local business.",
    "Great experience from start to finish.",
  ],
  hours: "Mon–Fri 9am–5pm",
  ctaVerb: "Get in touch",
};

export function resolveNiche(query: string): NicheProfile {
  const q = query.trim().toLowerCase();
  if (!q) return GENERIC;
  return (
    NICHES.find((n) => n.key === q || n.aliases.includes(q)) ??
    NICHES.find((n) => n.aliases.some((a) => q.includes(a) || a.includes(q))) ??
    { ...GENERIC, category: titleCase(q.replace(/s$/, "")) }
  );
}

export function nicheByKey(key: string): NicheProfile {
  return NICHES.find((n) => n.key === key) ?? GENERIC;
}

export const POPULAR_NICHES = ["Plumbers", "Restaurants", "Cafés", "Hair salons", "Dentists", "Bakeries"];

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
