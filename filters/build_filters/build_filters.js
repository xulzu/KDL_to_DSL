"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFilter = void 0;
var phrase_filter_1 = require("./phrase_filter");
var phrases_filter_1 = require("./phrases_filter");
var range_filter_1 = require("./range_filter");
var exists_filter_1 = require("./exists_filter");
/**
 *
 * @param indexPattern
 * @param field
 * @param type
 * @param negate whether the filter is negated (NOT filter)
 * @param disabled  whether the filter is disabled andwon't be applied to searches
 * @param params
 * @param alias a display name for the filter
 * @param store whether the filter applies to the current application or should be applied to global context
 * @returns
 *
 * @public
 */
function buildFilter(
  indexPattern,
  field,
  type,
  negate,
  disabled,
  params,
  alias,
  store
) {
  var filter = buildBaseFilter(indexPattern, field, type, params);
  filter.meta.alias = alias;
  filter.meta.negate = negate;
  filter.meta.disabled = disabled;
  if (store) {
    filter.$state = { store: store };
  }
  return filter;
}
exports.buildFilter = buildFilter;
function buildBaseFilter(indexPattern, field, type, params) {
  switch (type) {
    case "phrase":
      return (0, phrase_filter_1.buildPhraseFilter)(
        field,
        params,
        indexPattern
      );
    case "phrases":
      return (0, phrases_filter_1.buildPhrasesFilter)(
        field,
        params,
        indexPattern
      );
    case "range":
      var _a = params,
        gte = _a.from,
        lt = _a.to;
      return (0, range_filter_1.buildRangeFilter)(
        field,
        { lt: lt, gte: gte },
        indexPattern
      );
    case "range_from_value":
      return (0, range_filter_1.buildRangeFilter)(field, params, indexPattern);
    case "exists":
      return (0, exists_filter_1.buildExistsFilter)(field, indexPattern);
    default:
      throw new Error("Unknown filter type: ".concat(type));
  }
}
