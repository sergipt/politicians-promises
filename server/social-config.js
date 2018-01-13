

module.exports = {
  session: {
    keys: [
      'AsUpErSeCreTkEy54326789'
    ]
  },
  facebook: {
    clientId: '166886444041133',
    clientSecret: '28c758a77d1b3d6cf88f9a53fe55d8f1',
    callbackUrl: 'http://localhost:3006/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
}