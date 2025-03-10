import checkDot from "./checkDot.js";

/**
* Creates an inE('edge') and adds it to the current query string.
* 
* @param {String} alias the vertex or edge's alias.
* @this {QueryBuilder} The query builder object.
*/
export default function (alias = '') {
    this.query += `${checkDot(this.query)}select('${alias}')`;
    return this;
}