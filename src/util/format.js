export function roundWithDigits(value, digits) {
    return value.toLocaleString('en-US', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
        useGrouping: false
    });
}