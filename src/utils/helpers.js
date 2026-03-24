export const initials = (name) => {
    const safeName = String(name || '');
    return safeName
        .trim()
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
};

export const colorMap = {
    sw1: { bg: '#ede9fe', tc: '#7c3aed' },
    sw2: { bg: '#dbeafe', tc: '#1d4ed8' },
    sw3: { bg: '#dcfce7', tc: '#15803d' },
    sw4: { bg: '#fef3c7', tc: '#b45309' },
    sw5: { bg: '#fee2e2', tc: '#b91c1c' },
    sw6: { bg: '#e0f2fe', tc: '#0369a1' },
    sw7: { bg: '#f3e8ff', tc: '#7e22ce' },
    sw8: { bg: '#fce7f3', tc: '#be185d' },
};

export const swatchColor = Object.keys(colorMap);

export const formatDateTime = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

export const shortHash = () =>
    '0x' + Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join();
