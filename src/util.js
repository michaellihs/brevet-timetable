export function copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    navigator.clipboard.writeText(input.value).then(r => console.log('Copied value ' + input.value + ' to clipboard'));
}