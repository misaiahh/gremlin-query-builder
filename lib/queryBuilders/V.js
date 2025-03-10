import checkDot from "./checkDot.js";

/**
* Checks if the given string ends with an opening parenthesis.
* 
* @param {String} id The Vertex ID.
* @this {QueryBuilder} The query builder object.
*/
export default function (id = '') {
    this.query += `${checkDot(this.query)}V('${id}')`;
    return this;
}