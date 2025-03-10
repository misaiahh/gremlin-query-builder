import checkDot from "./checkDot.js";

/**
* Creates a .V('vertex') and adds it to the current query string.
* 
* @param {String} id The Vertex ID.
* @this {QueryBuilder} The query builder object.
*/
export default function (id = '') {
    this.query += `${checkDot(this.query)}V('${id}')`;
    return this;
}