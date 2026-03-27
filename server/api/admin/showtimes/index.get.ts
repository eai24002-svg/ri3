import type { Seat, Showtime } from '~/types'
import { queryRows } from '~/server/utils/db'

type Row = Showtime & { movie_title: string }

export default defineEventHandler(async () => {
  const showtimes = await queryRows<Row>(
    `SELECT s.*, m.title as movie_title
     FROM showtimes s
     INNER JOIN movies m ON m.id = s.movie_id
     ORDER BY s.show_date ASC, s.show_time ASC`
  )

  const hydrated = await Promise.all(
    showtimes.map(async (showtime) => {
      const seats = await queryRows<Seat>(
        `SELECT * FROM seats
         WHERE showtime_id = :showtimeId
         ORDER BY seat_number ASC`,
        { showtimeId: showtime.id }
      )

      return {
        ...showtime,
        seats
      }
    })
  )

  return { data: hydrated }
})
