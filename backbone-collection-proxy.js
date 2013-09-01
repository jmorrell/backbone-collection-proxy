
// Methods on the collection we will expose to the outside world
var collectionMethods = [
  'toJSON', 'forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
  'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
  'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
  'max', 'min', 'groupBy', 'sortedIndex', 'shuffle', 'toArray', 'size',
  'first', 'head', 'take', 'initial', 'rest', 'tail', 'drop', 'last',
  'without', 'indexOf', 'lastIndexOf', 'isEmpty', 'chain', 'pluck',
  'findWhere', 'get', 'at', 'slice', 'where', 'findWhere'
];

function pipeEvents() {
  var args = _.toArray(arguments);

  // replace any references to `this._collection` with `this`
  for (var i = 1; i < args.length; i++) {
    // Is there a better way to check for this?
    // List all of the possible events?
    if (args[i].models && args[i].models.length === this._collection.models.length) {
      args[i] = this;
    }
  }

  this.trigger.apply(this, args);
}

function proxyCollection(from, target, options) {
  var methods = {};

  _.each(collectionMethods, function(method) {
    // if method not in options.skipMethods
    methods[method] = function() {
      return Backbone.Collection.prototype[method].apply(target, arguments);
    };
  });

  _.extend(target.prototype, methods, Backbone.Events);

  target.listenTo(from, 'all', pipeEvents);
  target.listenTo(from, 'add remove reset', function updateLength() {
    this.length = from.length;
  });
}

module.exports = proxyCollection;

