const formatPrice = (amount: number): string => {
    return Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

export default formatPrice;