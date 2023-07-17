"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRangeFilterToTimeRangeString =
  exports.convertRangeFilterToTimeRange = void 0;
var moment_1 = require("moment");
var lodash_1 = require("lodash");
function convertRangeFilterToTimeRange(filter) {
  var key = (0, lodash_1.keys)(filter.query.range)[0];
  var values = filter.query.range[key];
  return {
    from: (0, moment_1.default)(values.gt || values.gte),
    to: (0, moment_1.default)(values.lt || values.lte),
  };
}
exports.convertRangeFilterToTimeRange = convertRangeFilterToTimeRange;
function convertRangeFilterToTimeRangeString(filter) {
  var _a = convertRangeFilterToTimeRange(filter),
    from = _a.from,
    to = _a.to;
  return {
    from: from === null || from === void 0 ? void 0 : from.toISOString(),
    to: to === null || to === void 0 ? void 0 : to.toISOString(),
  };
}
exports.convertRangeFilterToTimeRangeString =
  convertRangeFilterToTimeRangeString;
