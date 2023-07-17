"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNodeParams = exports.isNode = exports.KQL_FUNCTION_AND = void 0;
var ast = require("../ast");
exports.KQL_FUNCTION_AND = 'and';
function isNode(node) {
    return node.function === exports.KQL_FUNCTION_AND;
}
exports.isNode = isNode;
function buildNodeParams(children) {
    return {
        arguments: children,
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
    var _a;
    if (config === void 0) { config = {}; }
    if (context === void 0) { context = {}; }
    var filtersInMustClause = config.filtersInMustClause;
    var children = node.arguments || [];
    var key = filtersInMustClause ? 'must' : 'filter';
    return {
        bool: (_a = {},
            _a[key] = children.map(function (child) {
                return ast.toElasticsearchQuery(child, indexPattern, config, context);
            }),
            _a),
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    return "(".concat(node.arguments.map(ast.toKqlExpression).join(' AND '), ")");
}
exports.toKqlExpression = toKqlExpression;
