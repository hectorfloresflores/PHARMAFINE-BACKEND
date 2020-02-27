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
    deleteItemsCheckout
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
        password: profile.id
    }
      
    existUser("id",profile.id).then(user =>{
        if (!user) {
            createUser(newUser);
            newUser.token = createTokenAndUpdateUser(newUser);
            return done(null,newUser);
          }else{
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
      token: theToken
  })

  return theToken;
}
