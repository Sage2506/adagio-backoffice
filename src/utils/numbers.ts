import type { Dispatch, SetStateAction } from "react";

interface DateParts {
    year: number;
    month: number;
    day: number;
}

function getDateParts(dateString: string): DateParts | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(dateString);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!month || month > 12 || !day || day > new Date(Date.UTC(year, month, 0)).getUTCDate()) {
        return null;
    }

    if (!dateString.includes('T')) return { year, month, day };

    const timestamp = new Date(dateString);
    if (Number.isNaN(timestamp.getTime())) return null;

    return {
        year: timestamp.getUTCFullYear(),
        month: timestamp.getUTCMonth() + 1,
        day: timestamp.getUTCDate(),
    };
}

export const formatPrice = (amount: number): string => {
    return Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

export const formatCurrencyValue = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export const formatPrettyDateShort = (dateString: string): string => {
    if (!dateString) return "N/A";
    const parts = getDateParts(dateString);
    if (!parts) return "N/A";
    const { year, month, day } = parts;
    const monthShort = new Date(Date.UTC(year, month - 1, day)).toLocaleString('es-MX', {
        month: 'short',
        timeZone: 'UTC',
    });
    return `${String(day).padStart(2, '0')}-${monthShort}-${year}`;
}

// Date-only values are calendar dates; timestamps are formatted in UTC.
export const formatDayMonth = (dateString?: string | null): string => {
    if (!dateString) return "N/A";
    const parts = getDateParts(dateString);
    if (!parts) return "N/A";
    return `${String(parts.day).padStart(2, '0')}/${String(parts.month).padStart(2, '0')}`;
}

export const formatPrettyLongDateShort = (dateString: string): string => {
    if (!dateString) return "N/A";
    const parts = getDateParts(dateString);
    if (!parts) return "N/A";
    const { year, month, day } = parts;
    const date = new Date(Date.UTC(year, month - 1, day));
    const monthShort = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const dayString = String(day).padStart(2, '0');
    return `${dayString}-${monthShort}-${year}`;
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

