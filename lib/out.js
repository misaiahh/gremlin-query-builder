import checkDot from "./checkDot.js";

/**
 * @typedef {import('./types.js').QueryBuilder} QueryBuilder
 */

/**
* Creates an out('edge') and adds it to the current query string.
* 
* @param {String} edge The Edge ID.
* @returns {QueryBuilder} The query builder object.
*/
export function out(edge = '') {
    this.query += `${checkDot(this.query)}out('${edge}')`;
    return this;
}