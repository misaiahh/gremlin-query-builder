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
            assert.strictEqual(factory.config.disableAliases, true);
            assert.strictEqual(factory.config.disableEdges, true);
        });

        it('should add an alias', () => {
            const factory = new Factory();
            factory.create().as('testAlias');
            assert.strictEqual(factory.config.aliases.includes('testAlias'), true);
        });

        it('should validate edge', () => {
            const factory = new Factory({ edges: ['knows'], disableEdges: false });
            const builder = factory.create();
            assert.doesNotThrow(() => builder.E('knows'));
            assert.throws(() => builder.E('unknownEdge'), /Edge 'unknownEdge' was not found/);
        });

        it('should validate alias', () => {
            const factory = new Factory();
            factory.create().as('testAlias');
            assert.doesNotThrow(() => Factory.from(factory).select('testAlias'));
            assert.throws(() => Factory.from(factory).select('unknownAlias'), /Alias 'unknownAlias' was not found/);
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

        it('should added the query string from the as() method to the query string', () => {
            const builder = new Factory().create();
            builder.g.V('123').not(a => a.has('removed', true).has('name', 'Alice'));
            assert.strictEqual(builder.toString, "g.V('123').not(has('removed',true).has('name',Alice))");
        });

        it('should create a sideEffect query string', () => {
            const builder = new Factory().create();
            builder.g.V('123').sideEffect(a => a.out('knows').aggregate('b'));
            assert.strictEqual(builder.toString, "g.V('123').sideEffect(out('knows').aggregate('b'))");
        });

        it('should create a a hasLabel query string with multiple labels', () => {
            const builder = new Factory().create();
            builder.g.V('123').hasLabel(['person', 'user']);
            assert.strictEqual(builder.toString, "g.V('123').hasLabel('person','user')");
        });
    });
});