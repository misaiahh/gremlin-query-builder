import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an in('edge') and adds it to the current query string.
* 
* @param {String} edge The Edge ID.
* @returns {QueryBuilder} The query builder object.
*/
export function In(edge = '') {
    this.query += `${checkDot(this.query)}in('${edge}')`;
    return this;
}