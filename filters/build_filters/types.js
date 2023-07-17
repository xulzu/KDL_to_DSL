"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterStateStore = exports.FILTERS = void 0;
/**
 * An enum of all types of filters supported by this package
 * @public
 */
var FILTERS;
(function (FILTERS) {
  FILTERS["CUSTOM"] = "custom";
  FILTERS["PHRASES"] = "phrases";
  FILTERS["PHRASE"] = "phrase";
  FILTERS["EXISTS"] = "exists";
  FILTERS["MATCH_ALL"] = "match_all";
  FILTERS["QUERY_STRING"] = "query_string";
  FILTERS["RANGE"] = "range";
  FILTERS["RANGE_FROM_VALUE"] = "range_from_value";
  FILTERS["SPATIAL_FILTER"] = "spatial_filter";
  FILTERS["COMBINED"] = "combined";
})(FILTERS || (exports.FILTERS = FILTERS = {}));
/**
  Filter,
 * An enum to denote whether a filter is specific to an application's context or whether it should be applied globally.
 * @public
 */
var FilterStateStore;
(function (FilterStateStore) {
  FilterStateStore["APP_STATE"] = "appState";
  FilterStateStore["GLOBAL_STATE"] = "globalState";
})(FilterStateStore || (exports.FilterStateStore = FilterStateStore = {}));
