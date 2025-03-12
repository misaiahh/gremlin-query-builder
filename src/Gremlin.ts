import { Config } from "./lib/interfaces/gremlinConfig.ts";

class Gremlin {
    query: string;
    private _aliases: Set<string>;
    private _edges: Set<string>;
    private _disableAliases: boolean;
    private _disableEdges: boolean;

    constructor(config: Config = {}) {
        this.query = '';
        this._aliases = config.aliases ? new Set(config.aliases) : new Set();
        this._edges = config.edges ? new Set(config.edges) : new Set();
        this._disableAliases = config.disableAliases ?? true;
        this._disableEdges = config.disableEdges ?? true;
    }

    get g() {
        this.query += 'g.';
        return this;
    }

    get config() {
        return {
            aliases: [...this._aliases],
            edges: [...this._edges],
            disableAliases: this._disableAliases,
            disableEdges: this._disableEdges,
        };
    }

    get toString() {
        return this.query.replace(/\s+/g, '').trim();
    }

    get raw() {
        return this.query.replace(/\)\./g, ').\n');
    }

    /**
     * __ - Spawns anonymous DefaultSocialTraversal instances.
     * @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#traversal
     */
    get __() {
        this.query += `__.`;
        return this;
    }

    /**
     * Adds an alias to the list of available aliases.
     */
    private _addAlias(alias: string = '') {
        if (!this._disableAliases) return;
        if (this._aliases.has(alias)) {
            throw new Error(`Alias '${alias}' is already defined`);
        }
        this._aliases.add(alias);
    }

    /**
     * Returns a period if the query does not end with a parenthesis, dot, or if the query is empty.
     */
    private _dot() {
        return this.query.endsWith('(') || this.query.endsWith('.') || this.query.length === 0 ? '' : '.';
    }

    /**
     * Validates if the provided edge exists within the set of edges.
     * If edge validation is disabled, the function returns immediately.
     * Throws an error if the edge is not found in the set.
     */
    private _validateEdge(edge: string = '') {
        if (this._disableEdges) return;
        if (!this._edges.has(edge)) {
            throw new Error(`Edge '${edge}' was not found`);
        }
    }

    /**
     * Validates if the provided alias exists within the set of aliases.
     * If alias validation is disabled, the function returns immediately.
     * Throws an error if the alias is not found in the set.
     * @todo add check to make sure the alias does not already exist
     */
    private _validateAlias(alias: string = '') {
        if (this._disableAliases && !this._aliases.has(alias)) {
            throw new Error(`Alias '${alias}' was not found`);
        }
    }

    aggregate(alias: string = '') {
        this._addAlias(alias);
        this.query += `${this._dot()}aggregate('${alias}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#and-step */
    and(steps: string[] = []) {
        this.query += `${this._dot()}and(${steps.join(', ')})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#as-step */
    as(name: string = '') {
        this._addAlias(name);
        this.query += `${this._dot()}as('${name}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#count-step */
    count() {
        this.query += `${this._dot()}count()`;
        return this;
    }

    /**
     * Append a custom Gremlin query string to the builder.
     */
    custom(queryString: string = '') {
        this.query += `${this._dot()}${queryString}`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#dedup-step */
    dedup() {
        this.query += `${this._dot()}dedup()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#e-step */
    E(edge: string = '') {
        this._validateEdge(edge);
        this.query += `${this._dot()}E('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#elementmap-step */
    elementMap(keys: string[] = []) {
        this.query += keys.length === 0 ? `${this._dot()}elementMap()` : `${this._dot()}elementMap(${keys.join(', ')})`;

        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#fold-step */
    fold(obj = null, bifunction = null) {
        this.query += `${this._dot()}fold()`;
        return this;
    }

    has(key: string = '', value: any = true) {
        this.query += `${this._dot()}has('${key}', ${typeof value === 'boolean' ? value : `'${value}'`})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#id-step */
    id() {
        this.query += `${this._dot()}id()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    in(edge: string = '') {
        this._validateEdge(edge);
        this.query += `${this._dot()}in('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    inE(edge: string = '') {
        this._validateEdge(edge);
        this.query += `${this._dot()}inE('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    inV(id: string = '') {
        this.query += `${this._dot()}inV('${id}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#is-step */
    is(queryString: string = '') {
        this.query += `${this._dot()}is(${queryString})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#not-step */
    not(queryString: string = '') {
        this.query += `${this._dot()}not(${queryString})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    out(edge: string = '') {
        this._validateEdge(edge);
        this.query += `${this._dot()}out('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    outE(edge: string = '') {
        this._validateEdge(edge);
        this.query += `${this._dot()}outE('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    outV() {
        this.query += `${this._dot()}outV()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#project-step */
    project(parts: [partA: string, partB: string][] = []) {
        this.query += `${this._dot()}project(` +
            `${parts.map(([partA, _]) => `'${partA}'`)}` +
            `)` +
            `${parts.map(([_, partB]) => `.by(${partB})`).join('')}`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#select-step */
    select(alias: string = '') {
        this._validateAlias(alias);
        this.query += `${this._dot()}select('${alias}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#sideeffect-step */
    sideEffect(queryString: string = '') {
        this.query += `${this._dot()}sideEffect(${queryString})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#unfold-step */
    unfold() {
        this.query += `${this._dot()}unfold()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#v-step */
    V(id: string = '') {
        this.query += `${this._dot()}V('${id}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#values-step */
    values(value: string = '') {
        this.query += `${this._dot()}values('${value}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#where-step */
    where(queryString: string = '') {
        this.query += `${this._dot()}where(${queryString})`;
        return this;
    }
}

export default Gremlin;
