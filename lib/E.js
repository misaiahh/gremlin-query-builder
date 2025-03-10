import checkDot from "./checkDot.js";

/**
* Creates an .E('edge') and adds it to the current query string.
* 
* @param {String} id The Edge ID.
* @this {QueryBuilder} The query builder object.
*/
export default function (id = '') {
    this.query += `${checkDot(this.query)}E('${id}')`;
    return this;
}