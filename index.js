import { Factory } from "./dist/index.js";

(() => {
    const config = ['knows', 'likes', 'alvin'];
    const f = new Factory({ edges: config, edgesDisable: false });

    const query = f.create()
        .g.V('123').as('a')
        .out('knows').as('b').select('a').custom(
            Factory.from(f).select('a').toString
        )
        .toString;

    const query1 = Factory.from().custom('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')')
        .toString;

    const f2 = new Factory();
    const query2 = f2.create().g.V('123').as('vertex').project([
        ['name', Factory.from(f2).select('vertex').in('alvin').values('micky').toString],
        ['age', Factory.from(f2).select('vertex').in('likes').values('age').fold().toString],
    ]).toString;

    console.log(query);
    console.log(query1);
    console.log(query2);
})();
