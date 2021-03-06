var passport    = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find({username : username}).exec(function (err, user){

      if (err) { return done(null, err); }
      if (!user || user.length < 1) { return done(null, false, { message: 'Incorrect User'})}

      bcrypt.compare(password, user[0].password, function(err, res) {
        if (!res) return done(null, false, { message: 'Incorrect Password'});
        return done(null, user);
      });
    });
  })
);

module.exports = {
 http: {
    customMiddleware: function(app){
      console.log('Initializing passport session');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};