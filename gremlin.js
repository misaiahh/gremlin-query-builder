import checkDot from "./lib/checkDot.js";

class Gremlin {
    query;
    _aliases;
    _edges;
    _disableAliases;
    _disableEdges;

    constructor(config = {}) {
        this.query = '';
        this._aliases = config.aliases ? new Set(config.aliases) : new Set();
        this._edges = config.edges ? new Set(config.edges) : new Set();
        this._disableAliases = config.disableAliases || this._aliases.size || true;
        this._disableEdges = config.disableEdges || this._edges.size || true;
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

    _addAlias(alias = '') {
        if (!this._disableAliases) return;
        if (this._aliases.has(alias)) {
            throw new Error(`Alias '${alias}' is already defined`);
        }
        this._aliases.add(alias);
    }

    _validateEdge(edge = '') {
        if (this._disableEdges) return;
        console.log(this._edges);
        if (!this._edges.has(edge)) {
            throw new Error(`Edge '${edge}' was not found`);
        }
    }

    _validateAlias(alias = '') {
        if (this._disableAliases && !this._aliases.has(alias)) {
            throw new Error(`Alias '${alias}' was not found`);
        }
    }

    as(name = '') {
        this._addAlias(name);
        this.query += `${checkDot(this.query)}as('${name}')`;
        return this;
    }

    custom(queryString = '') {
        this.query += `${checkDot(this.query)}${queryString}`;
        return this;
    }

    E(edge = '') {
        this._validateEdge(edge);
        this.query += `${checkDot(this.query)}E('${edge}')`;
        return this;
    }

    fold(options = null) {
        this.query += `${checkDot(this.query)}fold()`;
        return this;
    }

    in(edge = '') {
        this._validateEdge(edge);
        this.query += `${checkDot(this.query)}in('${edge}')`;
        return this;
    }

    inE(edge = '') {
        this._validateEdge(edge);
        this.query += `${checkDot(this.query)}inE('${edge}')`;
        return this;
    }

    out(edge = '') {
        this._validateEdge(edge);
        this.query += `${checkDot(this.query)}out('${edge}')`;
        return this;
    }

    outE(edge = '') {
        this._validateEdge(edge);
        this.query += `${checkDot(this.query)}outE('${edge}')`;
        return this;
    }

    project(parts = []) {
        this.query += `${checkDot(this.query)}project(` +
            `${parts.map(([partA, _]) => `'${partA}'`)}` +
            `)` +
            `${parts.map(([_, partB]) => `.by(${partB})`).join('')}`;
        return this;
    }

    select(alias = '') {
        this._validateAlias(alias);
        this.query += `${checkDot(this.query)}select('${alias}')`;
        return this;
    }

    V(id = '') {
        this.query += `${checkDot(this.query)}V('${id}')`;
        return this;
    }

    values(value = '') {
        this.query += `${checkDot(this.query)}values('${value}')`;
        return this;
    }
}

export default Gremlin;
