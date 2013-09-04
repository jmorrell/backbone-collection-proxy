module.exports = function (grunt) {
  grunt.initConfig({

    browserify: {
      basic: {
        src: [],
        dest: './backbone-collection-proxy.js',
        options: {
          external: [ 'underscore', 'backbone' ],
          alias: ['./index.js:backbone-collection-proxy']
        }
      }
    },

    umd: {
      default: {
        src: './backbone-collection-proxy.js',
        template: './templates/umd.hbs',
        objectToExport: "require('backbone-collection-proxy')",
        globalAlias: 'proxyCollection',
        deps: {
          'default': ['_', 'Backbone'],
          amd: ['underscore', 'backbone'],
          cjs: ['underscore', 'backbone'],
          global: ['_', 'Backbone']
        },
        browserifyMapping: '{"backbone":Backbone,"underscore":_}'
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('default', ['browserify', 'umd']);
};
