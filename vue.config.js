
/** @type {import('@vue/cli-service/types/index').ProjectOptions} */
const config = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.worker\.(c|m)?js$/i,
          use: [
            {
              loader: 'worker-loader'
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          ]
        }
      ]
    }
  }
}

module.exports = config
