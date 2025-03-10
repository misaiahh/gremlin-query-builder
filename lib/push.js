import checkDot from "./checkDot.js";

/**
* Creates an custom gremlin query and adds it to the current query string.
* 
* @param {String} queryString a custom query builder object.
* @this {QueryBuilder} The query builder object.
*/
export default function (queryString = '') {
    this.query += `${checkDot(this.query)}${queryString}`;
    return this;
}