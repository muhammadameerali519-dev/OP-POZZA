export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  category: "special" | "classic" | "bogo" | "special-deal" | "triple" | "burger-wrap" | "sides" | "birthday";
  sizes?: {
    [key: string]: number; // e.g. "Regular": 600, "Medium": 1050, etc.
  };
}

export interface CartItem {
  id: string;
  foodId: string;
  name: string;
  selectedSize?: string;
  selectedPrice: number;
  quantity: number;
  description?: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  role: string;
  stars: number;
  date: string;
}
