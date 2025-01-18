const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const path = require('path'); // Necesitamos esto para resolver la ruta

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'), // Aquí se define la carpeta de salida
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new Dotenv({
            safe: true,
            systemvars: true
        })
    ]
});
