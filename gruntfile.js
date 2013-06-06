var fs = require('fs');
var jison = require('jison');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    meta: {
      version: '0.0.1',
      banner: '/*! Terraformer JS - <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/geoloqi/Terraformer\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT */'
    },

    jshint: {
      files: [ 'grunt.js', 'src/*.js', 'src/Parsers/ArcGIS/*.js' ],
      options: {
        node: true
      }
    },
    concat: {
      browser: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/browser/terraformer.js'
      },
      node: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/node/terraformer.js'
      },
      geostore: {
        src: ['<banner:meta.banner>', "src/geostore.js"],
        dest: 'dist/browser/geostore.js'
      },
      geostore_node: {
        src: ['src/geostore.js'],
        dest: 'dist/node/GeoStore/index.js'
      },
      memory_store: {
        src: ['<banner:meta.banner>', "src/Store/Memory.js"],
        dest: 'dist/browser/Store/Memory.js'
      },
      local_store: {
        src: ['<banner:meta.banner>', "src/Store/LocalStorage.js"],
        dest: 'dist/browser/Store/LocalStorage.js'
      }
    },
    uglify: {
      terraformer: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/browser/terraformer.min.js'
      },
      rtree: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/browser/rtree.min.js'
      },
      arcgis: {
        src: ["dist/browser/arcgis.js"],
        dest: 'dist/browser/arcgis.min.js'
      },
      wkt: {
        src: ["dist/browser/wkt.js"],
        dest: 'dist/browser/wkt.min.js'
      },
      geostore: {
        src: ["dist/browser/geostore.js"],
        dest: 'dist/browser/geostore.min.js'
      },
      memory_store: {
        src: ["dist/browser/Store/Memory.js"],
        dest: 'dist/browser/Store/Memory.min.js'
      },
      local_store: {
        src: ["dist/browser/Store/LocalStorage.js"],
        dest: 'dist/browser/Store/LocalStorage.min.js'
      }
    }
  });

  grunt.registerTask('wkt-parser', 'Building WKT Parser', function() {
    var grammar = fs.readFileSync('./src/Parsers/WKT/partials/wkt.yy', 'utf8');
    var convert = fs.readFileSync('./src/Parsers/WKT/partials/convert.js', 'utf8');

    var wrapper = fs.readFileSync('./src/Parsers/WKT/partials/module-source.js', 'utf8');

    var Parser = jison.Parser;
    var parser = new Parser(grammar);

    // generate source, ready to be written to disk
    var parserSource = parser.generate({ moduleType: "js" });

    wrapper = wrapper.replace('"SOURCE";', parserSource + convert);

    fs.writeFileSync("./src/Parsers/WKT/wkt.js", wrapper, "utf8");
    fs.writeFileSync("./dist/browser/wkt.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/WKT/parser.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
  });

  grunt.registerTask('arcgis-parser', 'Building ArcGIS Parser', function() {
    var src = fs.readFileSync('./src/Parsers/ArcGIS/arcgis.js', 'utf8');

    var wrapper = fs.readFileSync('./src/Parsers/ArcGIS/partials/module-source.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/browser/arcgis.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/ArcGIS/index.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
  });

  grunt.registerTask('rtree-exports', 'Building RTree node module', function() {
    var src = fs.readFileSync('./src/rtree.js', 'utf8');

    var wrapper = fs.readFileSync('./src/partials/module-rtree.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/browser/rtree.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/RTree/index.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', [ 'wkt-parser', 'arcgis-parser', 'rtree-exports', 'concat', 'jshint', 'uglify' ]);
};