export default function (status: string) {
  switch (status) {
    case 'Finish':
      return 'bg-green-500/20 text-green-400'
    case 'Approved':
      return 'bg-green-500/20 text-green-400'
    case 'Cancel':
      return 'bg-red-500/20 text-red-400'
    case 'Closed':
      return 'bg-red-500/20 text-red-400'
    case 'New':
      return 'bg-blue-500/20 text-blue-400'
    case 'Open':
      return 'bg-blue-500/20 text-blue-400'
    case 'Processing':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'Pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'Rejected':
      return 'bg-red-500/20 text-red-400'
    case 'Inactive':
      return 'bg-orange-500/20 text-orange-400'
    case 'Active':
      return 'bg-green-500/20 text-green-400'
    case 'Deleted':
      return 'bg-red-500/20 text-red-400'
    case 'Cancelled':
      return 'bg-red-500/20 text-red-400'
    default:
      break
  }
}
