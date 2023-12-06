module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // [
    //   'module-resolver',
    //   {
    //     root: ['./src'],
    //     alias: {
    //       '~/hooks': './src/hooks'
    //     }
    //   }
    // ],
    'react-native-reanimated/plugin'
  ]
};

// module.exports = {
//   presets: [
//     'module:metro-react-native-babel-preset',
//     [
//       '@babel/preset-env',
//       {
//         loose: true,
//         shippedProposals: true,
//       },
//     ],
//   ],
//   plugins: ['react-native-reanimated/plugin'],
// };
