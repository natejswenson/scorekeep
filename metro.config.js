const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable static file serving for GitHub Pages
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Configure for GitHub Pages deployment
if (process.env.GITHUB_PAGES) {
  config.transformer.publicPath = '/scorekeep/';
}

module.exports = config;