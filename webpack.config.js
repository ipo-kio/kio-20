'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');

const sourceFolders = [
    path.join(__dirname, 'tasks'),
    path.join(__dirname, 'node_modules')
];

//envirnoment env.mode = 'prod'|'dev'

module.exports = function (env) {
    let production = env && env.mode === 'prod';

    let dist_folder = production ? 'dist-prod' : 'dist';

    let config = {
        entry: {
            //added for all tasks in tasks folder
            //'taskname': 'taskname/taskname.js',
        },
        output: {
            path: path.join(__dirname, dist_folder),
            filename: '[name].js',
            library: '[name]',
            // https://github.com/webpack/webpack/issues/1194#issuecomment-565960948
            devtoolNamespace: 'devtool_namespace'
        },
        resolve: {
            modules: sourceFolders,
            extensions: ['.js', '.ts']
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    include: sourceFolders,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader, //TODO remove empty main (with javascript)
                        {
                            loader: 'css-loader',
                            options: {
                                "url": false
                            }
                        },
                        'sass-loader'
                    ],
                },
                {
                    test: /\.ts$/,
                    // use: ['babel-loader', 'ts-loader'],
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
            })
        ]
    };

    let debugConfig = {
        mode: 'development',
        devtool: 'source-map',
        output: {
            pathinfo: true
        }
    };

    let productionConfig = {
        mode: "production",
        optimization: {
            minimizer: [new UglifyJsPlugin()],
        },
        plugins: [
            new OptimizeCssAssetsPlugin()
        ]
    };

    find_all_tasks_and_add_to_config(config, dist_folder);

    if (env && env.mode === 'prod') {
        return merge(config, productionConfig);
    } else
        return merge(config, debugConfig);
};

function find_all_tasks_and_add_to_config(config, dist_folder) {
    config.entry = {};

    let task_html_template = fs.readFileSync('./tasks/task.html', {encoding: "utf8"});

    if (!fs.existsSync(dist_folder))
        fs.mkdirSync(dist_folder);

    fs.readdirSync('./tasks').forEach(file => {
        add_task_to_config(file, config, task_html_template, dist_folder);
    });
}

function process_html_template(task_html_template, task_name) {
    let capitalized_task_name = task_name.charAt(0).toUpperCase() + task_name.slice(1);

    function replace_all(where, what, to) {
        let replacement = new RegExp('\\[' + what + '\\]', 'g');
        return where.replace(replacement, to);
    }

    task_html_template = replace_all(task_html_template, 'TASKNAME', task_name);
    task_html_template = replace_all(task_html_template, 'TASKNAME\\|CAPITALIZE', capitalized_task_name);

    return task_html_template;
}

function add_task_to_config(task_name, config, task_html_template, dist_folder) {
    if (task_name.indexOf('.') >= 0) // skip non directories
        return;

    //add entries
    let task_file_js = path.join(task_name, task_name + '.js');
    let task_file_ts = path.join(task_name, task_name + '.ts');
    config.entry[task_name] = fs.existsSync('tasks/' + task_file_ts) ? task_file_ts : task_file_js;

    //copy html
    let output_html = process_html_template(task_html_template, task_name);
    fs.writeFileSync(path.join(dist_folder, task_name + '.html'), output_html, {encoding: "utf8"});

    //copy assets
    config.plugins.push(
        new CopyWebpackPlugin([
            {from: './tasks/' + task_name + '/res/*', to: './' + task_name + '-resources', flatten: true},
        ])
    );
}