import Gremlin from "./gremlin.js";

(() => {
    const edges = ['knows', 'likes'];
    // g.V('123').as('a').out('knows').as('b')
    const qb = new Gremlin({ edges });
    const query = qb
        .g.V('123').as('a')
        .out('knows').as('b').select('a').custom(
            new Gremlin(qb.config).select('a').toString
        )
        .toString;

    // g.V('123').as('a').out('knows').as('b')
    const query1 = new Gremlin().custom('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')')
        .toString;

    const qb2 = new Gremlin();
    const query2 = qb2.g.V('123').as('vertex').project([
        ['name', new Gremlin(qb2.config).select('alvin').in('knows').values('micky').toString],
        ['age', new Gremlin(qb2.config).select('vertex').in('likes').values('age').fold().toString],
    ]).raw;

    // console.log(query);
    // console.log(query1);
    console.log(query2);
})();