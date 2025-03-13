import test from 'node:test';
import assert from 'node:assert';
import Factory from '../Builder.js';

test('Gremlin class', async (t) => {
    await t.test('should return an instance of the Factory class', () => {
        const gremlin = new Factory();
        assert.strictEqual(gremlin instanceof Factory, true);
    });

    await t.test('should return an instance of the Builder class', () => {
        const gremlin = Factory.from().g.V('123').in('knows').toString;
        assert.strictEqual(gremlin, "g.V('123').in('knows')");
    });

    await t.test('should return an instance of the Builder class with existing aliases', () => {
        const factory = new Factory();
        const existingBuilder = factory.create().g.V('123').as('V');
        const newBuilder = Factory.from(factory);
        assert.strictEqual(newBuilder.config.aliases.includes('V'), true);
    });

    await t.test('should initialize with default values', () => {
        const gremlin = new Factory();
        assert.strictEqual(gremlin.config.aliases.length, 0);
        assert.strictEqual(gremlin.config.edges.length, 0);
        assert.strictEqual(gremlin.config.disableAliases, true);
        assert.strictEqual(gremlin.config.disableEdges, true);
    });

    await t.test('should add an alias', () => {
        const factory = new Factory();
        factory.create().as('testAlias');
        assert.strictEqual(factory.config.aliases.includes('testAlias'), true);
    });

    await t.test('should validate edge', () => {
        const factory = new Factory({ edges: ['knows'], disableEdges: false });
        const builder = factory.create();
        assert.doesNotThrow(() => builder.E('knows'));
        assert.throws(() => builder.E('unknownEdge'), /Edge 'unknownEdge' was not found/);
    });

    await t.test('should validate alias', () => {
        const factory = new Factory();
        factory.create().as('testAlias');
        assert.doesNotThrow(() => Factory.from(factory).select('testAlias'));
        assert.throws(() => Factory.from(factory).select('unknownAlias'), /Alias 'unknownAlias' was not found/);
    });

    await t.test('should generate correct query string', () => {
        const gremlin = new Factory().create();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.toString, "g.V('123').as('a').out('knows').as('b').select('a')");
    });

    await t.test('should generate raw query string with newlines', () => {
        const gremlin = new Factory().create();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.raw, "g.V('123').\nas('a').\nout('knows').\nas('b').\nselect('a')");
    });

    await t.test('should generate a string has', () => {
        const gremlin = new Factory().create();
        gremlin.g.V('123').has('name', 'Alice').toString;
        assert.strictEqual(gremlin.toString, "g.V('123').has('name','Alice')");
    });

    await t.test('should generate a boolean has', () => {
        const gremlin = new Factory().create();
        gremlin.g.V('123').has('name', false);
        assert.strictEqual(gremlin.toString, "g.V('123').has('name',false)");
    });

    await t.test('should not check edges if disableEdges is true', () => {
        const gremlin = new Factory({ disableEdges: true }).create();
        gremlin.g.V('123').E('knows');
        assert.strictEqual(gremlin.toString, "g.V('123').E('knows')");
    });

    await t.test('should check edges if disableEdges is false', () => {
        const gremlin = new Factory({ edges: ['knows'], disableEdges: false }).create();
        gremlin.g.V('123').E('knows');
        assert.strictEqual(gremlin.toString, "g.V('123').E('knows')");
    });

    await t.test('should throw an error if edge is not found', () => {
        const gremlin = new Factory({ edges: [], disableEdges: false }).create();
        assert.throws(() => gremlin.g.V('123').E('knows'), /Edge 'knows' was not found/);
    });
});