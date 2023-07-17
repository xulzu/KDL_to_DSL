"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInlineScriptForPhraseFilter =
  exports.getPhraseScript =
  exports.buildPhraseFilter =
  exports.getPhraseFilterValue =
  exports.getPhraseFilterField =
  exports.isScriptedPhraseFilter =
  exports.isPhraseFilter =
    void 0;
var lodash_1 = require("lodash");
var get_converted_value_for_field_1 = require("./get_converted_value_for_field");
var range_filter_1 = require("./range_filter");
/**
 * @param filter
 * @returns `true` if a filter is a `PhraseFilter`
 *
 * @public
 */
var isPhraseFilter = function (filter) {
  var isMatchPhraseQuery = (0, lodash_1.has)(filter, "query.match_phrase");
  var matchQueryPart = (0, lodash_1.get)(filter, "query.match", []);
  var isDeprecatedMatchPhraseQuery =
    Object.values(matchQueryPart).find(function (params) {
      return params.type === "phrase";
    }) !== undefined;
  return isMatchPhraseQuery || isDeprecatedMatchPhraseQuery;
};
exports.isPhraseFilter = isPhraseFilter;
/**
 * @param filter
 * @returns `true` if a filter is a scripted `PhrasesFilter`
 *
 * @public
 */
var isScriptedPhraseFilter = function (filter) {
  var _a, _b, _c;
  return (
    (0, lodash_1.has)(filter, "query.script.script.params.value") &&
    !(0, range_filter_1.hasRangeKeys)(
      (_c =
        (_b =
          (_a = filter.query) === null || _a === void 0
            ? void 0
            : _a.script) === null || _b === void 0
          ? void 0
          : _b.script) === null || _c === void 0
        ? void 0
        : _c.params
    )
  );
};
exports.isScriptedPhraseFilter = isScriptedPhraseFilter;
/** @internal */
var getPhraseFilterField = function (filter) {
  var _a, _b, _c;
  if ((_a = filter.meta) === null || _a === void 0 ? void 0 : _a.field)
    return filter.meta.field;
  var queryConfig =
    (_c =
      (_b = filter.query.match_phrase) !== null && _b !== void 0
        ? _b
        : filter.query.match) !== null && _c !== void 0
      ? _c
      : {};
  return Object.keys(queryConfig)[0];
};
exports.getPhraseFilterField = getPhraseFilterField;
/**
 * @internal
 */
var getPhraseFilterValue = function (filter) {
  var _a, _b, _c, _d;
  if ((0, exports.isPhraseFilter)(filter)) {
    var queryConfig = filter.query.match_phrase || filter.query.match || {};
    var queryValue = Object.values(queryConfig)[0];
    return (0, lodash_1.isPlainObject)(queryValue)
      ? queryValue.query
      : queryValue;
  } else {
    return (_d =
      (_c =
        (_b =
          (_a = filter.query) === null || _a === void 0
            ? void 0
            : _a.script) === null || _b === void 0
          ? void 0
          : _b.script) === null || _c === void 0
        ? void 0
        : _c.params) === null || _d === void 0
      ? void 0
      : _d.value;
  }
};
exports.getPhraseFilterValue = getPhraseFilterValue;
/**
 * Creates a filter where the given field matches a given value
 * @param field
 * @param params
 * @param indexPattern
 * @returns `PhraseFilter`
 *
 * @public
 */
var buildPhraseFilter = function (field, value, indexPattern) {
  var _a;
  var convertedValue = (0,
  get_converted_value_for_field_1.getConvertedValueForField)(field, value);
  if (field.scripted) {
    return {
      meta: { index: indexPattern.id, field: field.name },
      query: { script: (0, exports.getPhraseScript)(field, value) },
    };
  } else {
    return {
      meta: { index: indexPattern.id },
      query: {
        match_phrase: ((_a = {}), (_a[field.name] = convertedValue), _a),
      },
    };
  }
};
exports.buildPhraseFilter = buildPhraseFilter;
/** @internal */
var getPhraseScript = function (field, value) {
  var convertedValue = (0,
  get_converted_value_for_field_1.getConvertedValueForField)(field, value);
  var script = (0, exports.buildInlineScriptForPhraseFilter)(field);
  return {
    script: {
      source: script,
      lang: field.lang,
      params: {
        value: convertedValue,
      },
    },
  };
};
exports.getPhraseScript = getPhraseScript;
/**
 * @internal
 * Takes a scripted field and returns an inline script appropriate for use in a script query.
 * Handles lucene expression and Painless scripts. Other langs aren't guaranteed to generate valid
 * scripts.
 *
 * @param {object} scriptedField A Field object representing a scripted field
 * @returns {string} The inline script string
 */
var buildInlineScriptForPhraseFilter = function (scriptedField) {
  // We must wrap painless scripts in a lambda in case they're more than a simple expression
  if (scriptedField.lang === "painless") {
    return (
      "boolean compare(Supplier s, def v) {if(s.get() instanceof List){List list = s.get(); for(def k : list){if(k==v){return true;}}return false;}else{return s.get() == v;}}" +
      "compare(() -> { ".concat(scriptedField.script, " }, params.value);")
    );
  } else {
    return "(".concat(scriptedField.script, ") == value");
  }
};
exports.buildInlineScriptForPhraseFilter = buildInlineScriptForPhraseFilter;
