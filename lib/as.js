import checkDot from "./checkDot.js";

/**
 * Adds a vertex step with the specified `id`.
 * 
 * @param {String} name The alias ID.
 */
export function as(name = '') {
    this.query += `${checkDot(this.query)}as('${name}')`;
    return this;
}