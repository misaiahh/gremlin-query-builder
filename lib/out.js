import checkDot from "./checkDot.js";

/**
* Creates an out('edge') and adds it to the current query string.
* 
* @param {String} edge The Edge ID.
* @this {QueryBuilder} The query builder object.
*/
export default function (edge = '') {
    this.query += `${checkDot(this.query)}out('${edge}')`;
    return this;
}