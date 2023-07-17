"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeBuilder = void 0;
var types_1 = require("../types");
exports.nodeBuilder = {
    is: function (fieldName, value) {
        return types_1.nodeTypes.function.buildNodeWithArgumentNodes('is', [
            types_1.nodeTypes.literal.buildNode(fieldName),
            typeof value === 'string' ? types_1.nodeTypes.literal.buildNode(value) : value,
        ]);
    },
    or: function (nodes) {
        return nodes.length === 1 ? nodes[0] : types_1.nodeTypes.function.buildNode('or', nodes);
    },
    and: function (nodes) {
        return nodes.length === 1 ? nodes[0] : types_1.nodeTypes.function.buildNode('and', nodes);
    },
    range: function (fieldName, operator, value) {
        return types_1.nodeTypes.function.buildNodeWithArgumentNodes('range', [
            types_1.nodeTypes.literal.buildNode(fieldName),
            operator,
            typeof value === 'string' ? types_1.nodeTypes.literal.buildNode(value) : value,
        ]);
    },
};
