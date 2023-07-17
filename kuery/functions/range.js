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
exports.toKqlExpression = exports.toElasticsearchQuery = exports.buildNodeParams = exports.isNode = exports.KQL_RANGE_OPERATOR_MAP = exports.KQL_FUNCTION_RANGE = void 0;
var literal_1 = require("../node_types/literal");
var node_types_1 = require("../node_types");
var ast = require("../ast");
var filters_1 = require("../../filters");
var get_fields_1 = require("./utils/get_fields");
var utils_1 = require("../../utils");
var get_full_field_name_node_1 = require("./utils/get_full_field_name_node");
exports.KQL_FUNCTION_RANGE = 'range';
exports.KQL_RANGE_OPERATOR_MAP = {
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
};
function isNode(node) {
    return node.function === exports.KQL_FUNCTION_RANGE;
}
exports.isNode = isNode;
function buildNodeParams(fieldName, operator, value) {
    // Run through the parser instead treating it as a literal because it may contain wildcards
    var fieldNameArg = ast.fromLiteralExpression(fieldName);
    var valueArg = (0, literal_1.buildNode)(value);
    return { arguments: [fieldNameArg, operator, valueArg] };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
    if (config === void 0) { config = {}; }
    if (context === void 0) { context = {}; }
    var _a = node.arguments, fieldNameArg = _a[0], operatorArg = _a[1], valueArg = _a[2];
    var fullFieldNameArg = (0, get_full_field_name_node_1.getFullFieldNameNode)(fieldNameArg, indexPattern, (context === null || context === void 0 ? void 0 : context.nested) ? context.nested.path : undefined);
    var fields = indexPattern ? (0, get_fields_1.getFields)(fullFieldNameArg, indexPattern) : [];
    // If no fields are found in the index pattern we send through the given field name as-is. We do this to preserve
    // the behaviour of lucene on dashboards where there are panels based on different index patterns that have different
    // fields. If a user queries on a field that exists in one pattern but not the other, the index pattern without the
    // field should return no results. It's debatable whether this is desirable, but it's been that way forever, so we'll
    // keep things familiar for now.
    if (fields && fields.length === 0) {
        fields.push({
            name: ast.toElasticsearchQuery(fullFieldNameArg),
            scripted: false,
            type: '',
        });
    }
    var queries = fields.map(function (field) {
        var _a, _b, _c;
        var wrapWithNestedQuery = function (query) {
            // Wildcards can easily include nested and non-nested fields. There isn't a good way to let
            // users handle this themselves so we automatically add nested queries in this scenario.
            var subTypeNested = (0, utils_1.getDataViewFieldSubtypeNested)(field);
            if (!node_types_1.nodeTypes.wildcard.isNode(fullFieldNameArg) ||
                !(subTypeNested === null || subTypeNested === void 0 ? void 0 : subTypeNested.nested) ||
                context.nested) {
                return query;
            }
            else {
                return {
                    nested: __assign({ path: subTypeNested.nested.path, query: query, score_mode: 'none' }, (typeof config.nestedIgnoreUnmapped === 'boolean' && {
                        ignore_unmapped: config.nestedIgnoreUnmapped,
                    })),
                };
            }
        };
        var queryParams = (_a = {},
            _a[operatorArg] = ast.toElasticsearchQuery(valueArg),
            _a);
        if (field.scripted) {
            return {
                script: (0, filters_1.getRangeScript)(field, queryParams),
            };
        }
        else if (field.type === 'date') {
            var timeZoneParam = config.dateFormatTZ
                ? { time_zone: (0, utils_1.getTimeZoneFromSettings)(config.dateFormatTZ) }
                : {};
            return wrapWithNestedQuery({
                range: (_b = {},
                    _b[field.name] = __assign(__assign({}, queryParams), timeZoneParam),
                    _b),
            });
        }
        return wrapWithNestedQuery({
            range: (_c = {},
                _c[field.name] = queryParams,
                _c),
        });
    });
    return {
        bool: {
            should: queries,
            minimum_should_match: 1,
        },
    };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
    var _a = node.arguments, field = _a[0], operator = _a[1], value = _a[2];
    return "".concat(ast.toKqlExpression(field), " ").concat(exports.KQL_RANGE_OPERATOR_MAP[operator], " ").concat(ast.toKqlExpression(value));
}
exports.toKqlExpression = toKqlExpression;
