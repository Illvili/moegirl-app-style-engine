module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      js: {
        src: 'src/*.js',
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: 'src/*.css',
        dest: 'dist/<%= pkg.name %>.css'
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
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
}