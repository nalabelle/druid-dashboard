'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    directives: 'grunt-sprockets-directives'
  });

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/modules/**/*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      sass: {
        files: ['<%= yeoman.app %>/stylesheets/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/stylesheets/**/*.css',
          '<%= yeoman.app %>/resources/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/build-libs',
                connect.static('./build-libs')
              ),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/stylesheets',
                connect.static('./app/stylesheets')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/**/*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: {
        files: [{
          src: [
            '.tmp',
          ]
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/stylesheets/',
          src: '**/*.css',
          dest: '.tmp/stylesheets/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/stylesheets/',
          src: '**/*.css',
          dest: '.tmp/stylesheets/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/stylesheets/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    // https://github.com/yeoman/generator-angular/issues/819
    sass: {
        options: {
            includePaths: [
                'bower_components'
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/stylesheets',
                src: ['*.scss'],
                dest: '.tmp/stylesheets',
                ext: '.css'
            }]
        },
        server: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/stylesheets',
                src: ['*.scss'],
                dest: '.tmp/stylesheets',
                ext: '.css'
            }]
        }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/stylesheets/**/*.css'],
      js: ['<%= yeoman.app %>/modules/**/*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/resources/images',
          '<%= yeoman.dist %>/stylesheets'
        ],
        patterns: {
          js: [[/(resources\/images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/resources/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/resources/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/resources/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/resources/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'druid',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= yeoman.app %>',
        src: 'views/**/*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'resources/images/{,*/}*.{webp}',
            'resources/fonts/{,*/}*.*',
            'i18n/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/resources/images',
          dest: '<%= yeoman.dist %>/resources/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: '.tmp/stylessheets',
          dest: '<%= yeoman.dist %>/stylesheets',
          src: '{,*/}*.css'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/stylesheets',
        dest: '.tmp/stylesheets/',
        src: '{,*/}*.css'
      },
      views: {
        expand: true,
        cwd: '<%= yeoman.app %>/views',
        dest: '<%= yeoman.dist %>/views',
        src: '**/**.html'
      },
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
      //  'sass:server',
      //  'copy:stylesheets'
      ],
      dist: [
      //  'sass',
      //  'copy:stylesheets',
      //  'imagemin',
      //  'svgmin'
      ]
    },

    // copies REST endpoints for the environment into the proper location.
    directives: {
      dev: {
        dest: '<%= yeoman.app %>/scripts/services/rest.js',
        src: '<%= yeoman.app %>/scripts/services/rest.dev.js'
      },
      localdev: {
        dest: '<%= yeoman.app %>/scripts/services/rest.js',
        src: '<%= yeoman.app %>/scripts/services/rest.localdev.js'
      },
      prod: {
        dest: '<%= yeoman.app %>/scripts/services/rest.js',
        src: '<%= yeoman.app %>/scripts/services/rest.prod.js'
      }
    },

    // Getting crazy here to insert build numbers.
    jenkins_build_info: {
      main: {
        options: {
          files: ['package.json']
        },
      }
    },

    'string-replace': {
      dev: {
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
        },
        options: {
          replacements: [{
            pattern: /<!-- @import __VERSION__ -->/,
            replacement: function(match, p1) {
              var build = require('./package.json').build || null;
              var version = 'Local Build';
              if(build.number) {
                version = build.gitRevision + '-' + build.number;
              }
              return '<li>'+version+'</li>';
            }
          }]
        }
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
        },
        options: {
          replacements: [{
            pattern: /<!-- @import __VERSION__ -->/,
            replacement: function(match, p1) {
              return '';
            }
          }]
        }
      }
    },

    // Include all modules
    ngsrc: {
      main: {
        src: ['app/**/*.js', '!app/**/*.spec.js'],
        dest: ['.tmp/index.html']
      }
    },


  });

  //local web server
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'jenkins_build_info',
      'directives:dev',
      'wiredep',
      //'concurrent:server',
      'sass:server',
      'copy:styles',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  //builds prod
  grunt.registerTask('build', [
    'clean:dist',
    'jenkins_build_info',
    'directives:prod',
    'wiredep',
    'useminPrepare',
    //'concurrent:dist',
    'sass',
    'copy:styles',
    'imagemin',
    'svgmin',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'string-replace:dist',
    'copy:views',
    'usemin',
    'htmlmin'
  ]);

  //builds dev
  grunt.registerTask('devbuild', [
    'clean:dist',
    'jenkins_build_info',
    'directives:dev',
    'wiredep',
    'useminPrepare',
    //'concurrent:dist',
    'sass',
    'copy:styles',
    'imagemin',
    'svgmin',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'string-replace:dev',
    'copy:views',
    'usemin',
    'htmlmin'
  ]);

  // Default must always be to build prod.
  grunt.registerTask('default', [
    'build'
  ]);
};
