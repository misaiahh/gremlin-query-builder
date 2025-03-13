import { FactoryConfig } from "./lib/interfaces/Config.ts";

export default class Factory {
    edges: string[];
    disableEdges: boolean;
    aliases: string[];
    disableAliases: boolean;

    constructor(config: FactoryConfig | undefined = undefined) {
        this.edges = config?.edges ? config.edges : [];
        this.disableEdges = config?.disableEdges ?? true;
        this.aliases = config?.aliases ? config.aliases : [];
        this.disableAliases = config?.disableAliases ?? true;
    }

    get config() {
        return {
            edges: [...this.edges],
            disableEdges: this.disableEdges,
            aliases: [...this.aliases],
            disableAliases: this.disableAliases
        };
    }

    /**
     * Validates if the provided alias exists within the set of aliases.
     * If alias validation is disabled, the function returns immediately.
     * Throws an error if the alias is not found in the set.
     * @todo add check to make sure the alias does not already exist
     */
    validateAlias(alias: string = '') {
        if (this.disableAliases && !this.aliases.includes(alias)) {
            throw new Error(`Alias '${alias}' was not found`);
        }
    }

    /**
     * Adds an alias to the list of available aliases.
     */
    addAlias(alias: string = '') {
        if (!this.disableAliases) return;
        if (this.aliases.includes(alias)) {
            throw new Error(`Alias '${alias}' is already defined`);
        }
        this.aliases.push(alias);
    }

    create() {
        return new Builder(this);
    }

    static from(factory: Factory | undefined = undefined) {
        return new Builder(factory);
    }

    /**
     * Validates if the provided edge exists within the set of edges.
     * If edge validation is disabled, the function returns immediately.
     * Throws an error if the edge is not found in the set.
     */
    validateEdge(edge: string = '') {
        if (this.disableEdges) return;
        if (!this.edges.includes(edge)) {
            throw new Error(`Edge '${edge}' was not found`);
        }
    }
}

export class Builder {
    query: string;
    private factory: Factory;

    constructor(factory: Factory | undefined = undefined) {
        this.factory = factory ?? new Factory();
        this.query = '';
    }

    get config() {
        return this.factory.config;
    }

    get g() {
        this.query += 'g.';
        return this;
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
     * Returns a period if the query does not end with a parenthesis, dot, or if the query is empty.
     */
    _dot() {
        return this.query.endsWith('(') || this.query.endsWith('.') || this.query.length === 0 ? '' : '.';
    }


    aggregate(alias: string = '') {
        this.factory.addAlias(alias);
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
        this.factory.addAlias(name);
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
        this.factory.validateEdge(edge);
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
        this.factory.validateEdge(edge);
        this.query += `${this._dot()}in('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    inE(edge: string = '') {
        this.factory.validateEdge(edge);
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
        this.factory.validateEdge(edge);
        this.query += `${this._dot()}out('${edge}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#vertex-steps */
    outE(edge: string = '') {
        this.factory.validateEdge(edge);
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
        this.factory.validateAlias(alias);
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
