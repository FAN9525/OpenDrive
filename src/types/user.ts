export type UserRole = 'Broker' | 'Client' | 'Insurer' | 'UMA' | 'Assessor' | 'Service Provider'

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  company_id?: string | null
  created_at?: string
}


