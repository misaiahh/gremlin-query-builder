import test from 'node:test';
import assert from 'node:assert';
import Gremlin from '../gremlin';

test('Gremlin class', async (t) => {
    await t.test('should initialize with default values', () => {
        const gremlin = new Gremlin();
        assert.strictEqual(gremlin.config.aliases.length, 0);
        assert.strictEqual(gremlin.config.edges.length, 0);
        assert.strictEqual(gremlin.config.disableAliases, true);
        assert.strictEqual(gremlin.config.disableEdges, true);
    });

    await t.test('should add an alias', () => {
        const gremlin = new Gremlin();
        gremlin.as('testAlias');
        assert.strictEqual(gremlin.config.aliases.includes('testAlias'), true);
    });

    await t.test('should validate edge', () => {
        const gremlin = new Gremlin({ edges: ['knows'], disableEdges: false });
        assert.doesNotThrow(() => gremlin.E('knows'));
        assert.throws(() => gremlin.E('unknownEdge'), /Edge 'unknownEdge' was not found/);
    });

    await t.test('should validate alias', () => {
        const gremlin = new Gremlin();
        gremlin.as('testAlias');
        assert.doesNotThrow(() => gremlin.select('testAlias'));
        assert.throws(() => gremlin.select('unknownAlias'), /Alias 'unknownAlias' was not found/);
    });

    await t.test('should generate correct query string', () => {
        const gremlin = new Gremlin();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.toString, "g.V('123').as('a').out('knows').as('b').select('a')");
    });

    await t.test('should generate raw query string with newlines', () => {
        const gremlin = new Gremlin();
        gremlin.g.V('123').as('a').out('knows').as('b').select('a');
        assert.strictEqual(gremlin.raw, "g.V('123').\nas('a').\nout('knows').\nas('b').\nselect('a')");
    });
});