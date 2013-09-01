# backbone-collection-proxy

[![Build Status](https://secure.travis-ci.org/user/backbone-collection-proxy.png?branch=master)](http://travis-ci.org/user/backbone-collection-proxy)

Proxy a collection's methods and events through a proxy object while hiding certain functionality.

```javascript
// TODO
```

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

## Usage

TODO

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

