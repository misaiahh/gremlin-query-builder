// https://stackoverflow.com/questions/70633940/cannot-export-interface-in-typescirpt-the-requested-module-does-not-provide-an
import type { FactoryConfig } from "./lib/interfaces/Config.ts";

export default class Factory {
    edges: string[];
    disableEdges: boolean;
    aliases: string[];
    disableAliases: boolean;

    constructor(config: FactoryConfig | undefined = undefined) {
        this.edges = config?.edges ? config.edges : [];
        this.disableEdges = config?.disableEdges ?? true;
        this.aliases = config?.aliases ? config.aliases : [];
        this.disableAliases = config?.disableAliases ?? false;
    }

    get config() {
        return {
            edges: [...this.edges],
            disableEdges: this.disableEdges,
            aliases: [...this.aliases],
            disableAliases: this.disableAliases
        };
    }

    static from(factory: Factory | undefined = undefined) {
        return new Builder(factory);
    }

    /**
     * Validates if the provided alias exists within the set of aliases.
     * If alias validation is disabled, the function returns immediately.
     * Throws an error if the alias is not found in the set.
     * @todo add check to make sure the alias does not already exist
     */
    validateAlias(alias: string = '') {
        if (this.disableAliases) return;
        if (!this.aliases.includes(alias)) {
            throw new Error(`Alias '${alias}' was not found`);
        }
    }

    /**
     * Adds an alias to the list of available aliases.
     */
    addAlias(alias: string = '') {
        if (this.disableAliases) return;
        if (this.aliases.includes(alias)) {
            throw new Error(`Alias '${alias}' is already defined`);
        }
        this.aliases.push(alias);
    }

    /**
     * Creates and returns a new instance of the Builder class
     * using the current Factory instance.
     */
    create() {
        return new Builder(this);
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
        this.query += `${this._dot()}__.`;
        return this;
    }

    /**
     * Returns a period if the query does not end with a parenthesis, dot, or if the query is empty.
     */
    _dot() {
        return this.query.endsWith('(') || this.query.endsWith('.') || this.query.length === 0 ? '' : '.';
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#aggregate-step */
    aggregate(alias: string = '') {
        this.factory.addAlias(alias);
        this.query += `${this._dot()}aggregate('${alias}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#and-step */
    and(input: ((builder: Builder) => void) | ((builder: Builder) => void)[] | undefined = undefined) {
        if (typeof input === 'undefined') {
            this.query += `${this._dot()}and()`;
        } else if (typeof input === 'function') {
            const builder = Factory.from(this.factory);
            input(builder);
            this.query += `${this._dot()}and(${builder.toString})`;
        } else if (Array.isArray(input)) {
            const builderInstances = input.map(() => new Builder(this.factory));
            input.forEach((callback, index) => callback(builderInstances[index]));
            const queryString = `${this._dot()}and(${builderInstances.map((builder) => builder.toString).join(',')})`;
            this.query += queryString;
        } else {
            throw new Error('[and()] Input must be undefined, a function, or an array of functions');
        }

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
    elementMap(keys: string[] | undefined = undefined) {
        if (Array.isArray(keys)) {
            this.query += `${this._dot()}elementMap(${keys.map((element) => `'${element}'`).join(', ')})`;
            return this;
        }

        if (!keys) {
            this.query += `${this._dot()}elementMap()`;
            return this;
        }

        throw new Error('Keys must be an array or undefined');
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#fold-step */
    fold(_obj = null, _bifunction = null) {
        this.query += `${this._dot()}fold()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#has-step */
    has(key: string = '', value: string | number | boolean = true) {
        this.query += `${this._dot()}has('${key}', ${value})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#has-step */
    hasLabel(labels: string[] | string) {
        let queryString = '';

        if (typeof labels === 'string') {
            queryString = `${this._dot()}hasLabel('${labels}')`;
        }

        if (Array.isArray(labels)) {
            queryString = `${this._dot()}hasLabel(${labels.map((label) => `'${label}'`).join(',')})`;
        }

        this.query += queryString;

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
    inV() {
        this.query += `${this._dot()}inV()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#is-step */
    is(operator: string | number) {
        this.query += `${this._dot()}is(${operator})`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#not-step */
    not(callback: (builder: Builder) => void) {
        const builder = Factory.from(this.factory);
        callback(builder);
        this.query += `${this._dot()}not(${builder.toString})`;
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
    project(parts: { name: string; by: (builder: Builder) => void }[]) {
        if (!Array.isArray(parts)) {
            throw new Error('Parts must be an array');
        }

        const builderInstances = parts.map(() => new Builder(this.factory));

        parts.forEach((part, index) => part.by(builderInstances[index]));

        this.query += `${this._dot()}project(` +
            `${parts.map((part) => `'${part.name}'`).join(', ')}` +
            `)` +
            `${builderInstances.map((builder) => `.by(${builder.toString})`).join('')}`;

        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#select-step */
    select(alias: string = '') {
        this.factory.validateAlias(alias);
        this.query += `${this._dot()}select('${alias}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#sideeffect-step */
    sideEffect(callback: (builder: Builder) => void) {
        const builder = Factory.from(this.factory);
        callback(builder);
        this.query += `${this._dot()}sideEffect(${builder.toString})`;
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

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#valuemap-step */
    valueMap() {
        this.query += `${this._dot()}valueMap()`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#values-step */
    values(value: string = '') {
        this.query += `${this._dot()}values('${value}')`;
        return this;
    }

    /** @tutorial https://tinkerpop.apache.org/docs/3.7.3/reference/#where-step */
    where(callback: ((builder: Builder) => void)) {
        const builder = Factory.from(this.factory);
        callback(builder);
        this.query += `${this._dot()}where(${builder.toString})`;
        return this;
    }
}
