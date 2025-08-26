export interface Barbershop {
  id: string
  name: string
  description: string
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    whatsapp?: string
    email?: string
    website?: string
    instagram?: string
  }
  hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  services: Service[]
  amenities: string[]
  images: string[]
  rating: number
  reviewCount: number
  priceRange: "low" | "medium" | "high"
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // em minutos
  category: "corte" | "barba" | "combo" | "tratamento" | "outros"
}

export interface Review {
  id: string
  barbershopId: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface CreateBarbershopRequest {
  name: string
  description: string
  address: Omit<Barbershop["address"], "coordinates">
  contact: Barbershop["contact"]
  hours: Barbershop["hours"]
  services: Omit<Service, "id">[]
  amenities: string[]
  images: string[]
  priceRange: Barbershop["priceRange"]
}

export interface UpdateBarbershopRequest extends Partial<CreateBarbershopRequest> {}

export interface SearchFilters {
  city?: string
  state?: string
  neighborhood?: string
  priceRange?: Barbershop["priceRange"]
  services?: string[]
  amenities?: string[]
  rating?: number
  verified?: boolean
}
