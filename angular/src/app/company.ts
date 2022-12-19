export class Company {
    company_id: number | null
    name: string
    website?: string | "URL not provided"
    description?: string | "No description"
    establishment_date?: number
    location?: string | "Location not provided"
    email?: string
    contact_no? : string
    pic_url?: string
    pic_url_old?: string
    edited?: boolean
}
