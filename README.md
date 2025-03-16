A gremlin query string create meant for use with the [neptune-data](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/neptunedata/) client provided by AWS.

Suported methods are:

Here are the  files for each method of the Builder class:

# As()
================

The `as` method is used to assign an alias to a step in the query.

## Syntax

as(name: string)

## Parameters

* `callbacks`: An array of callback functions that take a `Builder` instance as an argument.

## Description

The `as` method assigns an alias to a step in the query. The alias can be used to reference the step later in the query.

## Example

builder.V('VERTEX').as('NAME');

## Returns

The `Builder` instance.

# Custom()
================

The `custom` method is used to add a custom step to the query.

## Syntax

custom(step: string)

## Parameters

* `step`: The custom step to add to the query.

## Description

The `custom` method adds a custom step to the query. The custom step can be any valid Gremlin step.

## Example

builder.custom('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')');

## Returns

The `Builder` instance.

# Count()
================

The `count` method is used to count the number of vertices or edges in the query.

## Syntax

count()


## Parameters

None

## Description

The `count` method returns the number of vertices or edges in the query.

## Example

builder.count();


## Returns

The `Builder` instance.

# Is()
================

The `is` method is used to filter the query based on a condition.

## Syntax

is(condition: string | number)


## Parameters

* `condition`: The condition to filter the query by.

## Description

The `is` method filters the query based on a condition. The condition can be a string or a number.

## Example

builder.is('gt(2)');
builder.is(2);


## Returns

The `Builder` instance.

# Not()
================

The `not` method is used to negate a condition in the query.

## Syntax

not(condition: (builder: Builder) => void)


## Parameters

* `condition`: The condition to negate.

## Description

The `not` method negates a condition in the query.

## Example

builder.not((b) => b.has('removed', true).has('name', '\'Alice\''));


## Returns

The `Builder` instance.

# Out()
================

The `out` method is used to traverse the graph in the outgoing direction.

## Syntax

out(edge: string)


## Parameters

* `edge`: The edge to traverse.

## Description

The `out` method traverses the graph in the outgoing direction.

## Example

builder.out('knows');


## Returns

The `Builder` instance.

# OutE()
================

The `outE` method is used to traverse the graph in the outgoing edge direction.

## Syntax

outE(edge: string)

## Parameters

* `edge`: The edge to traverse.

## Description

The `outE` method traverses the graph in the outgoing edge direction.

## Example

builder.outE('knows');

## Returns

The `Builder` instance.

# OutV()
================

The `outV` method is used to traverse the graph in the outgoing vertex direction.

## Syntax

outV()

## Parameters

None

## Description

The `outV` method traverses the graph in the outgoing vertex direction.

## Example

builder.outV();

## Returns

The `Builder` instance.

# Project()
================

The `project` method is used to project a set of vertices or edges.

## Syntax

project(parts: { to: string; by: (builder: Builder) => void }[])

## Parameters

* `parts`: An array of objects that define the projection.

## Description

The `project` method projects a set of vertices or edges.

## Example

builder.project([
  { name: 'name', by: (b) => b.values('name') },
  { name: 'age', by: (b) => b.values('age') }
]);

## Returns

The `Builder` instance.

