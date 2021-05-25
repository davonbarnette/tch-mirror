/*
 * We need these declaration files to avoid the Typescript errors that arise from using a node_module that has no
 * static typings (e.g. npm install --save @types/x).
 */

declare module 'chart.js';
declare module 'react-chartkick';
declare module 'react-node-graph';
