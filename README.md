# backbone-collection-proxy

[![Build Status](https://secure.travis-ci.org/user/backbone-collection-proxy.png?branch=master)](http://travis-ci.org/user/backbone-collection-proxy)

Create a read-only copy of a backbone collection that stays in sync with the original 
collection as it's modified, and forwards all of the original collection's events through
the proxy.

```javascript
var original = new Backbone.Collection([ /* ... */ ]);

// Create a new object that will be a read-only proxy of the original model
var proxy = {};
proxyCollection(original, proxy);

// Now we can read values using Backbone.Collection methods on the proxy object
proxy.length === original.length;
proxy.map(function(model) { /* ... */ });
// etc
```

## Why?

This module is somewhat useless on it's own, but it's intended to be used to
hide the actual `Backbone.Collection` so that I can manipulate it without the
user being able to modify the proxy.

## Usage

The following methods are not available on the proxy:

* `add`
* `create`
* `remove`
* `set`
* `reset`
* `sort`
* `parse`
* `sync`
* `fetch`
* `push`
* `pop`
* `shift`
* `unshift`

Additionally, there is no access to the following properties:

* comparator
* model
* models
* url

All other collection methods should work and return the same result
as if they were called on the original collection.

### Events

Note that events fired on the proxied collection *will not* also be
fired on the original collection, however all events fired on the
original collection will be forwarded to the proxied collection.

## Installation

### Usage with Bower

Install with [Bower](http://bower.io):

```
bower install backbone-collection-proxy
```

The component can be used as a Common JS module, an AMD module, or a global.

### Usage with Browserify

Install with npm, use with [Browserify](http://browserify.org/)

```
> npm install backbone-collection-proxy
```

and in your code

```javascript
var proxyCollection = require('backbone-collection-proxy');
```

### Usage as browser global

You can include `backbone-sorted-collection.js` directly in a script tag. Make 
sure that it is loaded after underscore and backbone. It's exported as `SortedCollection`
on the global object.

```HTML
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="backbone-collection-proxy.js"></script>
```

## Testing

Install [Node](http://nodejs.org) (comes with npm) and Bower.

From the repo root, install the project's development dependencies:

```
npm install
bower install
```

Testing relies on the Karma test-runner. If you'd like to use Karma to
automatically watch and re-run the test file during development, it's easiest
to globally install Karma and run it from the CLI.

```
npm install -g karma
karma start
```

To run the tests in Firefox, just once, as CI would:

```
npm test
```

## License

MIT

