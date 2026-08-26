import { createAnonClient } from '@/lib/supabase/server'

type CreateContactMessageInput = {
  name: string
  contact: string
  message: string
}

export async function createContactMessage(input: CreateContactMessageInput) {
  const id = crypto.randomUUID()
  const { name, contact, message } = input
  const supabase = createAnonClient()

  // Same reasoning as createReview/createRequest: anon has no select policy
  // on contact_messages, so we generate the id ourselves and skip .select().
  const { error } = await supabase.from('contact_messages').insert({
    id,
    name,
    contact,
    message,
  })

  if (error) throw error

  return { id }
}
