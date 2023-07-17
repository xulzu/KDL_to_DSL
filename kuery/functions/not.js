"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNodeParams = exports.isNode = exports.KQL_FUNCTION_NOT = void 0;
var ast = require("../ast");
exports.KQL_FUNCTION_NOT = 'not';
function isNode(node) {
    return node.function === exports.KQL_FUNCTION_NOT;
}
exports.isNode = isNode;
function buildNodeParams(child) {
    return {
        arguments: [child],
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
    if (config === void 0) { config = {}; }
    if (context === void 0) { context = {}; }
    var argument = node.arguments[0];
    return {
        bool: {
            must_not: ast.toElasticsearchQuery(argument, indexPattern, config, context),
        },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    var child = node.arguments[0];
    return "NOT ".concat(ast.toKqlExpression(child));
}
exports.toKqlExpression = toKqlExpression;
