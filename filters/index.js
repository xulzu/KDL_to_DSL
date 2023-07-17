"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILTERS =
  exports.FilterStateStore =
  exports.BooleanRelation =
  exports.getFilterParams =
  exports.isScriptedRangeFilter =
  exports.isScriptedPhraseFilter =
  exports.getPhraseFilterField =
  exports.getPhraseFilterValue =
  exports.getConvertedValueForField =
  exports.getPhraseScript =
  exports.getRangeScript =
  exports.buildExistsFilter =
  exports.buildEmptyFilter =
  exports.buildFilter =
  exports.buildCustomFilter =
  exports.buildRangeFilter =
  exports.buildPhraseFilter =
  exports.buildPhrasesFilter =
  exports.buildQueryFilter =
  exports.getFilterField =
  exports.isQueryStringFilter =
  exports.isRangeFilter =
  exports.isPhrasesFilter =
  exports.isPhraseFilter =
  exports.isCombinedFilter =
  exports.buildCombinedFilter =
  exports.isMatchAllFilter =
  exports.isExistsFilter =
  exports.convertRangeFilterToTimeRange =
  exports.extractTimeRange =
  exports.extractTimeFilter =
  exports.unpinFilter =
  exports.toggleFilterPinned =
  exports.toggleFilterDisabled =
  exports.toggleFilterNegated =
  exports.isFilterDisabled =
  exports.disableFilter =
  exports.enableFilter =
  exports.onlyDisabledFiltersChanged =
  exports.isFilterPinned =
  exports.updateFilter =
  exports.pinFilter =
  exports.isFilters =
  exports.isFilter =
  exports.cleanFilter =
  exports.COMPARE_ALL_OPTIONS =
  exports.compareFilters =
  exports.uniqFilters =
  exports.dedupFilters =
    void 0;
