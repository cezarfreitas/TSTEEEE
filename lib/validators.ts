export function validateCreateBarbershop(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push("Nome é obrigatório e deve ter pelo menos 2 caracteres")
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 10) {
    errors.push("Descrição é obrigatória e deve ter pelo menos 10 caracteres")
  }

  if (!data.address || typeof data.address !== "object") {
    errors.push("Endereço é obrigatório")
  } else {
    const { street, number, neighborhood, city, state, zipCode } = data.address
    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      errors.push("Todos os campos do endereço são obrigatórios")
    }
  }

  if (!data.contact || typeof data.contact !== "object") {
    errors.push("Informações de contato são obrigatórias")
  } else {
    if (!data.contact.phone) {
      errors.push("Telefone é obrigatório")
    }
  }

  if (!data.hours || typeof data.hours !== "object") {
    errors.push("Horários de funcionamento são obrigatórios")
  }

  if (!data.services || !Array.isArray(data.services) || data.services.length === 0) {
    errors.push("Pelo menos um serviço deve ser informado")
  } else {
    data.services.forEach((service: any, index: number) => {
      if (!service.name || !service.price || !service.duration || !service.category) {
        errors.push(`Serviço ${index + 1}: nome, preço, duração e categoria são obrigatórios`)
      }
    })
  }

  if (!data.priceRange || !["low", "medium", "high"].includes(data.priceRange)) {
    errors.push("Faixa de preço deve ser: low, medium ou high")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateUpdateBarbershop(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim().length < 2)) {
    errors.push("Nome deve ter pelo menos 2 caracteres")
  }

  if (data.description !== undefined && (typeof data.description !== "string" || data.description.trim().length < 10)) {
    errors.push("Descrição deve ter pelo menos 10 caracteres")
  }

  if (data.priceRange !== undefined && !["low", "medium", "high"].includes(data.priceRange)) {
    errors.push("Faixa de preço deve ser: low, medium ou high")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateReview(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.customerName || typeof data.customerName !== "string" || data.customerName.trim().length < 2) {
    errors.push("Nome do cliente é obrigatório")
  }

  if (!data.rating || typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    errors.push("Avaliação deve ser um número entre 1 e 5")
  }

  if (!data.comment || typeof data.comment !== "string" || data.comment.trim().length < 5) {
    errors.push("Comentário é obrigatório e deve ter pelo menos 5 caracteres")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
