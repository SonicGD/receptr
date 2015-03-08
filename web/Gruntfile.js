module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        typescript: {
            base: {
                src: ['app/js/**/*.ts'],
                options: {
                    module: 'amd',
                    target: 'es5',
                    livereload: true
                }
            }
        },
        watch: {
            ts: {
                files: 'app/**/*.ts',
                tasks: ['typescript'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: 'app/**/*.html',
                options: {
                    livereload: true
                }
            }
        },

        open: {
            all: {
                path: 'http://recptr.dev/index.html',
                app: 'chrome'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');

    // Default task(s).
    grunt.registerTask('server', [
        'typescript',
        'open',
        'watch'
    ]);
};