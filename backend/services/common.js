import passport from "passport"

export const isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  //TODO : this is temporary token for testing without cookie
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODhlNDI1NzMzZTZjZTZiYjIwNWI0NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM3MDI0NTQ5fQ.dT1YsG_GT6E7SqsptncQuHCYJHfE0Wx6rrjZl5HutO0"

  // admin token
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGNjMTQ1NGI3MDEyNGViMGE3NjllOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM3Mjc3NzY1fQ.qakttVVjAVfY9vOVPYBipCuzNt97Jxg1Sgj0qDkssF4"
  return token;
};