import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const barbershops = await dataStore.getAllBarbershops()

    const stats = {
      totalBarbershops: barbershops.length,
      verifiedBarbershops: barbershops.filter((b) => b.verified).length,
      averageRating: barbershops.reduce((sum, b) => sum + b.rating, 0) / barbershops.length || 0,
      totalReviews: barbershops.reduce((sum, b) => sum + b.reviewCount, 0),
      citiesCount: new Set(barbershops.map((b) => b.address.city)).size,
      statesCount: new Set(barbershops.map((b) => b.address.state)).size,
      priceRangeDistribution: {
        low: barbershops.filter((b) => b.priceRange === "low").length,
        medium: barbershops.filter((b) => b.priceRange === "medium").length,
        high: barbershops.filter((b) => b.priceRange === "high").length,
      },
      topServices: getTopServices(barbershops),
      topAmenities: getTopAmenities(barbershops),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

function getTopServices(barbershops: any[]) {
  const serviceCount: { [key: string]: number } = {}

  barbershops.forEach((barbershop) => {
    barbershop.services.forEach((service: any) => {
      serviceCount[service.name] = (serviceCount[service.name] || 0) + 1
    })
  })

  return Object.entries(serviceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))
}

function getTopAmenities(barbershops: any[]) {
  const amenityCount: { [key: string]: number } = {}

  barbershops.forEach((barbershop) => {
    barbershop.amenities.forEach((amenity: string) => {
      amenityCount[amenity] = (amenityCount[amenity] || 0) + 1
    })
  })

  return Object.entries(amenityCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))
}
