module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      options: {
        globals: {
          jQuery: true
        },
        sub: true,
        shadow: true
      },
      test: ['Gruntfile.js', 'src/*.js'],
      build: ['build/*.js']
    },
    
    concat: {
      options: {
        stripBanners: true
      },
      js: {
        options: {
          banner: '/* jshint sub:true, shadow:true */'
        },
        src: 'src/*.js',
        dest: 'build/<%= pkg.name %>.js'
      },
      css: {
        src: 'src/*.css',
        dest: 'build/<%= pkg.name %>.css'
      }
    },
    
    copy: {
      build: {
        expand: true,
        flatten: true,
        src: 'src/xbutton.png',
        dest: 'build/'
      },
      dist: {
        expand: true,
        flatten: true,
        src: 'src/xbutton.png',
        dest: 'dist/'
      }
    },
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: '<%= concat.js.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    
    cssmin: {
      dist: {
        src: '<%= concat.css.dest %>',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  grunt.registerTask('test', ['jshint:test']);
  grunt.registerTask('default', ['jshint:test', 'concat', 'copy:build', 'jshint:build', 'uglify', 'cssmin', 'copy:dist']);
};