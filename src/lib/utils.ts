
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.toLocaleString('en', { month: 'long' })
  const day = date.getDate()

  if (date.getMonth() === 0 && day === 1) return `${year}`
  if (day === 1) return `${month} ${year}`
  return `${month} ${day}, ${year}`
}