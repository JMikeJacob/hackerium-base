import { Tag } from './tag'

export class Job {
    job_id: string
    job_name: string
    company_name: string
    type: string
    level: string
    field: string
    posted_by_id: number
    job_location: string
    description: string
    qualifications: string
    is_open: string
    date_posted: number
    date_deadline: number
    count?: number
    tags: Tag[]
    edited?: boolean
}
