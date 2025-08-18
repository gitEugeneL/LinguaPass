export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['../../packages/shared/src/styles/breakpoints.pcss']
    },
    'postcss-nested': {},
    'postcss-custom-media': {},
    autoprefixer: {}
  }
};
