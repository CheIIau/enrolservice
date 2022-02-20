module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
    compression: {
      brotli: {
        filename: '[file].br[query]',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      },
    },
  },
  productionSourceMap: true,

  pwa: {
    name: 'RonikManik',
    themeColor: '#ff9eef',
    msTileColor: '#ff9eef',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#ff9eef',
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'RonikManik';
      return args;
    });
    config.optimization.minimize(true);
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.output = {
        ...args[0].terserOptions.output,
        comments: false,
      };
      return args;
    });
  },
};
