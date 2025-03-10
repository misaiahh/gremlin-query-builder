import gremlin from "./lib/queryBuilders/index.js";

/**
 * Returns a new query builder object.
 * 
 * @type {QueryBuilder} A new query builder object.
 */


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