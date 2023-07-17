"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNodeParams = exports.isNode = exports.KQL_FUNCTION_OR = void 0;
var ast = require("../ast");
exports.KQL_FUNCTION_OR = 'or';
function isNode(node) {
    return node.function === exports.KQL_FUNCTION_OR;
}
exports.isNode = isNode;
function buildNodeParams(children) {
    return {
        arguments: children,
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
    if (config === void 0) { config = {}; }
    if (context === void 0) { context = {}; }
    var children = node.arguments || [];
    return {
        bool: {
            should: children.map(function (child) {
                return ast.toElasticsearchQuery(child, indexPattern, config, context);
            }),
            minimum_should_match: 1,
        },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    return "(".concat(node.arguments.map(ast.toKqlExpression).join(' OR '), ")");
}
exports.toKqlExpression = toKqlExpression;
