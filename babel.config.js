module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    [
      '@babel/preset-env',
      {
        loose: true,
        shippedProposals: true,
      },
    ],
  ],
  plugins: ['react-native-reanimated/plugin'],
};
