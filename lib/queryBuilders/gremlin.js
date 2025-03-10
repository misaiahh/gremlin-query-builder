import as from './as.js';
import V from './V.js';
import E from './E.js';
import In from './in.js';
import inE from './inE.js';
import out from './out.js';
import outE from './outE.js';
import select from './select.js';
import push from './push.js';

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
        E: E,
        in: In,
        inE: inE,
        out: out,
        outE: outE,
        as: as,
        select: select,
        push: push,
    }
}