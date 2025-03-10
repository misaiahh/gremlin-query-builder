import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an .E('edge') and adds it to the current query string.
* 
* @param {String} id The Edge ID.
* @returns {QueryBuilder} The query builder object.
* @this {QueryBuilder}
*/
export function E(id = '') {
    this.query += `${checkDot(this.query)}E('${id}')`;
    return this;
}