import test from 'node:test';
import assert from 'node:assert';
import Factory, { Builder as B } from '../Builder.js';

test('Gremlin class', async (t) => {
    await t.test('should return an instance of the Builder class', () => {
        const gremlin = B.from();
        assert.strictEqual(gremlin instanceof B, true);
    });

    await t.test('should return an instance of the Builder class', () => {
        const gremlin = B.from().g.V('123').in('knows').toString;
        assert.strictEqual(gremlin, "g.V('123').in('knows')");
    });

    await t.test('should return an instance of the Builder class with existing edges', () => {
        const factory = new Factory({ edges: ['knows'], disableEdges: false });
        const existingBuilder = factory.create();
        const newBuilder = B.from(existingBuilder);
        assert.strictEqual(newBuilder.config.edges.includes('knows'), true);
    });

    await t.test('should return an instance of the Builder class with existing aliases', () => {
        const existingBuilder = new B({ aliases: ['V'], disableAliases: false });
        const newBuilder = B.from(existingBuilder);
        assert.strictEqual(newBuilder.aliases.includes('V'), true);
    });

    await t.test('should initialize with default values', () => {
        const gremlin = new B();
        assert.strictEqual(gremlin.config.aliases.length, 0);
        assert.strictEqual(gremlin.config.edges.length, 0);
        assert.strictEqual(gremlin.config.disableAliases, true);
        assert.strictEqual(gremlin.config.disableEdges, true);
    });

    await t.test('should add an alias', () => {
        const gremlin = new B();
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
        const gremlin = new B();
        gremlin.as('testAlias');
        assert.doesNotThrow(() => gremlin.select('testAlias'));
        assert.throws(() => gremlin.select('unknownAlias'), /Alias 'unknownAlias' was not found/);
    });

    await t.test('should generate correct query string', () => {
        const gremlin = new B();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.toString, "g.V('123').as('a').out('knows').as('b').select('a')");
    });

    await t.test('should generate raw query string with newlines', () => {
        const gremlin = new B();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.raw, "g.V('123').\nas('a').\nout('knows').\nas('b').\nselect('a')");
    });

    await t.test('should generate a string has', () => {
        const gremlin = new B();
        gremlin.g.V('123').has('name', 'Alice').toString;
        assert.strictEqual(gremlin.toString, "g.V('123').has('name','Alice')");
    });

    await t.test('should generate a boolean has', () => {
        const gremlin = new B();
        gremlin.g.V('123').has('name', false);
        assert.strictEqual(gremlin.toString, "g.V('123').has('name',false)");
    });
});