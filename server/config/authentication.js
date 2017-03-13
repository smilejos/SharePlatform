module.exports = {
    facebookAuth: {
        clientID: '1289438404475100',
        clientSecret: 'b38ec4c5af15129830a8b53b1e0865cb',
        callbackURL: "http://jos.link:8888/auth/facebook/callback"
    },
    twitterAuth: {
        consumerKey: 'YOUR-TWITTER-CONSUMER-KEY',
        consumerSecret: 'YOUR-TWITTER-CONSUMER-SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback',
    },
    googleAuth: {
        clientID: 'YOUR-GOOGLE-CLIENT-ID',
        clientSecret: 'YOUR-GOOGLE-CLIENT-SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback',
    }
}