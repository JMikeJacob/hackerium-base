import { Tag } from './tag'

export class Seeker {
    id: string | null
    user_id?: string
    email: string
    password?: string
    last_name: string
    lastname?: string
    first_name: string
    firstname?: string
    contact_no?: string
    contact?: string
    salary_per_month?: number
    gender?: string
    birthdate?: number
    education?: string
    level?: string
    tags?: any[]
    skills?: Tag[]
    fields?: Tag[]
    pic_url?: string
    pic_url_old?: string
    resume_url?: string
    resume_url_old?: string
    edited?: boolean
    aggregate_id?:string

    constructor() {
        this.id = null
        this.email = ""
        this.last_name = ""
        this.first_name = ""
    }
}
