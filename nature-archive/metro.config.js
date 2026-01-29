/**
 * Metro Configuration
 *
 * Metro is the JavaScript bundler used by React Native.
 * This configuration extends the default Expo Metro config.
 */

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
