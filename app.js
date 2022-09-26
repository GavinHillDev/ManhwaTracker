const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require('dotenv')
const helmet = require('helmet')
const compression = require('compression')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const User = require('./models/usermodel')
const Tracker = require('./models/tracker')
const SundayTracker = require('./models/sunday')
const MondayTracker = require('./models/monday')
const TuesdayTracker = require('./models/tuesday')
const WednesdayTracker = require('./models/wednesday')
const ThursdayTracker = require('./models/thursday')
const FridayTracker = require('./models/friday')
const SaturdayTracker = require('./models/saturday')
const async = require("async")
const app = express();
dotenv.config()

const mongoDB = process.env.the_db;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on("error", console.error.bind(console, "mongo connection error"));

app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "pug");
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression())
passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            
            return done(null, user)
          } else {
            console.log('error')
            return done(null, false, { message: "Incorrect password" })
          }
        })
        // return done(null, user);
      });
    })
  );
  
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done, ) {

    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
    res.render('index.pug', {user: req.user, tracker: req.tracker})
    
})
app.get('/tracked', (req, res, next) => {
  async.parallel({
    sundaylist(callback) {
      SundayTracker.find(callback)
    },
    mondaylist(callback) {
      MondayTracker.find(callback)
      .sort([['rank', 'descending']])
    },
    tuesdaylist(callback) {
      TuesdayTracker.find(callback)
      .sort([['rank', 'descending']])
    },
    wednesdaylist(callback) {
      WednesdayTracker.find(callback)
      .sort([['rank', 'descending']])
    },
    thursdaylist(callback) {
      ThursdayTracker.find(callback)
      .sort([['rank', 'descending']])
    },
    fridaylist(callback) {
      FridayTracker.find(callback)
      .sort([['rank', 'descending']])
    },
    saturdaylist(callback) {
      SaturdayTracker.find(callback)
      .sort([['rank', 'descending']])
    }
  }, 
  (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('tracked.pug', {
      title: "Tracker page",
      user: req.user,
      sundaylist: results.sundaylist,
      mondaylist: results.mondaylist,
      tuesdaylist: results.tuesdaylist,
      wednesdaylist: results.wednesdaylist,
      thursdaylist: results.thursdaylist,
      fridaylist: results.fridaylist,
      saturdaylist: results.saturdaylist,
  });
})})
app.post('/trackedmonday', (req, res) =>{
  
  async.parallel(
     { 
      monday(callback) {
        MondayTracker.findById(req.body.mondayid).exec(callback)}
      },
      MondayTracker.findOneAndDelete(req.body.mondayid, (err) => {
        if (err) {
          return next(err)
        }
       
        res.redirect('/tracked')
}))})
app.post('/trackedsunday', (req, res) => {
 
  async.parallel(
    { 
     sunday(callback) {
       SundayTracker.findById(req.body.sundayid).exec(callback)}
     },
     SundayTracker.findOneAndDelete(req.body.sundayid, (err) => {
       if (err) {
         return next(err)
       }
      
       res.redirect('/tracked')
}))})
app.post('/trackedwednesday', (req, res) =>{
  
  async.parallel(
     { 
      wednesday(callback) {
        WednesdayTracker.findById(req.body.wednesdayid).exec(callback)}
      },
      WednesdayTracker.findOneAndDelete(req.body.wednesdayid, (err) => {
        if (err) {
          return next(err)
        }
       
        res.redirect('/tracked')
}))})
app.post('/trackedtuesday', (req, res) => {
 
  async.parallel(
    { 
     tuesday(callback) {
       TuesdayTracker.findById(req.body.tuesdayid).exec(callback)}
     },
     TuesdayTracker.findOneAndDelete(req.body.tuesdayid, (err) => {
       if (err) {
         return next(err)
       }
      
       res.redirect('/tracked')
}))})
app.post('/trackedfriday', (req, res) =>{
  
  async.parallel(
     { 
      friday(callback) {
        FridayTracker.findById(req.body.fridayid).exec(callback)}
      },
      FridayTracker.findOneAndDelete(req.body.fridayid, (err) => {
        if (err) {
          return next(err)
        }
       
        res.redirect('/tracked')
}))})
app.post('/trackedthursday', (req, res) => {
  async.parallel(
    { 
     thursday(callback) {
       ThursdayTracker.findById(req.body.thursdayid).exec(callback)}
     },
     ThursdayTracker.findOneAndDelete(req.body.thursdayid, (err) => {
       if (err) {
         return next(err)
       }
      
       res.redirect('/tracked')
}))})
app.post('/trackedsaturday', (req, res) => {
  async.parallel(
    { 
     saturday(callback) {
       SaturdayTracker.findById(req.body.saturdayid).exec(callback)}
     },
     SaturdayTracker.findOneAndDelete(req.body.saturdayid, (err) => {
       if (err) {
         return next(err)
       }
      
       res.redirect('/tracked')
}))})

app.get('/trackercreate', (req, res) => {
    res.render('tracker.pug', {user : req.user})
})
app.get("/log-out", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  app.post('/trackercreate', (req, res, next) => {
    if (req.body.day === 'Sunday') {
      const sundaytracker = new SundayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }
    if (req.body.day === 'Monday') {
      const mondaytracker = new MondayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }
    if (req.body.day === 'Tuesday') {
      const tuesdaytracker = new TuesdayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }
    if (req.body.day === 'Wednesday') {
      const wednesdaytracker = new WednesdayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }
    if (req.body.day === 'Thursday') {
      const thursdaytracker = new ThursdayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }
    if (req.body.day === 'Friday') {
      const fridaytracker = new FridayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }
    if (req.body.day === 'Saturday') {
      const saturdaytracker = new SaturdayTracker({
        title: req.body.trackerTitle,
        name : req.body.name,
        rank : req.body.rank,
        // week : req.body.week,
        day : req.body.day
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      });
    }

  })

app.post("/sign-up", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save(err => {
      if (err) { 
        return next(err);
      }
      res.redirect("/");
    });
  }) 
  });
  app.post(
    "/log-in",
    passport.authenticate("local",  {
      successRedirect: "/",
      failureRedirect: "/"
    })
  ); 
app.listen(3000, () => console.log("app listening on port 3000!"))