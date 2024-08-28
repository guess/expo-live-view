module.exports = {
  presets: [
    ['module:react-native-builder-bob/babel-preset', { modules: 'commonjs' }],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@/*': './src',
        },
      },
    ],
  ],
};
