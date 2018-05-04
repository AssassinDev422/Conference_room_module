module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['public/javascripts/whiteboard/wbactions.js'],
                dest: 'public/javascripts/build/vclass.js',
            }
        },
        jshint: {
            all: ['public/javascripts/build/vclass.js']
        },
        jsbeautifier : {
            files : ['public/javascripts/build/vclass.js'],
            options : {
            }
        },
        uglify: {
            build: {
                src: "public/javascripts/build/vclass.js",
                dest: "public/javascripts/build/vclass.min.js"
            }
        },
        shell: {
            nodejs: {
                command: function() {
                    return 'sudo node app.js';
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('default', ['concat', 'jshint', 'jsbeautifier', 'uglify', 'shell'])
}
