var tpm = require('./lib/tpm')

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    domain: "root@tpm.orbit.al",

    exec: {
      npminstall: { cmd: 'npm install' },
      server: { cmd: 'node server/server.js' },
      upload: { cmd: 'rsync -rav -e ssh --delete --exclude-from server/config/exclude.txt . <%= domain %>:~/<%= pkg.name %>'},
      deploy: { cmd: 'ssh -t <%= domain %> "cd ~/<%= pkg.name %> && server/config/deploy.sh"'},
    },

    typescript: {
      lib: {
        src: ['lib/tpm.ts'],
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
        tasks: ["typescript:lib"],
      },
    },

    build: {
      all: {
        dest: "data/index.json"
      },
    }

  });

  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-typescript')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerMultiTask('build', 'Build the static index', function() {
    var done = this.async()

    var files = this.files // why is this an array?
    grunt.log.writeln("Building Index...")

    tpm.loadDtAndBuildIndex().then(function(index) { 
      var contents = JSON.stringify(index)

      files.forEach(function(file) {
        grunt.log.ok("Wrote " + contents.length + " bytes to " + file.dest)  
        grunt.file.write(file.dest, contents)
      })

      done(true)
    })
    

    // files is an array of DESTINATIONS
    
    // this.files.forEach(function(file) {
    //   console.log("FILE", file.src)
    // })
  })

  // Default task(s).
  grunt.registerTask('default', ['typescript'])
  grunt.registerTask('install', ['exec:npminstall'])
  grunt.registerTask('deploy', ['exec:upload', 'exec:deploy'])
};