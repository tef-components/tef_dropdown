module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      default: {
        files: {
          "templates/tef.dropdown.css": "less/tef.dropdown.less"
        }
      }
    },
    
    // Creates embedded icon font
    webfont: {
      embedded: {
        src: '../icons/source/*.svg',
        dest: 'fonts/',
        options: {
          font: 'icons',
          embed: 'woff,ttf,eot',
          engine: 'node',
          templateOptions: {
            baseClass: '',
            classPrefix: '',
            mixinPrefix: ""
          }
        }
      }
    },

    includes: {
      files: {
        cwd: 'templates/',
        src: '**/*.html',
        dest: ''
      }
    },

    bump: {
      // upgrade release and push to master
      options : {
        files: ['bower.json'],
        commitFiles: ["-a"],
        pushTo: 'origin'
      }
    },

    exec: {
      // add new files before commiting
      add: {
        command: 'git add .'
      },

      // push to gh-pages branch
      pages: {
        command: [
          'git checkout gh-pages',
          'git pull origin master',
          'git push origin gh-pages',
          'git checkout master'
        ].join('&&')
      },

      // adds prompted commit message
      message: {
        command: function() {
          var message = grunt.config('gitmessage');
          return "git commit -am '" + message + "'";
        }
      }
    },

    prompt: {
      commit: {
        options: {
          questions: [
            {
              config: 'gitmessage',
              type: 'input',
              message: 'Commit Message'
            }
          ]
        }
      }
    }
  });

  grunt.registerTask('default', [
    'less',
    'webfont:embedded',
    'includes'
  ]);

  grunt.registerTask('release', [
    'less',
    'webfont:embedded',
    'includes',
    'exec:add',
    'prompt',
    'exec:message',
    'bump',
    'exec:pages'
  ]);
};
