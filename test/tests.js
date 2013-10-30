$(document).ready(function() {

  function getProxyCollection(coll) {
    return proxyCollection(coll, {});
  }

  var mockData = [
    { a: 1, b: 2, c:'a' },
    { a: 1, b: 3, c:'b' },
    { a: 1, b: 3, c:'c' },
    { a: 2, b: 2, c:'20' },
    { a: 2, b: 2, c:'3' }
  ];

  var resetData = [
    { d: 1, e: 2, f:'a' },
    { d: 1, e: 3, f:'b' },
    { d: 1, e: 3, f:'c' },
    { d: 2, e: 2, f:'3' }
  ];

  var original, proxied;

  module("Proxied Collection", _.extend(new Environment, {

    setup: function() {
      original = new Backbone.Collection(mockData);
      proxied = getProxyCollection(original);
    }

  }));

  test("length", function() {
    equal(original.length, proxied.length, "should have same length");
  });

  test('results in the same toJSON output', function() {
    deepEqual(original.toJSON(), proxied.toJSON());
  });

  test('has the same .first() output', function() {
    equal(original.first(), proxied.first());
  });

  test('has the same .last() output', function() {
    equal(original.last(), proxied.last());
  });

  test('has the same .at() output', function() {
    equal(original.at(0), proxied.at(0));
    equal(original.at(1), proxied.at(1));
    equal(original.at(2), proxied.at(2));
    equal(original.at(3), proxied.at(3));
    equal(original.at(4), proxied.at(4));
  });

  test("updates length", function() {
    original.add({ a: 1, b: 2, c:'a' });
    equal(original.length, proxied.length, "should have same length");

    original.reset(resetData);
    equal(original.length, proxied.length, "should have same length");
  });

  test("has the same .models", function() {
    equal(original.models, proxied.models, "should have the same models array");

    // Add a new model and make sure the change propagates
    original.add({ a: 3 });
    equal(original.models, proxied.models, "should still have the same models array");

    // Reset the orignal collection and make sure the change propagates
    original.reset(resetData);
    equal(original.models, proxied.models, "should still have the same models array");
  });

  test('get', function() {
    original.each(function(model) {
      ok(proxied.get(model.cid));
      equal(original.get(model.cid), proxied.get(model.cid));
    });
  });

  test('at', function() {
    equal(original.at(0), proxied.at(0));
    equal(original.at(1), proxied.at(1));
    equal(original.at(2), proxied.at(2));
  });

  test('toJSON', function() {
    deepEqual(original.toJSON(), proxied.toJSON());
    equal(JSON.stringify(original.toJSON()), JSON.stringify(proxied.toJSON()));
  });

  test('first', function() {
    equal(original.first(), proxied.first());
  });

  test('last', function() {
    equal(original.last(), proxied.last());
  });

  test('length', function() {
    equal(original.length, proxied.length);
  });

  test('map', function() {
    var fn = function(model) { return model.get('a'); };
    deepEqual(original.map(fn), proxied.map(fn));
  });

  test('map with context', function() {
    var context = { a: 100 };
    var fn = function(model) { return this.a; };
    deepEqual(original.map(fn, context), proxied.map(fn, context));
    deepEqual(proxied.map(fn, context), [ 100, 100, 100, 100, 100 ]);
  });

  test('each', function() {
    var calledA = [];
    var calledB = [];

    original.each(function(model) {
      calledA.push(model.toJSON());
    });

    proxied.each(function(model) {
      calledB.push(model.toJSON());
    });

    equal(calledA.length, 5);
    equal(calledA.length, calledB.length);
    deepEqual(calledA, calledB);
  });

  test('each with context', function() {
    var calledA = [];
    var calledB = [];
    var context = { a: 100 };

    original.each(function(model) {
      calledA.push(this.a);
    }, context);

    proxied.each(function(model) {
      calledB.push(this.a);
    }, context);

    equal(calledA.length, 5);
    equal(calledA.length, calledB.length);
    deepEqual(calledA, calledB);
    deepEqual(calledA, [ 100, 100, 100, 100, 100 ]);
  });

  test('slice', function() {
    deepEqual(original.slice(1), proxied.slice(1));
    deepEqual(original.slice(0, 1), proxied.slice(0, 1));
    deepEqual(original.slice(1, 1), proxied.slice(1, 1));
  });

  test('where', function() {
    deepEqual(original.where({ b: 2 }), proxied.where({ b: 2 }));
  });

  test('findWhere', function() {
    deepEqual(
      original.findWhere({ b: 3 }), proxied.findWhere({ b: 3 })
    );
  });

});
