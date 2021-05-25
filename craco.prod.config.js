/*
 * This file allows you to modify the webpack configuration of the create-react-app scripts. You'll notice that in the
 * package.json, we're actually using 'craco start' as a way to start the scripts, rather than 'react-scripts'. This is
 * so that if we decide to move back to react-scripts because craco breaks, we can. The main point is to be able to
 * abstract Webpack configurations as much as possible but some configurations are unavoidable.
 *
 */

const path = require('path');

const exportPath = path.resolve('../', "build");

module.exports = function({ env, paths }) {
    return {
        webpack: {
            configure: {
                optimization: {
                    splitChunks: {
                        name: 'vendors'
                    },
                },
                // output: {
                //     path:exportPath,
                // }
            },
        },
    };
};