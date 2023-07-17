"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression =
  exports.toElasticsearchQuery =
  exports.buildNodeWithArgumentNodes =
  exports.buildNode =
  exports.isNode =
  exports.KQL_NODE_TYPE_FUNCTION =
    void 0;
var functions_1 = require("../functions");
exports.KQL_NODE_TYPE_FUNCTION = "function";
function isUndefined(obj) {
  return obj === undefined;
}
function isNode(node) {
  return node.type === exports.KQL_NODE_TYPE_FUNCTION;
}
exports.isNode = isNode;
function buildNode(functionName) {
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  var kueryFunction = functions_1.functions[functionName];
  if (isUndefined(kueryFunction)) {
    throw new Error('Unknown function "'.concat(functionName, '"'));
  }
  return __assign(
    { type: exports.KQL_NODE_TYPE_FUNCTION, function: functionName },
    kueryFunction.buildNodeParams.apply(kueryFunction, args)
  );
}
exports.buildNode = buildNode;
// Mainly only useful in the grammar where we'll already have real argument nodes in hand
function buildNodeWithArgumentNodes(functionName, args) {
  if (functions_1.functions[functionName] === undefined) {
    throw new Error('Unknown function "'.concat(functionName, '"'));
  }
  return {
    type: exports.KQL_NODE_TYPE_FUNCTION,
    function: functionName,
    arguments: args,
  };
}
exports.buildNodeWithArgumentNodes = buildNodeWithArgumentNodes;
function toElasticsearchQuery(node, indexPattern, config, context) {
  if (functions_1.functions.and.isNode(node))
    return functions_1.functions.and.toElasticsearchQuery(
      node,
      indexPattern,
      config,
      context
    );
  if (functions_1.functions.exists.isNode(node))
    return (
      functions_1.functions.exists.toElasticsearchQuery(node),
      indexPattern,
      config,
      context
    );
  if (functions_1.functions.is.isNode(node))
    return functions_1.functions.is.toElasticsearchQuery(
      node,
      indexPattern,
      config,
      context
    );
  if (functions_1.functions.nested.isNode(node))
    return functions_1.functions.nested.toElasticsearchQuery(
      node,
      indexPattern,
      config,
      context
    );
  if (functions_1.functions.not.isNode(node))
    return functions_1.functions.not.toElasticsearchQuery(
      node,
      indexPattern,
      config,
      context
    );
  if (functions_1.functions.or.isNode(node))
    return functions_1.functions.or.toElasticsearchQuery(
      node,
      indexPattern,
      config,
      context
    );
  if (functions_1.functions.range.isNode(node))
    return functions_1.functions.range.toElasticsearchQuery(
      node,
      indexPattern,
      config,
      context
    );
  throw new Error('Unknown KQL function: "'.concat(node.function, '"'));
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
  if (functions_1.functions.and.isNode(node))
    return functions_1.functions.and.toKqlExpression(node);
  if (functions_1.functions.exists.isNode(node))
    return functions_1.functions.exists.toKqlExpression(node);
  if (functions_1.functions.is.isNode(node))
    return functions_1.functions.is.toKqlExpression(node);
  if (functions_1.functions.nested.isNode(node))
    return functions_1.functions.nested.toKqlExpression(node);
  if (functions_1.functions.not.isNode(node))
    return functions_1.functions.not.toKqlExpression(node);
  if (functions_1.functions.or.isNode(node))
    return functions_1.functions.or.toKqlExpression(node);
  if (functions_1.functions.range.isNode(node))
    return functions_1.functions.range.toKqlExpression(node);
  throw new Error('Unknown KQL function: "'.concat(node.function, '"'));
}
exports.toKqlExpression = toKqlExpression;
