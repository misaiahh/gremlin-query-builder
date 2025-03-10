import V from './V.js';
import checkDot from './checkDot.js';

/**
 * Returns a new query builder object.
 * 
 * @type {QueryBuilder} A new query builder object.
 */
export default function gremlin() {
    let query = '';
    return {
        query: query,
        get g() {
            this.query += 'g.';
            return this;
        },
        get toString() {
            return this.query;
        },
        V: V,
        E: function (id = '') {
            this.query += `${checkDot(this.query)}E('${id}')`;
            return this;
        },
        in: function (edge = '') {
            this.query += `${checkDot(this.query)}in('${edge}')`;
            return this;
        },
        inE: function (edge = '') {
            this.query += `${checkDot(this.query)}inE('${edge}')`;
            return this;
        },
        out: function (edge = '') {
            this.query += `${checkDot(this.query)}out('${edge}')`;
            return this;
        },
        outE: function (edge = '') {
            this.query += `${checkDot(this.query)}outE('${edge}')`;
            return this;
        },
        as: function (name = '') {
            this.query += `${checkDot(this.query)}as('${name}')`;
            return this;
        },
        select: function (name = '') {
            this.query += `${checkDot(this.query)}select('${name}')`;
            return this;
        },
        push: function (queryString = '') {
            this.query += `${checkDot(this.query)}${queryString}`;
            return this;
        }
    }
}