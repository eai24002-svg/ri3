export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getShowStatusByAvailability = (bookedSeats: number, totalSeats: number) => {
  const free = totalSeats - bookedSeats

  if (free <= 0) {
    return 'full'
  }

  if (free <= 3) {
    return 'limited'
  }

  return 'available'
}
