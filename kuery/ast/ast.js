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
exports.toElasticsearchQuery =
  exports.toKqlExpression =
  exports.fromKueryExpression =
  exports.fromLiteralExpression =
    void 0;
var node_types_1 = require("../node_types");
var grammar_1 = require("./grammar.pegjs");
var fromExpression = function (expression, parseOptions, parse) {
  if (parseOptions === void 0) {
    parseOptions = {};
  }
  if (parse === void 0) {
    parse = grammar_1.parse;
  }
  if (typeof expression === "undefined") {
    throw new Error("expression must be a string, got undefined instead");
  }
  return parse(
    expression,
    __assign(__assign({}, parseOptions), {
      helpers: { nodeTypes: node_types_1.nodeTypes },
    })
  );
};
var fromLiteralExpression = function (expression, parseOptions) {
  if (parseOptions === void 0) {
    parseOptions = {};
  }
  return fromExpression(
    expression,
    __assign(__assign({}, parseOptions), { startRule: "Literal" }),
    grammar_1.parse
  );
};
exports.fromLiteralExpression = fromLiteralExpression;
var fromKueryExpression = function (expression, parseOptions) {
  if (parseOptions === void 0) {
    parseOptions = {};
  }
  try {
    return fromExpression(expression, parseOptions, grammar_1.parse);
  } catch (error) {
    if (error.name === "SyntaxError") {
      if (String(error).includes("Leading wildcards are disabled")) {
        throw new Error("禁用前置通用匹配");
      }
      throw new Error("解析错误");
    } else {
      throw error;
    }
  }
};
exports.fromKueryExpression = fromKueryExpression;
/**
 * Given a KQL AST node, generate the corresponding KQL expression.
 * @public
 * @param node
 */
function toKqlExpression(node) {
  if (node_types_1.nodeTypes.function.isNode(node))
    return node_types_1.nodeTypes.function.toKqlExpression(node);
  if (node_types_1.nodeTypes.literal.isNode(node))
    return node_types_1.nodeTypes.literal.toKqlExpression(node);
  if (node_types_1.nodeTypes.wildcard.isNode(node))
    return node_types_1.nodeTypes.wildcard.toKqlExpression(node);
  throw new Error('Unknown KQL node type: "'.concat(node.type, '"'));
}
exports.toKqlExpression = toKqlExpression;
/**
 * @params {String} indexPattern
 * @params {Object} config - contains the dateFormatTZ
 *
 * IndexPattern isn't required, but if you pass one in, we can be more intelligent
 * about how we craft the queries (e.g. scripted fields)
 *
 */
var toElasticsearchQuery = function (node, indexPattern, config, context) {
  if (config === void 0) {
    config = {};
  }
  if (!node || !node.type || !node_types_1.nodeTypes[node.type]) {
    return (0, exports.toElasticsearchQuery)(
      node_types_1.nodeTypes.function.buildNode("and", []),
      indexPattern
    );
  }
  // TODO: the return type of this function might be incorrect and it works only because of this casting
  var nodeType = node_types_1.nodeTypes[node.type];
  return nodeType.toElasticsearchQuery(node, indexPattern, config, context);
};
exports.toElasticsearchQuery = toElasticsearchQuery;
