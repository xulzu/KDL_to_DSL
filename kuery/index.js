"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeKuery =
  exports.toKqlExpression =
  exports.fromKueryExpression =
  exports.nodeBuilder =
  exports.nodeTypes =
  exports.KQLSyntaxError =
  exports.toElasticsearchQuery =
    void 0;
var ast_1 = require("./ast");
/**
 * @params {String} indexPattern
 * @params {Object} config - contains the dateFormatTZ
 *
 * IndexPattern isn't required, but if you pass one in, we can be more intelligent
 * about how we craft the queries (e.g. scripted fields)
 */
var toElasticsearchQuery = function () {
  var params = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    params[_i] = arguments[_i];
  }
  return ast_1.toElasticsearchQuery.apply(void 0, params);
};
exports.toElasticsearchQuery = toElasticsearchQuery;
var node_types_1 = require("./node_types");
Object.defineProperty(exports, "nodeTypes", {
  enumerable: true,
  get: function () {
    return node_types_1.nodeTypes;
  },
});
Object.defineProperty(exports, "nodeBuilder", {
  enumerable: true,
  get: function () {
    return node_types_1.nodeBuilder;
  },
});
var ast_2 = require("./ast");
Object.defineProperty(exports, "fromKueryExpression", {
  enumerable: true,
  get: function () {
    return ast_2.fromKueryExpression;
  },
});
Object.defineProperty(exports, "toKqlExpression", {
  enumerable: true,
  get: function () {
    return ast_2.toKqlExpression;
  },
});
var utils_1 = require("./utils");
Object.defineProperty(exports, "escapeKuery", {
  enumerable: true,
  get: function () {
    return utils_1.escapeKuery;
  },
});
