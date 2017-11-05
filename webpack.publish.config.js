var HtmlWebpackPlugin = require('html-webpack-plugin')

var path = require('path')

var webpack = require('webpack')

var CleanWebpackPlugin = require('clean-webpack-plugin')

const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        /**
         * 属性名称代表最终生成的文件名称
         * 值:第三方包的名称
         */
        mintUi:['mint-ui'],
        vueResource:['vue-resource'],
        moment:['moment'],
        vuePreview:['vue-preview'],
        quanjiatong:['vue','vue-router','vuex'],
        bundle:'./src/main.js', //项目打包的入口文件
    },
    output: { //项目打包之后的输出文件
        path: path.join(__dirname,'dist'),
        filename: 'js/[name].js'
    },
    module: {//配置loaders
        rules: [ //loaders也是可以的
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: "vue-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|svg|gif)$/,
                use: [
                  {
                      /*
                        limit：
                            表示的是一个阀值,如果当前我们资源中的图片大小
                            4kb就从bundle.js中剥离出来，如果小于4kb打包进bundle.js,4kb只是我这设置的一个值,实际开发过程中要根据业务来

                        name:抽离出来的图片，放在哪个文件夹下，用什么文件名称命名
                            [name]代表你原始的文件名称
                            [hash:5] 避免图片换了之后，浏览器还加在原先的图片,解决缓存的问题
                            [ext] 图片本身的拓展名
                    */
                    loader: 'url-loader?limit=4000&name=images/[name]-[hash:5].[ext]'
                  }
                ]
            },
            {
                test: /\.(ttf)$/,
                use: [
                  {
                      /*
                        limit：
                            表示的是一个阀值,如果当前我们资源中的图片大小
                            4kb就从bundle.js中剥离出来，如果小于4kb打包进bundle.js,4kb只是我这设置的一个值,实际开发过程中要根据业务来

                        name:抽离出来的图片，放在哪个文件夹下，用什么文件名称命名
                            [name]代表你原始的文件名称
                            [hash:5] 避免图片换了之后，浏览器还加在原先的图片,解决缓存的问题
                            [ext] 图片本身的拓展名
                    */
                    loader: 'url-loader?limit=4000&name=fonts/[name]-[hash:5].[ext]'
                  }
                ]
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, //排除第三方的
                loader: "babel-loader" 
            },
            {
                test: /vue-preview.src.*?js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist'),

        //根据参照template.html在浏览器内存中生成一个index.html
        new HtmlWebpackPlugin({
            template: './template.html', //参照文件
            filename: 'index.html',//在内存中生成的文件名称
            minify:{
                collapseWhitespace:true, //去除空格
                minifyCSS:true,//压缩css
                minifyJS:true,//压缩js
                removeComments:true//去掉注释
            }
        }),
        //把当前环境设置为生产环境
        new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"production"'
            }
        }),
        //压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false //干掉警告
            },
            comments: false //去掉版权信息等注释
        }),
        //这个地方有个小注意点，不要把自己业务逻辑bundle放在这里，
        //这里只放第三方
        /**
         * name:我们刚刚在entry打包入口对象里面的属性名称
         * minChunks:公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
         */
        new webpack.optimize.CommonsChunkPlugin({name:["vuePreview","moment","vueResource","quanjiatong","mintUi"],minChunks: Infinity}),

        //把抽离出来的css放到一个单独的文件中去
        new ExtractTextPlugin("css/styles.css")
    ]
}