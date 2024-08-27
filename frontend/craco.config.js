const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'react-native$': 'react-native-web',
    },
    resolve: {
      extensions: ['.web.js', '.js'],
    },
  },
};
