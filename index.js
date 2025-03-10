import gremlin from "./lib/index.js";

(() => {
    // g.V('123').as('a').out('knows').as('b')
    const query = gremlin()
        .g.V('123').as('a')
        .out('knows').as('b')
        .toString;

    // g.V('123').as('a').out('knows').as('b')
    const query1 = gremlin().push('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')')
        .toString;

    console.log(query);
    console.log(query1);
})();