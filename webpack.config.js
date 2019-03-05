'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('deepmerge');
const path = require('path');
const fs = require('fs');

const sourceFolders = [
    path.join(__dirname, 'tasks')
];

//envirnoment env.mode = 'prod'|'dev'

module.exports = function (env) {
    let config = {
        entry: {
            //added for all tasks in tasks folder
            //'taskname': 'taskname/taskname.js',
        },
        output: {
            path: path.join(__dirname, '/dist'),
            filename: '[name].js',
            library: '[name]'
        },
        resolve: {
            modules: sourceFolders
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader', //Why loader instead of use?
                    include: sourceFolders,
                    options: {
                        presets: [
                            ['env', {"modules": false}], //this is 'env' preset with options
                        ],
                        plugins: [
                            "transform-object-rest-spread",
                            "transform-class-properties",
                            "transform-export-default"
                        ]
                    }
                },
                {
                    test: /\.scss$/,
                    include: sourceFolders,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "css-loader",
                            options: {
                                url: false
                            }
                        }, "sass-loader"]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin("[name].css"),
            // added for all tasks in tasks folder:
            // new CopyWebpackPlugin([
            //     {from: './tasks/taskname/img/*', to: './taskname-resources', flatten: true},
            // ])
        ]
    };

    let debugConfig = {
        devtool: 'source-map',
        output: {
            pathinfo: true
        }
    };

    let productionConfig = {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                comments: false
            })
        ]
    };

    let arrayMerge = function (destArray, sourceArray, options) {
        return destArray.concat(sourceArray);
    };

    find_all_tasks_and_add_to_config(config);

    if (env && env.mode === 'prod') {
        return merge(config, productionConfig, {arrayMerge: arrayMerge});
    } else
        return merge(config, debugConfig, {arrayMerge: arrayMerge});
};

function find_all_tasks_and_add_to_config(config) {
    config.entry = {};

    let task_html_template = fs.readFileSync('./tasks/task.html', {encoding: "utf8"});

    if (!fs.existsSync('./dist'))
        fs.mkdirSync('./dist');

    fs.readdirSync('./tasks').forEach(file => {
        add_task_to_config(file, config, task_html_template);
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

function add_task_to_config(task_name, config, task_html_template) {
    if (task_name.indexOf('.') >= 0) // skip non directories
        return;

    //add entries
    config.entry[task_name] = task_name + '/' + task_name + '.js';

    //copy html
    let output_html = process_html_template(task_html_template, task_name);
    fs.writeFileSync('./dist/' + task_name + '.html', output_html, {encoding: "utf8"});

    //copy assets
    config.plugins.push(
        new CopyWebpackPlugin([
            {from: './tasks/' + task_name + '/res/*', to: './' + task_name + '-resources', flatten: true},
        ])
    );
}
