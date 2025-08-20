export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  period: string;
  bedrooms: string;
  area: string;
  type: "House" | "Apartment" | "Office";
  city: "Addis Ababa" | "Nairobi" | "Lagos";
  image: string;
  images: string[];
  coords: { lat: number; lng: number };
  description?: string;
};

export type City = "Addis Ababa" | "Nairobi" | "Lagos";

export const allPropertyData: Record<City, Property[]> = {
  "Addis Ababa": [
    {
      id: 1,
      title: "Luxury 2BHK Apartment",
      location: "CMC, Addis Ababa",
      price: "ETB 20,000",
      period: "/month",
      bedrooms: "2-bed",
      area: "100 m²",
      type: "Apartment",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c1efd?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 9.0206, lng: 38.8096 },
      description:
        "Spacious 2-bedroom apartment with modern finishes in CMC. Close to amenities and transit.",
    },
    {
      id: 2,
      title: "1 Room with Attached Bathroom",
      location: "Ayat, Addis Ababa",
      price: "ETB 10,000",
      period: "/month",
      bedrooms: "Bathroom",
      area: "16 m²",
      type: "House",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 9.0321, lng: 38.8758 },
      description:
        "Compact studio with attached bathroom ideal for students near Ayat.",
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      location: "CMC, Addis Ababa",
      price: "ETB 18,000",
      period: "/month",
      bedrooms: "Studio",
      area: "24 m²",
      type: "Apartment",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1521783988139-893ce36b95d9?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 9.0237, lng: 38.8085 },
      description: "Modern studio with natural light and efficient layout.",
    },
    {
      id: 4,
      title: "Modern Office Space",
      location: "Bole, Addis Ababa",
      price: "ETB 25,000",
      period: "/month",
      bedrooms: "Office",
      area: "50 m²",
      type: "Office",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 8.9941, lng: 38.7892 },
      description: "Bright office space in Bole business district.",
    },
    {
      id: 9,
      title: "Family House with Garden",
      location: "Sarbet, Addis Ababa",
      price: "ETB 35,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "150 m²",
      type: "House",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d46?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 8.9899, lng: 38.7578 },
      description: "Spacious family home with a private garden.",
    },
  ],
  Nairobi: [
    {
      id: 5,
      title: "Modern 3BR House",
      location: "Westlands, Nairobi",
      price: "KES 45,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "120 m²",
      type: "House",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c1efd?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d46?w=1200&h=900&fit=crop",
      ],
      coords: { lat: -1.2649, lng: 36.811 },
      description: "Stylish house in Westlands with modern amenities.",
    },
    {
      id: 6,
      title: "Executive Apartment",
      location: "Karen, Nairobi",
      price: "KES 35,000",
      period: "/month",
      bedrooms: "2-bed",
      area: "85 m²",
      type: "Apartment",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=900&fit=crop",
      ],
      coords: { lat: -1.3251, lng: 36.7205 },
      description: "Executive apartment in leafy Karen.",
    },
    {
      id: 10,
      title: "Corporate Office Suite",
      location: "Upper Hill, Nairobi",
      price: "KES 60,000",
      period: "/month",
      bedrooms: "Office",
      area: "100 m²",
      type: "Office",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1521783988139-893ce36b95d9?w=1200&h=900&fit=crop",
      ],
      coords: { lat: -1.3006, lng: 36.817 },
      description: "Prime office suite in Upper Hill.",
    },
    {
      id: 11,
      title: "Penthouse Apartment",
      location: "Kilimani, Nairobi",
      price: "KES 55,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "140 m²",
      type: "Apartment",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c1efd?w=1200&h=900&fit=crop",
      ],
      coords: { lat: -1.2926, lng: 36.7831 },
      description: "Penthouse with city views in Kilimani.",
    },
  ],
  Lagos: [
    {
      id: 7,
      title: "Luxury Villa",
      location: "Victoria Island, Lagos",
      price: "₦ 150,000",
      period: "/month",
      bedrooms: "4-bed",
      area: "200 m²",
      type: "House",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c1efd?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d46?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 6.4281, lng: 3.4219 },
      description: "Luxury waterfront villa in VI.",
    },
    {
      id: 8,
      title: "Business Office",
      location: "Ikeja, Lagos",
      price: "₦ 80,000",
      period: "/month",
      bedrooms: "Office",
      area: "75 m²",
      type: "Office",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1521783988139-893ce36b95d9?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 6.6018, lng: 3.3515 },
      description: "Business-ready office in Ikeja.",
    },
    {
      id: 12,
      title: "Waterfront Apartment",
      location: "Lekki, Lagos",
      price: "₦ 120,000",
      period: "/month",
      bedrooms: "2-bed",
      area: "90 m²",
      type: "Apartment",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c1efd?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 6.458, lng: 3.6015 },
      description: "Bright waterfront apartment in Lekki.",
    },
    {
      id: 13,
      title: "Suburban Family Home",
      location: "Ajah, Lagos",
      price: "₦ 95,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "180 m²",
      type: "House",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=700&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d46?w=1200&h=900&fit=crop",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=900&fit=crop",
      ],
      coords: { lat: 6.4698, lng: 3.5852 },
      description: "Comfortable family home in Ajah.",
    },
  ],
};

export function getPropertyById(id: number): Property | undefined {
  for (const city of Object.keys(allPropertyData) as City[]) {
    const found = allPropertyData[city].find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getAllProperties(): Property[] {
  return (Object.keys(allPropertyData) as City[]).flatMap(
    (c) => allPropertyData[c]
  );
}
