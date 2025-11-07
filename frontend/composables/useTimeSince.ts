export default function (dateInput: string) {
  const now: any = new Date()
  const past: any = new Date(dateInput)
  const seconds: any = Math.floor((now - past) / 1000)

  const intervals: any = [
    { label: 'سال', seconds: 31536000 },
    { label: 'ماه', seconds: 2592000 },
    { label: 'هفته', seconds: 604800 },
    { label: 'روز', seconds: 86400 },
    { label: 'ساعت', seconds: 3600 },
    { label: 'دقیقه', seconds: 60 },
    { label: 'ثانیه', seconds: 1 },
  ]

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds)
    if (interval >= 1) {
      return `${interval} ${intervals[i].label} پیش`
    }
  }

  return 'همین الان'
}
