/**
* Checks if the given string ends with an opening parenthesis.
* 
* @param {String} str The string to be checked.
* @returns {String} Returns an empty string if `str` ends with '(', otherwise returns a dot '.'.
*/
export default function checkDot(str = '') {
    return str.endsWith('(') || str.endsWith('.') || str.length === 0 ? '' : '.';
}