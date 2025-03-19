import { describe, it } from 'node:test';
import assert from 'node:assert';
import Factory, { Builder } from '../Builder.ts';

describe('Gremlin Query Builder', () => {
    describe('Factory', () => {
        it('should return an instance of the Factory class', () => {
            const factory = new Factory();
            assert.strictEqual(factory instanceof Factory, true);
        });

        it('should return an instance of the Builder class', () => {
            const builder = new Factory().create();
            assert.strictEqual(builder instanceof Builder, true);
        });

        it('should initialize with default values', () => {
            const factory = new Factory();
            assert.strictEqual(factory.config.aliases.length, 0);
            assert.strictEqual(factory.config.edges.length, 0);
            assert.strictEqual(factory.config.disableAliases, false);
            assert.strictEqual(factory.config.disableEdges, true);
        });

        it('should add an alias', () => {
            const factory = new Factory();
            factory.create().as('testAlias');
            assert.strictEqual(factory.config.aliases.includes('testAlias'), true);
        });

        it('should validate alias', () => {
            const factory = new Factory();
            factory.create().as('testAlias');
            assert.doesNotThrow(() => Factory.from(factory).select('testAlias'));
            assert.throws(() => Factory.from(factory).select('unknownAlias'), /Alias 'unknownAlias' was not found/);
        });

        it('should have edges', () => {
            const factory = new Factory({ edges: ['knows'], disableEdges: false });
            const builder = factory.create();
            assert.strictEqual(builder.config.edges.includes('knows'), true);
        });

        it('should validate edge', () => {
            const factory = new Factory({ edges: ['knows'], disableEdges: false });
            const builder = factory.create();
            assert.doesNotThrow(() => builder.E('knows'));
            assert.throws(() => builder.E('unknownEdge'), /Edge 'unknownEdge' was not found/);
        });

        it('should return an instance of the Builder class with existing aliases', () => {
            const factory = new Factory();
            factory.create().g.V('123').as('V');
            const builder = Factory.from(factory);
            assert.strictEqual(builder.config.aliases.includes('V'), true);
        });

        it('should generate correct query string', () => {
            const factory = new Factory().create();
            factory.g.V('123').as('a').out('knows').as('b').select('a');
            assert.strictEqual(factory.toString, "g.V('123').as('a').out('knows').as('b').select('a')");
        });

        it('should generate raw query string with newlines', () => {
            const factory = new Factory().create();
            factory.g.V('123').as('a').out('knows').as('b').select('a');
            assert.strictEqual(factory.raw, "g.V('123').\nas('a').\nout('knows').\nas('b').\nselect('a')");
        });
    });

    describe('Builder', () => {
        it('should return an instance of the Builder class', () => {
            const builder = new Builder();
            assert.strictEqual(builder instanceof Builder, true);
        });

        it('should not check edges if disableEdges is true', () => {
            const builder = new Factory({ disableEdges: true }).create();
            builder.g.V('123').E('knows');
            assert.strictEqual(builder.toString, "g.V('123').E('knows')");
        });

        it('should check edges if disableEdges is false', () => {
            const builder = new Factory({ edges: ['knows'], disableEdges: false }).create();
            builder.g.V('123').E('knows');
            assert.strictEqual(builder.toString, "g.V('123').E('knows')");
        });

        it('should throw an error if edge is not found', () => {
            const builder = new Factory({ edges: [], disableEdges: false }).create();
            assert.throws(() => builder.g.V('123').E('knows'), /Edge 'knows' was not found/);
        });

        describe('__()', () => {
            it('should add an anonymous traversal to the query string', () => {
                const builder = new Factory().create();
                builder.g.V('123').__;
                assert.strictEqual(builder.toString, "g.V('123').__.");
            });
        });

        describe('aggregate()', () => {
            it('should generate a string aggregate', () => {
                const builder = new Factory().create();
                builder.g.V('123').aggregate('a');
                assert.strictEqual(builder.toString, "g.V('123').aggregate('a')");
            });

            it('should add an alias to the factory if disableAliases is false', () => {
                const builder = new Factory().create();
                builder.g.V('123').aggregate('a');
                assert.strictEqual(builder.config.aliases.includes('a'), true);
            });
        });

        describe('and()', () => {
            it('should generate a string query from undefined', () => {
                const builder = new Factory().create();
                builder.g.V('123').and();
                assert.strictEqual(builder.toString, "g.V('123').and()");
            });

            it('should generate an and() string query from a single callback', () => {
                const builder = new Factory().create();
                builder.g.V('123').and(a => a.has('removed', true).has('name', '\'Alice\''));
                assert.strictEqual(builder.toString, "g.V('123').and(has('removed',true).has('name','Alice'))");
            });

            it('should generate an and() string query from an array of callbacks', () => {
                const builder = new Factory().create();
                builder.g.V('123').and([(a) => a.has('removed', true), (a) => a.has('name', '\'Alice\'')]);
                assert.strictEqual(builder.toString, "g.V('123').and(has('removed',true),has('name','Alice'))");
            });

            it('should throw an error if input a valid array of callbacks', () => {
                const builder = new Factory().create();
                assert.throws(() => builder.g.V('123').and([]), /'input' must be undefined, a function, or an array of functions/);
            });
        });

        describe('as()', () => {
            it('should add an alias to the query string', () => {
                const builder = new Factory().create();
                builder.g.V('123').as('a');
                assert.strictEqual(builder.toString, "g.V('123').as('a')");
            });

            it('should added the query string from the as() method to the query string', () => {
                const builder = new Factory().create();
                builder.g.V('123').not(a => a.has('removed', true).has('name', '\'Alice\''));
                assert.strictEqual(builder.toString, "g.V('123').not(has('removed',true).has('name','Alice'))");
            });
        });

        describe('count()', () => {
            it('should generate a string count', () => {
                const builder = new Factory().create();
                builder.g.V('123').count();
                assert.strictEqual(builder.toString, "g.V('123').count()");
            });
        });

        describe('custom()', () => {
            it('should generate a custom query string', () => {
                const builder = new Factory().create();
                builder.g.V('123').custom('a');
                assert.strictEqual(builder.toString, "g.V('123').a");
            });
        });

        describe('dedup()', () => {
            it('should generate a string dedup', () => {
                const builder = new Factory().create();
                builder.g.V('123').dedup();
                assert.strictEqual(builder.toString, "g.V('123').dedup()");
            });
        });

        describe('E()', () => {
            it('should generate a string E', () => {
                const builder = new Factory().create();
                builder.g.V('123').E('knows');
                assert.strictEqual(builder.toString, "g.V('123').E('knows')");
            });

            it('should throw an error if edge is not found', () => {
                const builder = new Factory({ edges: [], disableEdges: false }).create();
                assert.throws(() => builder.g.V('123').E('knows'), /Edge 'knows' was not found/);
            });
        });

        describe('elementMap()', () => {
            it('should generate a string elementMap', () => {
                const builder = new Factory().create();
                builder.g.V('123').elementMap();
                assert.strictEqual(builder.toString, "g.V('123').elementMap()");
            });

            it('should generate a string elementMap with keys', () => {
                const builder = new Factory().create();
                builder.g.V('123').elementMap(['name', 'age']);
                assert.strictEqual(builder.toString, "g.V('123').elementMap('name','age')");
            });

            it('should throw an error if keys is not an array', () => {
                const builder = new Factory().create();
                assert.throws(() => builder.g.V('123').elementMap('name'), /Keys must be an array/);
            });
        });

        describe('fold()', () => {
            it('should generate a string fold', () => {
                const builder = new Factory().create();
                builder.g.V('123').fold();
                assert.strictEqual(builder.toString, "g.V('123').fold()");
            });
        });

        describe('has()', () => {
            it('should generate a string has', () => {
                const builder = new Factory().create();
                builder.g.V('123').has('name', '\'Alice\'').toString;
                assert.strictEqual(builder.toString, "g.V('123').has('name','Alice')");
            });

            it('should generate a boolean has', () => {
                const builder = new Factory().create();
                builder.g.V('123').has('name', false);
                assert.strictEqual(builder.toString, "g.V('123').has('name',false)");
            });
        });

        describe('hasLabel()', () => {
            it('should create a hasLabel from a string', () => {
                const builder = new Factory().create();
                builder.g.V('123').hasLabel('person');
                assert.strictEqual(builder.toString, "g.V('123').hasLabel('person')");
            });

            it('should create a hasLabel from an array', () => {
                const builder = new Factory().create();
                builder.g.V('123').hasLabel(['person', 'user']);
                assert.strictEqual(builder.toString, "g.V('123').hasLabel('person','user')");
            });
        });

        describe('id()', () => {
            it('should generate a string id', () => {
                const builder = new Factory().create();
                builder.g.V('123').id();
                assert.strictEqual(builder.toString, "g.V('123').id()");
            });
        });

        describe('in()', () => {
            it('should generate a string in', () => {
                const builder = new Factory().create();
                builder.g.V('123').in('knows');
                assert.strictEqual(builder.toString, "g.V('123').in('knows')");
            });

            it('should throw an error if edge is not found', () => {
                const builder = new Factory({ edges: [], disableEdges: false }).create();
                assert.throws(() => builder.g.V('123').in('knows'), /Edge 'knows' was not found/);
            });
        });

        describe('inE()', () => {
            it('should generate a string inE', () => {
                const builder = new Factory().create();
                builder.g.V('123').inE('knows');
                assert.strictEqual(builder.toString, "g.V('123').inE('knows')");
            });

            it('should throw an error if edge is not found', () => {
                const builder = new Factory({ edges: [], disableEdges: false }).create();
                assert.throws(() => builder.g.V('123').inE('knows'), /Edge 'knows' was not found/);
            });
        });

        describe('inV()', () => {
            it('should generate a string inV', () => {
                const builder = new Factory().create();
                builder.g.V('123').inV();
                assert.strictEqual(builder.toString, "g.V('123').inV()");
            });
        });

        describe('is()', () => {
            it('should generate a string is()', () => {
                const builder = new Factory().create();
                builder.g.V('123').is('gt(2)');
                assert.strictEqual(builder.toString, "g.V('123').is(gt(2))");
            });


            it('should generate a number is()', () => {
                const builder = new Factory().create();
                builder.g.V('123').is(2);
                assert.strictEqual(builder.toString, "g.V('123').is(2)");
            });
        });

        describe('not()', () => {
            it('should generate a string not', () => {
                const builder = new Factory().create();
                builder.g.V('123').not(a => a.has('removed', true).has('name', '\'Alice\''));
                assert.strictEqual(builder.toString, "g.V('123').not(has('removed',true).has('name','Alice'))");
            });
        });

        describe('out()', () => {
            it('should generate a string out', () => {
                const builder = new Factory().create();
                builder.g.V('123').out('knows');
                assert.strictEqual(builder.toString, "g.V('123').out('knows')");
            });

            it('should throw an error if edge is not found', () => {
                const builder = new Factory({ edges: [], disableEdges: false }).create();
                assert.throws(() => builder.g.V('123').out('knows'), /Edge 'knows' was not found/);
            });
        });

        describe('outE()', () => {
            it('should generate a string outE', () => {
                const builder = new Factory().create();
                builder.g.V('123').outE('knows');
                assert.strictEqual(builder.toString, "g.V('123').outE('knows')");
            });

            it('should throw an error if edge is not found', () => {
                const builder = new Factory({ edges: [], disableEdges: false }).create();
                assert.throws(() => builder.g.V('123').outE('knows'), /Edge 'knows' was not found/);
            });
        });

        describe('outV()', () => {
            it('should generate a string outV', () => {
                const builder = new Factory().create();
                builder.g.V('123').outV();
                assert.strictEqual(builder.toString, "g.V('123').outV()");
            });
        });

        describe('project()', () => {
            it('should generate a single project', () => {
                const builder = new Factory().create();
                builder.g.V('123').project([{ name: 'a', by: (b) => b.valueMap() }]);
                assert.strictEqual(builder.toString, "g.V('123').project('a').by(valueMap())");
            });

            it('should generate a single by project that works with as()', () => {
                const builder = new Factory().create();
                builder.g.V('123').as('V').project([{ name: 'a', by: (b) => b.select('V').valueMap() }]);
                assert.strictEqual(builder.toString, "g.V('123').as('V').project('a').by(select('V').valueMap())");
            });

            it('should generate a multiple project', () => {
                const builder = new Factory().create();
                builder.g.V('123').project([{ name: 'a', by: (b) => b.valueMap() }, { name: 'c', by: (d) => d.valueMap() }]);
                assert.strictEqual(builder.toString, "g.V('123').project('a','c').by(valueMap()).by(valueMap())");
            });

            it('should generate multiple by project that works with as()', () => {
                const builder = new Factory().create();
                builder.g.V('123').as('V').project([
                    { name: 'a', by: (b) => b.select('V').valueMap() },
                    { name: 'c', by: (d) => d.select('V').valueMap() }
                ]);
                assert.strictEqual(builder.toString, "g.V('123').as('V').project('a','c').by(select('V').valueMap()).by(select('V').valueMap())");
            });

            it('should throw an error if parts is not an array', () => {
                const builder = new Factory().create();
                assert.throws(() => builder.g.V('123').project('a'), /Parts must be an array/);
            });
        });

        describe('select()', () => {
            it('should generate a string select', () => {
                const builder = new Factory().create();
                builder.g.V('123').as('a').select('a');
                assert.strictEqual(builder.toString, "g.V('123').as('a').select('a')");
            });

            it('should throw an error if alias is not found', () => {
                const builder = new Factory({ aliases: [], disableAliases: false }).create();
                assert.throws(() => builder.g.V('123').select('a'), /Alias 'a' was not found/);
            });
        });

        describe('sideEffect()', () => {
            it('should create a sideEffect query string', () => {
                const builder = new Factory().create();
                builder.g.V('123').sideEffect(a => a.out('knows').aggregate('b'));
                assert.strictEqual(builder.toString, "g.V('123').sideEffect(out('knows').aggregate('b'))");
            });
        });

        describe('unfold()', () => {
            it('should generate a string unfold', () => {
                const builder = new Factory().create();
                builder.g.V('123').unfold();
                assert.strictEqual(builder.toString, "g.V('123').unfold()");
            });
        });

        describe('V()', () => {
            it('should generate a string V', () => {
                const builder = new Factory().create();
                builder.g.V('123');
                assert.strictEqual(builder.toString, "g.V('123')");
            });
        });

        describe('valueMap()', () => {
            it('should generate a string valueMap', () => {
                const builder = new Factory().create();
                builder.g.V('123').valueMap();
                assert.strictEqual(builder.toString, "g.V('123').valueMap()");
            });
        });

        describe('values()', () => {
            it('should generate a string values', () => {
                const builder = new Factory().create();
                builder.g.V('123').values('name');
                assert.strictEqual(builder.toString, "g.V('123').values('name')");
            });
        });

        describe('where()', () => {
            it('should generate a string where', () => {
                const builder = new Factory().create();
                builder.g.V('123').where(a => a.has('removed', true).has('name', '\'Alice\''));
                assert.strictEqual(builder.toString, "g.V('123').where(has('removed',true).has('name','Alice'))");
            });
        });
    });
});