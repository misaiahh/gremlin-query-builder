import test from 'node:test';
import assert from 'node:assert';
import { Factory, Builder } from '../Builder.js';

test('Gremlin class', async (t) => {
    await t.test('should return an instance of the Builder class', () => {
        const gremlin = Builder.from();
        assert.strictEqual(gremlin instanceof Builder, true);
    });

    await t.test('should return an instance of the Builder class', () => {
        const gremlin = Builder.from().g.V('123').in('knows').toString;
        assert.strictEqual(gremlin, "g.V('123').in('knows')");
    });

    await t.test('should return an instance of the Builder class with existing aliases', () => {
        const existingBuilder = new Builder().g.V('123').as('V');
        const newBuilder = Builder.from(existingBuilder);
        assert.strictEqual(newBuilder.config.aliases.includes('V'), true);
    });

    await t.test('should initialize with default values', () => {
        const gremlin = new Builder();
        assert.strictEqual(gremlin.config.aliases.length, 0);
        assert.strictEqual(gremlin.config.edges.length, 0);
        assert.strictEqual(gremlin.config.disableAliases, true);
        assert.strictEqual(gremlin.config.disableEdges, true);
    });

    await t.test('should add an alias', () => {
        const gremlin = new Builder();
        gremlin.as('testAlias');
        assert.strictEqual(gremlin.config.aliases.includes('testAlias'), true);
    });

    await t.test('should validate edge', () => {
        const factory = new Factory({ edges: ['knows'], disableEdges: false });
        const builder = factory.create();
        assert.doesNotThrow(() => builder.E('knows'));
        assert.throws(() => builder.E('unknownEdge'), /Edge 'unknownEdge' was not found/);
    });

    await t.test('should validate alias', () => {
        const gremlin = new Builder();
        gremlin.as('testAlias');
        assert.doesNotThrow(() => gremlin.select('testAlias'));
        assert.throws(() => gremlin.select('unknownAlias'), /Alias 'unknownAlias' was not found/);
    });

    await t.test('should generate correct query string', () => {
        const gremlin = new Builder();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.toString, "g.V('123').as('a').out('knows').as('b').select('a')");
    });

    await t.test('should generate raw query string with newlines', () => {
        const gremlin = new Builder();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.raw, "g.V('123').\nas('a').\nout('knows').\nas('b').\nselect('a')");
    });

    await t.test('should generate a string has', () => {
        const gremlin = new Builder();
        gremlin.g.V('123').has('name', 'Alice').toString;
        assert.strictEqual(gremlin.toString, "g.V('123').has('name','Alice')");
    });

    await t.test('should generate a boolean has', () => {
        const gremlin = new Builder();
        gremlin.g.V('123').has('name', false);
        assert.strictEqual(gremlin.toString, "g.V('123').has('name',false)");
    });
});