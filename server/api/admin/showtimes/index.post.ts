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
  const body = bodySchema.parse(await readBody(event))

  const insertResult = await executeWrite(
    `INSERT INTO showtimes
      (movie_id, show_date, show_time, total_seats, status)
     VALUES
      (:movie_id, :show_date, :show_time, :total_seats, :status)`,
    body
  )

  const insertId = insertResult.insertId

  for (let seat = 1; seat <= body.total_seats; seat += 1) {
    await executeWrite(
      'INSERT INTO seats (showtime_id, seat_number, is_booked) VALUES (:showtimeId, :seatNumber, 0)',
      { showtimeId: insertId, seatNumber: seat }
    )
  }

  return { ok: true }
})
