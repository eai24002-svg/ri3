import { z } from 'zod'
import { executeWrite } from '~/server/utils/db'

const bodySchema = z.object({
  movie_id: z.coerce.number().int().min(1),
  show_date: z.string().min(8),
  show_time: z.string().min(4),
  total_seats: z.coerce.number().int().min(10).max(10),
  status: z.enum(['available', 'limited', 'full', 'closed'])
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = bodySchema.parse(await readBody(event))

  await executeWrite(
    `UPDATE showtimes SET
      movie_id = :movie_id,
      show_date = :show_date,
      show_time = :show_time,
      total_seats = :total_seats,
      status = :status
     WHERE id = :id`,
    { ...body, id }
  )

  return { ok: true }
})
