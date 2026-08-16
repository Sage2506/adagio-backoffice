import type { Dispatch, SetStateAction } from "react";

export const formatPrice = (amount: number): string => {
    return Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

export const formatPrettyDateShort = (dateString: string): string => {
    if (!dateString) return "N/A";
    // Extrae solo la parte de la fecha (YYYY-MM-DD)
    const [year, month, day] = dateString.split('T')[0].split('-');
    // Obtiene el nombre corto del mes
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const monthShort = date.toLocaleString('es-MX', { month: 'short' });
    return `${day.padStart(2, '0')}-${monthShort}-${year}`;
}

export const formatPrettyLongDateShort = (dateString: string): string => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const year = String(date.getUTCFullYear());
    return `${day}-${month}-${year}`;
}

export const handlePriceInputChange = (event: React.ChangeEvent<HTMLInputElement>, setState: Dispatch<SetStateAction<string>>) => {
    const value = event.target.value;
    if(value === ''){
        setState('');
        return;
    }

    const priceRegex = /^\d*\.?\d{0,2}$/;
    if(priceRegex.test(value) ){
        setState(value)
    }
}


