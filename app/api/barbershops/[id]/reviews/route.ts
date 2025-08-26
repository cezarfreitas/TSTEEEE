import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { validateReview } from "@/lib/validators"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const barbershop = await dataStore.getBarbershopById(params.id)

    if (!barbershop) {
      return NextResponse.json({ success: false, error: "Barbearia não encontrada" }, { status: 404 })
    }

    const reviews = await dataStore.getReviewsByBarbershopId(params.id)

    return NextResponse.json({
      success: true,
      data: reviews,
      total: reviews.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const barbershop = await dataStore.getBarbershopById(params.id)

    if (!barbershop) {
      return NextResponse.json({ success: false, error: "Barbearia não encontrada" }, { status: 404 })
    }

    const body = await request.json()

    const validation = validateReview(body)
    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const review = await dataStore.createReview({
      ...body,
      barbershopId: params.id,
    })

    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
