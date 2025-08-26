import type { Barbershop, Review, Service } from "./types"
import { executeQuery, executeTransaction } from "./mysql"
import { v4 as uuidv4 } from "uuid"

class DataStore {
  // Métodos para Barbearias
  async getAllBarbershops(): Promise<Barbershop[]> {
    const barbershopsQuery = `
      SELECT 
        id, name, description, street, number, neighborhood, city, state, zip_code,
        phone, whatsapp, email, instagram, website, price_range, rating, review_count,
        verified, amenities, images, hours, created_at, updated_at
      FROM barbershops 
      ORDER BY created_at DESC
    `

    const barbershops = await executeQuery<any>(barbershopsQuery)

    // Buscar serviços para cada barbearia
    for (const barbershop of barbershops) {
      const services = await this.getServicesByBarbershopId(barbershop.id)
      barbershop.services = services

      // Parse JSON fields
      barbershop.amenities = JSON.parse(barbershop.amenities || "[]")
      barbershop.images = JSON.parse(barbershop.images || "[]")
      barbershop.hours = JSON.parse(barbershop.hours || "{}")

      // Format address
      barbershop.address = {
        street: barbershop.street,
        number: barbershop.number,
        neighborhood: barbershop.neighborhood,
        city: barbershop.city,
        state: barbershop.state,
        zipCode: barbershop.zip_code,
      }

      // Format contact
      barbershop.contact = {
        phone: barbershop.phone,
        whatsapp: barbershop.whatsapp,
        email: barbershop.email,
        instagram: barbershop.instagram,
        website: barbershop.website,
      }

      // Clean up flat fields
      delete barbershop.street
      delete barbershop.number
      delete barbershop.neighborhood
      delete barbershop.city
      delete barbershop.state
      delete barbershop.zip_code
      delete barbershop.phone
      delete barbershop.whatsapp
      delete barbershop.email
      delete barbershop.instagram
      delete barbershop.website
    }

    return barbershops
  }

  async getBarbershopById(id: string): Promise<Barbershop | null> {
    const query = `
      SELECT 
        id, name, description, street, number, neighborhood, city, state, zip_code,
        phone, whatsapp, email, instagram, website, price_range, rating, review_count,
        verified, amenities, images, hours, created_at, updated_at
      FROM barbershops 
      WHERE id = ?
    `

    const results = await executeQuery<any>(query, [id])
    if (results.length === 0) return null

    const barbershop = results[0]

    // Buscar serviços
    barbershop.services = await this.getServicesByBarbershopId(id)

    // Parse JSON fields
    barbershop.amenities = JSON.parse(barbershop.amenities || "[]")
    barbershop.images = JSON.parse(barbershop.images || "[]")
    barbershop.hours = JSON.parse(barbershop.hours || "{}")

    // Format address and contact
    barbershop.address = {
      street: barbershop.street,
      number: barbershop.number,
      neighborhood: barbershop.neighborhood,
      city: barbershop.city,
      state: barbershop.state,
      zipCode: barbershop.zip_code,
    }

    barbershop.contact = {
      phone: barbershop.phone,
      whatsapp: barbershop.whatsapp,
      email: barbershop.email,
      instagram: barbershop.instagram,
      website: barbershop.website,
    }

    return barbershop
  }

  async createBarbershop(
    data: Omit<Barbershop, "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt">,
  ): Promise<Barbershop> {
    const id = uuidv4()
    const now = new Date()

    const queries = [
      {
        query: `
          INSERT INTO barbershops (
            id, name, description, street, number, neighborhood, city, state, zip_code,
            phone, whatsapp, email, instagram, website, price_range, verified,
            amenities, images, hours, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        params: [
          id,
          data.name,
          data.description,
          data.address.street,
          data.address.number,
          data.address.neighborhood,
          data.address.city,
          data.address.state,
          data.address.zipCode,
          data.contact.phone,
          data.contact.whatsapp,
          data.contact.email,
          data.contact.instagram,
          data.contact.website,
          data.priceRange,
          data.verified,
          JSON.stringify(data.amenities),
          JSON.stringify(data.images),
          JSON.stringify(data.hours),
          now,
          now,
        ],
      },
    ]

    // Adicionar serviços
    for (const service of data.services) {
      queries.push({
        query: `
          INSERT INTO services (id, barbershop_id, name, description, price, duration, category)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        params: [uuidv4(), id, service.name, service.description, service.price, service.duration, service.category],
      })
    }

    await executeTransaction(queries)

