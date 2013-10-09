module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec: {
      npminstall: { cmd: 'npm install' },
      server: { cmd: 'node server/server.js' },
    },

    typescript: {
      server: {
        src: ['server/server.ts'],
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5', //or es3
          // sourcemap: true,
          // fullSourceMapPath: true,
        }
      },
    },

    watch: {
      options: { livereload: true, spawn: false },
      server: {
        files: ["**/*.ts", "*.ts"],
        tasks: ["typescript:server"],
      },
    },

  });

  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-typescript')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Default task(s).
  grunt.registerTask('default', ['typescript'])
  grunt.registerTask('install', ['exec:npminstall'])
};