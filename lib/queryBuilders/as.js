import checkDot from "./checkDot.js";

/**
* Creates an as('name') alias and adds it to the current query string.
* 
* @param {String} name The alias's name.
* @this {QueryBuilder} The query builder object.
*/
export default function (name = '') {
    this.query += `${checkDot(this.query)}as('${name}')`;
    return this;
}