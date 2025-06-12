import { NextResponse } from "next/server"

interface FinanceBill {
  id: string
  year: number
  title: string
  status: "draft" | "public_participation" | "parliamentary_debate" | "passed" | "withdrawn" | "assented"
  totalRevenue: string
  keyChanges: string[]
  timeline: Array<{
    date: string
    event: string
    status: "completed" | "in-progress" | "pending" | "cancelled"
    description?: string
  }>
  documents: Array<{
    title: string
    url: string
    type: "bill" | "memorandum" | "report" | "amendment"
    date: string
  }>
  publicParticipation: {
    startDate?: string
    endDate?: string
    venues: string[]
    submissionsCount: number
    documentsUrl?: string
  }
  corruptionConcerns: string[]
  impactAssessment: {
    economicImpact: string
    socialImpact: string
    businessImpact: string
  }
}

const financeBillsData: FinanceBill[] = [
  {
    id: "fb-2024",
    year: 2024,
    title: "Finance Bill 2024",
    status: "withdrawn",
    totalRevenue: "KSh 3.34 trillion",
    keyChanges: [
      "16% VAT on bread and other basic commodities",
      "Eco levy on diapers and sanitary towels",
      "Motor vehicle tax increase from 2% to 2.5%",
      "Digital services tax at 1.5%",
      "Excise duty on cooking oil at KSh 25 per litre",
      "Housing levy increase to 3%",
      "Import declaration fee of 2.5%",
    ],
    timeline: [
      {
        date: "2024-05-09",
        event: "Finance Bill 2024 introduced to Parliament",
        status: "completed",
        description: "Bill officially tabled in National Assembly",
      },
      {
        date: "2024-05-20",
        event: "Public participation period begins",
        status: "completed",
        description: "30-day public consultation period started",
      },
      {
        date: "2024-06-18",
        event: "Parliamentary committee hearings",
        status: "completed",
        description: "Finance Committee conducted public hearings",
      },
      {
        date: "2024-06-25",
        event: "Nationwide protests - Occupy Parliament",
        status: "completed",
        description: "Gen Z-led protests against the bill",
      },
      {
        date: "2024-06-26",
        event: "President Ruto withdraws the bill",
        status: "completed",
        description: "Bill withdrawn following public pressure",
      },
    ],
    documents: [
      {
        title: "Finance Bill 2024 (Original)",
        url: "https://parliament.go.ke/finance-bill-2024",
        type: "bill",
        date: "2024-05-09",
      },
      {
        title: "Memorandum on Finance Bill 2024",
        url: "https://treasury.go.ke/memorandum-2024",
        type: "memorandum",
        date: "2024-05-09",
      },
      {
        title: "Public Participation Report",
        url: "https://parliament.go.ke/public-participation-2024",
        type: "report",
        date: "2024-06-20",
      },
    ],
    publicParticipation: {
      startDate: "2024-05-20",
      endDate: "2024-06-19",
      venues: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri"],
      submissionsCount: 156789,
      documentsUrl: "https://parliament.go.ke/finance-bill-2024-submissions",
    },
    corruptionConcerns: [
      "Limited genuine public participation",
      "Rushed parliamentary process",
      "Influence of special interest groups",
      "Inadequate socio-economic impact assessment",
      "Lack of transparency in revenue projections",
    ],
    impactAssessment: {
      economicImpact: "Projected to increase cost of living by 15-20% for average households",
      socialImpact: "Disproportionate burden on low-income families and vulnerable populations",
      businessImpact: "Increased operational costs for SMEs and manufacturing sector",
    },
  },
  {
    id: "fb-2025",
    year: 2025,
    title: "Finance Bill 2025",
    status: "draft",
    totalRevenue: "KSh 3.7 trillion",
    keyChanges: [
      "Digital economy taxation framework",
      "Green economy tax incentives",
      "SME tax relief measures",
      "Infrastructure development levy",
      "Healthcare financing reforms",
      "Education sector funding increase",
      "Agricultural sector support measures",
    ],
    timeline: [
      {
        date: "2025-01-15",
        event: "Stakeholder pre-consultation meetings",
        status: "in-progress",
        description: "Treasury engaging key stakeholders",
      },
      {
        date: "2025-03-01",
        event: "Draft bill publication expected",
        status: "pending",
        description: "Public release of draft legislation",
      },
      {
        date: "2025-03-15",
        event: "Public participation period",
        status: "pending",
        description: "60-day enhanced public consultation",
      },
      {
        date: "2025-05-15",
        event: "Parliamentary committee review",
        status: "pending",
        description: "Detailed committee analysis and hearings",
      },
      {
        date: "2025-06-30",
        event: "Expected passage and assent",
        status: "pending",
        description: "Final parliamentary vote and presidential assent",
      },
    ],
    documents: [
      {
        title: "Finance Bill 2025 - Concept Paper",
        url: "https://treasury.go.ke/finance-bill-2025-concept",
        type: "report",
        date: "2025-01-10",
      },
    ],
    publicParticipation: {
      venues: ["All 47 counties", "Online platform", "Diaspora consultations"],
      submissionsCount: 0,
      documentsUrl: "https://treasury.go.ke/finance-bill-2025-participation",
    },
    corruptionConcerns: [
      "Need for enhanced transparency in drafting process",
      "Adequate time for public participation",
      "Clear socio-economic impact assessments required",
      "Lobbying disclosure and regulation needed",
      "Parliamentary oversight mechanisms",
    ],
    impactAssessment: {
      economicImpact: "Projected to support economic growth while maintaining fiscal sustainability",
      socialImpact: "Focus on reducing inequality and supporting vulnerable populations",
      businessImpact: "Balanced approach to support business growth while ensuring fair taxation",
    },
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")
    const billId = searchParams.get("id")

    if (billId) {
      const bill = financeBillsData.find((b) => b.id === billId)
      if (!bill) {
        return NextResponse.json(
          {
            success: false,
            error: "Finance bill not found",
          },
          { status: 404 },
        )
      }
      return NextResponse.json({
        success: true,
        data: bill,
      })
    }

    let bills = financeBillsData
    if (year) {
      bills = bills.filter((b) => b.year.toString() === year)
    }

    return NextResponse.json({
      success: true,
      data: bills,
      total: bills.length,
    })
  } catch (error) {
    console.error("Error fetching finance bills:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch finance bills",
        data: [],
      },
      { status: 500 },
    )
  }
}
