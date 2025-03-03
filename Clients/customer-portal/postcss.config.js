export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['./src/assets/styles/breakpoints.pcss']
    },
    'postcss-nested': {},
    'postcss-custom-media': {},
    autoprefixer: {}
  }
};
