"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPhrasesFilter =
  exports.getPhrasesFilterField =
  exports.isPhrasesFilter =
    void 0;
var types_1 = require("./types");
var phrase_filter_1 = require("./phrase_filter");
/**
 * @param filter
 * @returns `true` if a filter is a `PhrasesFilter`
 *
 * @public
 */
var isPhrasesFilter = function (filter) {
  var _a;
  return (
    ((_a = filter === null || filter === void 0 ? void 0 : filter.meta) ===
      null || _a === void 0
      ? void 0
      : _a.type) === types_1.FILTERS.PHRASES
  );
};
exports.isPhrasesFilter = isPhrasesFilter;
/** @internal */
var getPhrasesFilterField = function (filter) {
  // Phrases is a newer filter type that has always been created via a constructor that ensures
  // `meta.key` is set to the field name
  return filter.meta.key;
};
exports.getPhrasesFilterField = getPhrasesFilterField;
/**
 * Creates a filter where the given field matches one or more of the given values
 * params should be an array of values
 * @param field
 * @param params
 * @param indexPattern
 * @returns
 *
 * @public
 */
var buildPhrasesFilter = function (field, params, indexPattern) {
  var index = indexPattern.id;
  var type = types_1.FILTERS.PHRASES;
  var key = field.name;
  var should;
  if (field.scripted) {
    should = params.map(function (v) {
      return {
        script: (0, phrase_filter_1.getPhraseScript)(field, v),
      };
    });
  } else {
    should = params.map(function (v) {
      var _a;
      return {
        match_phrase: ((_a = {}), (_a[field.name] = v), _a),
      };
    });
  }
  return {
    meta: { index: index, type: type, key: key, params: params },
    query: {
      bool: {
        should: should,
        minimum_should_match: 1,
      },
    },
  };
};
exports.buildPhrasesFilter = buildPhrasesFilter;
