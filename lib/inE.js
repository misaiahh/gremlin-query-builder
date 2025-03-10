import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an inE('edge') and adds it to the current  query string.
* 
* @param {String} edge The Edge ID.
* @returns {QueryBuilder} The query builder object.
*/
export function inE(edge = '') {
    this.query += `${checkDot(this.query)}inE('${edge}')`;
    return this;
}