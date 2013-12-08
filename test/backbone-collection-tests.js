$(document).ready(function() {

  /*
   * These are tests pulled from the backbone.collection unit tests.
   * All of the tests that involved modifying the collection have
   * been removed.
   */

  var a, b, c, d, e, col, otherCol;

  function getProxyCollection(coll) {
    return proxyCollection(coll, {});
  }

  module("Backbone.Collection", _.extend(new Environment, {

    setup: function() {
      Environment.prototype.setup.apply(this, arguments);

      a         = new Backbone.Model({id: 3, label: 'a'});
      b         = new Backbone.Model({id: 2, label: 'b'});
      c         = new Backbone.Model({id: 1, label: 'c'});
      d         = new Backbone.Model({id: 0, label: 'd'});
      e         = null;
      col = getProxyCollection(new Backbone.Collection([a,b,c,d]));
      otherCol = getProxyCollection(new Backbone.Collection());
    }

  }));

  test("new and sort", 2, function() {
    var counter = 0;
    col.on('sort', function(){ counter++; });
    equal(col.first(), a, "a should be first");
    equal(col.last(), d, "d should be last");
  });

  test("String comparator.", 1, function() {
    var collection = getProxyCollection(new Backbone.Collection([
      {id: 3},
      {id: 1},
      {id: 2}
    ], {comparator: 'id'}));

    deepEqual(collection.pluck('id'), [1, 2, 3]);
  });

  test("new and parse", 3, function() {
    var Collection = Backbone.Collection.extend({
      parse : function(data) {
        return _.filter(data, function(datum) {
          return datum.a % 2 === 0;
        });
      }
    });
    var models = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
    var collection = getProxyCollection(new Collection(models, {parse: true}));
    strictEqual(collection.length, 2);
    strictEqual(collection.first().get('a'), 2);
    strictEqual(collection.last().get('a'), 4);
  });

  test("get", 6, function() {
    equal(col.get(0), d);
    equal(col.get(d.clone()), d);
    equal(col.get(2), b);
    equal(col.get({id: 1}), c);
    equal(col.get(c.clone()), c);
    equal(col.get(col.first().cid), col.first());
  });

  test("get with non-default ids", 4, function() {
    var MongoModel = Backbone.Model.extend({idAttribute: '_id'});
    var model = new MongoModel({_id: 100});
    var col = getProxyCollection(new Backbone.Collection([model]));
    equal(col.get(100), model);
    equal(col.get(model.cid), model);
    equal(col.get(model), model);
    equal(col.get(101), void 0);
  });

  test("update index when id changes", 3, function() {
    var col = getProxyCollection(new Backbone.Collection([
      {id : 0, name : 'one'},
      {id : 1, name : 'two'}
    ]));
    var one = col.get(0);
    equal(one.get('name'), 'one');
    one.set({id : 101});
    equal(col.get(0), null);
    equal(col.get(101).get('name'), 'one');
  });

  test("at", 1, function() {
    equal(col.at(2), c);
  });

  test("pluck", 1, function() {
    equal(col.pluck('label').join(' '), 'a b c d');
  });

  test("slice", 2, function() {
    var col = getProxyCollection(new Backbone.Collection([{a: 'a'}, {b: 'b'}, {c: 'c'}]));
    var array = col.slice(1, 3);
    equal(array.length, 2);
    equal(array[0].get('b'), 'b');
  });

  test("toJSON", 1, function() {
    equal(JSON.stringify(col), '[{"id":3,"label":"a"},{"id":2,"label":"b"},{"id":1,"label":"c"},{"id":0,"label":"d"}]');
  });

  test("where and findWhere", 8, function() {
    var model = new Backbone.Model({a: 1});
    var coll = getProxyCollection(new Backbone.Collection([
      model,
      {a: 1},
      {a: 1, b: 2},
      {a: 2, b: 2},
      {a: 3}
    ]));
    equal(coll.where({a: 1}).length, 3);
    equal(coll.where({a: 2}).length, 1);
    equal(coll.where({a: 3}).length, 1);
    equal(coll.where({b: 1}).length, 0);
    equal(coll.where({b: 2}).length, 2);
    equal(coll.where({a: 1, b: 2}).length, 1);
    equal(coll.findWhere({a: 1}), model);
    equal(coll.findWhere({a: 4}), void 0);
  });

  test("Underscore methods", 13, function() {
    equal(col.map(function(model){ return model.get('label'); }).join(' '), 'a b c d');
    equal(col.any(function(model){ return model.id === 100; }), false);
    equal(col.any(function(model){ return model.id === 0; }), true);
    equal(col.indexOf(b), 1);
    equal(col.size(), 4);
    equal(col.rest().length, 3);
    ok(!_.include(col.rest(), a));
    ok(_.include(col.rest(), d));
    ok(!col.isEmpty());
    ok(!_.include(col.without(d), d));
    equal(col.max(function(model){ return model.id; }).id, 3);
    equal(col.min(function(model){ return model.id; }).id, 0);
    deepEqual(col.chain()
            .filter(function(o){ return o.id % 2 === 0; })
            .map(function(o){ return o.id * 2; })
            .value(),
         [4, 0]);
  });

  test("trigger custom events on models", 1, function() {
    var fired = null;
    a.on("custom", function() { fired = true; });
    a.trigger("custom");
    equal(fired, true);
  });

  test("#964 - collection.get return inconsistent", 2, function() {
    var c = getProxyCollection(new Backbone.Collection());
    ok(c.get(null) === undefined);
    ok(c.get() === undefined);
  });

  test("#1112 - passing options.model sets collection.model", 1, function() {
    var Model = Backbone.Model.extend({});
    var c = getProxyCollection(new Backbone.Collection([{id: 1}], {model: Model}));
    ok(c.at(0) instanceof Model);
  });

  test("null and undefined are invalid ids.", 2, function() {
    var model = new Backbone.Model({id: 1});
    var collection = getProxyCollection(new Backbone.Collection([model]));
    model.set({id: null});
    ok(!collection.get('null'));
    model.set({id: 1});
    model.set({id: undefined});
    ok(!collection.get('undefined'));
  });

  test("#1655 - groupBy can be used with a string argument.", 3, function() {
    var collection = getProxyCollection(new Backbone.Collection([{x: 1}, {x: 2}]));
    var grouped = collection.groupBy('x');
    strictEqual(_.keys(grouped).length, 2);
    strictEqual(grouped[1][0].get('x'), 1);
    strictEqual(grouped[2][0].get('x'), 2);
  });

  test("#1655 - sortBy can be used with a string argument.", 1, function() {
    var collection = getProxyCollection(new Backbone.Collection([{x: 3}, {x: 1}, {x: 2}]));
    var values = _.map(collection.sortBy('x'), function(model) {
      return model.get('x');
    });
    deepEqual(values, [1, 2, 3]);
  });

  test("#1407 parse option on constructor parses collection and models", 2, function() {
    var model = {
      namespace : [{id: 1}, {id:2}]
    };
    var Collection = Backbone.Collection.extend({
      model: Backbone.Model.extend({
        parse: function(model) {
          model.name = 'test';
          return model;
        }
      }),
      parse: function(model) {
        return model.namespace;
      }
    });
    var c = getProxyCollection(new Collection(model, {parse:true}));

    equal(c.length, 2);
    equal(c.at(0).get('name'), 'test');
  });

});
