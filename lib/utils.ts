export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function clsx(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Available',
    reserved: 'Reserved',
    borrowed: 'Borrowed',
    requested: 'Requested',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    returned: 'Returned',
  };
  return labels[status] ?? status;
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    available: 'text-green-600 bg-green-50',
    reserved: 'text-yellow-600 bg-yellow-50',
    borrowed: 'text-red-600 bg-red-50',
    requested: 'text-blue-600 bg-blue-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
    cancelled: 'text-gray-500 bg-gray-50',
    returned: 'text-gray-600 bg-gray-50',
  };
  return colors[status] ?? 'text-gray-600 bg-gray-50';
}
