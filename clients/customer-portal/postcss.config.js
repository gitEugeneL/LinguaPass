export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['../common/assets/styles/breakpoints.pcss']
    },
    'postcss-nested': {},
    'postcss-custom-media': {},
    autoprefixer: {}
  }
};
