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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullFieldNameNode = void 0;
var get_fields_1 = require("./get_fields");
var utils_1 = require("../../../utils");
var wildcard_1 = require("../../node_types/wildcard");
function getFullFieldNameNode(rootNameNode, indexPattern, nestedPath) {
    var fullFieldNameNode = __assign(__assign({}, rootNameNode), { value: nestedPath ? "".concat(nestedPath, ".").concat(rootNameNode.value) : rootNameNode.value });
    // Wildcards can easily include nested and non-nested fields. There isn't a good way to let
    // users handle this themselves so we automatically add nested queries in this scenario and skip the
    // error checking below.
    if (!indexPattern || ((0, wildcard_1.isNode)(fullFieldNameNode) && !nestedPath)) {
        return fullFieldNameNode;
    }
    var fields = (0, get_fields_1.getFields)(fullFieldNameNode, indexPattern);
    var errors = fields.reduce(function (acc, field) {
        var subTypeNested = (0, utils_1.getDataViewFieldSubtypeNested)(field);
        var nestedPathFromField = subTypeNested === null || subTypeNested === void 0 ? void 0 : subTypeNested.nested.path;
        if (nestedPath && !nestedPathFromField) {
            return __spreadArray(__spreadArray([], acc, true), [
                "".concat(field.name, " is not a nested field but is in nested group \"").concat(nestedPath, "\" in the KQL expression."),
            ], false);
        }
        if (nestedPathFromField && !nestedPath) {
            return __spreadArray(__spreadArray([], acc, true), [
                "".concat(field.name, " is a nested field, but is not in a nested group in the KQL expression."),
            ], false);
        }
        if (nestedPathFromField !== nestedPath) {
            return __spreadArray(__spreadArray([], acc, true), [
                "Nested field ".concat(field.name, " is being queried with the incorrect nested path. The correct path is ").concat(subTypeNested === null || subTypeNested === void 0 ? void 0 : subTypeNested.nested.path, "."),
            ], false);
        }
        return acc;
    }, []);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return fullFieldNameNode;
}
exports.getFullFieldNameNode = getFullFieldNameNode;
