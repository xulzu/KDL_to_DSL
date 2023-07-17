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
exports.buildQueryFilter = exports.isQueryStringFilter = void 0;
var lodash_1 = require("lodash");
/**
 * @param filter
 * @returns `true` if a filter is a `QueryStringFilter`
 *
 * @public
 */
var isQueryStringFilter = function (filter) {
  return (0, lodash_1.has)(filter, "query.query_string");
};
exports.isQueryStringFilter = isQueryStringFilter;
/**
 * Creates a filter corresponding to a raw Elasticsearch query DSL object
 * @param query
 * @param index
 * @param alias
 * @returns `QueryStringFilter`
 *
 * @public
 */
var buildQueryFilter = function (query, index, alias, meta) {
  if (meta === void 0) {
    meta = {};
  }
  return { query: query, meta: __assign({ index: index, alias: alias }, meta) };
};
exports.buildQueryFilter = buildQueryFilter;