    return (await this.getBarbershopById(id)) as Barbershop
  }

  async updateBarbershop(id: string, data: Partial<Barbershop>): Promise<Barbershop | null> {
    const existing = await this.getBarbershopById(id)
    if (!existing) return null

    const updateFields: string[] = []
    const params: any[] = []

    if (data.name) {
      updateFields.push("name = ?")
      params.push(data.name)
    }
    if (data.description) {
      updateFields.push("description = ?")
      params.push(data.description)
    }
    if (data.address) {
      if (data.address.street) {
        updateFields.push("street = ?")
        params.push(data.address.street)
      }
      if (data.address.number) {
        updateFields.push("number = ?")
        params.push(data.address.number)
      }
      if (data.address.neighborhood) {
        updateFields.push("neighborhood = ?")
        params.push(data.address.neighborhood)
      }
      if (data.address.city) {
        updateFields.push("city = ?")
        params.push(data.address.city)
      }
      if (data.address.state) {
        updateFields.push("state = ?")
        params.push(data.address.state)
      }
      if (data.address.zipCode) {
        updateFields.push("zip_code = ?")
        params.push(data.address.zipCode)
      }
    }
    if (data.contact) {
      if (data.contact.phone) {
        updateFields.push("phone = ?")
        params.push(data.contact.phone)
      }
      if (data.contact.whatsapp) {
        updateFields.push("whatsapp = ?")
        params.push(data.contact.whatsapp)
      }
      if (data.contact.email) {
        updateFields.push("email = ?")
        params.push(data.contact.email)
      }
      if (data.contact.instagram) {
        updateFields.push("instagram = ?")
        params.push(data.contact.instagram)
      }
      if (data.contact.website) {
        updateFields.push("website = ?")
        params.push(data.contact.website)
      }
    }
    if (data.priceRange) {
      updateFields.push("price_range = ?")
      params.push(data.priceRange)
    }
    if (data.verified !== undefined) {
      updateFields.push("verified = ?")
      params.push(data.verified)
    }
    if (data.amenities) {
      updateFields.push("amenities = ?")
      params.push(JSON.stringify(data.amenities))
    }
    if (data.images) {
      updateFields.push("images = ?")
      params.push(JSON.stringify(data.images))
    }
    if (data.hours) {
      updateFields.push("hours = ?")
      params.push(JSON.stringify(data.hours))
    }

    if (updateFields.length === 0) return existing

    updateFields.push("updated_at = ?")
    params.push(new Date())
    params.push(id)

    const query = `UPDATE barbershops SET ${updateFields.join(", ")} WHERE id = ?`
    await executeQuery(query, params)

    // Atualizar serviços se fornecidos
    if (data.services) {
      // Remover serviços existentes
      await executeQuery("DELETE FROM services WHERE barbershop_id = ?", [id])

      // Adicionar novos serviços
      for (const service of data.services) {
        await executeQuery(
          `
          INSERT INTO services (id, barbershop_id, name, description, price, duration, category)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [uuidv4(), id, service.name, service.description, service.price, service.duration, service.category],
        )
      }
    }

    return await this.getBarbershopById(id)
  }

  async deleteBarbershop(id: string): Promise<boolean> {
    const result = await executeQuery("DELETE FROM barbershops WHERE id = ?", [id])
    return (result as any).affectedRows > 0
  }

  async searchBarbershops(filters: any): Promise<Barbershop[]> {
    let query = `
      SELECT 
        id, name, description, street, number, neighborhood, city, state, zip_code,
        phone, whatsapp, email, instagram, website, price_range, rating, review_count,
        verified, amenities, images, hours, created_at, updated_at
      FROM barbershops WHERE 1=1
    `
    const params: any[] = []

    if (filters.city) {
      query += " AND city LIKE ?"
      params.push(`%${filters.city}%`)
    }

    if (filters.state) {
      query += " AND state LIKE ?"
      params.push(`%${filters.state}%`)
    }

    if (filters.neighborhood) {
      query += " AND neighborhood LIKE ?"
      params.push(`%${filters.neighborhood}%`)
    }

    if (filters.priceRange) {
      query += " AND price_range = ?"
      params.push(filters.priceRange)
    }

    if (filters.rating) {
      query += " AND rating >= ?"
      params.push(Number.parseFloat(filters.rating))
    }

    if (filters.verified !== undefined) {
      query += " AND verified = ?"
      params.push(filters.verified === "true")
    }

    query += " ORDER BY rating DESC, review_count DESC"

    const results = await executeQuery<any>(query, params)

    // Processar resultados similar ao getAllBarbershops
    for (const barbershop of results) {
      barbershop.services = await this.getServicesByBarbershopId(barbershop.id)
      barbershop.amenities = JSON.parse(barbershop.amenities || "[]")
      barbershop.images = JSON.parse(barbershop.images || "[]")
      barbershop.hours = JSON.parse(barbershop.hours || "{}")

      barbershop.address = {
        street: barbershop.street,
        number: barbershop.number,
        neighborhood: barbershop.neighborhood,
        city: barbershop.city,
        state: barbershop.state,
        zipCode: barbershop.zip_code,
      }

      barbershop.contact = {
        phone: barbershop.phone,
        whatsapp: barbershop.whatsapp,
        email: barbershop.email,
        instagram: barbershop.instagram,
        website: barbershop.website,
      }
    }

    return results
  }

  // Métodos para Serviços
  async getServicesByBarbershopId(barbershopId: string): Promise<Service[]> {
    const query = "SELECT * FROM services WHERE barbershop_id = ? ORDER BY category, name"
    return await executeQuery<Service>(query, [barbershopId])
  }

  // Métodos para Reviews
  async getReviewsByBarbershopId(barbershopId: string): Promise<Review[]> {
    const query = "SELECT * FROM reviews WHERE barbershop_id = ? ORDER BY created_at DESC"
    return await executeQuery<Review>(query, [barbershopId])
  }

  async createReview(data: Omit<Review, "id" | "createdAt">): Promise<Review> {
    const id = uuidv4()
    const now = new Date()

    await executeQuery(
      `
      INSERT INTO reviews (id, barbershop_id, customer_name, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [id, data.barbershopId, data.customerName, data.rating, data.comment, now],
    )

    await this.updateBarbershopRating(data.barbershopId)

    const result = await executeQuery<Review>("SELECT * FROM reviews WHERE id = ?", [id])
    return result[0]
  }

  private async updateBarbershopRating(barbershopId: string): Promise<void> {
    const reviews = await this.getReviewsByBarbershopId(barbershopId)

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      await executeQuery(
        `
        UPDATE barbershops 
        SET rating = ?, review_count = ?, updated_at = ?
        WHERE id = ?
      `,
        [Math.round(averageRating * 10) / 10, reviews.length, new Date(), barbershopId],
      )
    }
  }
}

export const dataStore = new DataStore()
