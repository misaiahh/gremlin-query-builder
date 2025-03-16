A gremlin query string create meant for use with the [neptune-data](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/neptunedata/) client provided by AWS.

This project provides links to the [gremlin-tinkerpop](https://tinkerpop.apache.org/docs/3.7.3/reference/) documentation for each suported method. However, this project is not a complete implementation of the Gremlin language nor should it be used as a replacement official documentation.

### Supported methods:

# As()
================

The `as` method is used to assign an alias to a step in the query.

## Syntax

as(name: string)

## Examples

builder.V('VERTEX').as('NAME');

# Custom()
================

The `custom` method is used to add a custom step to the query.

## Syntax

custom(queryString: string)

## Description

The `custom` method adds a custom step to the query. The custom step can be any valid Gremlin step. This method was intended to be used for cases that this library does not currently support. 

## Examples

builder.custom('g.V(\'123\').as(\'a\').out(\'knows\').as(\'b\')');

# Count()
================

The `count` method is used to count the number of vertices or edges in the query.

## Syntax

count()

## Examples

builder.count();

# Is()
================

The `is` method is used to filter the query based on a condition.

## Syntax

is(condition: string | number)

## Examples

builder.is('gt(2)');
builder.is(2);

# Not()
================

The `not` method is used to negate a condition in the query.

## Syntax

not(callback: (builder: Builder) => void)

## Example

builder.not((b) => b.has('removed', true).has('name', '\'Alice\''));

# Out()
================

The `out` method is used to traverse the graph in the outgoing direction.

## Syntax

out(edge: string)

## Examples

builder.out('knows');

# OutE()
================

The `outE` method is used to traverse the graph in the outgoing edge direction.

## Syntax

outE(edge: string)

## Examples

builder.outE('knows');

# OutV()
================

The `outV` method is used to traverse the graph in the outgoing vertex direction.

## Syntax

outV()

## Examples

builder.outV();

# Project()
================

The `project` method is used to project a set of vertices or edges.

## Syntax

project(parts: { name: string; by: (builder: Builder) => void }[])

## Parameters

* `parts`: An array of objects that define the projection.

## Examples

builder.project([
  { name: 'name', by: (b) => b.values('name') },
  { name: 'age', by: (b) => b.elementMap() },
]);
