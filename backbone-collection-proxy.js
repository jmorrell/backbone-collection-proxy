(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('underscore'), require('backbone'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['underscore', 'backbone'], factory);
    }
    else {
        root.proxyCollection = factory(root._, root.Backbone);
    }
}(this, function(_, Backbone) {
var require=function(name){return {"backbone":Backbone,"underscore":_}[name];};
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"+xzAE8":[function(require,module,exports){

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


},{"backbone":false,"underscore":false}],"backbone-collection-proxy":[function(require,module,exports){
module.exports=require('+xzAE8');
},{}]},{},[])
;
return require('backbone-collection-proxy');

}));
