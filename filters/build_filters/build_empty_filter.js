"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEmptyFilter = void 0;
var types_1 = require("./types");
var buildEmptyFilter = function (isPinned, index) {
  var meta = {
    disabled: false,
    negate: false,
    alias: null,
    index: index,
  };
  var $state = {
    store: isPinned
      ? types_1.FilterStateStore.GLOBAL_STATE
      : types_1.FilterStateStore.APP_STATE,
  };
  return { meta: meta, $state: $state };
};
exports.buildEmptyFilter = buildEmptyFilter;
