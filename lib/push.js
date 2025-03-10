import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an custom gremlin query and adds it to the current query string.
* 
* @param {String} queryString a custom query builder object.
* @returns {QueryBuilder} The query builder object.
*/
export function push(queryString = '') {
    this.query += `${checkDot(this.query)}${queryString}`;
    return this;
}