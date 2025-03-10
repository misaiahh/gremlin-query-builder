/**
 * Typedef for the query builder object.
 * 
 * @typedef {Object} QueryBuilder
 * @property {function(id: string): QueryBuilder} V Adds a vertex step with the specified `id`.
 * @property {function(id: string): QueryBuilder} E Adds a vertex step with the specified `id`.
 * @property {function(edge: string): QueryBuilder} in Adds an ingoing edge step with the specified `edge`.
 * @property {function(edge: string): QueryBuilder} inE Adds an ingoing edge element step with the specified `edge`.
 * @property {function(edge: string): QueryBuilder} out Adds an outgoing edge step with the specified `edge`.
 * @property {function(edge: string): QueryBuilder} outE Adds an outgoing edge element step with the specified `edge`.
 * @property {function(name: string): QueryBuilder} as Adds an alias step with the specified `name`.
 * @property {function(name: string): QueryBuilder} select Adds a select step with the specified `name`.
 * @property {function(queryString: string): QueryBuilder} push Adds a custom gremlin string code to the query.
 */