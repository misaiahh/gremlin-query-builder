A gremlin query string create meant for use with the [neptune-data](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/neptunedata/) client provided by AWS.

Suported methods are:



Here are the Markdown files for each method of the Builder class:

**as.()**
```markdown
# As
================

The `as` method is used to assign an alias to a step in the query.

## Syntax
```typescript
as(callbacks: ((builder: Builder) => void)[])
```

## Parameters

* `callbacks`: An array of callback functions that take a `Builder` instance as an argument.

## Description

The `as` method assigns an alias to a step in the query. The alias can be used to reference the step later in the query.

## Example
```typescript
builder.V('VERTEX').as('NAME');
```

## Returns

The `Builder` instance.
```

**custom()**
```markdown
# Custom
================

The `custom` method is used to add a custom step to the query.

## Syntax
```typescript
custom(step: string)
```

## Parameters

* `step`: The custom step to add to the query.

## Description

The `custom` method adds a custom step to the query. The custom step can be any valid Gremlin step.

## Example
```typescript
builder.custom('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')');
```

## Returns

The `Builder` instance.
```

**count()**
```markdown
# Count
================

The `count` method is used to count the number of vertices or edges in the query.

## Syntax
```typescript
count()
```

## Parameters

None

## Description

The `count` method returns the number of vertices or edges in the query.

## Example
```typescript
builder.count();
```

## Returns

The `Builder` instance.
```

**is()**
```markdown
# Is
================

The `is` method is used to filter the query based on a condition.

## Syntax
```typescript
is(condition: string | number)
```

## Parameters

* `condition`: The condition to filter the query by.

## Description

The `is` method filters the query based on a condition. The condition can be a string or a number.

## Example
```typescript
builder.is('gt(2)');
builder.is(2);
```

## Returns

The `Builder` instance.
```

**not()**
```markdown
# Not
================

The `not` method is used to negate a condition in the query.

## Syntax
```typescript
not(condition: (builder: Builder) => void)
```

## Parameters

* `condition`: The condition to negate.

## Description

The `not` method negates a condition in the query.

## Example
```typescript
builder.not((b) => b.has('removed', true).has('name', '\'Alice\''));
```

## Returns

The `Builder` instance.
```

**out()**
```markdown
# Out
================

The `out` method is used to traverse the graph in the outgoing direction.

## Syntax
```typescript
out(edge: string)
```

## Parameters

* `edge`: The edge to traverse.

## Description

The `out` method traverses the graph in the outgoing direction.

## Example
```typescript
builder.out('knows');
```

## Returns

The `Builder` instance.
```

**outE()**
```markdown
# OutE
================

The `outE` method is used to traverse the graph in the outgoing edge direction.

## Syntax
```typescript
outE(edge: string)
```

## Parameters

* `edge`: The edge to traverse.

## Description

The `outE` method traverses the graph in the outgoing edge direction.

## Example
```typescript
builder.outE('knows');
```

## Returns

The `Builder` instance.
```

**outV()**
```markdown
# OutV
================

The `outV` method is used to traverse the graph in the outgoing vertex direction.

## Syntax
```typescript
outV()
```

## Parameters

None

## Description

The `outV` method traverses the graph in the outgoing vertex direction.

## Example
```typescript
builder.outV();
```

## Returns

The `Builder` instance.
```

**project()**
```markdown
# Project
================

The `project` method is used to project a set of vertices or edges.

## Syntax
```typescript
project(parts: { to: string; by: (builder: Builder) => void }[])
```

## Parameters

* `parts`: An array of objects that define the projection.

## Description

The `project` method projects a set of vertices or edges.

## Example
```typescript
builder.project([
  { to: 'name', by: (b) => b.values('name') },
  { to: 'age', by: (b) => b.values('age') }
]);
```

## Returns

The `Builder` instance.
```
