export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['../../../Clients/packages/shared/src/styles/breakpoints.pcss']
    },
    'postcss-nested': {},
    'postcss-custom-media': {},
    autoprefixer: {}
  }
};
