"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNode = exports.isNode = exports.KQL_NODE_TYPE_LITERAL = void 0;
exports.KQL_NODE_TYPE_LITERAL = 'literal';
function isNode(node) {
    return node.type === exports.KQL_NODE_TYPE_LITERAL;
}
exports.isNode = isNode;
function buildNode(value, isQuoted) {
    if (isQuoted === void 0) { isQuoted = false; }
    return {
        type: exports.KQL_NODE_TYPE_LITERAL,
        value: value,
        isQuoted: isQuoted,
    };
}
exports.buildNode = buildNode;
function toElasticsearchQuery(node) {
    return node.value;
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    return node.isQuoted ? "\"".concat(node.value, "\"") : "".concat(node.value);
}
exports.toKqlExpression = toKqlExpression;
