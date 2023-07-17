"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatchAllFilter = void 0;
var lodash_1 = require("lodash");
/**
 * @param filter
 * @returns `true` if a filter is an `MatchAllFilter`
 *
 * @public
 */
var isMatchAllFilter = function (filter) {
  return (0, lodash_1.has)(filter, "query.match_all");
};
exports.isMatchAllFilter = isMatchAllFilter;
