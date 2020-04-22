const passport = require("passport");
const  clientID = '1085398317165-efts9oskbt6huocbodgne09smma7gndo.apps.googleusercontent.com';
const clientSECRET = 'GZJ7LTYMXdZRoMPxcEdk_D9T';

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser,
    deleteItemsCheckout,
    existUserIDandEmail
} = require('../db/users')

const {
  tokenValidation,
  tokenSign
} = require('../middlewares/authentication/jsonwebtoken')

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSECRET,
      callbackURL: "http://localhost:3002/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
      
      
      let newUser = {
          id: profile.id,
          url: profile.photos[0].value,
        name: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        isVerified: profile.emails[0].verified,
    }
      
    existUserIDandEmail(profile.id,profile.emails[0].value).then(user =>{
        if (user == undefined) {
            createUser(newUser);
            newUser.token = createTokenAndUpdateUser(newUser);
            return done(null,newUser);
          }else{
            if (user.id == undefined) {
              user.id = profile.id;
            }
            user.token = createTokenAndUpdateUser(user);
            return done(null,user);
          }
      })
    
    }
  )
);

function createTokenAndUpdateUser(user) {
  let theToken = tokenSign(user)
  updateUser({
      email: user.email
  }, {
      id:user.id,
      token: theToken
  })

  return theToken;
}
