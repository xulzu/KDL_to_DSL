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
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNodeParams = exports.isNode = exports.KQL_FUNCTION_EXISTS = void 0;
var literal_1 = require("../node_types/literal");
exports.KQL_FUNCTION_EXISTS = 'exists';
function isNode(node) {
    return node.function === exports.KQL_FUNCTION_EXISTS;
}
exports.isNode = isNode;
function buildNodeParams(fieldName) {
    return {
        arguments: [(0, literal_1.buildNode)(fieldName)],
    };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
    var _a;
    if (config === void 0) { config = {}; }
    if (context === void 0) { context = {}; }
    var fieldNameArg = node.arguments[0];
    var fullFieldNameArg = __assign(__assign({}, fieldNameArg), { value: (context === null || context === void 0 ? void 0 : context.nested) ? "".concat(context.nested.path, ".").concat(fieldNameArg.value) : fieldNameArg.value });
    var fieldName = (0, literal_1.toElasticsearchQuery)(fullFieldNameArg);
    var field = (_a = indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.fields) === null || _a === void 0 ? void 0 : _a.find(function (fld) { return fld.name === fieldName; });
    if (field === null || field === void 0 ? void 0 : field.scripted) {
        throw new Error("Exists query does not support scripted fields");
    }
    return {
        exists: { field: fieldName },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    var field = node.arguments[0];
    return "".concat((0, literal_1.toKqlExpression)(field), ": *");
}
exports.toKqlExpression = toKqlExpression;
