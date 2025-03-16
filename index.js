import { Factory } from "./dist/index.js";

(() => {
    const config = ['knows', 'likes', 'alvin'];
    const f = new Factory({ edges: config, edgesDisable: false });

    const query1 = f.create()
        .g.V('123').as('a')
        .out('knows').as('b').select('a').custom(
            Factory.from(f).select('a').toString
        )
        .toString;

    const query2 = Factory.from().custom('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')')
        .toString;

    const f2 = new Factory();

    const names = (b) => b.select('vertex').in('alvin').values('micky');
    const ages = (b) => b.select('vertex').in('likes').values('age').fold();

    const query3 = Factory.from(f2).g.V('123').as('vertex').project([
        { name: 'todo', by: (b) => b.valueMap() },
        { name: 'name', by: names },
        { name: 'age', by: ages },
    ]).toString;

    console.log(query1);
    console.log(query2);
    console.log(query3);
})();
