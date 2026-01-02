export function formatDate(dateVal: Date | string | { $date: string } | undefined | null): string {
    if (!dateVal) return '';

    let dateObj: Date;

    try {
        if (dateVal instanceof Date) {
            dateObj = dateVal;
        } else if (typeof dateVal === 'string') {
            dateObj = new Date(dateVal);
        } else if (typeof dateVal === 'object' && '$date' in dateVal) {
            dateObj = new Date(dateVal.$date);
        } else {
            // Fallback for unknown object types that might represent date
            // e.g. some CMS might return seconds/milliseconds timestamp
            dateObj = new Date(dateVal as any);
        }

        // Check if valid date
        if (isNaN(dateObj.getTime())) {
            console.warn('Invalid date received:', dateVal);
            return '';
        }

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (err) {
        console.error('Error parsing date:', err);
        return '';
    }
}
