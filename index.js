import { V, checkDot } from './lib/queryBuilders/index.js';

/**
 * Typedef for the query builder object.
 * 
 * @typedef {Object} QueryBuilder
 * @property {function(id: string): QueryBuilder} V Adds a vertex step with the specified `id`.
 * @property {function(id: string): QueryBuilder} E Adds a vertex step with the specified `id`.
 * @property {function(edge: string): QueryBuilder} in Adds an ingoing edge step with the specified `edge`.
 * @property {function(edge: string): QueryBuilder} inE Adds an ingoing edge element step with the specified `edge`.
 * @property {function(edge: string): QueryBuilder} out Adds an outgoing edge step with the specified `edge`.
 * @property {function(edge: string): QueryBuilder} outE Adds an outgoing edge element step with the specified `edge`.
 * @property {function(name: string): QueryBuilder} as Adds an alias step with the specified `name`.
 * @property {function(name: string): QueryBuilder} select Adds a select step with the specified `name`.
 * @property {function(queryString: string): QueryBuilder} push Adds a custom gremlin string code to the query.
 */

/**
 * Returns a new query builder object.
 * 
 * @type {QueryBuilder} A new query builder object.
 */
function gremlin() {
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

(() => {
    // g.V('123').as('a').out('knows').as('b')
    const query = gremlin()
        .g.V('123').as('a')
        .out('knows').as('b')
        .toString;

    const query1 = gremlin().push('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')')
        .toString;

    console.log(query);
    console.log(query1);
})();