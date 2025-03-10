import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an outE('edge') and adds it to the current query string.
* 
* @param {String} edge The Edge ID.
* @returns {QueryBuilder} The query builder object.
*/
export function outE(edge = '') {
    this.query += `${checkDot(this.query)}outE('${edge}')`;
    return this;
}