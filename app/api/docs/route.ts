import { NextResponse } from "next/server"

export async function GET() {
  const apiDocs = {
    title: "Barbershop Directory API",
    version: "1.0.0",
    description: "API completa para diretório de barbearias",
    baseUrl: "/api",
    endpoints: {
      barbershops: {
        "GET /barbershops": {
          description: "Lista todas as barbearias",
          response: "Array de barbearias com informações completas",
        },
        "POST /barbershops": {
          description: "Cria uma nova barbearia",
          body: "Dados da barbearia (nome, endereço, contato, horários, serviços, etc.)",
          response: "Barbearia criada",
        },
        "GET /barbershops/{id}": {
          description: "Busca barbearia por ID",
          response: "Dados completos da barbearia",
        },
        "PUT /barbershops/{id}": {
          description: "Atualiza dados da barbearia",
          body: "Campos a serem atualizados",
          response: "Barbearia atualizada",
        },
        "DELETE /barbershops/{id}": {
          description: "Remove barbearia",
          response: "Confirmação de remoção",
        },
        "GET /barbershops/search": {
          description: "Busca barbearias com filtros",
          queryParams: [
            "city - Filtrar por cidade",
            "state - Filtrar por estado",
            "neighborhood - Filtrar por bairro",
            "priceRange - low|medium|high",
            "services - Nome do serviço",
            "amenities - Nome da comodidade",
            "rating - Avaliação mínima",
            "verified - true|false",
          ],
          response: "Array de barbearias filtradas",
        },
      },
      reviews: {
        "GET /barbershops/{id}/reviews": {
          description: "Lista avaliações de uma barbearia",
          response: "Array de avaliações",
        },
        "POST /barbershops/{id}/reviews": {
          description: "Adiciona avaliação à barbearia",
          body: "customerName, rating (1-5), comment",
          response: "Avaliação criada",
        },
      },
      stats: {
        "GET /stats": {
          description: "Estatísticas gerais do diretório",
          response: "Dados estatísticos (total de barbearias, avaliações, etc.)",
        },
      },
    },
    examples: {
      createBarbershop: {
        name: "Barbearia Exemplo",
        description: "Descrição da barbearia",
        address: {
          street: "Rua Exemplo",
          number: "123",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
        },
        contact: {
          phone: "(11) 99999-9999",
          whatsapp: "(11) 99999-9999",
          email: "contato@exemplo.com",
          instagram: "@exemplo",
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
            category: "corte",
          },
        ],
        amenities: ["Wi-Fi", "Ar Condicionado"],
        images: ["url1", "url2"],
        priceRange: "medium",
      },
      createReview: {
        customerName: "João Silva",
        rating: 5,
        comment: "Excelente atendimento e corte perfeito!",
      },
    },
  }

  return NextResponse.json(apiDocs)
}
