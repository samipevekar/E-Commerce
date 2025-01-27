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
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGNjYzEzMjIzM2Q0ZGE3OGRmNDllYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM3NTQ0NzU0fQ.209zhmOxZ2Jlv2oTr8NY5jaLnhg1e1mdtvEayRIH774"

  // admin token
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGNjYjlhYzY3YWJkOWYwZGNmNWYwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNzgwMDE4MH0.8f19SaRclkMHvIQDgwRBGAslS9TkXECrRtPyNruiikY"
  return token;
};