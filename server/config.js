module.exports = {
  facebook: {
    clientId: '166886444041133',
    clientSecret: '28c758a77d1b3d6cf88f9a53fe55d8f1',
    callbackUrl: 'http://localhost:3006/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'],
    validateUrl: 'https://graph.facebook.com/me'
  },
  google: {
    consumerKey: '1006414047628-c0nojgcen4mkc0s2onokisg4e5r4omv2.apps.googleusercontent.com',
    consumerSecret: 'wr70u2MU-OjO9PkgBPLpmZfa',
    callbackURL: 'http://localhost:3006/auth/google/callback'
  },
  jwt: {
    secretKey: 'SK345678987654',
  }
}