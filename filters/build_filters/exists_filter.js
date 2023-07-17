"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExistsFilter =
  exports.getExistsFilterField =
  exports.isExistsFilter =
    void 0;
var lodash_1 = require("lodash");
/**
 * @param filter
 * @returns `true` if a filter is an `ExistsFilter`
 *
 * @public
 */
var isExistsFilter = function (filter) {
  return (0, lodash_1.has)(filter, "query.exists");
};
exports.isExistsFilter = isExistsFilter;
/**
 * @internal
 */
var getExistsFilterField = function (filter) {
  return filter.query.exists && filter.query.exists.field;
};
exports.getExistsFilterField = getExistsFilterField;
/**
 * Builds an `ExistsFilter`
 * @param field field to validate the existence of
 * @param indexPattern index pattern to look for the field in
 * @returns An `ExistsFilter`
 *
 * @public
 */
var buildExistsFilter = function (field, indexPattern) {
  return {
    meta: {
      index: indexPattern.id,
    },
    query: {
      exists: {
        field: field.name,
      },
    },
  };
};
exports.buildExistsFilter = buildExistsFilter;
