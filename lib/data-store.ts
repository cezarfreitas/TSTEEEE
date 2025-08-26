import type { Barbershop, Review } from "./types"

// Simulação de banco de dados em memória
class DataStore {
  private barbershops: Map<string, Barbershop> = new Map()
  private reviews: Map<string, Review> = new Map()

  constructor() {
    this.seedData()
  }

  // Métodos para Barbearias
  getAllBarbershops(): Barbershop[] {
    return Array.from(this.barbershops.values())
  }

  getBarbershopById(id: string): Barbershop | undefined {
    return this.barbershops.get(id)
  }

  createBarbershop(data: Omit<Barbershop, "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt">): Barbershop {
    const id = this.generateId()
    const now = new Date().toISOString()

    const barbershop: Barbershop = {
      ...data,
      id,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
      services: data.services.map((service) => ({
        ...service,
        id: this.generateId(),
      })),
    }

    this.barbershops.set(id, barbershop)
    return barbershop
  }

  updateBarbershop(id: string, data: Partial<Barbershop>): Barbershop | null {
    const existing = this.barbershops.get(id)
    if (!existing) return null

    const updated: Barbershop = {
      ...existing,
      ...data,
      id: existing.id, // Não permitir alterar o ID
      updatedAt: new Date().toISOString(),
      services: data.services
        ? data.services.map((service) => ({
            ...service,
            id: service.id || this.generateId(),
          }))
        : existing.services,
    }

    this.barbershops.set(id, updated)
    return updated
  }

  deleteBarbershop(id: string): boolean {
    return this.barbershops.delete(id)
  }

  searchBarbershops(filters: any): Barbershop[] {
    let results = this.getAllBarbershops()

    if (filters.city) {
      results = results.filter((b) => b.address.city.toLowerCase().includes(filters.city.toLowerCase()))
    }

    if (filters.state) {
      results = results.filter((b) => b.address.state.toLowerCase().includes(filters.state.toLowerCase()))
    }

    if (filters.neighborhood) {
      results = results.filter((b) => b.address.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase()))
    }

    if (filters.priceRange) {
      results = results.filter((b) => b.priceRange === filters.priceRange)
    }

    if (filters.rating) {
      results = results.filter((b) => b.rating >= Number.parseFloat(filters.rating))
    }

    if (filters.verified !== undefined) {
      results = results.filter((b) => b.verified === (filters.verified === "true"))
    }

    if (filters.services && filters.services.length > 0) {
      const serviceNames = Array.isArray(filters.services) ? filters.services : [filters.services]
      results = results.filter((b) =>
        serviceNames.some((serviceName) =>
          b.services.some((service) => service.name.toLowerCase().includes(serviceName.toLowerCase())),
        ),
      )
    }

    if (filters.amenities && filters.amenities.length > 0) {
      const amenityNames = Array.isArray(filters.amenities) ? filters.amenities : [filters.amenities]
      results = results.filter((b) =>
        amenityNames.some((amenity) =>
          b.amenities.some((barbershopAmenity) => barbershopAmenity.toLowerCase().includes(amenity.toLowerCase())),
        ),
      )
    }

    return results
  }

  // Métodos para Reviews
  getReviewsByBarbershopId(barbershopId: string): Review[] {
    return Array.from(this.reviews.values()).filter((r) => r.barbershopId === barbershopId)
  }

  createReview(data: Omit<Review, "id" | "createdAt">): Review {
    const id = this.generateId()
    const review: Review = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }

    this.reviews.set(id, review)
    this.updateBarbershopRating(data.barbershopId)
    return review
  }

  private updateBarbershopRating(barbershopId: string): void {
    const reviews = this.getReviewsByBarbershopId(barbershopId)
    const barbershop = this.getBarbershopById(barbershopId)

    if (barbershop && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      this.updateBarbershop(barbershopId, {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      })
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private seedData(): void {
    // Dados de exemplo
    const sampleBarbershops = [
      {
        name: "Barbearia Clássica",
        description: "Tradição em cortes masculinos há mais de 20 anos",
        address: {
          street: "Rua das Flores",
          number: "123",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
        },
        contact: {
          phone: "(11) 99999-9999",
          whatsapp: "(11) 99999-9999",
          instagram: "@barbeariaclassica",
        },
        hours: {
          monday: { open: "08:00", close: "18:00", closed: false },
          tuesday: { open: "08:00", close: "18:00", closed: false },
          wednesday: { open: "08:00", close: "18:00", closed: false },
          thursday: { open: "08:00", close: "18:00", closed: false },
          friday: { open: "08:00", close: "19:00", closed: false },
          saturday: { open: "08:00", close: "17:00", closed: false },
          sunday: { open: "00:00", close: "00:00", closed: true },
        },
        services: [
          {
            name: "Corte Masculino",
            description: "Corte tradicional",
            price: 25,
            duration: 30,
            category: "corte" as const,
          },
          { name: "Barba", description: "Aparar e modelar barba", price: 15, duration: 20, category: "barba" as const },
          {
            name: "Combo Corte + Barba",
            description: "Corte completo",
            price: 35,
            duration: 45,
            category: "combo" as const,
          },
        ],
        amenities: ["Wi-Fi", "Ar Condicionado", "TV", "Café"],
        images: ["/barbearia-classica.png"],
        priceRange: "medium" as const,
        verified: true,
      },
      {
        name: "Modern Barber Shop",
        description: "Estilo moderno com técnicas tradicionais",
        address: {
          street: "Avenida Paulista",
          number: "456",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          zipCode: "01310-100",
        },
        contact: {
          phone: "(11) 88888-8888",
          whatsapp: "(11) 88888-8888",
          email: "contato@modernbarber.com",
          instagram: "@modernbarbershop",
        },
        hours: {
          monday: { open: "09:00", close: "19:00", closed: false },
          tuesday: { open: "09:00", close: "19:00", closed: false },
          wednesday: { open: "09:00", close: "19:00", closed: false },
          thursday: { open: "09:00", close: "19:00", closed: false },
          friday: { open: "09:00", close: "20:00", closed: false },
          saturday: { open: "08:00", close: "18:00", closed: false },
          sunday: { open: "10:00", close: "16:00", closed: false },
        },
        services: [
          {
            name: "Corte Premium",
            description: "Corte moderno personalizado",
            price: 45,
            duration: 40,
            category: "corte" as const,
          },
          {
            name: "Barba Premium",
            description: "Barba com toalha quente",
            price: 30,
            duration: 30,
            category: "barba" as const,
          },
          {
            name: "Tratamento Capilar",
            description: "Hidratação e tratamento",
            price: 60,
            duration: 60,
            category: "tratamento" as const,
          },
        ],
        amenities: ["Wi-Fi", "Ar Condicionado", "Netflix", "Bebidas", "Estacionamento"],
        images: ["/barbearia-moderna.png"],
        priceRange: "high" as const,
        verified: true,
      },
    ]

    sampleBarbershops.forEach((data) => {
      this.createBarbershop(data)
    })
  }
}

export const dataStore = new DataStore()
