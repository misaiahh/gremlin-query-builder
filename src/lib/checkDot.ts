export default function checkDot(str: string = '') {
    return str.endsWith('(') || str.endsWith('.') || str.length === 0 ? '' : '.';
}