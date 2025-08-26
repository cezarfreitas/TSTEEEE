import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { validateCreateBarbershop } from "@/lib/validators"

export async function GET(request: NextRequest) {
  try {
    const barbershops = dataStore.getAllBarbershops()

    return NextResponse.json({
      success: true,
      data: barbershops,
      total: barbershops.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = validateCreateBarbershop(body)
    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const barbershop = dataStore.createBarbershop({
      ...body,
      verified: false, // Novas barbearias começam não verificadas
    })

    return NextResponse.json({ success: true, data: barbershop }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
