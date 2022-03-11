const PATH = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');

const extractLinkedPackages = require('stream-chat-react-native-core/metro-dev-helpers/extract-linked-packages');

const projectRoot = PATH.resolve(__dirname);
const { alternateRoots, extraNodeModules, moduleBlacklist } = extractLinkedPackages(projectRoot);
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      extraNodeModules,
      useWatchman: false,
      blacklistRE: blacklist(moduleBlacklist),
    },
    watchFolders: [projectRoot].concat(alternateRoots),
  };
})();
