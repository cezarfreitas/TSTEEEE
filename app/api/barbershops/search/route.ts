import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      city: searchParams.get("city"),
      state: searchParams.get("state"),
      neighborhood: searchParams.get("neighborhood"),
      priceRange: searchParams.get("priceRange"),
      services: searchParams.getAll("services"),
      amenities: searchParams.getAll("amenities"),
      rating: searchParams.get("rating"),
      verified: searchParams.get("verified"),
    }

    // Remove filtros vazios
    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof typeof filters]
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        delete filters[key as keyof typeof filters]
      }
    })

    const results = await dataStore.searchBarbershops(filters)

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      filters: filters,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
