import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an inE('edge') and adds it to the current query string.
* 
* @param {String} alias the vertex or edge's alias.
* @returns {QueryBuilder} The query builder object.
*/
export function select(alias = '') {
    this.query += `${checkDot(this.query)}select('${alias}')`;
    return this;
}