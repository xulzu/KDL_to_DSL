"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterField = void 0;
var exists_filter_1 = require("./exists_filter");
var phrases_filter_1 = require("./phrases_filter");
var phrase_filter_1 = require("./phrase_filter");
var range_filter_1 = require("./range_filter");
/** @internal */
var getFilterField = function (filter) {
  if ((0, exists_filter_1.isExistsFilter)(filter)) {
    return (0, exists_filter_1.getExistsFilterField)(filter);
  }
  if (
    (0, phrase_filter_1.isPhraseFilter)(filter) ||
    (0, phrase_filter_1.isScriptedPhraseFilter)(filter)
  ) {
    return (0, phrase_filter_1.getPhraseFilterField)(filter);
  }
  if ((0, phrases_filter_1.isPhrasesFilter)(filter)) {
    return (0, phrases_filter_1.getPhrasesFilterField)(filter);
  }
  if (
    (0, range_filter_1.isRangeFilter)(filter) ||
    (0, range_filter_1.isScriptedRangeFilter)(filter)
  ) {
    return (0, range_filter_1.getRangeFilterField)(filter);
  }
  return;
};
exports.getFilterField = getFilterField;
