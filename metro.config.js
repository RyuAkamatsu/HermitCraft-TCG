const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('db');
defaultConfig.resolver.assetExts.push('csv');

// Remove all console logs in production...
defaultConfig.transformer.minifierConfig.compress.drop_console = true;

module.exports = defaultConfig;
