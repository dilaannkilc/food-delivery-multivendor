

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...config.resolver.alias,
  assert: require.resolve('assert'),
  events: require.resolve('events'),
  stream: require.resolve('stream'),
  util: require.resolve('util'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process'),
};

config.resolver.fallback = {
  ...config.resolver.fallback,
  assert: require.resolve('assert'),
  events: require.resolve('events'),
  stream: require.resolve('stream'),
  util: require.resolve('util'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process'),
};


module.exports = withNativeWind(config, { input: "./global.css" });


