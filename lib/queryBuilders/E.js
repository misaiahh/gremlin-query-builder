import checkDot from "./checkDot.js";

/**
* Creates a g.E() query string.
* 
* @param {String} id The Edge ID.
* @this {QueryBuilder} The query builder object.
*/
export default function (id = '') {
    this.query += `${checkDot(this.query)}E('${id}')`;
    return this;
}