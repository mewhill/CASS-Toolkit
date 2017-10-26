//var paths = [];

module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project configuration.  
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        critical: {
            sitecss: {
                options: {
                    minify: true,
                    css: [
                        '../Website/_assets/css/site/default.css',
                    ],
                    dimensions: [{
                        height: 800,
                        width: 360
                    }, {
                        height: 900,
                        width: 1900
                    }],
                    ignore: ['@font-face', /url\(/, /tickets_popup/, /tbl\_pricing/, /sub_nav \.*\w+/, '.sub_nav', '.show_me-filter', /sub\_nav\-extend/]
                },
                src: "http://localhost:53667",
                dest: '../Website/_assets/css/site/critical.css'
            }
        },
        closureCompiler: {
            options: {
                // [REQUIRED] Path to closure compiler
                compilerFile: 'compiler.jar',
                // [OPTIONAL] set to true if you want to check if files were modified
                // before starting compilation (can save some time in large sourcebases)
                checkModified: false,
                // [OPTIONAL] Set Closure Compiler Directives here
                compilerOpts: {
                    //See https://developers.google.com/closure/compiler/docs/gettingstarted_app for more info
                    /**
                     * Keys will be used as directives for the compiler
                     * values can be strings or arrays.
                     * If no value is required use null
                     *
                     * The directive 'externs' is treated as a special case
                     * allowing a grunt file syntax (<config:...>, *)
                     *
                     * Following are some directive samples...
                     */
                    //Simple compilation only removes comments and whitespace. More complex compilation requires refactoring all code
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    //externs: ['path/to/file.js', '/source/**/*.js'],
                    //define: ["'goog.DEBUG=false'"],
                    //warning_level: 'verbose',
                    //jscomp_off: ['checkTypes', 'fileoverviewTags'],
                    //summary_detail_level: 3,
                    //output_wrapper: '"(function(){%output%}).call(this);"'
                },
                execOpts: {
                    /**
                     * Set maxBuffer if you got message "Error: maxBuffer exceeded."
                     * Node default: 200*1024
                     */
                    maxBuffer: 999999 * 1024
                },
            },
            minifyApp: {
                files: [
					{
					    '../Website/_assets/scripts/config.min.js': ['../Website/_assets/scripts/config.js']
					},
                    {
                        expand: true,
                        cwd: '../Website/_assets/scripts/app/',
                        src: ['*.js'],
                        dest: '../Website/_assets/scripts/app/min/',
                        ext: '.js'
                    }
                ]
            }
        },
        cssmin: {
            sitecss: {
                //options: {
                //    banner: '/* My minified css file */'
                //},
                files: {
                    '../Website/_assets/css/site/site.min.css': [
                        '../Website/_assets/scripts/plugin/slick/slick.css',
                        '../Website/_assets/css/site/default.css',
                        '../Website/_assets/css/site/print.css'
                    ]
                }
            }
        },
        replace: {
            version: {
                src: ['../Website/_assets/scripts/config.js'],
                overwrite: true,
                replacements: [{
                    from: /version_number: +([0-9]{1,3})/,
                    to: function (matchedWord, index, fullText, regexMatches) {   // callback replacement
                        var newNum = +regexMatches + +1
                        return "version_number: " + newNum;
                    }
                }
                ]
            },
            masterpage: {
                src: ['../Website/Masterpage.master'],
                overwrite: true,
                replacements: [{
                    from: /confv\=+([0-9]{1,3})/,
                    to: function (matchedWord, index, fullText, regexMatches) {   // callback replacement
                        var newNum = +regexMatches + +1
                        return "confv=" + newNum;
                    }
                }
                ]
            },
            build: {
                src: ['../Website/_assets/scripts/config.min.js'],
                overwrite: true,
                replacements: [{
                    from: "app/",
                    to: "app/min/"
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-critical');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task.  
    grunt.registerTask('default', ['cssmin', 'critical', 'replace:version', 'replace:masterpage', 'closureCompiler', 'replace:build']);
};