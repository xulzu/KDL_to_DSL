"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeTypes = exports.KQL_NODE_TYPE_WILDCARD = exports.KQL_NODE_TYPE_LITERAL = exports.KQL_NODE_TYPE_FUNCTION = exports.nodeBuilder = void 0;
var functionType = require("./function");
var literal = require("./literal");
var wildcard = require("./wildcard");
var node_builder_1 = require("./node_builder");
Object.defineProperty(exports, "nodeBuilder", { enumerable: true, get: function () { return node_builder_1.nodeBuilder; } });
var function_1 = require("./function");
Object.defineProperty(exports, "KQL_NODE_TYPE_FUNCTION", { enumerable: true, get: function () { return function_1.KQL_NODE_TYPE_FUNCTION; } });
var literal_1 = require("./literal");
Object.defineProperty(exports, "KQL_NODE_TYPE_LITERAL", { enumerable: true, get: function () { return literal_1.KQL_NODE_TYPE_LITERAL; } });
var wildcard_1 = require("./wildcard");
Object.defineProperty(exports, "KQL_NODE_TYPE_WILDCARD", { enumerable: true, get: function () { return wildcard_1.KQL_NODE_TYPE_WILDCARD; } });
/**
 * @public
 */
exports.nodeTypes = {
    // This requires better typing of the different typings and their return types.
    // @ts-ignore
    function: functionType,
    literal: literal,
    wildcard: wildcard,
};
