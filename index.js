
var _ = require('underscore');
var Backbone = require('backbone');

// Methods in the collection prototype that we won't expose
var blacklistedMethods = [
  "_onModelEvent", "_prepareModel", "_removeReference", "_reset", "add",
  "initialize", "sync", "remove", "reset", "set", "push", "pop", "unshift",
  "shift", "sort", "parse", "fetch", "create", "model", "off", "on",
  "listenTo", "listenToOnce", "bind", "trigger", "once", "stopListening"
];

function proxyCollection(from, target) {

  function updateLength() {
    target.length = from.length;
  }

  function pipeEvents() {
    var args = _.toArray(arguments);

    // replace any references to `from` with `this`
    for (var i = 1; i < args.length; i++) {
      if (args[i] && args[i].length && args[i].length === from.length) {
        args[i] = this;
      }
    }

    this.trigger.apply(this, args);
  }

  var methods = {};

  _.each(_.functions(Backbone.Collection.prototype), function(method) {
    if (!_.contains(blacklistedMethods, method)) {
      methods[method] = function() {
        return from[method].apply(from, arguments);
      };
    }
  });

  _.extend(target, Backbone.Events, methods);

  target.listenTo(from, 'all', updateLength);
  target.listenTo(from, 'all', pipeEvents);

  updateLength();
  return target;
}

module.exports = proxyCollection;

