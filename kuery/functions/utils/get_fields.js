"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = void 0;
var literal = require("../../node_types/literal");
var wildcard = require("../../node_types/wildcard");
function getFields(node, indexPattern) {
    if (!indexPattern)
        return [];
    if (literal.isNode(node)) {
        var fieldName_1 = literal.toElasticsearchQuery(node);
        var field = indexPattern.fields.find(function (fld) { return fld.name === fieldName_1; });
        if (!field) {
            return [];
        }
        return [field];
    }
    else if (wildcard.isNode(node)) {
        var fields = indexPattern.fields.filter(function (fld) { return wildcard.test(node, fld.name); });
        return fields;
    }
}
exports.getFields = getFields;
