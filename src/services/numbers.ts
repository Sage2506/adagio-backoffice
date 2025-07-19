export const formatPrice = (amount: number): string => {
    return Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

export const formatPrettyDateShort = (dateString: string): string => {
    const date = new Date(`${dateString}T00:00:00Z`)
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const year = String(date.getUTCFullYear());
    return `${day}-${month}-${year}`;
}

