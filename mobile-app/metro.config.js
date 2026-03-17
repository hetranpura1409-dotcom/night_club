const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // @rnmapbox/maps publishes TS sources under `src/` and compiled JS under `lib/`.
    // Metro can sometimes pick the `react-native: src/index` entry and fail to resolve.
    // Force Metro to prefer compiled JS.
    resolverMainFields: ['main', 'module', 'browser', 'react-native'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
