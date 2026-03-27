import type { Movie, Seat, Showtime } from '~/types'
import { queryRows } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const movies = await queryRows<Movie>(
    `SELECT * FROM movies
     WHERE is_active = 1
     ORDER BY created_at DESC`
  )

  const moviesWithShows = await Promise.all(
    movies.map(async (movie) => {
      const showtimes = await queryRows<Showtime>(
        `SELECT * FROM showtimes
         WHERE movie_id = :movieId
         ORDER BY show_date ASC, show_time ASC`,
        { movieId: movie.id }
      )

      const hydratedShows = await Promise.all(
        showtimes.map(async (showtime) => {
          const seats = await queryRows<Seat>(
            `SELECT * FROM seats
             WHERE showtime_id = :showtimeId
             ORDER BY seat_number ASC`,
            { showtimeId: showtime.id }
          )

          return {
            ...showtime,
            seats,
            booked_count: seats.filter((seat) => seat.is_booked === 1).length
          }
        })
      )

      return {
        ...movie,
        showtimes: hydratedShows
      }
    })
  )

  return {
    data: moviesWithShows
  }
})
