module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // domain: "root@tpm.orbit.al",

    exec: {
      npminstall: { cmd: 'npm install' },
      // server: { cmd: 'node server/server.js' },
      // upload: { cmd: 'rsync -rav -e ssh --delete --exclude-from server/config/exclude.txt . <%= domain %>:~/<%= pkg.name %>'},
      // deploy: { cmd: 'ssh -t <%= domain %> "cd ~/<%= pkg.name %> && server/config/deploy.sh"'},

      // publish
      "publish": { cmd: 'bash bin/publish.sh'}
    },

    typescript: {
      lib: {
        src: ['lib/command.ts'], // should reference everything else
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
    },

    "tpm-install": {
      options: {dev:true},
      all: {src: "package.json"}
    },

    "tpm-index": {
      all: {src: ["types/**/*.d.ts"]}
    }

  });

  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-typescript')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerMultiTask('build', 'Build the static index', function() {
    var tpm = require('./lib/tpm')
    var done = this.async()

    var files = this.files // why is this an array?
    grunt.log.writeln("Building Index...")

    tpm.loadDtAndBuildIndex().then(function(index) { 
      var contents = JSON.stringify(index, null, 4)

      files.forEach(function(file) {
        grunt.log.ok("Wrote " + contents.length + " bytes to " + file.dest)  
        grunt.file.write(file.dest, contents)
      })

      done(true)
    })
  })

  grunt.registerTask('test', ['typescript'], function() {
    var tpm = require('./lib/tpm')
    var done = this.async()
    tpm.loadIndex()
    .then(function(index) {
      grunt.log.writeln("loaded")
      console.log(tpm.findDefinitions(index, "angularjs"))
      console.log(tpm.findDefinitions(index, "angular"))
      console.log(tpm.findDefinitions(index, "jquery"))
      done(true)
    })
  })

  // load OUR tasks. I guess loadNPMTasks looks for a tasks folder
  grunt.loadTasks('tasks');

  grunt.registerTask('publish', ['typescript', 'build', 'exec:publish'])

  // Default task(s).
  grunt.registerTask('default', ['typescript'])
  grunt.registerTask('install', ['exec:npminstall', 'tpm-install', 'tpm-index'])
  // grunt.registerTask('deploy', ['exec:upload', 'exec:deploy'])
};