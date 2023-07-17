"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression = exports.hasLeadingWildcard = exports.isLoneWildcard = exports.toQueryStringQuery = exports.toElasticsearchQuery = exports.test = exports.buildNode = exports.isMatchAll = exports.isNode = exports.KQL_NODE_TYPE_WILDCARD = exports.KQL_WILDCARD_SYMBOL = void 0;
exports.KQL_WILDCARD_SYMBOL = '@kuery-wildcard@';
exports.KQL_NODE_TYPE_WILDCARD = 'wildcard';
// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
// See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters
function escapeQueryString(str) {
    return str.replace(/[+\-=&|><!(){}[\]^"~*?:\\/]/g, '\\$&'); // $& means the whole matched string
}
function isNode(node) {
    return node.type === exports.KQL_NODE_TYPE_WILDCARD;
}
exports.isNode = isNode;
function isMatchAll(node) {
    return node.value === exports.KQL_WILDCARD_SYMBOL;
}
exports.isMatchAll = isMatchAll;
function buildNode(value) {
    // When called from the parser, all wildcard characters are replaced with a special flag (since escaped wildcards are
    // handled as normal strings). However, when invoking programmatically, callers shouldn't need to do this replacement.
    if (!value.includes(exports.KQL_NODE_TYPE_WILDCARD) && value.includes('*')) {
        return buildNode(value.replaceAll('*', exports.KQL_WILDCARD_SYMBOL));
    }
    return {
        type: exports.KQL_NODE_TYPE_WILDCARD,
        value: value,
    };
}
exports.buildNode = buildNode;
function test(node, str) {
    var value = node.value;
    var regex = value.split(exports.KQL_WILDCARD_SYMBOL).map(escapeRegExp).join('[\\s\\S]*');
    var regexp = new RegExp("^".concat(regex, "$"));
    return regexp.test(str);
}
exports.test = test;
function toElasticsearchQuery(node) {
    var value = node.value;
    return value.split(exports.KQL_WILDCARD_SYMBOL).join('*');
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toQueryStringQuery(node) {
    var value = node.value;
    return value.split(exports.KQL_WILDCARD_SYMBOL).map(escapeQueryString).join('*');
}
exports.toQueryStringQuery = toQueryStringQuery;
function isLoneWildcard(_a) {
    var value = _a.value;
    return value.includes(exports.KQL_WILDCARD_SYMBOL) && value.replace(exports.KQL_WILDCARD_SYMBOL, '').length === 0;
}
exports.isLoneWildcard = isLoneWildcard;
function hasLeadingWildcard(node) {
    return !isLoneWildcard(node) && node.value.startsWith(exports.KQL_WILDCARD_SYMBOL);
}
exports.hasLeadingWildcard = hasLeadingWildcard;
function toKqlExpression(node) {
    return toQueryStringQuery(node);
}
exports.toKqlExpression = toKqlExpression;