var helpers_1 = require("./helpers");
Object.defineProperty(exports, "dedupFilters", {
  enumerable: true,
  get: function () {
    return helpers_1.dedupFilters;
  },
});
Object.defineProperty(exports, "uniqFilters", {
  enumerable: true,
  get: function () {
    return helpers_1.uniqFilters;
  },
});
Object.defineProperty(exports, "compareFilters", {
  enumerable: true,
  get: function () {
    return helpers_1.compareFilters;
  },
});
Object.defineProperty(exports, "COMPARE_ALL_OPTIONS", {
  enumerable: true,
  get: function () {
    return helpers_1.COMPARE_ALL_OPTIONS;
  },
});
Object.defineProperty(exports, "cleanFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.cleanFilter;
  },
});
Object.defineProperty(exports, "isFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.isFilter;
  },
});
Object.defineProperty(exports, "isFilters", {
  enumerable: true,
  get: function () {
    return helpers_1.isFilters;
  },
});
Object.defineProperty(exports, "pinFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.pinFilter;
  },
});
Object.defineProperty(exports, "updateFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.updateFilter;
  },
});
Object.defineProperty(exports, "isFilterPinned", {
  enumerable: true,
  get: function () {
    return helpers_1.isFilterPinned;
  },
});
Object.defineProperty(exports, "onlyDisabledFiltersChanged", {
  enumerable: true,
  get: function () {
    return helpers_1.onlyDisabledFiltersChanged;
  },
});
Object.defineProperty(exports, "enableFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.enableFilter;
  },
});
Object.defineProperty(exports, "disableFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.disableFilter;
  },
});
Object.defineProperty(exports, "isFilterDisabled", {
  enumerable: true,
  get: function () {
    return helpers_1.isFilterDisabled;
  },
});
Object.defineProperty(exports, "toggleFilterNegated", {
  enumerable: true,
  get: function () {
    return helpers_1.toggleFilterNegated;
  },
});
Object.defineProperty(exports, "toggleFilterDisabled", {
  enumerable: true,
  get: function () {
    return helpers_1.toggleFilterDisabled;
  },
});
Object.defineProperty(exports, "toggleFilterPinned", {
  enumerable: true,
  get: function () {
    return helpers_1.toggleFilterPinned;
  },
});
Object.defineProperty(exports, "unpinFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.unpinFilter;
  },
});
Object.defineProperty(exports, "extractTimeFilter", {
  enumerable: true,
  get: function () {
    return helpers_1.extractTimeFilter;
  },
});
Object.defineProperty(exports, "extractTimeRange", {
  enumerable: true,
  get: function () {
    return helpers_1.extractTimeRange;
  },
});
Object.defineProperty(exports, "convertRangeFilterToTimeRange", {
  enumerable: true,
  get: function () {
    return helpers_1.convertRangeFilterToTimeRange;
  },
});
var build_filters_1 = require("./build_filters");
Object.defineProperty(exports, "isExistsFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isExistsFilter;
  },
});
Object.defineProperty(exports, "isMatchAllFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isMatchAllFilter;
  },
});
Object.defineProperty(exports, "buildCombinedFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildCombinedFilter;
  },
});
Object.defineProperty(exports, "isCombinedFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isCombinedFilter;
  },
});
Object.defineProperty(exports, "isPhraseFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isPhraseFilter;
  },
});
Object.defineProperty(exports, "isPhrasesFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isPhrasesFilter;
  },
});
Object.defineProperty(exports, "isRangeFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isRangeFilter;
  },
});
Object.defineProperty(exports, "isQueryStringFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isQueryStringFilter;
  },
});
Object.defineProperty(exports, "getFilterField", {
  enumerable: true,
  get: function () {
    return build_filters_1.getFilterField;
  },
});
Object.defineProperty(exports, "buildQueryFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildQueryFilter;
  },
});
Object.defineProperty(exports, "buildPhrasesFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildPhrasesFilter;
  },
});
Object.defineProperty(exports, "buildPhraseFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildPhraseFilter;
  },
});
Object.defineProperty(exports, "buildRangeFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildRangeFilter;
  },
});
Object.defineProperty(exports, "buildCustomFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildCustomFilter;
  },
});
Object.defineProperty(exports, "buildFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildFilter;
  },
});
Object.defineProperty(exports, "buildEmptyFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildEmptyFilter;
  },
});
Object.defineProperty(exports, "buildExistsFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.buildExistsFilter;
  },
});
Object.defineProperty(exports, "getRangeScript", {
  enumerable: true,
  get: function () {
    return build_filters_1.getRangeScript;
  },
});
Object.defineProperty(exports, "getPhraseScript", {
  enumerable: true,
  get: function () {
    return build_filters_1.getPhraseScript;
  },
});
Object.defineProperty(exports, "getConvertedValueForField", {
  enumerable: true,
  get: function () {
    return build_filters_1.getConvertedValueForField;
  },
});
Object.defineProperty(exports, "getPhraseFilterValue", {
  enumerable: true,
  get: function () {
    return build_filters_1.getPhraseFilterValue;
  },
});
Object.defineProperty(exports, "getPhraseFilterField", {
  enumerable: true,
  get: function () {
    return build_filters_1.getPhraseFilterField;
  },
});
Object.defineProperty(exports, "isScriptedPhraseFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isScriptedPhraseFilter;
  },
});
Object.defineProperty(exports, "isScriptedRangeFilter", {
  enumerable: true,
  get: function () {
    return build_filters_1.isScriptedRangeFilter;
  },
});
Object.defineProperty(exports, "getFilterParams", {
  enumerable: true,
  get: function () {
    return build_filters_1.getFilterParams;
  },
});
Object.defineProperty(exports, "BooleanRelation", {
  enumerable: true,
  get: function () {
    return build_filters_1.BooleanRelation;
  },
});
var types_1 = require("./build_filters/types");
Object.defineProperty(exports, "FilterStateStore", {
  enumerable: true,
  get: function () {
    return types_1.FilterStateStore;
  },
});
Object.defineProperty(exports, "FILTERS", {
  enumerable: true,
  get: function () {
    return types_1.FILTERS;
  },
});
