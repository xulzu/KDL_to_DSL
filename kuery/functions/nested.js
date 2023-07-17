"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNodeParams = exports.isNode = exports.KQL_FUNCTION_NESTED = void 0;
var ast = require("../ast");
var literal = require("../node_types/literal");
exports.KQL_FUNCTION_NESTED = 'nested';
function isNode(node) {
    return node.function === exports.KQL_FUNCTION_NESTED;
}
exports.isNode = isNode;
function buildNodeParams(path, child) {
    var pathNode = typeof path === 'string' ? ast.fromLiteralExpression(path) : literal.buildNode(path);
    return {
        arguments: [pathNode, child],
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
    var _a;
    if (config === void 0) { config = {}; }
    if (context === void 0) { context = {}; }
    var _b = node.arguments, path = _b[0], child = _b[1];
    var stringPath = ast.toElasticsearchQuery(path);
    var fullPath = ((_a = context === null || context === void 0 ? void 0 : context.nested) === null || _a === void 0 ? void 0 : _a.path) ? "".concat(context.nested.path, ".").concat(stringPath) : stringPath;
    return {
        nested: __assign({ path: fullPath, query: ast.toElasticsearchQuery(child, indexPattern, config, __assign(__assign({}, context), { nested: { path: fullPath } })), score_mode: 'none' }, (typeof config.nestedIgnoreUnmapped === 'boolean' && {
            ignore_unmapped: config.nestedIgnoreUnmapped,
        })),
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    var _a = node.arguments, path = _a[0], child = _a[1];
    return "".concat(literal.toKqlExpression(path), ": { ").concat(ast.toKqlExpression(child), " }");
}
exports.toKqlExpression = toKqlExpression;
