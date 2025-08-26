import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { validateUpdateBarbershop } from "@/lib/validators"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const barbershop = dataStore.getBarbershopById(params.id)

    if (!barbershop) {
      return NextResponse.json({ success: false, error: "Barbearia não encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: barbershop,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const validation = validateUpdateBarbershop(body)
    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const updatedBarbershop = dataStore.updateBarbershop(params.id, body)

    if (!updatedBarbershop) {
      return NextResponse.json({ success: false, error: "Barbearia não encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedBarbershop,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = dataStore.deleteBarbershop(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Barbearia não encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Barbearia deletada com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
