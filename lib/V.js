import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates a .V('vertex') and adds it to the current query string.
* 
* @param {String} id The Vertex ID.
* @returns {QueryBuilder} The query builder object.
*/
export function V(id = '') {
    this.query += `${checkDot(this.query)}V('${id}')`;
    return this;
}