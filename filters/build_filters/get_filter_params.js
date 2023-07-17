"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterParams = void 0;
var phrases_filter_1 = require("./phrases_filter");
var phrase_filter_1 = require("./phrase_filter");
var range_filter_1 = require("./range_filter");
/**
 * @internal used only by the filter bar to create filter pills.
 */
function getFilterParams(filter) {
  var _a;
  if ((0, phrase_filter_1.isPhraseFilter)(filter)) {
    return (_a = filter.meta.params) === null || _a === void 0
      ? void 0
      : _a.query;
  } else if ((0, phrases_filter_1.isPhrasesFilter)(filter)) {
    return filter.meta.params;
  } else if ((0, range_filter_1.isRangeFilter)(filter) && filter.meta.params) {
    var _b = filter.meta.params,
      gte = _b.gte,
      gt = _b.gt,
      lte = _b.lte,
      lt = _b.lt;
    return {
      from: gte !== null && gte !== void 0 ? gte : gt,
      to: lt !== null && lt !== void 0 ? lt : lte,
    };
  } else {
    return filter.meta.params;
  }
}
exports.getFilterParams = getFilterParams;
