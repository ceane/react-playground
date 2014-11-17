/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classProps = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};

	var CodeMirror = __webpack_require__(4);

	var assign = __webpack_require__(2).assign;
	var JSXTransformer = __webpack_require__(3).JSXTransformer;
	var Editor = (function () {
	  var Editor = function Editor(node, props) {
	    if (props === undefined) props = {};


	    var defaults = {
	      value: "/** Start typing */",
	      autofocus: true,
	      mode: "javascript",
	      theme: "neo",
	      smartIndent: false,
	      electricChars: false,
	      lineNumbers: true,
	      workTime: 10,
	      tabSize: 2
	    };

	    props = Object.assign(defaults, props);

	    this._editor = CodeMirror(node, props);

	    this._editor.on("change", this.handleEditorChange);
	  };

	  _classProps(Editor, null, {
	    handleEditorChange: {
	      writable: true,
	      value: function (change) {
	        JSXTransformer.run(change.getValue());
	      }
	    }
	  });

	  return Editor;
	})();

	new Editor(); //jshint ignore:line

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014 Ceane Lamerez
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 *
	 * @providesModule Object.assign
	 *
	 * Sourced from Mozilla (https://developer.mozilla.org/en-US/...)
	 * @see http://goo.gl/ObtMza
	 */

	"use strict";

	var assign = exports.assign = Object.defineProperty(Object, "assign", {
	  enumerable: false,
	  configurable: true,
	  writable: true,
	  value: function (target, firstSource) {
	    if (target === undefined || target === null) throw new TypeError("Cannot convert first argument to object");

	    var to = Object(target);

	    var hasPendingException = false;
	    var pendingException;

	    for (var i = 1; i < arguments.length; i++) {
	      var nextSource = arguments[i];
	      if (nextSource === undefined || nextSource === null) continue;

	      var keysArray = Object.keys(Object(nextSource));
	      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	        var nextKey = keysArray[nextIndex];
	        try {
	          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
	        } catch (e) {
	          if (!hasPendingException) {
	            hasPendingException = true;
	            pendingException = e;
	          }
	        }
	      }

	      if (hasPendingException) throw pendingException;
	    }
	    return to;
	  }
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var visitors = __webpack_require__(5);
	var transform = __webpack_require__(7).transform;
	var Buffer = __webpack_require__(6).Buffer;

	module.exports = {
	  transform: function(input, options) {
	    var output = innerTransform(input, options);
	    var result = output.code;
	    if (options && options.sourceMap) {
	      var map = inlineSourceMap(
	        output.sourceMap,
	        input,
	        options.sourceFilename
	      );
	      result += '\n' + map;
	    }
	    return result;
	  },
	  transformWithDetails: function(input, options) {
	    var output = innerTransform(input, options);
	    var result = {};
	    result.code = output.code;
	    if (options && options.sourceMap) {
	      result.sourceMap = output.sourceMap.toJSON();
	    }
	    return result;
	  }
	};

	function innerTransform(input, options) {
	  options = options || {};

	  var visitorSets = ['react'];
	  if (options.harmony) {
	    visitorSets.push('harmony');
	  }
	  if (options.stripTypes) {
	    visitorSets.push('type-annotations');
	  }

	  var visitorList = visitors.getVisitorsBySet(visitorSets);
	  return transform(visitorList, input, options);
	}

	function inlineSourceMap(sourceMap, sourceCode, sourceFilename) {
	  var json = sourceMap.toJSON();
	  json.sources = [sourceFilename];
	  json.sourcesContent = [sourceCode];
	  var base64 = Buffer(JSON.stringify(json)).toString('base64');
	  return '//# sourceMappingURL=data:application/json;base64,' +
	         base64;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE

	// This is CodeMirror (http://codemirror.net), a code editor
	// implemented in JavaScript on top of the browser's DOM.
	//
	// You can find some technical background for some of the code below
	// at http://marijnhaverbeke.nl/blog/#cm-internals .

	(function(mod) {
	  if (true) // CommonJS
	    module.exports = mod();
	  else if (typeof define == "function" && define.amd) // AMD
	    return define([], mod);
	  else // Plain browser env
	    this.CodeMirror = mod();
	})(function() {
	  "use strict";

	  // BROWSER SNIFFING

	  // Kludges for bugs and behavior differences that can't be feature
	  // detected are enabled based on userAgent etc sniffing.

	  var gecko = /gecko\/\d/i.test(navigator.userAgent);
	  // ie_uptoN means Internet Explorer version N or lower
	  var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
	  var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
	  var ie = ie_upto10 || ie_11up;
	  var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : ie_11up[1]);
	  var webkit = /WebKit\//.test(navigator.userAgent);
	  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);
	  var chrome = /Chrome\//.test(navigator.userAgent);
	  var presto = /Opera\//.test(navigator.userAgent);
	  var safari = /Apple Computer/.test(navigator.vendor);
	  var khtml = /KHTML\//.test(navigator.userAgent);
	  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);
	  var phantom = /PhantomJS/.test(navigator.userAgent);

	  var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
	  // This is woefully incomplete. Suggestions for alternative methods welcome.
	  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
	  var mac = ios || /Mac/.test(navigator.platform);
	  var windows = /win/i.test(navigator.platform);

	  var presto_version = presto && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
	  if (presto_version) presto_version = Number(presto_version[1]);
	  if (presto_version && presto_version >= 15) { presto = false; webkit = true; }
	  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
	  var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
	  var captureRightClick = gecko || (ie && ie_version >= 9);

	  // Optimize some code when these features are not used.
	  var sawReadOnlySpans = false, sawCollapsedSpans = false;

	  // EDITOR CONSTRUCTOR

	  // A CodeMirror instance represents an editor. This is the object
	  // that user code is usually dealing with.

	  function CodeMirror(place, options) {
	    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

	    this.options = options = options ? copyObj(options) : {};
	    // Determine effective options based on given values and defaults.
	    copyObj(defaults, options, false);
	    setGuttersForLineNumbers(options);

	    var doc = options.value;
	    if (typeof doc == "string") doc = new Doc(doc, options.mode);
	    this.doc = doc;

	    var display = this.display = new Display(place, doc);
	    display.wrapper.CodeMirror = this;
	    updateGutters(this);
	    themeChanged(this);
	    if (options.lineWrapping)
	      this.display.wrapper.className += " CodeMirror-wrap";
	    if (options.autofocus && !mobile) focusInput(this);

	    this.state = {
	      keyMaps: [],  // stores maps added by addKeyMap
	      overlays: [], // highlighting overlays, as added by addOverlay
	      modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
	      overwrite: false, focused: false,
	      suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
	      pasteIncoming: false, cutIncoming: false, // help recognize paste/cut edits in readInput
	      draggingText: false,
	      highlight: new Delayed() // stores highlight worker timeout
	    };

	    // Override magic textarea content restore that IE sometimes does
	    // on our hidden textarea on reload
	    if (ie && ie_version < 11) setTimeout(bind(resetInput, this, true), 20);

	    registerEventHandlers(this);
	    ensureGlobalHandlers();

	    startOperation(this);
	    this.curOp.forceUpdate = true;
	    attachDoc(this, doc);

	    if ((options.autofocus && !mobile) || activeElt() == display.input)
	      setTimeout(bind(onFocus, this), 20);
	    else
	      onBlur(this);

	    for (var opt in optionHandlers) if (optionHandlers.hasOwnProperty(opt))
	      optionHandlers[opt](this, options[opt], Init);
	    maybeUpdateLineNumberWidth(this);
	    for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
	    endOperation(this);
	  }

	  // DISPLAY CONSTRUCTOR

	  // The display handles the DOM integration, both for input reading
	  // and content drawing. It holds references to DOM nodes and
	  // display-related state.

	  function Display(place, doc) {
	    var d = this;

	    // The semihidden textarea that is focused when the editor is
	    // focused, and receives input.
	    var input = d.input = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none");
	    // The textarea is kept positioned near the cursor to prevent the
	    // fact that it'll be scrolled into view on input from scrolling
	    // our fake cursor out of view. On webkit, when wrap=off, paste is
	    // very slow. So make the area wide instead.
	    if (webkit) input.style.width = "1000px";
	    else input.setAttribute("wrap", "off");
	    // If border: 0; -- iOS fails to open keyboard (issue #1287)
	    if (ios) input.style.border = "1px solid black";
	    input.setAttribute("autocorrect", "off"); input.setAttribute("autocapitalize", "off"); input.setAttribute("spellcheck", "false");

	    // Wraps and hides input textarea
	    d.inputDiv = elt("div", [input], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
	    // The fake scrollbar elements.
	    d.scrollbarH = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
	    d.scrollbarV = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
	    // Covers bottom-right square when both scrollbars are present.
	    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
	    // Covers bottom of gutter when coverGutterNextToScrollbar is on
	    // and h scrollbar is present.
	    d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
	    // Will contain the actual code, positioned to cover the viewport.
	    d.lineDiv = elt("div", null, "CodeMirror-code");
	    // Elements are added to these to represent selection and cursors.
	    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
	    d.cursorDiv = elt("div", null, "CodeMirror-cursors");
	    // A visibility: hidden element used to find the size of things.
	    d.measure = elt("div", null, "CodeMirror-measure");
	    // When lines outside of the viewport are measured, they are drawn in this.
	    d.lineMeasure = elt("div", null, "CodeMirror-measure");
	    // Wraps everything that needs to exist inside the vertically-padded coordinate system
	    d.lineSpace = elt("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
	                      null, "position: relative; outline: none");
	    // Moved around its parent to cover visible view.
	    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
	    // Set to the height of the document, allowing scrolling.
	    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
	    // Behavior of elts with overflow: auto and padding is
	    // inconsistent across browsers. This is used to ensure the
	    // scrollable area is big enough.
	    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerCutOff + "px; width: 1px;");
	    // Will contain the gutters, if any.
	    d.gutters = elt("div", null, "CodeMirror-gutters");
	    d.lineGutter = null;
	    // Actual scrollable element.
	    d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
	    d.scroller.setAttribute("tabIndex", "-1");
	    // The element in which the editor lives.
	    d.wrapper = elt("div", [d.inputDiv, d.scrollbarH, d.scrollbarV,
	                            d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");

	    // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
	    if (ie && ie_version < 8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
	    // Needed to hide big blue blinking cursor on Mobile Safari
	    if (ios) input.style.width = "0px";
	    if (!webkit) d.scroller.draggable = true;
	    // Needed to handle Tab key in KHTML
	    if (khtml) { d.inputDiv.style.height = "1px"; d.inputDiv.style.position = "absolute"; }
	    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
	    if (ie && ie_version < 8) d.scrollbarH.style.minHeight = d.scrollbarV.style.minWidth = "18px";

	    if (place.appendChild) place.appendChild(d.wrapper);
	    else place(d.wrapper);

	    // Current rendered range (may be bigger than the view window).
	    d.viewFrom = d.viewTo = doc.first;
	    // Information about the rendered lines.
	    d.view = [];
	    // Holds info about a single rendered line when it was rendered
	    // for measurement, while not in view.
	    d.externalMeasured = null;
	    // Empty space (in pixels) above the view
	    d.viewOffset = 0;
	    d.lastSizeC = 0;
	    d.updateLineNumbers = null;

	    // Used to only resize the line number gutter when necessary (when
	    // the amount of lines crosses a boundary that makes its width change)
	    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
	    // See readInput and resetInput
	    d.prevInput = "";
	    // Set to true when a non-horizontal-scrolling line widget is
	    // added. As an optimization, line widget aligning is skipped when
	    // this is false.
	    d.alignWidgets = false;
	    // Flag that indicates whether we expect input to appear real soon
	    // now (after some event like 'keypress' or 'input') and are
	    // polling intensively.
	    d.pollingFast = false;
	    // Self-resetting timeout for the poller
	    d.poll = new Delayed();

	    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;

	    // Tracks when resetInput has punted to just putting a short
	    // string into the textarea instead of the full selection.
	    d.inaccurateSelection = false;

	    // Tracks the maximum line length so that the horizontal scrollbar
	    // can be kept static when scrolling.
	    d.maxLine = null;
	    d.maxLineLength = 0;
	    d.maxLineChanged = false;

	    // Used for measuring wheel scrolling granularity
	    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

	    // True when shift is held down.
	    d.shift = false;

	    // Used to track whether anything happened since the context menu
	    // was opened.
	    d.selForContextMenu = null;
	  }

	  // STATE UPDATES

	  // Used to get the editor into a consistent state again when options change.

	  function loadMode(cm) {
	    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
	    resetModeState(cm);
	  }

	  function resetModeState(cm) {
	    cm.doc.iter(function(line) {
	      if (line.stateAfter) line.stateAfter = null;
	      if (line.styles) line.styles = null;
	    });
	    cm.doc.frontier = cm.doc.first;
	    startWorker(cm, 100);
	    cm.state.modeGen++;
	    if (cm.curOp) regChange(cm);
	  }

	  function wrappingChanged(cm) {
	    if (cm.options.lineWrapping) {
	      addClass(cm.display.wrapper, "CodeMirror-wrap");
	      cm.display.sizer.style.minWidth = "";
	    } else {
	      rmClass(cm.display.wrapper, "CodeMirror-wrap");
	      findMaxLine(cm);
	    }
	    estimateLineHeights(cm);
	    regChange(cm);
	    clearCaches(cm);
	    setTimeout(function(){updateScrollbars(cm);}, 100);
	  }

	  // Returns a function that estimates the height of a line, to use as
	  // first approximation until the line becomes visible (and is thus
	  // properly measurable).
	  function estimateHeight(cm) {
	    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
	    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
	    return function(line) {
	      if (lineIsHidden(cm.doc, line)) return 0;

	      var widgetsHeight = 0;
	      if (line.widgets) for (var i = 0; i < line.widgets.length; i++) {
	        if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
	      }

	      if (wrapping)
	        return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
	      else
	        return widgetsHeight + th;
	    };
	  }

	  function estimateLineHeights(cm) {
	    var doc = cm.doc, est = estimateHeight(cm);
	    doc.iter(function(line) {
	      var estHeight = est(line);
	      if (estHeight != line.height) updateLineHeight(line, estHeight);
	    });
	  }

	  function keyMapChanged(cm) {
	    var map = keyMap[cm.options.keyMap], style = map.style;
	    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") +
	      (style ? " cm-keymap-" + style : "");
	  }

	  function themeChanged(cm) {
	    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
	      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
	    clearCaches(cm);
	  }

	  function guttersChanged(cm) {
	    updateGutters(cm);
	    regChange(cm);
	    setTimeout(function(){alignHorizontally(cm);}, 20);
	  }

	  // Rebuild the gutter elements, ensure the margin to the left of the
	  // code matches their width.
	  function updateGutters(cm) {
	    var gutters = cm.display.gutters, specs = cm.options.gutters;
	    removeChildren(gutters);
	    for (var i = 0; i < specs.length; ++i) {
	      var gutterClass = specs[i];
	      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
	      if (gutterClass == "CodeMirror-linenumbers") {
	        cm.display.lineGutter = gElt;
	        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
	      }
	    }
	    gutters.style.display = i ? "" : "none";
	    updateGutterSpace(cm);
	  }

	  function updateGutterSpace(cm) {
	    var width = cm.display.gutters.offsetWidth;
	    cm.display.sizer.style.marginLeft = width + "px";
	    cm.display.scrollbarH.style.left = cm.options.fixedGutter ? width + "px" : 0;
	  }

	  // Compute the character length of a line, taking into account
	  // collapsed ranges (see markText) that might hide parts, and join
	  // other lines onto it.
	  function lineLength(line) {
	    if (line.height == 0) return 0;
	    var len = line.text.length, merged, cur = line;
	    while (merged = collapsedSpanAtStart(cur)) {
	      var found = merged.find(0, true);
	      cur = found.from.line;
	      len += found.from.ch - found.to.ch;
	    }
	    cur = line;
	    while (merged = collapsedSpanAtEnd(cur)) {
	      var found = merged.find(0, true);
	      len -= cur.text.length - found.from.ch;
	      cur = found.to.line;
	      len += cur.text.length - found.to.ch;
	    }
	    return len;
	  }

	  // Find the longest line in the document.
	  function findMaxLine(cm) {
	    var d = cm.display, doc = cm.doc;
	    d.maxLine = getLine(doc, doc.first);
	    d.maxLineLength = lineLength(d.maxLine);
	    d.maxLineChanged = true;
	    doc.iter(function(line) {
	      var len = lineLength(line);
	      if (len > d.maxLineLength) {
	        d.maxLineLength = len;
	        d.maxLine = line;
	      }
	    });
	  }

	  // Make sure the gutters options contains the element
	  // "CodeMirror-linenumbers" when the lineNumbers option is true.
	  function setGuttersForLineNumbers(options) {
	    var found = indexOf(options.gutters, "CodeMirror-linenumbers");
	    if (found == -1 && options.lineNumbers) {
	      options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
	    } else if (found > -1 && !options.lineNumbers) {
	      options.gutters = options.gutters.slice(0);
	      options.gutters.splice(found, 1);
	    }
	  }

	  // SCROLLBARS

	  function hScrollbarTakesSpace(cm) {
	    return cm.display.scroller.clientHeight - cm.display.wrapper.clientHeight < scrollerCutOff - 3;
	  }

	  // Prepare DOM reads needed to update the scrollbars. Done in one
	  // shot to minimize update/measure roundtrips.
	  function measureForScrollbars(cm) {
	    var scroll = cm.display.scroller;
	    return {
	      clientHeight: scroll.clientHeight,
	      barHeight: cm.display.scrollbarV.clientHeight,
	      scrollWidth: scroll.scrollWidth, clientWidth: scroll.clientWidth,
	      hScrollbarTakesSpace: hScrollbarTakesSpace(cm),
	      barWidth: cm.display.scrollbarH.clientWidth,
	      docHeight: Math.round(cm.doc.height + paddingVert(cm.display))
	    };
	  }

	  // Re-synchronize the fake scrollbars with the actual size of the
	  // content.
	  function updateScrollbars(cm, measure) {
	    if (!measure) measure = measureForScrollbars(cm);
	    var d = cm.display, sWidth = scrollbarWidth(d.measure);
	    var scrollHeight = measure.docHeight + scrollerCutOff;
	    var needsH = measure.scrollWidth > measure.clientWidth;
	    if (needsH && measure.scrollWidth <= measure.clientWidth + 1 &&
	        sWidth > 0 && !measure.hScrollbarTakesSpace)
	      needsH = false; // (Issue #2562)
	    var needsV = scrollHeight > measure.clientHeight;

	    if (needsV) {
	      d.scrollbarV.style.display = "block";
	      d.scrollbarV.style.bottom = needsH ? sWidth + "px" : "0";
	      // A bug in IE8 can cause this value to be negative, so guard it.
	      d.scrollbarV.firstChild.style.height =
	        Math.max(0, scrollHeight - measure.clientHeight + (measure.barHeight || d.scrollbarV.clientHeight)) + "px";
	    } else {
	      d.scrollbarV.style.display = "";
	      d.scrollbarV.firstChild.style.height = "0";
	    }
	    if (needsH) {
	      d.scrollbarH.style.display = "block";
	      d.scrollbarH.style.right = needsV ? sWidth + "px" : "0";
	      d.scrollbarH.firstChild.style.width =
	        (measure.scrollWidth - measure.clientWidth + (measure.barWidth || d.scrollbarH.clientWidth)) + "px";
	    } else {
	      d.scrollbarH.style.display = "";
	      d.scrollbarH.firstChild.style.width = "0";
	    }
	    if (needsH && needsV) {
	      d.scrollbarFiller.style.display = "block";
	      d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = sWidth + "px";
	    } else d.scrollbarFiller.style.display = "";
	    if (needsH && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
	      d.gutterFiller.style.display = "block";
	      d.gutterFiller.style.height = sWidth + "px";
	      d.gutterFiller.style.width = d.gutters.offsetWidth + "px";
	    } else d.gutterFiller.style.display = "";

	    if (!cm.state.checkedOverlayScrollbar && measure.clientHeight > 0) {
	      if (sWidth === 0) {
	        var w = mac && !mac_geMountainLion ? "12px" : "18px";
	        d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = w;
	        var barMouseDown = function(e) {
	          if (e_target(e) != d.scrollbarV && e_target(e) != d.scrollbarH)
	            operation(cm, onMouseDown)(e);
	        };
	        on(d.scrollbarV, "mousedown", barMouseDown);
	        on(d.scrollbarH, "mousedown", barMouseDown);
	      }
	      cm.state.checkedOverlayScrollbar = true;
	    }
	  }

	  // Compute the lines that are visible in a given viewport (defaults
	  // the the current scroll position). viewport may contain top,
	  // height, and ensure (see op.scrollToPos) properties.
	  function visibleLines(display, doc, viewport) {
	    var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
	    top = Math.floor(top - paddingTop(display));
	    var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;

	    var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
	    // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
	    // forces those lines into the viewport (if possible).
	    if (viewport && viewport.ensure) {
	      var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
	      if (ensureFrom < from)
	        return {from: ensureFrom,
	                to: lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight)};
	      if (Math.min(ensureTo, doc.lastLine()) >= to)
	        return {from: lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight),
	                to: ensureTo};
	    }
	    return {from: from, to: Math.max(to, from + 1)};
	  }

	  // LINE NUMBERS

	  // Re-align line numbers and gutter marks to compensate for
	  // horizontal scrolling.
	  function alignHorizontally(cm) {
	    var display = cm.display, view = display.view;
	    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
	    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
	    var gutterW = display.gutters.offsetWidth, left = comp + "px";
	    for (var i = 0; i < view.length; i++) if (!view[i].hidden) {
	      if (cm.options.fixedGutter && view[i].gutter)
	        view[i].gutter.style.left = left;
	      var align = view[i].alignable;
	      if (align) for (var j = 0; j < align.length; j++)
	        align[j].style.left = left;
	    }
	    if (cm.options.fixedGutter)
	      display.gutters.style.left = (comp + gutterW) + "px";
	  }

	  // Used to ensure that the line number gutter is still the right
	  // size for the current document size. Returns true when an update
	  // is needed.
	  function maybeUpdateLineNumberWidth(cm) {
	    if (!cm.options.lineNumbers) return false;
	    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
	    if (last.length != display.lineNumChars) {
	      var test = display.measure.appendChild(elt("div", [elt("div", last)],
	                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
	      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
	      display.lineGutter.style.width = "";
	      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding);
	      display.lineNumWidth = display.lineNumInnerWidth + padding;
	      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
	      display.lineGutter.style.width = display.lineNumWidth + "px";
	      updateGutterSpace(cm);
	      return true;
	    }
	    return false;
	  }

	  function lineNumberFor(options, i) {
	    return String(options.lineNumberFormatter(i + options.firstLineNumber));
	  }

	  // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
	  // but using getBoundingClientRect to get a sub-pixel-accurate
	  // result.
	  function compensateForHScroll(display) {
	    return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
	  }

	  // DISPLAY DRAWING

	  function DisplayUpdate(cm, viewport, force) {
	    var display = cm.display;

	    this.viewport = viewport;
	    // Store some values that we'll need later (but don't want to force a relayout for)
	    this.visible = visibleLines(display, cm.doc, viewport);
	    this.editorIsHidden = !display.wrapper.offsetWidth;
	    this.wrapperHeight = display.wrapper.clientHeight;
	    this.oldViewFrom = display.viewFrom; this.oldViewTo = display.viewTo;
	    this.oldScrollerWidth = display.scroller.clientWidth;
	    this.force = force;
	    this.dims = getDimensions(cm);
	  }

	  // Does the actual updating of the line display. Bails out
	  // (returning false) when there is nothing to be done and forced is
	  // false.
	  function updateDisplayIfNeeded(cm, update) {
	    var display = cm.display, doc = cm.doc;
	    if (update.editorIsHidden) {
	      resetView(cm);
	      return false;
	    }

	    // Bail out if the visible area is already rendered and nothing changed.
	    if (!update.force &&
	        update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo &&
	        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) &&
	        countDirtyView(cm) == 0)
	      return false;

	    if (maybeUpdateLineNumberWidth(cm)) {
	      resetView(cm);
	      update.dims = getDimensions(cm);
	    }

	    // Compute a suitable new viewport (from & to)
	    var end = doc.first + doc.size;
	    var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
	    var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
	    if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
	    if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);
	    if (sawCollapsedSpans) {
	      from = visualLineNo(cm.doc, from);
	      to = visualLineEndNo(cm.doc, to);
	    }

	    var different = from != display.viewFrom || to != display.viewTo ||
	      display.lastSizeC != update.wrapperHeight;
	    adjustView(cm, from, to);

	    display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
	    // Position the mover div to align with the current scroll position
	    cm.display.mover.style.top = display.viewOffset + "px";

	    var toUpdate = countDirtyView(cm);
	    if (!different && toUpdate == 0 && !update.force &&
	        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
	      return false;

	    // For big changes, we hide the enclosing element during the
	    // update, since that speeds up the operations on most browsers.
	    var focused = activeElt();
	    if (toUpdate > 4) display.lineDiv.style.display = "none";
	    patchDisplay(cm, display.updateLineNumbers, update.dims);
	    if (toUpdate > 4) display.lineDiv.style.display = "";
	    // There might have been a widget with a focused element that got
	    // hidden or updated, if so re-focus it.
	    if (focused && activeElt() != focused && focused.offsetHeight) focused.focus();

	    // Prevent selection and cursors from interfering with the scroll
	    // width.
	    removeChildren(display.cursorDiv);
	    removeChildren(display.selectionDiv);

	    if (different) {
	      display.lastSizeC = update.wrapperHeight;
	      startWorker(cm, 400);
	    }

	    display.updateLineNumbers = null;

	    return true;
	  }

	  function postUpdateDisplay(cm, update) {
	    var force = update.force, viewport = update.viewport;
	    for (var first = true;; first = false) {
	      if (first && cm.options.lineWrapping && update.oldScrollerWidth != cm.display.scroller.clientWidth) {
	        force = true;
	      } else {
	        force = false;
	        // Clip forced viewport to actual scrollable area.
	        if (viewport && viewport.top != null)
	          viewport = {top: Math.min(cm.doc.height + paddingVert(cm.display) - scrollerCutOff -
	                                    cm.display.scroller.clientHeight, viewport.top)};
	        // Updated line heights might result in the drawn area not
	        // actually covering the viewport. Keep looping until it does.
	        update.visible = visibleLines(cm.display, cm.doc, viewport);
	        if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
	          break;
	      }
	      if (!updateDisplayIfNeeded(cm, update)) break;
	      updateHeightsInViewport(cm);
	      var barMeasure = measureForScrollbars(cm);
	      updateSelection(cm);
	      setDocumentHeight(cm, barMeasure);
	      updateScrollbars(cm, barMeasure);
	    }

	    signalLater(cm, "update", cm);
	    if (cm.display.viewFrom != update.oldViewFrom || cm.display.viewTo != update.oldViewTo)
	      signalLater(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
	  }

	  function updateDisplaySimple(cm, viewport) {
	    var update = new DisplayUpdate(cm, viewport);
	    if (updateDisplayIfNeeded(cm, update)) {
	      updateHeightsInViewport(cm);
	      postUpdateDisplay(cm, update);
	      var barMeasure = measureForScrollbars(cm);
	      updateSelection(cm);
	      setDocumentHeight(cm, barMeasure);
	      updateScrollbars(cm, barMeasure);
	    }
	  }

	  function setDocumentHeight(cm, measure) {
	    cm.display.sizer.style.minHeight = cm.display.heightForcer.style.top = measure.docHeight + "px";
	    cm.display.gutters.style.height = Math.max(measure.docHeight, measure.clientHeight - scrollerCutOff) + "px";
	  }

	  function checkForWebkitWidthBug(cm, measure) {
	    // Work around Webkit bug where it sometimes reserves space for a
	    // non-existing phantom scrollbar in the scroller (Issue #2420)
	    if (cm.display.sizer.offsetWidth + cm.display.gutters.offsetWidth < cm.display.scroller.clientWidth - 1) {
	      cm.display.sizer.style.minHeight = cm.display.heightForcer.style.top = "0px";
	      cm.display.gutters.style.height = measure.docHeight + "px";
	    }
	  }

	  // Read the actual heights of the rendered lines, and update their
	  // stored heights to match.
	  function updateHeightsInViewport(cm) {
	    var display = cm.display;
	    var prevBottom = display.lineDiv.offsetTop;
	    for (var i = 0; i < display.view.length; i++) {
	      var cur = display.view[i], height;
	      if (cur.hidden) continue;
	      if (ie && ie_version < 8) {
	        var bot = cur.node.offsetTop + cur.node.offsetHeight;
	        height = bot - prevBottom;
	        prevBottom = bot;
	      } else {
	        var box = cur.node.getBoundingClientRect();
	        height = box.bottom - box.top;
	      }
	      var diff = cur.line.height - height;
	      if (height < 2) height = textHeight(display);
	      if (diff > .001 || diff < -.001) {
	        updateLineHeight(cur.line, height);
	        updateWidgetHeight(cur.line);
	        if (cur.rest) for (var j = 0; j < cur.rest.length; j++)
	          updateWidgetHeight(cur.rest[j]);
	      }
	    }
	  }

	  // Read and store the height of line widgets associated with the
	  // given line.
	  function updateWidgetHeight(line) {
	    if (line.widgets) for (var i = 0; i < line.widgets.length; ++i)
	      line.widgets[i].height = line.widgets[i].node.offsetHeight;
	  }

	  // Do a bulk-read of the DOM positions and sizes needed to draw the
	  // view, so that we don't interleave reading and writing to the DOM.
	  function getDimensions(cm) {
	    var d = cm.display, left = {}, width = {};
	    var gutterLeft = d.gutters.clientLeft;
	    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
	      left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
	      width[cm.options.gutters[i]] = n.clientWidth;
	    }
	    return {fixedPos: compensateForHScroll(d),
	            gutterTotalWidth: d.gutters.offsetWidth,
	            gutterLeft: left,
	            gutterWidth: width,
	            wrapperWidth: d.wrapper.clientWidth};
	  }

	  // Sync the actual display DOM structure with display.view, removing
	  // nodes for lines that are no longer in view, and creating the ones
	  // that are not there yet, and updating the ones that are out of
	  // date.
	  function patchDisplay(cm, updateNumbersFrom, dims) {
	    var display = cm.display, lineNumbers = cm.options.lineNumbers;
	    var container = display.lineDiv, cur = container.firstChild;

	    function rm(node) {
	      var next = node.nextSibling;
	      // Works around a throw-scroll bug in OS X Webkit
	      if (webkit && mac && cm.display.currentWheelTarget == node)
	        node.style.display = "none";
	      else
	        node.parentNode.removeChild(node);
	      return next;
	    }

	    var view = display.view, lineN = display.viewFrom;
	    // Loop over the elements in the view, syncing cur (the DOM nodes
	    // in display.lineDiv) with the view as we go.
	    for (var i = 0; i < view.length; i++) {
	      var lineView = view[i];
	      if (lineView.hidden) {
	      } else if (!lineView.node) { // Not drawn yet
	        var node = buildLineElement(cm, lineView, lineN, dims);
	        container.insertBefore(node, cur);
	      } else { // Already drawn
	        while (cur != lineView.node) cur = rm(cur);
	        var updateNumber = lineNumbers && updateNumbersFrom != null &&
	          updateNumbersFrom <= lineN && lineView.lineNumber;
	        if (lineView.changes) {
	          if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
	          updateLineForChanges(cm, lineView, lineN, dims);
	        }
	        if (updateNumber) {
	          removeChildren(lineView.lineNumber);
	          lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
	        }
	        cur = lineView.node.nextSibling;
	      }
	      lineN += lineView.size;
	    }
	    while (cur) cur = rm(cur);
	  }

	  // When an aspect of a line changes, a string is added to
	  // lineView.changes. This updates the relevant part of the line's
	  // DOM structure.
	  function updateLineForChanges(cm, lineView, lineN, dims) {
	    for (var j = 0; j < lineView.changes.length; j++) {
	      var type = lineView.changes[j];
	      if (type == "text") updateLineText(cm, lineView);
	      else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);
	      else if (type == "class") updateLineClasses(lineView);
	      else if (type == "widget") updateLineWidgets(lineView, dims);
	    }
	    lineView.changes = null;
	  }

	  // Lines with gutter elements, widgets or a background class need to
	  // be wrapped, and have the extra elements added to the wrapper div
	  function ensureLineWrapped(lineView) {
	    if (lineView.node == lineView.text) {
	      lineView.node = elt("div", null, null, "position: relative");
	      if (lineView.text.parentNode)
	        lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
	      lineView.node.appendChild(lineView.text);
	      if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
	    }
	    return lineView.node;
	  }

	  function updateLineBackground(lineView) {
	    var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
	    if (cls) cls += " CodeMirror-linebackground";
	    if (lineView.background) {
	      if (cls) lineView.background.className = cls;
	      else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
	    } else if (cls) {
	      var wrap = ensureLineWrapped(lineView);
	      lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
	    }
	  }

	  // Wrapper around buildLineContent which will reuse the structure
	  // in display.externalMeasured when possible.
	  function getLineContent(cm, lineView) {
	    var ext = cm.display.externalMeasured;
	    if (ext && ext.line == lineView.line) {
	      cm.display.externalMeasured = null;
	      lineView.measure = ext.measure;
	      return ext.built;
	    }
	    return buildLineContent(cm, lineView);
	  }

	  // Redraw the line's text. Interacts with the background and text
	  // classes because the mode may output tokens that influence these
	  // classes.
	  function updateLineText(cm, lineView) {
	    var cls = lineView.text.className;
	    var built = getLineContent(cm, lineView);
	    if (lineView.text == lineView.node) lineView.node = built.pre;
	    lineView.text.parentNode.replaceChild(built.pre, lineView.text);
	    lineView.text = built.pre;
	    if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
	      lineView.bgClass = built.bgClass;
	      lineView.textClass = built.textClass;
	      updateLineClasses(lineView);
	    } else if (cls) {
	      lineView.text.className = cls;
	    }
	  }

	  function updateLineClasses(lineView) {
	    updateLineBackground(lineView);
	    if (lineView.line.wrapClass)
	      ensureLineWrapped(lineView).className = lineView.line.wrapClass;
	    else if (lineView.node != lineView.text)
	      lineView.node.className = "";
	    var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
	    lineView.text.className = textClass || "";
	  }

	  function updateLineGutter(cm, lineView, lineN, dims) {
	    if (lineView.gutter) {
	      lineView.node.removeChild(lineView.gutter);
	      lineView.gutter = null;
	    }
	    var markers = lineView.line.gutterMarkers;
	    if (cm.options.lineNumbers || markers) {
	      var wrap = ensureLineWrapped(lineView);
	      var gutterWrap = lineView.gutter =
	        wrap.insertBefore(elt("div", null, "CodeMirror-gutter-wrapper", "position: absolute; left: " +
	                              (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"),
	                          lineView.text);
	      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
	        lineView.lineNumber = gutterWrap.appendChild(
	          elt("div", lineNumberFor(cm.options, lineN),
	              "CodeMirror-linenumber CodeMirror-gutter-elt",
	              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
	              + cm.display.lineNumInnerWidth + "px"));
	      if (markers) for (var k = 0; k < cm.options.gutters.length; ++k) {
	        var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
	        if (found)
	          gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
	                                     dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
	      }
	    }
	  }

	  function updateLineWidgets(lineView, dims) {
	    if (lineView.alignable) lineView.alignable = null;
	    for (var node = lineView.node.firstChild, next; node; node = next) {
	      var next = node.nextSibling;
	      if (node.className == "CodeMirror-linewidget")
	        lineView.node.removeChild(node);
	    }
	    insertLineWidgets(lineView, dims);
	  }

	  // Build a line's DOM representation from scratch
	  function buildLineElement(cm, lineView, lineN, dims) {
	    var built = getLineContent(cm, lineView);
	    lineView.text = lineView.node = built.pre;
	    if (built.bgClass) lineView.bgClass = built.bgClass;
	    if (built.textClass) lineView.textClass = built.textClass;

	    updateLineClasses(lineView);
	    updateLineGutter(cm, lineView, lineN, dims);
	    insertLineWidgets(lineView, dims);
	    return lineView.node;
	  }

	  // A lineView may contain multiple logical lines (when merged by
	  // collapsed spans). The widgets for all of them need to be drawn.
	  function insertLineWidgets(lineView, dims) {
	    insertLineWidgetsFor(lineView.line, lineView, dims, true);
	    if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
	      insertLineWidgetsFor(lineView.rest[i], lineView, dims, false);
	  }

	  function insertLineWidgetsFor(line, lineView, dims, allowAbove) {
	    if (!line.widgets) return;
	    var wrap = ensureLineWrapped(lineView);
	    for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
	      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
	      if (!widget.handleMouseEvents) node.ignoreEvents = true;
	      positionLineWidget(widget, node, lineView, dims);
	      if (allowAbove && widget.above)
	        wrap.insertBefore(node, lineView.gutter || lineView.text);
	      else
	        wrap.appendChild(node);
	      signalLater(widget, "redraw");
	    }
	  }

	  function positionLineWidget(widget, node, lineView, dims) {
	    if (widget.noHScroll) {
	      (lineView.alignable || (lineView.alignable = [])).push(node);
	      var width = dims.wrapperWidth;
	      node.style.left = dims.fixedPos + "px";
	      if (!widget.coverGutter) {
	        width -= dims.gutterTotalWidth;
	        node.style.paddingLeft = dims.gutterTotalWidth + "px";
	      }
	      node.style.width = width + "px";
	    }
	    if (widget.coverGutter) {
	      node.style.zIndex = 5;
	      node.style.position = "relative";
	      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
	    }
	  }

	  // POSITION OBJECT

	  // A Pos instance represents a position within the text.
	  var Pos = CodeMirror.Pos = function(line, ch) {
	    if (!(this instanceof Pos)) return new Pos(line, ch);
	    this.line = line; this.ch = ch;
	  };

	  // Compare two positions, return 0 if they are the same, a negative
	  // number when a is less, and a positive number otherwise.
	  var cmp = CodeMirror.cmpPos = function(a, b) { return a.line - b.line || a.ch - b.ch; };

	  function copyPos(x) {return Pos(x.line, x.ch);}
	  function maxPos(a, b) { return cmp(a, b) < 0 ? b : a; }
	  function minPos(a, b) { return cmp(a, b) < 0 ? a : b; }

	  // SELECTION / CURSOR

	  // Selection objects are immutable. A new one is created every time
	  // the selection changes. A selection is one or more non-overlapping
	  // (and non-touching) ranges, sorted, and an integer that indicates
	  // which one is the primary selection (the one that's scrolled into
	  // view, that getCursor returns, etc).
	  function Selection(ranges, primIndex) {
	    this.ranges = ranges;
	    this.primIndex = primIndex;
	  }

	  Selection.prototype = {
	    primary: function() { return this.ranges[this.primIndex]; },
	    equals: function(other) {
	      if (other == this) return true;
	      if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;
	      for (var i = 0; i < this.ranges.length; i++) {
	        var here = this.ranges[i], there = other.ranges[i];
	        if (cmp(here.anchor, there.anchor) != 0 || cmp(here.head, there.head) != 0) return false;
	      }
	      return true;
	    },
	    deepCopy: function() {
	      for (var out = [], i = 0; i < this.ranges.length; i++)
	        out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
	      return new Selection(out, this.primIndex);
	    },
	    somethingSelected: function() {
	      for (var i = 0; i < this.ranges.length; i++)
	        if (!this.ranges[i].empty()) return true;
	      return false;
	    },
	    contains: function(pos, end) {
	      if (!end) end = pos;
	      for (var i = 0; i < this.ranges.length; i++) {
	        var range = this.ranges[i];
	        if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0)
	          return i;
	      }
	      return -1;
	    }
	  };

	  function Range(anchor, head) {
	    this.anchor = anchor; this.head = head;
	  }

	  Range.prototype = {
	    from: function() { return minPos(this.anchor, this.head); },
	    to: function() { return maxPos(this.anchor, this.head); },
	    empty: function() {
	      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
	    }
	  };

	  // Take an unsorted, potentially overlapping set of ranges, and
	  // build a selection out of it. 'Consumes' ranges array (modifying
	  // it).
	  function normalizeSelection(ranges, primIndex) {
	    var prim = ranges[primIndex];
	    ranges.sort(function(a, b) { return cmp(a.from(), b.from()); });
	    primIndex = indexOf(ranges, prim);
	    for (var i = 1; i < ranges.length; i++) {
	      var cur = ranges[i], prev = ranges[i - 1];
	      if (cmp(prev.to(), cur.from()) >= 0) {
	        var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
	        var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
	        if (i <= primIndex) --primIndex;
	        ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
	      }
	    }
	    return new Selection(ranges, primIndex);
	  }

	  function simpleSelection(anchor, head) {
	    return new Selection([new Range(anchor, head || anchor)], 0);
	  }

	  // Most of the external API clips given positions to make sure they
	  // actually exist within the document.
	  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
	  function clipPos(doc, pos) {
	    if (pos.line < doc.first) return Pos(doc.first, 0);
	    var last = doc.first + doc.size - 1;
	    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
	    return clipToLen(pos, getLine(doc, pos.line).text.length);
	  }
	  function clipToLen(pos, linelen) {
	    var ch = pos.ch;
	    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
	    else if (ch < 0) return Pos(pos.line, 0);
	    else return pos;
	  }
	  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}
	  function clipPosArray(doc, array) {
	    for (var out = [], i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);
	    return out;
	  }

	  // SELECTION UPDATES

	  // The 'scroll' parameter given to many of these indicated whether
	  // the new cursor position should be scrolled into view after
	  // modifying the selection.

	  // If shift is held or the extend flag is set, extends a range to
	  // include a given position (and optionally a second position).
	  // Otherwise, simply returns the range between the given positions.
	  // Used for cursor motion and such.
	  function extendRange(doc, range, head, other) {
	    if (doc.cm && doc.cm.display.shift || doc.extend) {
	      var anchor = range.anchor;
	      if (other) {
	        var posBefore = cmp(head, anchor) < 0;
	        if (posBefore != (cmp(other, anchor) < 0)) {
	          anchor = head;
	          head = other;
	        } else if (posBefore != (cmp(head, other) < 0)) {
	          head = other;
	        }
	      }
	      return new Range(anchor, head);
	    } else {
	      return new Range(other || head, head);
	    }
	  }

	  // Extend the primary selection range, discard the rest.
	  function extendSelection(doc, head, other, options) {
	    setSelection(doc, new Selection([extendRange(doc, doc.sel.primary(), head, other)], 0), options);
	  }

	  // Extend all selections (pos is an array of selections with length
	  // equal the number of selections)
	  function extendSelections(doc, heads, options) {
	    for (var out = [], i = 0; i < doc.sel.ranges.length; i++)
	      out[i] = extendRange(doc, doc.sel.ranges[i], heads[i], null);
	    var newSel = normalizeSelection(out, doc.sel.primIndex);
	    setSelection(doc, newSel, options);
	  }

	  // Updates a single range in the selection.
	  function replaceOneSelection(doc, i, range, options) {
	    var ranges = doc.sel.ranges.slice(0);
	    ranges[i] = range;
	    setSelection(doc, normalizeSelection(ranges, doc.sel.primIndex), options);
	  }

	  // Reset the selection to a single range.
	  function setSimpleSelection(doc, anchor, head, options) {
	    setSelection(doc, simpleSelection(anchor, head), options);
	  }

	  // Give beforeSelectionChange handlers a change to influence a
	  // selection update.
	  function filterSelectionChange(doc, sel) {
	    var obj = {
	      ranges: sel.ranges,
	      update: function(ranges) {
	        this.ranges = [];
	        for (var i = 0; i < ranges.length; i++)
	          this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor),
	                                     clipPos(doc, ranges[i].head));
	      }
	    };
	    signal(doc, "beforeSelectionChange", doc, obj);
	    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
	    if (obj.ranges != sel.ranges) return normalizeSelection(obj.ranges, obj.ranges.length - 1);
	    else return sel;
	  }

	  function setSelectionReplaceHistory(doc, sel, options) {
	    var done = doc.history.done, last = lst(done);
	    if (last && last.ranges) {
	      done[done.length - 1] = sel;
	      setSelectionNoUndo(doc, sel, options);
	    } else {
	      setSelection(doc, sel, options);
	    }
	  }

	  // Set a new selection.
	  function setSelection(doc, sel, options) {
	    setSelectionNoUndo(doc, sel, options);
	    addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
	  }

	  function setSelectionNoUndo(doc, sel, options) {
	    if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange"))
	      sel = filterSelectionChange(doc, sel);

	    var bias = options && options.bias ||
	      (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
	    setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));

	    if (!(options && options.scroll === false) && doc.cm)
	      ensureCursorVisible(doc.cm);
	  }

	  function setSelectionInner(doc, sel) {
	    if (sel.equals(doc.sel)) return;

	    doc.sel = sel;

	    if (doc.cm) {
	      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = true;
	      signalCursorActivity(doc.cm);
	    }
	    signalLater(doc, "cursorActivity", doc);
	  }

	  // Verify that the selection does not partially select any atomic
	  // marked ranges.
	  function reCheckSelection(doc) {
	    setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false), sel_dontScroll);
	  }

	  // Return a selection that does not partially select any atomic
	  // ranges.
	  function skipAtomicInSelection(doc, sel, bias, mayClear) {
	    var out;
	    for (var i = 0; i < sel.ranges.length; i++) {
	      var range = sel.ranges[i];
	      var newAnchor = skipAtomic(doc, range.anchor, bias, mayClear);
	      var newHead = skipAtomic(doc, range.head, bias, mayClear);
	      if (out || newAnchor != range.anchor || newHead != range.head) {
	        if (!out) out = sel.ranges.slice(0, i);
	        out[i] = new Range(newAnchor, newHead);
	      }
	    }
	    return out ? normalizeSelection(out, sel.primIndex) : sel;
	  }

	  // Ensure a given position is not inside an atomic range.
	  function skipAtomic(doc, pos, bias, mayClear) {
	    var flipped = false, curPos = pos;
	    var dir = bias || 1;
	    doc.cantEdit = false;
	    search: for (;;) {
	      var line = getLine(doc, curPos.line);
	      if (line.markedSpans) {
	        for (var i = 0; i < line.markedSpans.length; ++i) {
	          var sp = line.markedSpans[i], m = sp.marker;
	          if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&
	              (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
	            if (mayClear) {
	              signal(m, "beforeCursorEnter");
	              if (m.explicitlyCleared) {
	                if (!line.markedSpans) break;
	                else {--i; continue;}
	              }
	            }
	            if (!m.atomic) continue;
	            var newPos = m.find(dir < 0 ? -1 : 1);
	            if (cmp(newPos, curPos) == 0) {
	              newPos.ch += dir;
	              if (newPos.ch < 0) {
	                if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));
	                else newPos = null;
	              } else if (newPos.ch > line.text.length) {
	                if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);
	                else newPos = null;
	              }
	              if (!newPos) {
	                if (flipped) {
	                  // Driven in a corner -- no valid cursor position found at all
	                  // -- try again *with* clearing, if we didn't already
	                  if (!mayClear) return skipAtomic(doc, pos, bias, true);
	                  // Otherwise, turn off editing until further notice, and return the start of the doc
	                  doc.cantEdit = true;
	                  return Pos(doc.first, 0);
	                }
	                flipped = true; newPos = pos; dir = -dir;
	              }
	            }
	            curPos = newPos;
	            continue search;
	          }
	        }
	      }
	      return curPos;
	    }
	  }

	  // SELECTION DRAWING

	  // Redraw the selection and/or cursor
	  function drawSelection(cm) {
	    var display = cm.display, doc = cm.doc, result = {};
	    var curFragment = result.cursors = document.createDocumentFragment();
	    var selFragment = result.selection = document.createDocumentFragment();

	    for (var i = 0; i < doc.sel.ranges.length; i++) {
	      var range = doc.sel.ranges[i];
	      var collapsed = range.empty();
	      if (collapsed || cm.options.showCursorWhenSelecting)
	        drawSelectionCursor(cm, range, curFragment);
	      if (!collapsed)
	        drawSelectionRange(cm, range, selFragment);
	    }

	    // Move the hidden textarea near the cursor to prevent scrolling artifacts
	    if (cm.options.moveInputWithCursor) {
	      var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
	      var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
	      result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
	                                          headPos.top + lineOff.top - wrapOff.top));
	      result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
	                                           headPos.left + lineOff.left - wrapOff.left));
	    }

	    return result;
	  }

	  function showSelection(cm, drawn) {
	    removeChildrenAndAdd(cm.display.cursorDiv, drawn.cursors);
	    removeChildrenAndAdd(cm.display.selectionDiv, drawn.selection);
	    if (drawn.teTop != null) {
	      cm.display.inputDiv.style.top = drawn.teTop + "px";
	      cm.display.inputDiv.style.left = drawn.teLeft + "px";
	    }
	  }

	  function updateSelection(cm) {
	    showSelection(cm, drawSelection(cm));
	  }

	  // Draws a cursor for the given range
	  function drawSelectionCursor(cm, range, output) {
	    var pos = cursorCoords(cm, range.head, "div", null, null, !cm.options.singleCursorHeightPerLine);

	    var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
	    cursor.style.left = pos.left + "px";
	    cursor.style.top = pos.top + "px";
	    cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";

	    if (pos.other) {
	      // Secondary cursor, shown when on a 'jump' in bi-directional text
	      var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
	      otherCursor.style.display = "";
	      otherCursor.style.left = pos.other.left + "px";
	      otherCursor.style.top = pos.other.top + "px";
	      otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
	    }
	  }

	  // Draws the given range as a highlighted selection
	  function drawSelectionRange(cm, range, output) {
	    var display = cm.display, doc = cm.doc;
	    var fragment = document.createDocumentFragment();
	    var padding = paddingH(cm.display), leftSide = padding.left, rightSide = display.lineSpace.offsetWidth - padding.right;

	    function add(left, top, width, bottom) {
	      if (top < 0) top = 0;
	      top = Math.round(top);
	      bottom = Math.round(bottom);
	      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
	                               "px; top: " + top + "px; width: " + (width == null ? rightSide - left : width) +
	                               "px; height: " + (bottom - top) + "px"));
	    }

	    function drawForLine(line, fromArg, toArg) {
	      var lineObj = getLine(doc, line);
	      var lineLen = lineObj.text.length;
	      var start, end;
	      function coords(ch, bias) {
	        return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
	      }

	      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
	        var leftPos = coords(from, "left"), rightPos, left, right;
	        if (from == to) {
	          rightPos = leftPos;
	          left = right = leftPos.left;
	        } else {
	          rightPos = coords(to - 1, "right");
	          if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
	          left = leftPos.left;
	          right = rightPos.right;
	        }
	        if (fromArg == null && from == 0) left = leftSide;
	        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
	          add(left, leftPos.top, null, leftPos.bottom);
	          left = leftSide;
	          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
	        }
	        if (toArg == null && to == lineLen) right = rightSide;
	        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
	          start = leftPos;
	        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
	          end = rightPos;
	        if (left < leftSide + 1) left = leftSide;
	        add(left, rightPos.top, right - left, rightPos.bottom);
	      });
	      return {start: start, end: end};
	    }

	    var sFrom = range.from(), sTo = range.to();
	    if (sFrom.line == sTo.line) {
	      drawForLine(sFrom.line, sFrom.ch, sTo.ch);
	    } else {
	      var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
	      var singleVLine = visualLine(fromLine) == visualLine(toLine);
	      var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
	      var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
	      if (singleVLine) {
	        if (leftEnd.top < rightStart.top - 2) {
	          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
	          add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
	        } else {
	          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
	        }
	      }
	      if (leftEnd.bottom < rightStart.top)
	        add(leftSide, leftEnd.bottom, null, rightStart.top);
	    }

	    output.appendChild(fragment);
	  }

	  // Cursor-blinking
	  function restartBlink(cm) {
	    if (!cm.state.focused) return;
	    var display = cm.display;
	    clearInterval(display.blinker);
	    var on = true;
	    display.cursorDiv.style.visibility = "";
	    if (cm.options.cursorBlinkRate > 0)
	      display.blinker = setInterval(function() {
	        display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
	      }, cm.options.cursorBlinkRate);
	    else if (cm.options.cursorBlinkRate < 0)
	      display.cursorDiv.style.visibility = "hidden";
	  }

	  // HIGHLIGHT WORKER

	  function startWorker(cm, time) {
	    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.viewTo)
	      cm.state.highlight.set(time, bind(highlightWorker, cm));
	  }

	  function highlightWorker(cm) {
	    var doc = cm.doc;
	    if (doc.frontier < doc.first) doc.frontier = doc.first;
	    if (doc.frontier >= cm.display.viewTo) return;
	    var end = +new Date + cm.options.workTime;
	    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
	    var changedLines = [];

	    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
	      if (doc.frontier >= cm.display.viewFrom) { // Visible
	        var oldStyles = line.styles;
	        var highlighted = highlightLine(cm, line, state, true);
	        line.styles = highlighted.styles;
	        var oldCls = line.styleClasses, newCls = highlighted.classes;
	        if (newCls) line.styleClasses = newCls;
	        else if (oldCls) line.styleClasses = null;
	        var ischange = !oldStyles || oldStyles.length != line.styles.length ||
	          oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
	        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
	        if (ischange) changedLines.push(doc.frontier);
	        line.stateAfter = copyState(doc.mode, state);
	      } else {
	        processLine(cm, line.text, state);
	        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
	      }
	      ++doc.frontier;
	      if (+new Date > end) {
	        startWorker(cm, cm.options.workDelay);
	        return true;
	      }
	    });
	    if (changedLines.length) runInOp(cm, function() {
	      for (var i = 0; i < changedLines.length; i++)
	        regLineChange(cm, changedLines[i], "text");
	    });
	  }

	  // Finds the line to start with when starting a parse. Tries to
	  // find a line with a stateAfter, so that it can start with a
	  // valid state. If that fails, it returns the line with the
	  // smallest indentation, which tends to need the least context to
	  // parse correctly.
	  function findStartLine(cm, n, precise) {
	    var minindent, minline, doc = cm.doc;
	    var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
	    for (var search = n; search > lim; --search) {
	      if (search <= doc.first) return doc.first;
	      var line = getLine(doc, search - 1);
	      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
	      var indented = countColumn(line.text, null, cm.options.tabSize);
	      if (minline == null || minindent > indented) {
	        minline = search - 1;
	        minindent = indented;
	      }
	    }
	    return minline;
	  }

	  function getStateBefore(cm, n, precise) {
	    var doc = cm.doc, display = cm.display;
	    if (!doc.mode.startState) return true;
	    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
	    if (!state) state = startState(doc.mode);
	    else state = copyState(doc.mode, state);
	    doc.iter(pos, n, function(line) {
	      processLine(cm, line.text, state);
	      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo;
	      line.stateAfter = save ? copyState(doc.mode, state) : null;
	      ++pos;
	    });
	    if (precise) doc.frontier = pos;
	    return state;
	  }

	  // POSITION MEASUREMENT

	  function paddingTop(display) {return display.lineSpace.offsetTop;}
	  function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
	  function paddingH(display) {
	    if (display.cachedPaddingH) return display.cachedPaddingH;
	    var e = removeChildrenAndAdd(display.measure, elt("pre", "x"));
	    var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
	    var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
	    if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
	    return data;
	  }

	  // Ensure the lineView.wrapping.heights array is populated. This is
	  // an array of bottom offsets for the lines that make up a drawn
	  // line. When lineWrapping is on, there might be more than one
	  // height.
	  function ensureLineHeights(cm, lineView, rect) {
	    var wrapping = cm.options.lineWrapping;
	    var curWidth = wrapping && cm.display.scroller.clientWidth;
	    if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
	      var heights = lineView.measure.heights = [];
	      if (wrapping) {
	        lineView.measure.width = curWidth;
	        var rects = lineView.text.firstChild.getClientRects();
	        for (var i = 0; i < rects.length - 1; i++) {
	          var cur = rects[i], next = rects[i + 1];
	          if (Math.abs(cur.bottom - next.bottom) > 2)
	            heights.push((cur.bottom + next.top) / 2 - rect.top);
	        }
	      }
	      heights.push(rect.bottom - rect.top);
	    }
	  }

	  // Find a line map (mapping character offsets to text nodes) and a
	  // measurement cache for the given line number. (A line view might
	  // contain multiple lines when collapsed ranges are present.)
	  function mapFromLineView(lineView, line, lineN) {
	    if (lineView.line == line)
	      return {map: lineView.measure.map, cache: lineView.measure.cache};
	    for (var i = 0; i < lineView.rest.length; i++)
	      if (lineView.rest[i] == line)
	        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i]};
	    for (var i = 0; i < lineView.rest.length; i++)
	      if (lineNo(lineView.rest[i]) > lineN)
	        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i], before: true};
	  }

	  // Render a line into the hidden node display.externalMeasured. Used
	  // when measurement is needed for a line that's not in the viewport.
	  function updateExternalMeasurement(cm, line) {
	    line = visualLine(line);
	    var lineN = lineNo(line);
	    var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
	    view.lineN = lineN;
	    var built = view.built = buildLineContent(cm, view);
	    view.text = built.pre;
	    removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
	    return view;
	  }

	  // Get a {top, bottom, left, right} box (in line-local coordinates)
	  // for a given character.
	  function measureChar(cm, line, ch, bias) {
	    return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
	  }

	  // Find a line view that corresponds to the given line number.
	  function findViewForLine(cm, lineN) {
	    if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
	      return cm.display.view[findViewIndex(cm, lineN)];
	    var ext = cm.display.externalMeasured;
	    if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
	      return ext;
	  }

	  // Measurement can be split in two steps, the set-up work that
	  // applies to the whole line, and the measurement of the actual
	  // character. Functions like coordsChar, that need to do a lot of
	  // measurements in a row, can thus ensure that the set-up work is
	  // only done once.
	  function prepareMeasureForLine(cm, line) {
	    var lineN = lineNo(line);
	    var view = findViewForLine(cm, lineN);
	    if (view && !view.text)
	      view = null;
	    else if (view && view.changes)
	      updateLineForChanges(cm, view, lineN, getDimensions(cm));
	    if (!view)
	      view = updateExternalMeasurement(cm, line);

	    var info = mapFromLineView(view, line, lineN);
	    return {
	      line: line, view: view, rect: null,
	      map: info.map, cache: info.cache, before: info.before,
	      hasHeights: false
	    };
	  }

	  // Given a prepared measurement object, measures the position of an
	  // actual character (or fetches it from the cache).
	  function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
	    if (prepared.before) ch = -1;
	    var key = ch + (bias || ""), found;
	    if (prepared.cache.hasOwnProperty(key)) {
	      found = prepared.cache[key];
	    } else {
	      if (!prepared.rect)
	        prepared.rect = prepared.view.text.getBoundingClientRect();
	      if (!prepared.hasHeights) {
	        ensureLineHeights(cm, prepared.view, prepared.rect);
	        prepared.hasHeights = true;
	      }
	      found = measureCharInner(cm, prepared, ch, bias);
	      if (!found.bogus) prepared.cache[key] = found;
	    }
	    return {left: found.left, right: found.right,
	            top: varHeight ? found.rtop : found.top,
	            bottom: varHeight ? found.rbottom : found.bottom};
	  }

	  var nullRect = {left: 0, right: 0, top: 0, bottom: 0};

	  function measureCharInner(cm, prepared, ch, bias) {
	    var map = prepared.map;

	    var node, start, end, collapse;
	    // First, search the line map for the text node corresponding to,
	    // or closest to, the target character.
	    for (var i = 0; i < map.length; i += 3) {
	      var mStart = map[i], mEnd = map[i + 1];
	      if (ch < mStart) {
	        start = 0; end = 1;
	        collapse = "left";
	      } else if (ch < mEnd) {
	        start = ch - mStart;
	        end = start + 1;
	      } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
	        end = mEnd - mStart;
	        start = end - 1;
	        if (ch >= mEnd) collapse = "right";
	      }
	      if (start != null) {
	        node = map[i + 2];
	        if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right"))
	          collapse = bias;
	        if (bias == "left" && start == 0)
	          while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
	            node = map[(i -= 3) + 2];
	            collapse = "left";
	          }
	        if (bias == "right" && start == mEnd - mStart)
	          while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
	            node = map[(i += 3) + 2];
	            collapse = "right";
	          }
	        break;
	      }
	    }

	    var rect;
	    if (node.nodeType == 3) { // If it is a text node, use a range to retrieve the coordinates.
	      for (var i = 0; i < 4; i++) { // Retry a maximum of 4 times when nonsense rectangles are returned
	        while (start && isExtendingChar(prepared.line.text.charAt(mStart + start))) --start;
	        while (mStart + end < mEnd && isExtendingChar(prepared.line.text.charAt(mStart + end))) ++end;
	        if (ie && ie_version < 9 && start == 0 && end == mEnd - mStart) {
	          rect = node.parentNode.getBoundingClientRect();
	        } else if (ie && cm.options.lineWrapping) {
	          var rects = range(node, start, end).getClientRects();
	          if (rects.length)
	            rect = rects[bias == "right" ? rects.length - 1 : 0];
	          else
	            rect = nullRect;
	        } else {
	          rect = range(node, start, end).getBoundingClientRect() || nullRect;
	        }
	        if (rect.left || rect.right || start == 0) break;
	        end = start;
	        start = start - 1;
	        collapse = "right";
	      }
	      if (ie && ie_version < 11) rect = maybeUpdateRectForZooming(cm.display.measure, rect);
	    } else { // If it is a widget, simply get the box for the whole widget.
	      if (start > 0) collapse = bias = "right";
	      var rects;
	      if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
	        rect = rects[bias == "right" ? rects.length - 1 : 0];
	      else
	        rect = node.getBoundingClientRect();
	    }
	    if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
	      var rSpan = node.parentNode.getClientRects()[0];
	      if (rSpan)
	        rect = {left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom};
	      else
	        rect = nullRect;
	    }

	    var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
	    var mid = (rtop + rbot) / 2;
	    var heights = prepared.view.measure.heights;
	    for (var i = 0; i < heights.length - 1; i++)
	      if (mid < heights[i]) break;
	    var top = i ? heights[i - 1] : 0, bot = heights[i];
	    var result = {left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
	                  right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
	                  top: top, bottom: bot};
	    if (!rect.left && !rect.right) result.bogus = true;
	    if (!cm.options.singleCursorHeightPerLine) { result.rtop = rtop; result.rbottom = rbot; }

	    return result;
	  }

	  // Work around problem with bounding client rects on ranges being
	  // returned incorrectly when zoomed on IE10 and below.
	  function maybeUpdateRectForZooming(measure, rect) {
	    if (!window.screen || screen.logicalXDPI == null ||
	        screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure))
	      return rect;
	    var scaleX = screen.logicalXDPI / screen.deviceXDPI;
	    var scaleY = screen.logicalYDPI / screen.deviceYDPI;
	    return {left: rect.left * scaleX, right: rect.right * scaleX,
	            top: rect.top * scaleY, bottom: rect.bottom * scaleY};
	  }

	  function clearLineMeasurementCacheFor(lineView) {
	    if (lineView.measure) {
	      lineView.measure.cache = {};
	      lineView.measure.heights = null;
	      if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
	        lineView.measure.caches[i] = {};
	    }
	  }

	  function clearLineMeasurementCache(cm) {
	    cm.display.externalMeasure = null;
	    removeChildren(cm.display.lineMeasure);
	    for (var i = 0; i < cm.display.view.length; i++)
	      clearLineMeasurementCacheFor(cm.display.view[i]);
	  }

	  function clearCaches(cm) {
	    clearLineMeasurementCache(cm);
	    cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
	    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
	    cm.display.lineNumChars = null;
	  }

	  function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
	  function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }

	  // Converts a {top, bottom, left, right} box from line-local
	  // coordinates into another coordinate system. Context may be one of
	  // "line", "div" (display.lineDiv), "local"/null (editor), or "page".
	  function intoCoordSystem(cm, lineObj, rect, context) {
	    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
	      var size = widgetHeight(lineObj.widgets[i]);
	      rect.top += size; rect.bottom += size;
	    }
	    if (context == "line") return rect;
	    if (!context) context = "local";
	    var yOff = heightAtLine(lineObj);
	    if (context == "local") yOff += paddingTop(cm.display);
	    else yOff -= cm.display.viewOffset;
	    if (context == "page" || context == "window") {
	      var lOff = cm.display.lineSpace.getBoundingClientRect();
	      yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
	      var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
	      rect.left += xOff; rect.right += xOff;
	    }
	    rect.top += yOff; rect.bottom += yOff;
	    return rect;
	  }

	  // Coverts a box from "div" coords to another coordinate system.
	  // Context may be "window", "page", "div", or "local"/null.
	  function fromCoordSystem(cm, coords, context) {
	    if (context == "div") return coords;
	    var left = coords.left, top = coords.top;
	    // First move into "page" coordinate system
	    if (context == "page") {
	      left -= pageScrollX();
	      top -= pageScrollY();
	    } else if (context == "local" || !context) {
	      var localBox = cm.display.sizer.getBoundingClientRect();
	      left += localBox.left;
	      top += localBox.top;
	    }

	    var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
	    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
	  }

	  function charCoords(cm, pos, context, lineObj, bias) {
	    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
	    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
	  }

	  // Returns a box for a given cursor position, which may have an
	  // 'other' property containing the position of the secondary cursor
	  // on a bidi boundary.
	  function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
	    lineObj = lineObj || getLine(cm.doc, pos.line);
	    if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
	    function get(ch, right) {
	      var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
	      if (right) m.left = m.right; else m.right = m.left;
	      return intoCoordSystem(cm, lineObj, m, context);
	    }
	    function getBidi(ch, partPos) {
	      var part = order[partPos], right = part.level % 2;
	      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
	        part = order[--partPos];
	        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
	        right = true;
	      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
	        part = order[++partPos];
	        ch = bidiLeft(part) - part.level % 2;
	        right = false;
	      }
	      if (right && ch == part.to && ch > part.from) return get(ch - 1);
	      return get(ch, right);
	    }
	    var order = getOrder(lineObj), ch = pos.ch;
	    if (!order) return get(ch);
	    var partPos = getBidiPartAt(order, ch);
	    var val = getBidi(ch, partPos);
	    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
	    return val;
	  }

	  // Used to cheaply estimate the coordinates for a position. Used for
	  // intermediate scroll updates.
	  function estimateCoords(cm, pos) {
	    var left = 0, pos = clipPos(cm.doc, pos);
	    if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
	    var lineObj = getLine(cm.doc, pos.line);
	    var top = heightAtLine(lineObj) + paddingTop(cm.display);
	    return {left: left, right: left, top: top, bottom: top + lineObj.height};
	  }

	  // Positions returned by coordsChar contain some extra information.
	  // xRel is the relative x position of the input coordinates compared
	  // to the found position (so xRel > 0 means the coordinates are to
	  // the right of the character position, for example). When outside
	  // is true, that means the coordinates lie outside the line's
	  // vertical range.
	  function PosWithInfo(line, ch, outside, xRel) {
	    var pos = Pos(line, ch);
	    pos.xRel = xRel;
	    if (outside) pos.outside = true;
	    return pos;
	  }

	  // Compute the character position closest to the given coordinates.
	  // Input must be lineSpace-local ("div" coordinate system).
	  function coordsChar(cm, x, y) {
	    var doc = cm.doc;
	    y += cm.display.viewOffset;
	    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
	    var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
	    if (lineN > last)
	      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
	    if (x < 0) x = 0;

	    var lineObj = getLine(doc, lineN);
	    for (;;) {
	      var found = coordsCharInner(cm, lineObj, lineN, x, y);
	      var merged = collapsedSpanAtEnd(lineObj);
	      var mergedPos = merged && merged.find(0, true);
	      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
	        lineN = lineNo(lineObj = mergedPos.to.line);
	      else
	        return found;
	    }
	  }

	  function coordsCharInner(cm, lineObj, lineNo, x, y) {
	    var innerOff = y - heightAtLine(lineObj);
	    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
	    var preparedMeasure = prepareMeasureForLine(cm, lineObj);

	    function getX(ch) {
	      var sp = cursorCoords(cm, Pos(lineNo, ch), "line", lineObj, preparedMeasure);
	      wrongLine = true;
	      if (innerOff > sp.bottom) return sp.left - adjust;
	      else if (innerOff < sp.top) return sp.left + adjust;
	      else wrongLine = false;
	      return sp.left;
	    }

	    var bidi = getOrder(lineObj), dist = lineObj.text.length;
	    var from = lineLeft(lineObj), to = lineRight(lineObj);
	    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

	    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
	    // Do a binary search between these bounds.
	    for (;;) {
	      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
	        var ch = x < fromX || x - fromX <= toX - x ? from : to;
	        var xDiff = x - (ch == from ? fromX : toX);
	        while (isExtendingChar(lineObj.text.charAt(ch))) ++ch;
	        var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
	                              xDiff < -1 ? -1 : xDiff > 1 ? 1 : 0);
	        return pos;
	      }
	      var step = Math.ceil(dist / 2), middle = from + step;
	      if (bidi) {
	        middle = from;
	        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
	      }
	      var middleX = getX(middle);
	      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
	      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
	    }
	  }

	  var measureText;
	  // Compute the default text height.
	  function textHeight(display) {
	    if (display.cachedTextHeight != null) return display.cachedTextHeight;
	    if (measureText == null) {
	      measureText = elt("pre");
	      // Measure a bunch of lines, for browsers that compute
	      // fractional heights.
	      for (var i = 0; i < 49; ++i) {
	        measureText.appendChild(document.createTextNode("x"));
	        measureText.appendChild(elt("br"));
	      }
	      measureText.appendChild(document.createTextNode("x"));
	    }
	    removeChildrenAndAdd(display.measure, measureText);
	    var height = measureText.offsetHeight / 50;
	    if (height > 3) display.cachedTextHeight = height;
	    removeChildren(display.measure);
	    return height || 1;
	  }

	  // Compute the default character width.
	  function charWidth(display) {
	    if (display.cachedCharWidth != null) return display.cachedCharWidth;
	    var anchor = elt("span", "xxxxxxxxxx");
	    var pre = elt("pre", [anchor]);
	    removeChildrenAndAdd(display.measure, pre);
	    var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
	    if (width > 2) display.cachedCharWidth = width;
	    return width || 10;
	  }

	  // OPERATIONS

	  // Operations are used to wrap a series of changes to the editor
	  // state in such a way that each change won't have to update the
	  // cursor and display (which would be awkward, slow, and
	  // error-prone). Instead, display updates are batched and then all
	  // combined and executed at once.

	  var operationGroup = null;

	  var nextOpId = 0;
	  // Start a new operation.
	  function startOperation(cm) {
	    cm.curOp = {
	      cm: cm,
	      viewChanged: false,      // Flag that indicates that lines might need to be redrawn
	      startHeight: cm.doc.height, // Used to detect need to update scrollbar
	      forceUpdate: false,      // Used to force a redraw
	      updateInput: null,       // Whether to reset the input textarea
	      typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
	      changeObjs: null,        // Accumulated changes, for firing change events
	      cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
	      cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
	      selectionChanged: false, // Whether the selection needs to be redrawn
	      updateMaxLine: false,    // Set when the widest line needs to be determined anew
	      scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
	      scrollToPos: null,       // Used to scroll to a specific position
	      id: ++nextOpId           // Unique ID
	    };
	    if (operationGroup) {
	      operationGroup.ops.push(cm.curOp);
	    } else {
	      cm.curOp.ownsGroup = operationGroup = {
	        ops: [cm.curOp],
	        delayedCallbacks: []
	      };
	    }
	  }

	  function fireCallbacksForOps(group) {
	    // Calls delayed callbacks and cursorActivity handlers until no
	    // new ones appear
	    var callbacks = group.delayedCallbacks, i = 0;
	    do {
	      for (; i < callbacks.length; i++)
	        callbacks[i]();
	      for (var j = 0; j < group.ops.length; j++) {
	        var op = group.ops[j];
	        if (op.cursorActivityHandlers)
	          while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
	            op.cursorActivityHandlers[op.cursorActivityCalled++](op.cm);
	      }
	    } while (i < callbacks.length);
	  }

	  // Finish an operation, updating the display and signalling delayed events
	  function endOperation(cm) {
	    var op = cm.curOp, group = op.ownsGroup;
	    if (!group) return;

	    try { fireCallbacksForOps(group); }
	    finally {
	      operationGroup = null;
	      for (var i = 0; i < group.ops.length; i++)
	        group.ops[i].cm.curOp = null;
	      endOperations(group);
	    }
	  }

	  // The DOM updates done when an operation finishes are batched so
	  // that the minimum number of relayouts are required.
	  function endOperations(group) {
	    var ops = group.ops;
	    for (var i = 0; i < ops.length; i++) // Read DOM
	      endOperation_R1(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
	      endOperation_W1(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Read DOM
	      endOperation_R2(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
	      endOperation_W2(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Read DOM
	      endOperation_finish(ops[i]);
	  }

	  function endOperation_R1(op) {
	    var cm = op.cm, display = cm.display;
	    if (op.updateMaxLine) findMaxLine(cm);

	    op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
	      op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
	                         op.scrollToPos.to.line >= display.viewTo) ||
	      display.maxLineChanged && cm.options.lineWrapping;
	    op.update = op.mustUpdate &&
	      new DisplayUpdate(cm, op.mustUpdate && {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
	  }

	  function endOperation_W1(op) {
	    op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
	  }

	  function endOperation_R2(op) {
	    var cm = op.cm, display = cm.display;
	    if (op.updatedDisplay) updateHeightsInViewport(cm);

	    op.barMeasure = measureForScrollbars(cm);

	    // If the max line changed since it was last measured, measure it,
	    // and ensure the document's width matches it.
	    // updateDisplay_W2 will use these properties to do the actual resizing
	    if (display.maxLineChanged && !cm.options.lineWrapping) {
	      op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
	      op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo +
	                                  scrollerCutOff - display.scroller.clientWidth);
	    }

	    if (op.updatedDisplay || op.selectionChanged)
	      op.newSelectionNodes = drawSelection(cm);
	  }

	  function endOperation_W2(op) {
	    var cm = op.cm;

	    if (op.adjustWidthTo != null) {
	      cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
	      if (op.maxScrollLeft < cm.doc.scrollLeft)
	        setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
	      cm.display.maxLineChanged = false;
	    }

	    if (op.newSelectionNodes)
	      showSelection(cm, op.newSelectionNodes);
	    if (op.updatedDisplay)
	      setDocumentHeight(cm, op.barMeasure);
	    if (op.updatedDisplay || op.startHeight != cm.doc.height)
	      updateScrollbars(cm, op.barMeasure);

	    if (op.selectionChanged) restartBlink(cm);

	    if (cm.state.focused && op.updateInput)
	      resetInput(cm, op.typing);
	  }

	  function endOperation_finish(op) {
	    var cm = op.cm, display = cm.display, doc = cm.doc;

	    if (op.adjustWidthTo != null && Math.abs(op.barMeasure.scrollWidth - cm.display.scroller.scrollWidth) > 1)
	      updateScrollbars(cm);

	    if (op.updatedDisplay) postUpdateDisplay(cm, op.update);

	    // Abort mouse wheel delta measurement, when scrolling explicitly
	    if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
	      display.wheelStartX = display.wheelStartY = null;

	    // Propagate the scroll position to the actual DOM scroller
	    if (op.scrollTop != null && (display.scroller.scrollTop != op.scrollTop || op.forceScroll)) {
	      var top = Math.max(0, Math.min(display.scroller.scrollHeight - display.scroller.clientHeight, op.scrollTop));
	      display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = top;
	    }
	    if (op.scrollLeft != null && (display.scroller.scrollLeft != op.scrollLeft || op.forceScroll)) {
	      var left = Math.max(0, Math.min(display.scroller.scrollWidth - display.scroller.clientWidth, op.scrollLeft));
	      display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = left;
	      alignHorizontally(cm);
	    }
	    // If we need to scroll a specific position into view, do so.
	    if (op.scrollToPos) {
	      var coords = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from),
	                                     clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
	      if (op.scrollToPos.isCursor && cm.state.focused) maybeScrollWindow(cm, coords);
	    }

	    // Fire events for markers that are hidden/unidden by editing or
	    // undoing
	    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
	    if (hidden) for (var i = 0; i < hidden.length; ++i)
	      if (!hidden[i].lines.length) signal(hidden[i], "hide");
	    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
	      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");

	    if (display.wrapper.offsetHeight)
	      doc.scrollTop = cm.display.scroller.scrollTop;

	    // Apply workaround for two webkit bugs
	    if (op.updatedDisplay && webkit) {
	      if (cm.options.lineWrapping)
	        checkForWebkitWidthBug(cm, op.barMeasure); // (Issue #2420)
	      if (op.barMeasure.scrollWidth > op.barMeasure.clientWidth &&
	          op.barMeasure.scrollWidth < op.barMeasure.clientWidth + 1 &&
	          !hScrollbarTakesSpace(cm))
	        updateScrollbars(cm); // (Issue #2562)
	    }

	    // Fire change events, and delayed event handlers
	    if (op.changeObjs)
	      signal(cm, "changes", cm, op.changeObjs);
	  }

	  // Run the given function in an operation
	  function runInOp(cm, f) {
	    if (cm.curOp) return f();
	    startOperation(cm);
	    try { return f(); }
	    finally { endOperation(cm); }
	  }
	  // Wraps a function in an operation. Returns the wrapped function.
	  function operation(cm, f) {
	    return function() {
	      if (cm.curOp) return f.apply(cm, arguments);
	      startOperation(cm);
	      try { return f.apply(cm, arguments); }
	      finally { endOperation(cm); }
	    };
	  }
	  // Used to add methods to editor and doc instances, wrapping them in
	  // operations.
	  function methodOp(f) {
	    return function() {
	      if (this.curOp) return f.apply(this, arguments);
	      startOperation(this);
	      try { return f.apply(this, arguments); }
	      finally { endOperation(this); }
	    };
	  }
	  function docMethodOp(f) {
	    return function() {
	      var cm = this.cm;
	      if (!cm || cm.curOp) return f.apply(this, arguments);
	      startOperation(cm);
	      try { return f.apply(this, arguments); }
	      finally { endOperation(cm); }
	    };
	  }

	  // VIEW TRACKING

	  // These objects are used to represent the visible (currently drawn)
	  // part of the document. A LineView may correspond to multiple
	  // logical lines, if those are connected by collapsed ranges.
	  function LineView(doc, line, lineN) {
	    // The starting line
	    this.line = line;
	    // Continuing lines, if any
	    this.rest = visualLineContinued(line);
	    // Number of logical lines in this visual line
	    this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
	    this.node = this.text = null;
	    this.hidden = lineIsHidden(doc, line);
	  }

	  // Create a range of LineView objects for the given lines.
	  function buildViewArray(cm, from, to) {
	    var array = [], nextPos;
	    for (var pos = from; pos < to; pos = nextPos) {
	      var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
	      nextPos = pos + view.size;
	      array.push(view);
	    }
	    return array;
	  }

	  // Updates the display.view data structure for a given change to the
	  // document. From and to are in pre-change coordinates. Lendiff is
	  // the amount of lines added or subtracted by the change. This is
	  // used for changes that span multiple lines, or change the way
	  // lines are divided into visual lines. regLineChange (below)
	  // registers single-line changes.
	  function regChange(cm, from, to, lendiff) {
	    if (from == null) from = cm.doc.first;
	    if (to == null) to = cm.doc.first + cm.doc.size;
	    if (!lendiff) lendiff = 0;

	    var display = cm.display;
	    if (lendiff && to < display.viewTo &&
	        (display.updateLineNumbers == null || display.updateLineNumbers > from))
	      display.updateLineNumbers = from;

	    cm.curOp.viewChanged = true;

	    if (from >= display.viewTo) { // Change after
	      if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo)
	        resetView(cm);
	    } else if (to <= display.viewFrom) { // Change before
	      if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
	        resetView(cm);
	      } else {
	        display.viewFrom += lendiff;
	        display.viewTo += lendiff;
	      }
	    } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
	      resetView(cm);
	    } else if (from <= display.viewFrom) { // Top overlap
	      var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
	      if (cut) {
	        display.view = display.view.slice(cut.index);
	        display.viewFrom = cut.lineN;
	        display.viewTo += lendiff;
	      } else {
	        resetView(cm);
	      }
	    } else if (to >= display.viewTo) { // Bottom overlap
	      var cut = viewCuttingPoint(cm, from, from, -1);
	      if (cut) {
	        display.view = display.view.slice(0, cut.index);
	        display.viewTo = cut.lineN;
	      } else {
	        resetView(cm);
	      }
	    } else { // Gap in the middle
	      var cutTop = viewCuttingPoint(cm, from, from, -1);
	      var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
	      if (cutTop && cutBot) {
	        display.view = display.view.slice(0, cutTop.index)
	          .concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN))
	          .concat(display.view.slice(cutBot.index));
	        display.viewTo += lendiff;
	      } else {
	        resetView(cm);
	      }
	    }

	    var ext = display.externalMeasured;
	    if (ext) {
	      if (to < ext.lineN)
	        ext.lineN += lendiff;
	      else if (from < ext.lineN + ext.size)
	        display.externalMeasured = null;
	    }
	  }

	  // Register a change to a single line. Type must be one of "text",
	  // "gutter", "class", "widget"
	  function regLineChange(cm, line, type) {
	    cm.curOp.viewChanged = true;
	    var display = cm.display, ext = cm.display.externalMeasured;
	    if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
	      display.externalMeasured = null;

	    if (line < display.viewFrom || line >= display.viewTo) return;
	    var lineView = display.view[findViewIndex(cm, line)];
	    if (lineView.node == null) return;
	    var arr = lineView.changes || (lineView.changes = []);
	    if (indexOf(arr, type) == -1) arr.push(type);
	  }

	  // Clear the view.
	  function resetView(cm) {
	    cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
	    cm.display.view = [];
	    cm.display.viewOffset = 0;
	  }

	  // Find the view element corresponding to a given line. Return null
	  // when the line isn't visible.
	  function findViewIndex(cm, n) {
	    if (n >= cm.display.viewTo) return null;
	    n -= cm.display.viewFrom;
	    if (n < 0) return null;
	    var view = cm.display.view;
	    for (var i = 0; i < view.length; i++) {
	      n -= view[i].size;
	      if (n < 0) return i;
	    }
	  }

	  function viewCuttingPoint(cm, oldN, newN, dir) {
	    var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
	    if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
	      return {index: index, lineN: newN};
	    for (var i = 0, n = cm.display.viewFrom; i < index; i++)
	      n += view[i].size;
	    if (n != oldN) {
	      if (dir > 0) {
	        if (index == view.length - 1) return null;
	        diff = (n + view[index].size) - oldN;
	        index++;
	      } else {
	        diff = n - oldN;
	      }
	      oldN += diff; newN += diff;
	    }
	    while (visualLineNo(cm.doc, newN) != newN) {
	      if (index == (dir < 0 ? 0 : view.length - 1)) return null;
	      newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
	      index += dir;
	    }
	    return {index: index, lineN: newN};
	  }

	  // Force the view to cover a given range, adding empty view element
	  // or clipping off existing ones as needed.
	  function adjustView(cm, from, to) {
	    var display = cm.display, view = display.view;
	    if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
	      display.view = buildViewArray(cm, from, to);
	      display.viewFrom = from;
	    } else {
	      if (display.viewFrom > from)
	        display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
	      else if (display.viewFrom < from)
	        display.view = display.view.slice(findViewIndex(cm, from));
	      display.viewFrom = from;
	      if (display.viewTo < to)
	        display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
	      else if (display.viewTo > to)
	        display.view = display.view.slice(0, findViewIndex(cm, to));
	    }
	    display.viewTo = to;
	  }

	  // Count the number of lines in the view whose DOM representation is
	  // out of date (or nonexistent).
	  function countDirtyView(cm) {
	    var view = cm.display.view, dirty = 0;
	    for (var i = 0; i < view.length; i++) {
	      var lineView = view[i];
	      if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
	    }
	    return dirty;
	  }

	  // INPUT HANDLING

	  // Poll for input changes, using the normal rate of polling. This
	  // runs as long as the editor is focused.
	  function slowPoll(cm) {
	    if (cm.display.pollingFast) return;
	    cm.display.poll.set(cm.options.pollInterval, function() {
	      readInput(cm);
	      if (cm.state.focused) slowPoll(cm);
	    });
	  }

	  // When an event has just come in that is likely to add or change
	  // something in the input textarea, we poll faster, to ensure that
	  // the change appears on the screen quickly.
	  function fastPoll(cm) {
	    var missed = false;
	    cm.display.pollingFast = true;
	    function p() {
	      var changed = readInput(cm);
	      if (!changed && !missed) {missed = true; cm.display.poll.set(60, p);}
	      else {cm.display.pollingFast = false; slowPoll(cm);}
	    }
	    cm.display.poll.set(20, p);
	  }

	  // This will be set to an array of strings when copying, so that,
	  // when pasting, we know what kind of selections the copied text
	  // was made out of.
	  var lastCopied = null;

	  // Read input from the textarea, and update the document to match.
	  // When something is selected, it is present in the textarea, and
	  // selected (unless it is huge, in which case a placeholder is
	  // used). When nothing is selected, the cursor sits after previously
	  // seen text (can be empty), which is stored in prevInput (we must
	  // not reset the textarea when typing, because that breaks IME).
	  function readInput(cm) {
	    var input = cm.display.input, prevInput = cm.display.prevInput, doc = cm.doc;
	    // Since this is called a *lot*, try to bail out as cheaply as
	    // possible when it is clear that nothing happened. hasSelection
	    // will be the case when there is a lot of text in the textarea,
	    // in which case reading its value would be expensive.
	    if (!cm.state.focused || (hasSelection(input) && !prevInput) || isReadOnly(cm) || cm.options.disableInput)
	      return false;
	    // See paste handler for more on the fakedLastChar kludge
	    if (cm.state.pasteIncoming && cm.state.fakedLastChar) {
	      input.value = input.value.substring(0, input.value.length - 1);
	      cm.state.fakedLastChar = false;
	    }
	    var text = input.value;
	    // If nothing changed, bail.
	    if (text == prevInput && !cm.somethingSelected()) return false;
	    // Work around nonsensical selection resetting in IE9/10, and
	    // inexplicable appearance of private area unicode characters on
	    // some key combos in Mac (#2689).
	    if (ie && ie_version >= 9 && cm.display.inputHasSelection === text ||
	        mac && /[\uf700-\uf7ff]/.test(text)) {
	      resetInput(cm);
	      return false;
	    }

	    var withOp = !cm.curOp;
	    if (withOp) startOperation(cm);
	    cm.display.shift = false;

	    if (text.charCodeAt(0) == 0x200b && doc.sel == cm.display.selForContextMenu && !prevInput)
	      prevInput = "\u200b";
	    // Find the part of the input that is actually new
	    var same = 0, l = Math.min(prevInput.length, text.length);
	    while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;
	    var inserted = text.slice(same), textLines = splitLines(inserted);

	    // When pasing N lines into N selections, insert one line per selection
	    var multiPaste = null;
	    if (cm.state.pasteIncoming && doc.sel.ranges.length > 1) {
	      if (lastCopied && lastCopied.join("\n") == inserted)
	        multiPaste = doc.sel.ranges.length % lastCopied.length == 0 && map(lastCopied, splitLines);
	      else if (textLines.length == doc.sel.ranges.length)
	        multiPaste = map(textLines, function(l) { return [l]; });
	    }

	    // Normal behavior is to insert the new text into every selection
	    for (var i = doc.sel.ranges.length - 1; i >= 0; i--) {
	      var range = doc.sel.ranges[i];
	      var from = range.from(), to = range.to();
	      // Handle deletion
	      if (same < prevInput.length)
	        from = Pos(from.line, from.ch - (prevInput.length - same));
	      // Handle overwrite
	      else if (cm.state.overwrite && range.empty() && !cm.state.pasteIncoming)
	        to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
	      var updateInput = cm.curOp.updateInput;
	      var changeEvent = {from: from, to: to, text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
	                         origin: cm.state.pasteIncoming ? "paste" : cm.state.cutIncoming ? "cut" : "+input"};
	      makeChange(cm.doc, changeEvent);
	      signalLater(cm, "inputRead", cm, changeEvent);
	      // When an 'electric' character is inserted, immediately trigger a reindent
	      if (inserted && !cm.state.pasteIncoming && cm.options.electricChars &&
	          cm.options.smartIndent && range.head.ch < 100 &&
	          (!i || doc.sel.ranges[i - 1].head.line != range.head.line)) {
	        var mode = cm.getModeAt(range.head);
	        var end = changeEnd(changeEvent);
	        if (mode.electricChars) {
	          for (var j = 0; j < mode.electricChars.length; j++)
	            if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
	              indentLine(cm, end.line, "smart");
	              break;
	            }
	        } else if (mode.electricInput) {
	          if (mode.electricInput.test(getLine(doc, end.line).text.slice(0, end.ch)))
	            indentLine(cm, end.line, "smart");
	        }
	      }
	    }
	    ensureCursorVisible(cm);
	    cm.curOp.updateInput = updateInput;
	    cm.curOp.typing = true;

	    // Don't leave long text in the textarea, since it makes further polling slow
	    if (text.length > 1000 || text.indexOf("\n") > -1) input.value = cm.display.prevInput = "";
	    else cm.display.prevInput = text;
	    if (withOp) endOperation(cm);
	    cm.state.pasteIncoming = cm.state.cutIncoming = false;
	    return true;
	  }

	  // Reset the input to correspond to the selection (or to be empty,
	  // when not typing and nothing is selected)
	  function resetInput(cm, typing) {
	    var minimal, selected, doc = cm.doc;
	    if (cm.somethingSelected()) {
	      cm.display.prevInput = "";
	      var range = doc.sel.primary();
	      minimal = hasCopyEvent &&
	        (range.to().line - range.from().line > 100 || (selected = cm.getSelection()).length > 1000);
	      var content = minimal ? "-" : selected || cm.getSelection();
	      cm.display.input.value = content;
	      if (cm.state.focused) selectInput(cm.display.input);
	      if (ie && ie_version >= 9) cm.display.inputHasSelection = content;
	    } else if (!typing) {
	      cm.display.prevInput = cm.display.input.value = "";
	      if (ie && ie_version >= 9) cm.display.inputHasSelection = null;
	    }
	    cm.display.inaccurateSelection = minimal;
	  }

	  function focusInput(cm) {
	    if (cm.options.readOnly != "nocursor" && (!mobile || activeElt() != cm.display.input))
	      cm.display.input.focus();
	  }

	  function ensureFocus(cm) {
	    if (!cm.state.focused) { focusInput(cm); onFocus(cm); }
	  }

	  function isReadOnly(cm) {
	    return cm.options.readOnly || cm.doc.cantEdit;
	  }

	  // EVENT HANDLERS

	  // Attach the necessary event handlers when initializing the editor
	  function registerEventHandlers(cm) {
	    var d = cm.display;
	    on(d.scroller, "mousedown", operation(cm, onMouseDown));
	    // Older IE's will not fire a second mousedown for a double click
	    if (ie && ie_version < 11)
	      on(d.scroller, "dblclick", operation(cm, function(e) {
	        if (signalDOMEvent(cm, e)) return;
	        var pos = posFromMouse(cm, e);
	        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
	        e_preventDefault(e);
	        var word = cm.findWordAt(pos);
	        extendSelection(cm.doc, word.anchor, word.head);
	      }));
	    else
	      on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
	    // Prevent normal selection in the editor (we handle our own)
	    on(d.lineSpace, "selectstart", function(e) {
	      if (!eventInWidget(d, e)) e_preventDefault(e);
	    });
	    // Some browsers fire contextmenu *after* opening the menu, at
	    // which point we can't mess with it anymore. Context menu is
	    // handled in onMouseDown for these browsers.
	    if (!captureRightClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});

	    // Sync scrolling between fake scrollbars and real scrollable
	    // area, ensure viewport is updated when scrolling.
	    on(d.scroller, "scroll", function() {
	      if (d.scroller.clientHeight) {
	        setScrollTop(cm, d.scroller.scrollTop);
	        setScrollLeft(cm, d.scroller.scrollLeft, true);
	        signal(cm, "scroll", cm);
	      }
	    });
	    on(d.scrollbarV, "scroll", function() {
	      if (d.scroller.clientHeight) setScrollTop(cm, d.scrollbarV.scrollTop);
	    });
	    on(d.scrollbarH, "scroll", function() {
	      if (d.scroller.clientHeight) setScrollLeft(cm, d.scrollbarH.scrollLeft);
	    });

	    // Listen to wheel events in order to try and update the viewport on time.
	    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
	    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});

	    // Prevent clicks in the scrollbars from killing focus
	    function reFocus() { if (cm.state.focused) setTimeout(bind(focusInput, cm), 0); }
	    on(d.scrollbarH, "mousedown", reFocus);
	    on(d.scrollbarV, "mousedown", reFocus);
	    // Prevent wrapper from ever scrolling
	    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });

	    on(d.input, "keyup", function(e) { onKeyUp.call(cm, e); });
	    on(d.input, "input", function() {
	      if (ie && ie_version >= 9 && cm.display.inputHasSelection) cm.display.inputHasSelection = null;
	      fastPoll(cm);
	    });
	    on(d.input, "keydown", operation(cm, onKeyDown));
	    on(d.input, "keypress", operation(cm, onKeyPress));
	    on(d.input, "focus", bind(onFocus, cm));
	    on(d.input, "blur", bind(onBlur, cm));

	    function drag_(e) {
	      if (!signalDOMEvent(cm, e)) e_stop(e);
	    }
	    if (cm.options.dragDrop) {
	      on(d.scroller, "dragstart", function(e){onDragStart(cm, e);});
	      on(d.scroller, "dragenter", drag_);
	      on(d.scroller, "dragover", drag_);
	      on(d.scroller, "drop", operation(cm, onDrop));
	    }
	    on(d.scroller, "paste", function(e) {
	      if (eventInWidget(d, e)) return;
	      cm.state.pasteIncoming = true;
	      focusInput(cm);
	      fastPoll(cm);
	    });
	    on(d.input, "paste", function() {
	      // Workaround for webkit bug https://bugs.webkit.org/show_bug.cgi?id=90206
	      // Add a char to the end of textarea before paste occur so that
	      // selection doesn't span to the end of textarea.
	      if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
	        var start = d.input.selectionStart, end = d.input.selectionEnd;
	        d.input.value += "$";
	        // The selection end needs to be set before the start, otherwise there
	        // can be an intermediate non-empty selection between the two, which
	        // can override the middle-click paste buffer on linux and cause the
	        // wrong thing to get pasted.
	        d.input.selectionEnd = end;
	        d.input.selectionStart = start;
	        cm.state.fakedLastChar = true;
	      }
	      cm.state.pasteIncoming = true;
	      fastPoll(cm);
	    });

	    function prepareCopyCut(e) {
	      if (cm.somethingSelected()) {
	        lastCopied = cm.getSelections();
	        if (d.inaccurateSelection) {
	          d.prevInput = "";
	          d.inaccurateSelection = false;
	          d.input.value = lastCopied.join("\n");
	          selectInput(d.input);
	        }
	      } else {
	        var text = [], ranges = [];
	        for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
	          var line = cm.doc.sel.ranges[i].head.line;
	          var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
	          ranges.push(lineRange);
	          text.push(cm.getRange(lineRange.anchor, lineRange.head));
	        }
	        if (e.type == "cut") {
	          cm.setSelections(ranges, null, sel_dontScroll);
	        } else {
	          d.prevInput = "";
	          d.input.value = text.join("\n");
	          selectInput(d.input);
	        }
	        lastCopied = text;
	      }
	      if (e.type == "cut") cm.state.cutIncoming = true;
	    }
	    on(d.input, "cut", prepareCopyCut);
	    on(d.input, "copy", prepareCopyCut);

	    // Needed to handle Tab key in KHTML
	    if (khtml) on(d.sizer, "mouseup", function() {
	      if (activeElt() == d.input) d.input.blur();
	      focusInput(cm);
	    });
	  }

	  // Called when the window resizes
	  function onResize(cm) {
	    // Might be a text scaling operation, clear size caches.
	    var d = cm.display;
	    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
	    cm.setSize();
	  }

	  // MOUSE EVENTS

	  // Return true when the given mouse event happened in a widget
	  function eventInWidget(display, e) {
	    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
	      if (!n || n.ignoreEvents || n.parentNode == display.sizer && n != display.mover) return true;
	    }
	  }

	  // Given a mouse event, find the corresponding position. If liberal
	  // is false, it checks whether a gutter or scrollbar was clicked,
	  // and returns null if it was. forRect is used by rectangular
	  // selections, and tries to estimate a character position even for
	  // coordinates beyond the right of the text.
	  function posFromMouse(cm, e, liberal, forRect) {
	    var display = cm.display;
	    if (!liberal) {
	      var target = e_target(e);
	      if (target == display.scrollbarH || target == display.scrollbarV ||
	          target == display.scrollbarFiller || target == display.gutterFiller) return null;
	    }
	    var x, y, space = display.lineSpace.getBoundingClientRect();
	    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
	    try { x = e.clientX - space.left; y = e.clientY - space.top; }
	    catch (e) { return null; }
	    var coords = coordsChar(cm, x, y), line;
	    if (forRect && coords.xRel == 1 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
	      var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
	      coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
	    }
	    return coords;
	  }

	  // A mouse down can be a single click, double click, triple click,
	  // start of selection drag, start of text drag, new cursor
	  // (ctrl-click), rectangle drag (alt-drag), or xwin
	  // middle-click-paste. Or it might be a click on something we should
	  // not interfere with, such as a scrollbar or widget.
	  function onMouseDown(e) {
	    if (signalDOMEvent(this, e)) return;
	    var cm = this, display = cm.display;
	    display.shift = e.shiftKey;

	    if (eventInWidget(display, e)) {
	      if (!webkit) {
	        // Briefly turn off draggability, to allow widgets to do
	        // normal dragging things.
	        display.scroller.draggable = false;
	        setTimeout(function(){display.scroller.draggable = true;}, 100);
	      }
	      return;
	    }
	    if (clickInGutter(cm, e)) return;
	    var start = posFromMouse(cm, e);
	    window.focus();

	    switch (e_button(e)) {
	    case 1:
	      if (start)
	        leftButtonDown(cm, e, start);
	      else if (e_target(e) == display.scroller)
	        e_preventDefault(e);
	      break;
	    case 2:
	      if (webkit) cm.state.lastMiddleDown = +new Date;
	      if (start) extendSelection(cm.doc, start);
	      setTimeout(bind(focusInput, cm), 20);
	      e_preventDefault(e);
	      break;
	    case 3:
	      if (captureRightClick) onContextMenu(cm, e);
	      break;
	    }
	  }

	  var lastClick, lastDoubleClick;
	  function leftButtonDown(cm, e, start) {
	    setTimeout(bind(ensureFocus, cm), 0);

	    var now = +new Date, type;
	    if (lastDoubleClick && lastDoubleClick.time > now - 400 && cmp(lastDoubleClick.pos, start) == 0) {
	      type = "triple";
	    } else if (lastClick && lastClick.time > now - 400 && cmp(lastClick.pos, start) == 0) {
	      type = "double";
	      lastDoubleClick = {time: now, pos: start};
	    } else {
	      type = "single";
	      lastClick = {time: now, pos: start};
	    }

	    var sel = cm.doc.sel, modifier = mac ? e.metaKey : e.ctrlKey;
	    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) &&
	        type == "single" && sel.contains(start) > -1 && sel.somethingSelected())
	      leftButtonStartDrag(cm, e, start, modifier);
	    else
	      leftButtonSelect(cm, e, start, type, modifier);
	  }

	  // Start a text drag. When it ends, see if any dragging actually
	  // happen, and treat as a click if it didn't.
	  function leftButtonStartDrag(cm, e, start, modifier) {
	    var display = cm.display;
	    var dragEnd = operation(cm, function(e2) {
	      if (webkit) display.scroller.draggable = false;
	      cm.state.draggingText = false;
	      off(document, "mouseup", dragEnd);
	      off(display.scroller, "drop", dragEnd);
	      if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
	        e_preventDefault(e2);
	        if (!modifier)
	          extendSelection(cm.doc, start);
	        focusInput(cm);
	        // Work around unexplainable focus problem in IE9 (#2127)
	        if (ie && ie_version == 9)
	          setTimeout(function() {document.body.focus(); focusInput(cm);}, 20);
	      }
	    });
	    // Let the drag handler handle this.
	    if (webkit) display.scroller.draggable = true;
	    cm.state.draggingText = dragEnd;
	    // IE's approach to draggable
	    if (display.scroller.dragDrop) display.scroller.dragDrop();
	    on(document, "mouseup", dragEnd);
	    on(display.scroller, "drop", dragEnd);
	  }

	  // Normal selection, as opposed to text dragging.
	  function leftButtonSelect(cm, e, start, type, addNew) {
	    var display = cm.display, doc = cm.doc;
	    e_preventDefault(e);

	    var ourRange, ourIndex, startSel = doc.sel;
	    if (addNew && !e.shiftKey) {
	      ourIndex = doc.sel.contains(start);
	      if (ourIndex > -1)
	        ourRange = doc.sel.ranges[ourIndex];
	      else
	        ourRange = new Range(start, start);
	    } else {
	      ourRange = doc.sel.primary();
	    }

	    if (e.altKey) {
	      type = "rect";
	      if (!addNew) ourRange = new Range(start, start);
	      start = posFromMouse(cm, e, true, true);
	      ourIndex = -1;
	    } else if (type == "double") {
	      var word = cm.findWordAt(start);
	      if (cm.display.shift || doc.extend)
	        ourRange = extendRange(doc, ourRange, word.anchor, word.head);
	      else
	        ourRange = word;
	    } else if (type == "triple") {
	      var line = new Range(Pos(start.line, 0), clipPos(doc, Pos(start.line + 1, 0)));
	      if (cm.display.shift || doc.extend)
	        ourRange = extendRange(doc, ourRange, line.anchor, line.head);
	      else
	        ourRange = line;
	    } else {
	      ourRange = extendRange(doc, ourRange, start);
	    }

	    if (!addNew) {
	      ourIndex = 0;
	      setSelection(doc, new Selection([ourRange], 0), sel_mouse);
	      startSel = doc.sel;
	    } else if (ourIndex > -1) {
	      replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
	    } else {
	      ourIndex = doc.sel.ranges.length;
	      setSelection(doc, normalizeSelection(doc.sel.ranges.concat([ourRange]), ourIndex),
	                   {scroll: false, origin: "*mouse"});
	    }

	    var lastPos = start;
	    function extendTo(pos) {
	      if (cmp(lastPos, pos) == 0) return;
	      lastPos = pos;

	      if (type == "rect") {
	        var ranges = [], tabSize = cm.options.tabSize;
	        var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
	        var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
	        var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
	        for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line));
	             line <= end; line++) {
	          var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
	          if (left == right)
	            ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
	          else if (text.length > leftPos)
	            ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
	        }
	        if (!ranges.length) ranges.push(new Range(start, start));
	        setSelection(doc, normalizeSelection(startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex),
	                     {origin: "*mouse", scroll: false});
	        cm.scrollIntoView(pos);
	      } else {
	        var oldRange = ourRange;
	        var anchor = oldRange.anchor, head = pos;
	        if (type != "single") {
	          if (type == "double")
	            var range = cm.findWordAt(pos);
	          else
	            var range = new Range(Pos(pos.line, 0), clipPos(doc, Pos(pos.line + 1, 0)));
	          if (cmp(range.anchor, anchor) > 0) {
	            head = range.head;
	            anchor = minPos(oldRange.from(), range.anchor);
	          } else {
	            head = range.anchor;
	            anchor = maxPos(oldRange.to(), range.head);
	          }
	        }
	        var ranges = startSel.ranges.slice(0);
	        ranges[ourIndex] = new Range(clipPos(doc, anchor), head);
	        setSelection(doc, normalizeSelection(ranges, ourIndex), sel_mouse);
	      }
	    }

	    var editorSize = display.wrapper.getBoundingClientRect();
	    // Used to ensure timeout re-tries don't fire when another extend
	    // happened in the meantime (clearTimeout isn't reliable -- at
	    // least on Chrome, the timeouts still happen even when cleared,
	    // if the clear happens after their scheduled firing time).
	    var counter = 0;

	    function extend(e) {
	      var curCount = ++counter;
	      var cur = posFromMouse(cm, e, true, type == "rect");
	      if (!cur) return;
	      if (cmp(cur, lastPos) != 0) {
	        ensureFocus(cm);
	        extendTo(cur);
	        var visible = visibleLines(display, doc);
	        if (cur.line >= visible.to || cur.line < visible.from)
	          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
	      } else {
	        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
	        if (outside) setTimeout(operation(cm, function() {
	          if (counter != curCount) return;
	          display.scroller.scrollTop += outside;
	          extend(e);
	        }), 50);
	      }
	    }

	    function done(e) {
	      counter = Infinity;
	      e_preventDefault(e);
	      focusInput(cm);
	      off(document, "mousemove", move);
	      off(document, "mouseup", up);
	      doc.history.lastSelOrigin = null;
	    }

	    var move = operation(cm, function(e) {
	      if (!e_button(e)) done(e);
	      else extend(e);
	    });
	    var up = operation(cm, done);
	    on(document, "mousemove", move);
	    on(document, "mouseup", up);
	  }

	  // Determines whether an event happened in the gutter, and fires the
	  // handlers for the corresponding event.
	  function gutterEvent(cm, e, type, prevent, signalfn) {
	    try { var mX = e.clientX, mY = e.clientY; }
	    catch(e) { return false; }
	    if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
	    if (prevent) e_preventDefault(e);

	    var display = cm.display;
	    var lineBox = display.lineDiv.getBoundingClientRect();

	    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
	    mY -= lineBox.top - display.viewOffset;

	    for (var i = 0; i < cm.options.gutters.length; ++i) {
	      var g = display.gutters.childNodes[i];
	      if (g && g.getBoundingClientRect().right >= mX) {
	        var line = lineAtHeight(cm.doc, mY);
	        var gutter = cm.options.gutters[i];
	        signalfn(cm, type, cm, line, gutter, e);
	        return e_defaultPrevented(e);
	      }
	    }
	  }

	  function clickInGutter(cm, e) {
	    return gutterEvent(cm, e, "gutterClick", true, signalLater);
	  }

	  // Kludge to work around strange IE behavior where it'll sometimes
	  // re-fire a series of drag-related events right after the drop (#1551)
	  var lastDrop = 0;

	  function onDrop(e) {
	    var cm = this;
	    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e))
	      return;
	    e_preventDefault(e);
	    if (ie) lastDrop = +new Date;
	    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
	    if (!pos || isReadOnly(cm)) return;
	    // Might be a file drop, in which case we simply extract the text
	    // and insert it.
	    if (files && files.length && window.FileReader && window.File) {
	      var n = files.length, text = Array(n), read = 0;
	      var loadFile = function(file, i) {
	        var reader = new FileReader;
	        reader.onload = operation(cm, function() {
	          text[i] = reader.result;
	          if (++read == n) {
	            pos = clipPos(cm.doc, pos);
	            var change = {from: pos, to: pos, text: splitLines(text.join("\n")), origin: "paste"};
	            makeChange(cm.doc, change);
	            setSelectionReplaceHistory(cm.doc, simpleSelection(pos, changeEnd(change)));
	          }
	        });
	        reader.readAsText(file);
	      };
	      for (var i = 0; i < n; ++i) loadFile(files[i], i);
	    } else { // Normal drop
	      // Don't do a replace if the drop happened inside of the selected text.
	      if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
	        cm.state.draggingText(e);
	        // Ensure the editor is re-focused
	        setTimeout(bind(focusInput, cm), 20);
	        return;
	      }
	      try {
	        var text = e.dataTransfer.getData("Text");
	        if (text) {
	          if (cm.state.draggingText && !(mac ? e.metaKey : e.ctrlKey))
	            var selected = cm.listSelections();
	          setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
	          if (selected) for (var i = 0; i < selected.length; ++i)
	            replaceRange(cm.doc, "", selected[i].anchor, selected[i].head, "drag");
	          cm.replaceSelection(text, "around", "paste");
	          focusInput(cm);
	        }
	      }
	      catch(e){}
	    }
	  }

	  function onDragStart(cm, e) {
	    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
	    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

	    e.dataTransfer.setData("Text", cm.getSelection());

	    // Use dummy image instead of default browsers image.
	    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
	    if (e.dataTransfer.setDragImage && !safari) {
	      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
	      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
	      if (presto) {
	        img.width = img.height = 1;
	        cm.display.wrapper.appendChild(img);
	        // Force a relayout, or Opera won't use our image for some obscure reason
	        img._top = img.offsetTop;
	      }
	      e.dataTransfer.setDragImage(img, 0, 0);
	      if (presto) img.parentNode.removeChild(img);
	    }
	  }

	  // SCROLL EVENTS

	  // Sync the scrollable area and scrollbars, ensure the viewport
	  // covers the visible area.
	  function setScrollTop(cm, val) {
	    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
	    cm.doc.scrollTop = val;
	    if (!gecko) updateDisplaySimple(cm, {top: val});
	    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
	    if (cm.display.scrollbarV.scrollTop != val) cm.display.scrollbarV.scrollTop = val;
	    if (gecko) updateDisplaySimple(cm);
	    startWorker(cm, 100);
	  }
	  // Sync scroller and scrollbar, ensure the gutter elements are
	  // aligned.
	  function setScrollLeft(cm, val, isScroller) {
	    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
	    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
	    cm.doc.scrollLeft = val;
	    alignHorizontally(cm);
	    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
	    if (cm.display.scrollbarH.scrollLeft != val) cm.display.scrollbarH.scrollLeft = val;
	  }

	  // Since the delta values reported on mouse wheel events are
	  // unstandardized between browsers and even browser versions, and
	  // generally horribly unpredictable, this code starts by measuring
	  // the scroll effect that the first few mouse wheel events have,
	  // and, from that, detects the way it can convert deltas to pixel
	  // offsets afterwards.
	  //
	  // The reason we want to know the amount a wheel event will scroll
	  // is that it gives us a chance to update the display before the
	  // actual scrolling happens, reducing flickering.

	  var wheelSamples = 0, wheelPixelsPerUnit = null;
	  // Fill in a browser-detected starting value on browsers where we
	  // know one. These don't have to be accurate -- the result of them
	  // being wrong would just be a slight flicker on the first wheel
	  // scroll (if it is large enough).
	  if (ie) wheelPixelsPerUnit = -.53;
	  else if (gecko) wheelPixelsPerUnit = 15;
	  else if (chrome) wheelPixelsPerUnit = -.7;
	  else if (safari) wheelPixelsPerUnit = -1/3;

	  function onScrollWheel(cm, e) {
	    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
	    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
	    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
	    else if (dy == null) dy = e.wheelDelta;

	    var display = cm.display, scroll = display.scroller;
	    // Quit if there's nothing to scroll here
	    if (!(dx && scroll.scrollWidth > scroll.clientWidth ||
	          dy && scroll.scrollHeight > scroll.clientHeight)) return;

	    // Webkit browsers on OS X abort momentum scrolls when the target
	    // of the scroll event is removed from the scrollable element.
	    // This hack (see related code in patchDisplay) makes sure the
	    // element is kept around.
	    if (dy && mac && webkit) {
	      outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
	        for (var i = 0; i < view.length; i++) {
	          if (view[i].node == cur) {
	            cm.display.currentWheelTarget = cur;
	            break outer;
	          }
	        }
	      }
	    }

	    // On some browsers, horizontal scrolling will cause redraws to
	    // happen before the gutter has been realigned, causing it to
	    // wriggle around in a most unseemly way. When we have an
	    // estimated pixels/delta value, we just handle horizontal
	    // scrolling entirely here. It'll be slightly off from native, but
	    // better than glitching out.
	    if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
	      if (dy)
	        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
	      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
	      e_preventDefault(e);
	      display.wheelStartX = null; // Abort measurement, if in progress
	      return;
	    }

	    // 'Project' the visible viewport to cover the area that is being
	    // scrolled into view (if we know enough to estimate it).
	    if (dy && wheelPixelsPerUnit != null) {
	      var pixels = dy * wheelPixelsPerUnit;
	      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
	      if (pixels < 0) top = Math.max(0, top + pixels - 50);
	      else bot = Math.min(cm.doc.height, bot + pixels + 50);
	      updateDisplaySimple(cm, {top: top, bottom: bot});
	    }

	    if (wheelSamples < 20) {
	      if (display.wheelStartX == null) {
	        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
	        display.wheelDX = dx; display.wheelDY = dy;
	        setTimeout(function() {
	          if (display.wheelStartX == null) return;
	          var movedX = scroll.scrollLeft - display.wheelStartX;
	          var movedY = scroll.scrollTop - display.wheelStartY;
	          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
	            (movedX && display.wheelDX && movedX / display.wheelDX);
	          display.wheelStartX = display.wheelStartY = null;
	          if (!sample) return;
	          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
	          ++wheelSamples;
	        }, 200);
	      } else {
	        display.wheelDX += dx; display.wheelDY += dy;
	      }
	    }
	  }

	  // KEY EVENTS

	  // Run a handler that was bound to a key.
	  function doHandleBinding(cm, bound, dropShift) {
	    if (typeof bound == "string") {
	      bound = commands[bound];
	      if (!bound) return false;
	    }
	    // Ensure previous input has been read, so that the handler sees a
	    // consistent view of the document
	    if (cm.display.pollingFast && readInput(cm)) cm.display.pollingFast = false;
	    var prevShift = cm.display.shift, done = false;
	    try {
	      if (isReadOnly(cm)) cm.state.suppressEdits = true;
	      if (dropShift) cm.display.shift = false;
	      done = bound(cm) != Pass;
	    } finally {
	      cm.display.shift = prevShift;
	      cm.state.suppressEdits = false;
	    }
	    return done;
	  }

	  // Collect the currently active keymaps.
	  function allKeyMaps(cm) {
	    var maps = cm.state.keyMaps.slice(0);
	    if (cm.options.extraKeys) maps.push(cm.options.extraKeys);
	    maps.push(cm.options.keyMap);
	    return maps;
	  }

	  var maybeTransition;
	  // Handle a key from the keydown event.
	  function handleKeyBinding(cm, e) {
	    // Handle automatic keymap transitions
	    var startMap = getKeyMap(cm.options.keyMap), next = startMap.auto;
	    clearTimeout(maybeTransition);
	    if (next && !isModifierKey(e)) maybeTransition = setTimeout(function() {
	      if (getKeyMap(cm.options.keyMap) == startMap) {
	        cm.options.keyMap = (next.call ? next.call(null, cm) : next);
	        keyMapChanged(cm);
	      }
	    }, 50);

	    var name = keyName(e, true), handled = false;
	    if (!name) return false;
	    var keymaps = allKeyMaps(cm);

	    if (e.shiftKey) {
	      // First try to resolve full name (including 'Shift-'). Failing
	      // that, see if there is a cursor-motion command (starting with
	      // 'go') bound to the keyname without 'Shift-'.
	      handled = lookupKey("Shift-" + name, keymaps, function(b) {return doHandleBinding(cm, b, true);})
	             || lookupKey(name, keymaps, function(b) {
	                  if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
	                    return doHandleBinding(cm, b);
	                });
	    } else {
	      handled = lookupKey(name, keymaps, function(b) { return doHandleBinding(cm, b); });
	    }

	    if (handled) {
	      e_preventDefault(e);
	      restartBlink(cm);
	      signalLater(cm, "keyHandled", cm, name, e);
	    }
	    return handled;
	  }

	  // Handle a key from the keypress event
	  function handleCharBinding(cm, e, ch) {
	    var handled = lookupKey("'" + ch + "'", allKeyMaps(cm),
	                            function(b) { return doHandleBinding(cm, b, true); });
	    if (handled) {
	      e_preventDefault(e);
	      restartBlink(cm);
	      signalLater(cm, "keyHandled", cm, "'" + ch + "'", e);
	    }
	    return handled;
	  }

	  var lastStoppedKey = null;
	  function onKeyDown(e) {
	    var cm = this;
	    ensureFocus(cm);
	    if (signalDOMEvent(cm, e)) return;
	    // IE does strange things with escape.
	    if (ie && ie_version < 11 && e.keyCode == 27) e.returnValue = false;
	    var code = e.keyCode;
	    cm.display.shift = code == 16 || e.shiftKey;
	    var handled = handleKeyBinding(cm, e);
	    if (presto) {
	      lastStoppedKey = handled ? code : null;
	      // Opera has no cut event... we try to at least catch the key combo
	      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
	        cm.replaceSelection("", null, "cut");
	    }

	    // Turn mouse into crosshair when Alt is held on Mac.
	    if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
	      showCrossHair(cm);
	  }

	  function showCrossHair(cm) {
	    var lineDiv = cm.display.lineDiv;
	    addClass(lineDiv, "CodeMirror-crosshair");

	    function up(e) {
	      if (e.keyCode == 18 || !e.altKey) {
	        rmClass(lineDiv, "CodeMirror-crosshair");
	        off(document, "keyup", up);
	        off(document, "mouseover", up);
	      }
	    }
	    on(document, "keyup", up);
	    on(document, "mouseover", up);
	  }

	  function onKeyUp(e) {
	    if (e.keyCode == 16) this.doc.sel.shift = false;
	    signalDOMEvent(this, e);
	  }

	  function onKeyPress(e) {
	    var cm = this;
	    if (signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) return;
	    var keyCode = e.keyCode, charCode = e.charCode;
	    if (presto && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
	    if (((presto && (!e.which || e.which < 10)) || khtml) && handleKeyBinding(cm, e)) return;
	    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
	    if (handleCharBinding(cm, e, ch)) return;
	    if (ie && ie_version >= 9) cm.display.inputHasSelection = null;
	    fastPoll(cm);
	  }

	  // FOCUS/BLUR EVENTS

	  function onFocus(cm) {
	    if (cm.options.readOnly == "nocursor") return;
	    if (!cm.state.focused) {
	      signal(cm, "focus", cm);
	      cm.state.focused = true;
	      addClass(cm.display.wrapper, "CodeMirror-focused");
	      // The prevInput test prevents this from firing when a context
	      // menu is closed (since the resetInput would kill the
	      // select-all detection hack)
	      if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
	        resetInput(cm);
	        if (webkit) setTimeout(bind(resetInput, cm, true), 0); // Issue #1730
	      }
	    }
	    slowPoll(cm);
	    restartBlink(cm);
	  }
	  function onBlur(cm) {
	    if (cm.state.focused) {
	      signal(cm, "blur", cm);
	      cm.state.focused = false;
	      rmClass(cm.display.wrapper, "CodeMirror-focused");
	    }
	    clearInterval(cm.display.blinker);
	    setTimeout(function() {if (!cm.state.focused) cm.display.shift = false;}, 150);
	  }

	  // CONTEXT MENU HANDLING

	  // To make the context menu work, we need to briefly unhide the
	  // textarea (making it as unobtrusive as possible) to let the
	  // right-click take effect on it.
	  function onContextMenu(cm, e) {
	    if (signalDOMEvent(cm, e, "contextmenu")) return;
	    var display = cm.display;
	    if (eventInWidget(display, e) || contextMenuInGutter(cm, e)) return;

	    var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
	    if (!pos || presto) return; // Opera is difficult.

	    // Reset the current text selection only if the click is done outside of the selection
	    // and 'resetSelectionOnContextMenu' option is true.
	    var reset = cm.options.resetSelectionOnContextMenu;
	    if (reset && cm.doc.sel.contains(pos) == -1)
	      operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);

	    var oldCSS = display.input.style.cssText;
	    display.inputDiv.style.position = "absolute";
	    display.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
	      "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " +
	      (ie ? "rgba(255, 255, 255, .05)" : "transparent") +
	      "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
	    if (webkit) var oldScrollY = window.scrollY; // Work around Chrome issue (#2712)
	    focusInput(cm);
	    if (webkit) window.scrollTo(null, oldScrollY);
	    resetInput(cm);
	    // Adds "Select all" to context menu in FF
	    if (!cm.somethingSelected()) display.input.value = display.prevInput = " ";
	    display.selForContextMenu = cm.doc.sel;
	    clearTimeout(display.detectingSelectAll);

	    // Select-all will be greyed out if there's nothing to select, so
	    // this adds a zero-width space so that we can later check whether
	    // it got selected.
	    function prepareSelectAllHack() {
	      if (display.input.selectionStart != null) {
	        var selected = cm.somethingSelected();
	        var extval = display.input.value = "\u200b" + (selected ? display.input.value : "");
	        display.prevInput = selected ? "" : "\u200b";
	        display.input.selectionStart = 1; display.input.selectionEnd = extval.length;
	        // Re-set this, in case some other handler touched the
	        // selection in the meantime.
	        display.selForContextMenu = cm.doc.sel;
	      }
	    }
	    function rehide() {
	      display.inputDiv.style.position = "relative";
	      display.input.style.cssText = oldCSS;
	      if (ie && ie_version < 9) display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos;
	      slowPoll(cm);

	      // Try to detect the user choosing select-all
	      if (display.input.selectionStart != null) {
	        if (!ie || (ie && ie_version < 9)) prepareSelectAllHack();
	        var i = 0, poll = function() {
	          if (display.selForContextMenu == cm.doc.sel && display.input.selectionStart == 0)
	            operation(cm, commands.selectAll)(cm);
	          else if (i++ < 10) display.detectingSelectAll = setTimeout(poll, 500);
	          else resetInput(cm);
	        };
	        display.detectingSelectAll = setTimeout(poll, 200);
	      }
	    }

	    if (ie && ie_version >= 9) prepareSelectAllHack();
	    if (captureRightClick) {
	      e_stop(e);
	      var mouseup = function() {
	        off(window, "mouseup", mouseup);
	        setTimeout(rehide, 20);
	      };
	      on(window, "mouseup", mouseup);
	    } else {
	      setTimeout(rehide, 50);
	    }
	  }

	  function contextMenuInGutter(cm, e) {
	    if (!hasHandler(cm, "gutterContextMenu")) return false;
	    return gutterEvent(cm, e, "gutterContextMenu", false, signal);
	  }

	  // UPDATING

	  // Compute the position of the end of a change (its 'to' property
	  // refers to the pre-change end).
	  var changeEnd = CodeMirror.changeEnd = function(change) {
	    if (!change.text) return change.to;
	    return Pos(change.from.line + change.text.length - 1,
	               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
	  };

	  // Adjust a position to refer to the post-change position of the
	  // same text, or the end of the change if the change covers it.
	  function adjustForChange(pos, change) {
	    if (cmp(pos, change.from) < 0) return pos;
	    if (cmp(pos, change.to) <= 0) return changeEnd(change);

	    var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
	    if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
	    return Pos(line, ch);
	  }

	  function computeSelAfterChange(doc, change) {
	    var out = [];
	    for (var i = 0; i < doc.sel.ranges.length; i++) {
	      var range = doc.sel.ranges[i];
	      out.push(new Range(adjustForChange(range.anchor, change),
	                         adjustForChange(range.head, change)));
	    }
	    return normalizeSelection(out, doc.sel.primIndex);
	  }

	  function offsetPos(pos, old, nw) {
	    if (pos.line == old.line)
	      return Pos(nw.line, pos.ch - old.ch + nw.ch);
	    else
	      return Pos(nw.line + (pos.line - old.line), pos.ch);
	  }

	  // Used by replaceSelections to allow moving the selection to the
	  // start or around the replaced test. Hint may be "start" or "around".
	  function computeReplacedSel(doc, changes, hint) {
	    var out = [];
	    var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
	    for (var i = 0; i < changes.length; i++) {
	      var change = changes[i];
	      var from = offsetPos(change.from, oldPrev, newPrev);
	      var to = offsetPos(changeEnd(change), oldPrev, newPrev);
	      oldPrev = change.to;
	      newPrev = to;
	      if (hint == "around") {
	        var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
	        out[i] = new Range(inv ? to : from, inv ? from : to);
	      } else {
	        out[i] = new Range(from, from);
	      }
	    }
	    return new Selection(out, doc.sel.primIndex);
	  }

	  // Allow "beforeChange" event handlers to influence a change
	  function filterChange(doc, change, update) {
	    var obj = {
	      canceled: false,
	      from: change.from,
	      to: change.to,
	      text: change.text,
	      origin: change.origin,
	      cancel: function() { this.canceled = true; }
	    };
	    if (update) obj.update = function(from, to, text, origin) {
	      if (from) this.from = clipPos(doc, from);
	      if (to) this.to = clipPos(doc, to);
	      if (text) this.text = text;
	      if (origin !== undefined) this.origin = origin;
	    };
	    signal(doc, "beforeChange", doc, obj);
	    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

	    if (obj.canceled) return null;
	    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
	  }

	  // Apply a change to a document, and add it to the document's
	  // history, and propagating it to all linked documents.
	  function makeChange(doc, change, ignoreReadOnly) {
	    if (doc.cm) {
	      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
	      if (doc.cm.state.suppressEdits) return;
	    }

	    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
	      change = filterChange(doc, change, true);
	      if (!change) return;
	    }

	    // Possibly split or suppress the update based on the presence
	    // of read-only spans in its range.
	    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
	    if (split) {
	      for (var i = split.length - 1; i >= 0; --i)
	        makeChangeInner(doc, {from: split[i].from, to: split[i].to, text: i ? [""] : change.text});
	    } else {
	      makeChangeInner(doc, change);
	    }
	  }

	  function makeChangeInner(doc, change) {
	    if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
	    var selAfter = computeSelAfterChange(doc, change);
	    addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

	    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
	    var rebased = [];

	    linkedDocs(doc, function(doc, sharedHist) {
	      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
	        rebaseHist(doc.history, change);
	        rebased.push(doc.history);
	      }
	      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
	    });
	  }

	  // Revert a change stored in a document's history.
	  function makeChangeFromHistory(doc, type, allowSelectionOnly) {
	    if (doc.cm && doc.cm.state.suppressEdits) return;

	    var hist = doc.history, event, selAfter = doc.sel;
	    var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;

	    // Verify that there is a useable event (so that ctrl-z won't
	    // needlessly clear selection events)
	    for (var i = 0; i < source.length; i++) {
	      event = source[i];
	      if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
	        break;
	    }
	    if (i == source.length) return;
	    hist.lastOrigin = hist.lastSelOrigin = null;

	    for (;;) {
	      event = source.pop();
	      if (event.ranges) {
	        pushSelectionToHistory(event, dest);
	        if (allowSelectionOnly && !event.equals(doc.sel)) {
	          setSelection(doc, event, {clearRedo: false});
	          return;
	        }
	        selAfter = event;
	      }
	      else break;
	    }

	    // Build up a reverse change object to add to the opposite history
	    // stack (redo when undoing, and vice versa).
	    var antiChanges = [];
	    pushSelectionToHistory(selAfter, dest);
	    dest.push({changes: antiChanges, generation: hist.generation});
	    hist.generation = event.generation || ++hist.maxGeneration;

	    var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

	    for (var i = event.changes.length - 1; i >= 0; --i) {
	      var change = event.changes[i];
	      change.origin = type;
	      if (filter && !filterChange(doc, change, false)) {
	        source.length = 0;
	        return;
	      }

	      antiChanges.push(historyChangeFromChange(doc, change));

	      var after = i ? computeSelAfterChange(doc, change) : lst(source);
	      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
	      if (!i && doc.cm) doc.cm.scrollIntoView({from: change.from, to: changeEnd(change)});
	      var rebased = [];

	      // Propagate to the linked documents
	      linkedDocs(doc, function(doc, sharedHist) {
	        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
	          rebaseHist(doc.history, change);
	          rebased.push(doc.history);
	        }
	        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
	      });
	    }
	  }

	  // Sub-views need their line numbers shifted when text is added
	  // above or below them in the parent document.
	  function shiftDoc(doc, distance) {
	    if (distance == 0) return;
	    doc.first += distance;
	    doc.sel = new Selection(map(doc.sel.ranges, function(range) {
	      return new Range(Pos(range.anchor.line + distance, range.anchor.ch),
	                       Pos(range.head.line + distance, range.head.ch));
	    }), doc.sel.primIndex);
	    if (doc.cm) {
	      regChange(doc.cm, doc.first, doc.first - distance, distance);
	      for (var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
	        regLineChange(doc.cm, l, "gutter");
	    }
	  }

	  // More lower-level change function, handling only a single document
	  // (not linked ones).
	  function makeChangeSingleDoc(doc, change, selAfter, spans) {
	    if (doc.cm && !doc.cm.curOp)
	      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

	    if (change.to.line < doc.first) {
	      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
	      return;
	    }
	    if (change.from.line > doc.lastLine()) return;

	    // Clip the change to the size of this doc
	    if (change.from.line < doc.first) {
	      var shift = change.text.length - 1 - (doc.first - change.from.line);
	      shiftDoc(doc, shift);
	      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
	                text: [lst(change.text)], origin: change.origin};
	    }
	    var last = doc.lastLine();
	    if (change.to.line > last) {
	      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
	                text: [change.text[0]], origin: change.origin};
	    }

	    change.removed = getBetween(doc, change.from, change.to);

	    if (!selAfter) selAfter = computeSelAfterChange(doc, change);
	    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);
	    else updateDoc(doc, change, spans);
	    setSelectionNoUndo(doc, selAfter, sel_dontScroll);
	  }

	  // Handle the interaction of a change to a document with the editor
	  // that this document is part of.
	  function makeChangeSingleDocInEditor(cm, change, spans) {
	    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

	    var recomputeMaxLength = false, checkWidthStart = from.line;
	    if (!cm.options.lineWrapping) {
	      checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
	      doc.iter(checkWidthStart, to.line + 1, function(line) {
	        if (line == display.maxLine) {
	          recomputeMaxLength = true;
	          return true;
	        }
	      });
	    }

	    if (doc.sel.contains(change.from, change.to) > -1)
	      signalCursorActivity(cm);

	    updateDoc(doc, change, spans, estimateHeight(cm));

	    if (!cm.options.lineWrapping) {
	      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
	        var len = lineLength(line);
	        if (len > display.maxLineLength) {
	          display.maxLine = line;
	          display.maxLineLength = len;
	          display.maxLineChanged = true;
	          recomputeMaxLength = false;
	        }
	      });
	      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
	    }

	    // Adjust frontier, schedule worker
	    doc.frontier = Math.min(doc.frontier, from.line);
	    startWorker(cm, 400);

	    var lendiff = change.text.length - (to.line - from.line) - 1;
	    // Remember that these lines changed, for updating the display
	    if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change))
	      regLineChange(cm, from.line, "text");
	    else
	      regChange(cm, from.line, to.line + 1, lendiff);

	    var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
	    if (changeHandler || changesHandler) {
	      var obj = {
	        from: from, to: to,
	        text: change.text,
	        removed: change.removed,
	        origin: change.origin
	      };
	      if (changeHandler) signalLater(cm, "change", cm, obj);
	      if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
	    }
	    cm.display.selForContextMenu = null;
	  }

	  function replaceRange(doc, code, from, to, origin) {
	    if (!to) to = from;
	    if (cmp(to, from) < 0) { var tmp = to; to = from; from = tmp; }
	    if (typeof code == "string") code = splitLines(code);
	    makeChange(doc, {from: from, to: to, text: code, origin: origin});
	  }

	  // SCROLLING THINGS INTO VIEW

	  // If an editor sits on the top or bottom of the window, partially
	  // scrolled out of view, this ensures that the cursor is visible.
	  function maybeScrollWindow(cm, coords) {
	    var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
	    if (coords.top + box.top < 0) doScroll = true;
	    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
	    if (doScroll != null && !phantom) {
	      var scrollNode = elt("div", "\u200b", null, "position: absolute; top: " +
	                           (coords.top - display.viewOffset - paddingTop(cm.display)) + "px; height: " +
	                           (coords.bottom - coords.top + scrollerCutOff) + "px; left: " +
	                           coords.left + "px; width: 2px;");
	      cm.display.lineSpace.appendChild(scrollNode);
	      scrollNode.scrollIntoView(doScroll);
	      cm.display.lineSpace.removeChild(scrollNode);
	    }
	  }

	  // Scroll a given position into view (immediately), verifying that
	  // it actually became visible (as line heights are accurately
	  // measured, the position of something may 'drift' during drawing).
	  function scrollPosIntoView(cm, pos, end, margin) {
	    if (margin == null) margin = 0;
	    for (var limit = 0; limit < 5; limit++) {
	      var changed = false, coords = cursorCoords(cm, pos);
	      var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
	      var scrollPos = calculateScrollPos(cm, Math.min(coords.left, endCoords.left),
	                                         Math.min(coords.top, endCoords.top) - margin,
	                                         Math.max(coords.left, endCoords.left),
	                                         Math.max(coords.bottom, endCoords.bottom) + margin);
	      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
	      if (scrollPos.scrollTop != null) {
	        setScrollTop(cm, scrollPos.scrollTop);
	        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
	      }
	      if (scrollPos.scrollLeft != null) {
	        setScrollLeft(cm, scrollPos.scrollLeft);
	        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
	      }
	      if (!changed) return coords;
	    }
	  }

	  // Scroll a given set of coordinates into view (immediately).
	  function scrollIntoView(cm, x1, y1, x2, y2) {
	    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
	    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
	    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
	  }

	  // Calculate a new scroll position needed to scroll the given
	  // rectangle into view. Returns an object with scrollTop and
	  // scrollLeft properties. When these are undefined, the
	  // vertical/horizontal position does not need to be adjusted.
	  function calculateScrollPos(cm, x1, y1, x2, y2) {
	    var display = cm.display, snapMargin = textHeight(cm.display);
	    if (y1 < 0) y1 = 0;
	    var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
	    var screen = display.scroller.clientHeight - scrollerCutOff, result = {};
	    if (y2 - y1 > screen) y2 = y1 + screen;
	    var docBottom = cm.doc.height + paddingVert(display);
	    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
	    if (y1 < screentop) {
	      result.scrollTop = atTop ? 0 : y1;
	    } else if (y2 > screentop + screen) {
	      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
	      if (newTop != screentop) result.scrollTop = newTop;
	    }

	    var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
	    var screenw = display.scroller.clientWidth - scrollerCutOff - display.gutters.offsetWidth;
	    var tooWide = x2 - x1 > screenw;
	    if (tooWide) x2 = x1 + screenw;
	    if (x1 < 10)
	      result.scrollLeft = 0;
	    else if (x1 < screenleft)
	      result.scrollLeft = Math.max(0, x1 - (tooWide ? 0 : 10));
	    else if (x2 > screenw + screenleft - 3)
	      result.scrollLeft = x2 + (tooWide ? 0 : 10) - screenw;

	    return result;
	  }

	  // Store a relative adjustment to the scroll position in the current
	  // operation (to be applied when the operation finishes).
	  function addToScrollPos(cm, left, top) {
	    if (left != null || top != null) resolveScrollToPos(cm);
	    if (left != null)
	      cm.curOp.scrollLeft = (cm.curOp.scrollLeft == null ? cm.doc.scrollLeft : cm.curOp.scrollLeft) + left;
	    if (top != null)
	      cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
	  }

	  // Make sure that at the end of the operation the current cursor is
	  // shown.
	  function ensureCursorVisible(cm) {
	    resolveScrollToPos(cm);
	    var cur = cm.getCursor(), from = cur, to = cur;
	    if (!cm.options.lineWrapping) {
	      from = cur.ch ? Pos(cur.line, cur.ch - 1) : cur;
	      to = Pos(cur.line, cur.ch + 1);
	    }
	    cm.curOp.scrollToPos = {from: from, to: to, margin: cm.options.cursorScrollMargin, isCursor: true};
	  }

	  // When an operation has its scrollToPos property set, and another
	  // scroll action is applied before the end of the operation, this
	  // 'simulates' scrolling that position into view in a cheap way, so
	  // that the effect of intermediate scroll commands is not ignored.
	  function resolveScrollToPos(cm) {
	    var range = cm.curOp.scrollToPos;
	    if (range) {
	      cm.curOp.scrollToPos = null;
	      var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
	      var sPos = calculateScrollPos(cm, Math.min(from.left, to.left),
	                                    Math.min(from.top, to.top) - range.margin,
	                                    Math.max(from.right, to.right),
	                                    Math.max(from.bottom, to.bottom) + range.margin);
	      cm.scrollTo(sPos.scrollLeft, sPos.scrollTop);
	    }
	  }

	  // API UTILITIES

	  // Indent the given line. The how parameter can be "smart",
	  // "add"/null, "subtract", or "prev". When aggressive is false
	  // (typically set to true for forced single-line indents), empty
	  // lines are not indented, and places where the mode returns Pass
	  // are left alone.
	  function indentLine(cm, n, how, aggressive) {
	    var doc = cm.doc, state;
	    if (how == null) how = "add";
	    if (how == "smart") {
	      // Fall back to "prev" when the mode doesn't have an indentation
	      // method.
	      if (!doc.mode.indent) how = "prev";
	      else state = getStateBefore(cm, n);
	    }

	    var tabSize = cm.options.tabSize;
	    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
	    if (line.stateAfter) line.stateAfter = null;
	    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
	    if (!aggressive && !/\S/.test(line.text)) {
	      indentation = 0;
	      how = "not";
	    } else if (how == "smart") {
	      indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
	      if (indentation == Pass || indentation > 150) {
	        if (!aggressive) return;
	        how = "prev";
	      }
	    }
	    if (how == "prev") {
	      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
	      else indentation = 0;
	    } else if (how == "add") {
	      indentation = curSpace + cm.options.indentUnit;
	    } else if (how == "subtract") {
	      indentation = curSpace - cm.options.indentUnit;
	    } else if (typeof how == "number") {
	      indentation = curSpace + how;
	    }
	    indentation = Math.max(0, indentation);

	    var indentString = "", pos = 0;
	    if (cm.options.indentWithTabs)
	      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
	    if (pos < indentation) indentString += spaceStr(indentation - pos);

	    if (indentString != curSpaceString) {
	      replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
	    } else {
	      // Ensure that, if the cursor was in the whitespace at the start
	      // of the line, it is moved to the end of that space.
	      for (var i = 0; i < doc.sel.ranges.length; i++) {
	        var range = doc.sel.ranges[i];
	        if (range.head.line == n && range.head.ch < curSpaceString.length) {
	          var pos = Pos(n, curSpaceString.length);
	          replaceOneSelection(doc, i, new Range(pos, pos));
	          break;
	        }
	      }
	    }
	    line.stateAfter = null;
	  }

	  // Utility for applying a change to a line by handle or number,
	  // returning the number and optionally registering the line as
	  // changed.
	  function changeLine(doc, handle, changeType, op) {
	    var no = handle, line = handle;
	    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
	    else no = lineNo(handle);
	    if (no == null) return null;
	    if (op(line, no) && doc.cm) regLineChange(doc.cm, no, changeType);
	    return line;
	  }

	  // Helper for deleting text near the selection(s), used to implement
	  // backspace, delete, and similar functionality.
	  function deleteNearSelection(cm, compute) {
	    var ranges = cm.doc.sel.ranges, kill = [];
	    // Build up a set of ranges to kill first, merging overlapping
	    // ranges.
	    for (var i = 0; i < ranges.length; i++) {
	      var toKill = compute(ranges[i]);
	      while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
	        var replaced = kill.pop();
	        if (cmp(replaced.from, toKill.from) < 0) {
	          toKill.from = replaced.from;
	          break;
	        }
	      }
	      kill.push(toKill);
	    }
	    // Next, remove those actual ranges.
	    runInOp(cm, function() {
	      for (var i = kill.length - 1; i >= 0; i--)
	        replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
	      ensureCursorVisible(cm);
	    });
	  }

	  // Used for horizontal relative motion. Dir is -1 or 1 (left or
	  // right), unit can be "char", "column" (like char, but doesn't
	  // cross line boundaries), "word" (across next word), or "group" (to
	  // the start of next group of word or non-word-non-whitespace
	  // chars). The visually param controls whether, in right-to-left
	  // text, direction 1 means to move towards the next index in the
	  // string, or towards the character to the right of the current
	  // position. The resulting position will have a hitSide=true
	  // property if it reached the end of the document.
	  function findPosH(doc, pos, dir, unit, visually) {
	    var line = pos.line, ch = pos.ch, origDir = dir;
	    var lineObj = getLine(doc, line);
	    var possible = true;
	    function findNextLine() {
	      var l = line + dir;
	      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
	      line = l;
	      return lineObj = getLine(doc, l);
	    }
	    function moveOnce(boundToLine) {
	      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
	      if (next == null) {
	        if (!boundToLine && findNextLine()) {
	          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
	          else ch = dir < 0 ? lineObj.text.length : 0;
	        } else return (possible = false);
	      } else ch = next;
	      return true;
	    }

	    if (unit == "char") moveOnce();
	    else if (unit == "column") moveOnce(true);
	    else if (unit == "word" || unit == "group") {
	      var sawType = null, group = unit == "group";
	      var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
	      for (var first = true;; first = false) {
	        if (dir < 0 && !moveOnce(!first)) break;
	        var cur = lineObj.text.charAt(ch) || "\n";
	        var type = isWordChar(cur, helper) ? "w"
	          : group && cur == "\n" ? "n"
	          : !group || /\s/.test(cur) ? null
	          : "p";
	        if (group && !first && !type) type = "s";
	        if (sawType && sawType != type) {
	          if (dir < 0) {dir = 1; moveOnce();}
	          break;
	        }

	        if (type) sawType = type;
	        if (dir > 0 && !moveOnce(!first)) break;
	      }
	    }
	    var result = skipAtomic(doc, Pos(line, ch), origDir, true);
	    if (!possible) result.hitSide = true;
	    return result;
	  }

	  // For relative vertical movement. Dir may be -1 or 1. Unit can be
	  // "page" or "line". The resulting position will have a hitSide=true
	  // property if it reached the end of the document.
	  function findPosV(cm, pos, dir, unit) {
	    var doc = cm.doc, x = pos.left, y;
	    if (unit == "page") {
	      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
	      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
	    } else if (unit == "line") {
	      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
	    }
	    for (;;) {
	      var target = coordsChar(cm, x, y);
	      if (!target.outside) break;
	      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
	      y += dir * 5;
	    }
	    return target;
	  }

	  // EDITOR METHODS

	  // The publicly visible API. Note that methodOp(f) means
	  // 'wrap f in an operation, performed on its `this` parameter'.

	  // This is not the complete set of editor methods. Most of the
	  // methods defined on the Doc type are also injected into
	  // CodeMirror.prototype, for backwards compatibility and
	  // convenience.

	  CodeMirror.prototype = {
	    constructor: CodeMirror,
	    focus: function(){window.focus(); focusInput(this); fastPoll(this);},

	    setOption: function(option, value) {
	      var options = this.options, old = options[option];
	      if (options[option] == value && option != "mode") return;
	      options[option] = value;
	      if (optionHandlers.hasOwnProperty(option))
	        operation(this, optionHandlers[option])(this, value, old);
	    },

	    getOption: function(option) {return this.options[option];},
	    getDoc: function() {return this.doc;},

	    addKeyMap: function(map, bottom) {
	      this.state.keyMaps[bottom ? "push" : "unshift"](map);
	    },
	    removeKeyMap: function(map) {
	      var maps = this.state.keyMaps;
	      for (var i = 0; i < maps.length; ++i)
	        if (maps[i] == map || (typeof maps[i] != "string" && maps[i].name == map)) {
	          maps.splice(i, 1);
	          return true;
	        }
	    },

	    addOverlay: methodOp(function(spec, options) {
	      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
	      if (mode.startState) throw new Error("Overlays may not be stateful.");
	      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
	      this.state.modeGen++;
	      regChange(this);
	    }),
	    removeOverlay: methodOp(function(spec) {
	      var overlays = this.state.overlays;
	      for (var i = 0; i < overlays.length; ++i) {
	        var cur = overlays[i].modeSpec;
	        if (cur == spec || typeof spec == "string" && cur.name == spec) {
	          overlays.splice(i, 1);
	          this.state.modeGen++;
	          regChange(this);
	          return;
	        }
	      }
	    }),

	    indentLine: methodOp(function(n, dir, aggressive) {
	      if (typeof dir != "string" && typeof dir != "number") {
	        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
	        else dir = dir ? "add" : "subtract";
	      }
	      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
	    }),
	    indentSelection: methodOp(function(how) {
	      var ranges = this.doc.sel.ranges, end = -1;
	      for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        if (!range.empty()) {
	          var from = range.from(), to = range.to();
	          var start = Math.max(end, from.line);
	          end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
	          for (var j = start; j < end; ++j)
	            indentLine(this, j, how);
	          var newRanges = this.doc.sel.ranges;
	          if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
	            replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
	        } else if (range.head.line > end) {
	          indentLine(this, range.head.line, how, true);
	          end = range.head.line;
	          if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
	        }
	      }
	    }),

	    // Fetch the parser token for a given character. Useful for hacks
	    // that want to inspect the mode state (say, for completion).
	    getTokenAt: function(pos, precise) {
	      var doc = this.doc;
	      pos = clipPos(doc, pos);
	      var state = getStateBefore(this, pos.line, precise), mode = this.doc.mode;
	      var line = getLine(doc, pos.line);
	      var stream = new StringStream(line.text, this.options.tabSize);
	      while (stream.pos < pos.ch && !stream.eol()) {
	        stream.start = stream.pos;
	        var style = readToken(mode, stream, state);
	      }
	      return {start: stream.start,
	              end: stream.pos,
	              string: stream.current(),
	              type: style || null,
	              state: state};
	    },

	    getTokenTypeAt: function(pos) {
	      pos = clipPos(this.doc, pos);
	      var styles = getLineStyles(this, getLine(this.doc, pos.line));
	      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
	      var type;
	      if (ch == 0) type = styles[2];
	      else for (;;) {
	        var mid = (before + after) >> 1;
	        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
	        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
	        else { type = styles[mid * 2 + 2]; break; }
	      }
	      var cut = type ? type.indexOf("cm-overlay ") : -1;
	      return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
	    },

	    getModeAt: function(pos) {
	      var mode = this.doc.mode;
	      if (!mode.innerMode) return mode;
	      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
	    },

	    getHelper: function(pos, type) {
	      return this.getHelpers(pos, type)[0];
	    },

	    getHelpers: function(pos, type) {
	      var found = [];
	      if (!helpers.hasOwnProperty(type)) return helpers;
	      var help = helpers[type], mode = this.getModeAt(pos);
	      if (typeof mode[type] == "string") {
	        if (help[mode[type]]) found.push(help[mode[type]]);
	      } else if (mode[type]) {
	        for (var i = 0; i < mode[type].length; i++) {
	          var val = help[mode[type][i]];
	          if (val) found.push(val);
	        }
	      } else if (mode.helperType && help[mode.helperType]) {
	        found.push(help[mode.helperType]);
	      } else if (help[mode.name]) {
	        found.push(help[mode.name]);
	      }
	      for (var i = 0; i < help._global.length; i++) {
	        var cur = help._global[i];
	        if (cur.pred(mode, this) && indexOf(found, cur.val) == -1)
	          found.push(cur.val);
	      }
	      return found;
	    },

	    getStateAfter: function(line, precise) {
	      var doc = this.doc;
	      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
	      return getStateBefore(this, line + 1, precise);
	    },

	    cursorCoords: function(start, mode) {
	      var pos, range = this.doc.sel.primary();
	      if (start == null) pos = range.head;
	      else if (typeof start == "object") pos = clipPos(this.doc, start);
	      else pos = start ? range.from() : range.to();
	      return cursorCoords(this, pos, mode || "page");
	    },

	    charCoords: function(pos, mode) {
	      return charCoords(this, clipPos(this.doc, pos), mode || "page");
	    },

	    coordsChar: function(coords, mode) {
	      coords = fromCoordSystem(this, coords, mode || "page");
	      return coordsChar(this, coords.left, coords.top);
	    },

	    lineAtHeight: function(height, mode) {
	      height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
	      return lineAtHeight(this.doc, height + this.display.viewOffset);
	    },
	    heightAtLine: function(line, mode) {
	      var end = false, last = this.doc.first + this.doc.size - 1;
	      if (line < this.doc.first) line = this.doc.first;
	      else if (line > last) { line = last; end = true; }
	      var lineObj = getLine(this.doc, line);
	      return intoCoordSystem(this, lineObj, {top: 0, left: 0}, mode || "page").top +
	        (end ? this.doc.height - heightAtLine(lineObj) : 0);
	    },

	    defaultTextHeight: function() { return textHeight(this.display); },
	    defaultCharWidth: function() { return charWidth(this.display); },

	    setGutterMarker: methodOp(function(line, gutterID, value) {
	      return changeLine(this.doc, line, "gutter", function(line) {
	        var markers = line.gutterMarkers || (line.gutterMarkers = {});
	        markers[gutterID] = value;
	        if (!value && isEmpty(markers)) line.gutterMarkers = null;
	        return true;
	      });
	    }),

	    clearGutter: methodOp(function(gutterID) {
	      var cm = this, doc = cm.doc, i = doc.first;
	      doc.iter(function(line) {
	        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
	          line.gutterMarkers[gutterID] = null;
	          regLineChange(cm, i, "gutter");
	          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
	        }
	        ++i;
	      });
	    }),

	    addLineWidget: methodOp(function(handle, node, options) {
	      return addLineWidget(this, handle, node, options);
	    }),

	    removeLineWidget: function(widget) { widget.clear(); },

	    lineInfo: function(line) {
	      if (typeof line == "number") {
	        if (!isLine(this.doc, line)) return null;
	        var n = line;
	        line = getLine(this.doc, line);
	        if (!line) return null;
	      } else {
	        var n = lineNo(line);
	        if (n == null) return null;
	      }
	      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
	              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
	              widgets: line.widgets};
	    },

	    getViewport: function() { return {from: this.display.viewFrom, to: this.display.viewTo};},

	    addWidget: function(pos, node, scroll, vert, horiz) {
	      var display = this.display;
	      pos = cursorCoords(this, clipPos(this.doc, pos));
	      var top = pos.bottom, left = pos.left;
	      node.style.position = "absolute";
	      display.sizer.appendChild(node);
	      if (vert == "over") {
	        top = pos.top;
	      } else if (vert == "above" || vert == "near") {
	        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
	        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
	        // Default to positioning above (if specified and possible); otherwise default to positioning below
	        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
	          top = pos.top - node.offsetHeight;
	        else if (pos.bottom + node.offsetHeight <= vspace)
	          top = pos.bottom;
	        if (left + node.offsetWidth > hspace)
	          left = hspace - node.offsetWidth;
	      }
	      node.style.top = top + "px";
	      node.style.left = node.style.right = "";
	      if (horiz == "right") {
	        left = display.sizer.clientWidth - node.offsetWidth;
	        node.style.right = "0px";
	      } else {
	        if (horiz == "left") left = 0;
	        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
	        node.style.left = left + "px";
	      }
	      if (scroll)
	        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
	    },

	    triggerOnKeyDown: methodOp(onKeyDown),
	    triggerOnKeyPress: methodOp(onKeyPress),
	    triggerOnKeyUp: onKeyUp,

	    execCommand: function(cmd) {
	      if (commands.hasOwnProperty(cmd))
	        return commands[cmd](this);
	    },

	    findPosH: function(from, amount, unit, visually) {
	      var dir = 1;
	      if (amount < 0) { dir = -1; amount = -amount; }
	      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
	        cur = findPosH(this.doc, cur, dir, unit, visually);
	        if (cur.hitSide) break;
	      }
	      return cur;
	    },

	    moveH: methodOp(function(dir, unit) {
	      var cm = this;
	      cm.extendSelectionsBy(function(range) {
	        if (cm.display.shift || cm.doc.extend || range.empty())
	          return findPosH(cm.doc, range.head, dir, unit, cm.options.rtlMoveVisually);
	        else
	          return dir < 0 ? range.from() : range.to();
	      }, sel_move);
	    }),

	    deleteH: methodOp(function(dir, unit) {
	      var sel = this.doc.sel, doc = this.doc;
	      if (sel.somethingSelected())
	        doc.replaceSelection("", null, "+delete");
	      else
	        deleteNearSelection(this, function(range) {
	          var other = findPosH(doc, range.head, dir, unit, false);
	          return dir < 0 ? {from: other, to: range.head} : {from: range.head, to: other};
	        });
	    }),

	    findPosV: function(from, amount, unit, goalColumn) {
	      var dir = 1, x = goalColumn;
	      if (amount < 0) { dir = -1; amount = -amount; }
	      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
	        var coords = cursorCoords(this, cur, "div");
	        if (x == null) x = coords.left;
	        else coords.left = x;
	        cur = findPosV(this, coords, dir, unit);
	        if (cur.hitSide) break;
	      }
	      return cur;
	    },

	    moveV: methodOp(function(dir, unit) {
	      var cm = this, doc = this.doc, goals = [];
	      var collapse = !cm.display.shift && !doc.extend && doc.sel.somethingSelected();
	      doc.extendSelectionsBy(function(range) {
	        if (collapse)
	          return dir < 0 ? range.from() : range.to();
	        var headPos = cursorCoords(cm, range.head, "div");
	        if (range.goalColumn != null) headPos.left = range.goalColumn;
	        goals.push(headPos.left);
	        var pos = findPosV(cm, headPos, dir, unit);
	        if (unit == "page" && range == doc.sel.primary())
	          addToScrollPos(cm, null, charCoords(cm, pos, "div").top - headPos.top);
	        return pos;
	      }, sel_move);
	      if (goals.length) for (var i = 0; i < doc.sel.ranges.length; i++)
	        doc.sel.ranges[i].goalColumn = goals[i];
	    }),

	    // Find the word at the given position (as returned by coordsChar).
	    findWordAt: function(pos) {
	      var doc = this.doc, line = getLine(doc, pos.line).text;
	      var start = pos.ch, end = pos.ch;
	      if (line) {
	        var helper = this.getHelper(pos, "wordChars");
	        if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
	        var startChar = line.charAt(start);
	        var check = isWordChar(startChar, helper)
	          ? function(ch) { return isWordChar(ch, helper); }
	          : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
	          : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
	        while (start > 0 && check(line.charAt(start - 1))) --start;
	        while (end < line.length && check(line.charAt(end))) ++end;
	      }
	      return new Range(Pos(pos.line, start), Pos(pos.line, end));
	    },

	    toggleOverwrite: function(value) {
	      if (value != null && value == this.state.overwrite) return;
	      if (this.state.overwrite = !this.state.overwrite)
	        addClass(this.display.cursorDiv, "CodeMirror-overwrite");
	      else
	        rmClass(this.display.cursorDiv, "CodeMirror-overwrite");

	      signal(this, "overwriteToggle", this, this.state.overwrite);
	    },
	    hasFocus: function() { return activeElt() == this.display.input; },

	    scrollTo: methodOp(function(x, y) {
	      if (x != null || y != null) resolveScrollToPos(this);
	      if (x != null) this.curOp.scrollLeft = x;
	      if (y != null) this.curOp.scrollTop = y;
	    }),
	    getScrollInfo: function() {
	      var scroller = this.display.scroller, co = scrollerCutOff;
	      return {left: scroller.scrollLeft, top: scroller.scrollTop,
	              height: scroller.scrollHeight - co, width: scroller.scrollWidth - co,
	              clientHeight: scroller.clientHeight - co, clientWidth: scroller.clientWidth - co};
	    },

	    scrollIntoView: methodOp(function(range, margin) {
	      if (range == null) {
	        range = {from: this.doc.sel.primary().head, to: null};
	        if (margin == null) margin = this.options.cursorScrollMargin;
	      } else if (typeof range == "number") {
	        range = {from: Pos(range, 0), to: null};
	      } else if (range.from == null) {
	        range = {from: range, to: null};
	      }
	      if (!range.to) range.to = range.from;
	      range.margin = margin || 0;

	      if (range.from.line != null) {
	        resolveScrollToPos(this);
	        this.curOp.scrollToPos = range;
	      } else {
	        var sPos = calculateScrollPos(this, Math.min(range.from.left, range.to.left),
	                                      Math.min(range.from.top, range.to.top) - range.margin,
	                                      Math.max(range.from.right, range.to.right),
	                                      Math.max(range.from.bottom, range.to.bottom) + range.margin);
	        this.scrollTo(sPos.scrollLeft, sPos.scrollTop);
	      }
	    }),

	    setSize: methodOp(function(width, height) {
	      var cm = this;
	      function interpret(val) {
	        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
	      }
	      if (width != null) cm.display.wrapper.style.width = interpret(width);
	      if (height != null) cm.display.wrapper.style.height = interpret(height);
	      if (cm.options.lineWrapping) clearLineMeasurementCache(this);
	      var lineNo = cm.display.viewFrom;
	      cm.doc.iter(lineNo, cm.display.viewTo, function(line) {
	        if (line.widgets) for (var i = 0; i < line.widgets.length; i++)
	          if (line.widgets[i].noHScroll) { regLineChange(cm, lineNo, "widget"); break; }
	        ++lineNo;
	      });
	      cm.curOp.forceUpdate = true;
	      signal(cm, "refresh", this);
	    }),

	    operation: function(f){return runInOp(this, f);},

	    refresh: methodOp(function() {
	      var oldHeight = this.display.cachedTextHeight;
	      regChange(this);
	      this.curOp.forceUpdate = true;
	      clearCaches(this);
	      this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
	      updateGutterSpace(this);
	      if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5)
	        estimateLineHeights(this);
	      signal(this, "refresh", this);
	    }),

	    swapDoc: methodOp(function(doc) {
	      var old = this.doc;
	      old.cm = null;
	      attachDoc(this, doc);
	      clearCaches(this);
	      resetInput(this);
	      this.scrollTo(doc.scrollLeft, doc.scrollTop);
	      this.curOp.forceScroll = true;
	      signalLater(this, "swapDoc", this, old);
	      return old;
	    }),

	    getInputField: function(){return this.display.input;},
	    getWrapperElement: function(){return this.display.wrapper;},
	    getScrollerElement: function(){return this.display.scroller;},
	    getGutterElement: function(){return this.display.gutters;}
	  };
	  eventMixin(CodeMirror);

	  // OPTION DEFAULTS

	  // The default configuration options.
	  var defaults = CodeMirror.defaults = {};
	  // Functions to run when options are changed.
	  var optionHandlers = CodeMirror.optionHandlers = {};

	  function option(name, deflt, handle, notOnInit) {
	    CodeMirror.defaults[name] = deflt;
	    if (handle) optionHandlers[name] =
	      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
	  }

	  // Passed to option handlers when there is no old value.
	  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};

	  // These two are, on init, called from the constructor because they
	  // have to be initialized before the editor can start at all.
	  option("value", "", function(cm, val) {
	    cm.setValue(val);
	  }, true);
	  option("mode", null, function(cm, val) {
	    cm.doc.modeOption = val;
	    loadMode(cm);
	  }, true);

	  option("indentUnit", 2, loadMode, true);
	  option("indentWithTabs", false);
	  option("smartIndent", true);
	  option("tabSize", 4, function(cm) {
	    resetModeState(cm);
	    clearCaches(cm);
	    regChange(cm);
	  }, true);
	  option("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(cm, val) {
	    cm.options.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
	    cm.refresh();
	  }, true);
	  option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {cm.refresh();}, true);
	  option("electricChars", true);
	  option("rtlMoveVisually", !windows);
	  option("wholeLineUpdateBefore", true);

	  option("theme", "default", function(cm) {
	    themeChanged(cm);
	    guttersChanged(cm);
	  }, true);
	  option("keyMap", "default", keyMapChanged);
	  option("extraKeys", null);

	  option("lineWrapping", false, wrappingChanged, true);
	  option("gutters", [], function(cm) {
	    setGuttersForLineNumbers(cm.options);
	    guttersChanged(cm);
	  }, true);
	  option("fixedGutter", true, function(cm, val) {
	    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
	    cm.refresh();
	  }, true);
	  option("coverGutterNextToScrollbar", false, updateScrollbars, true);
	  option("lineNumbers", false, function(cm) {
	    setGuttersForLineNumbers(cm.options);
	    guttersChanged(cm);
	  }, true);
	  option("firstLineNumber", 1, guttersChanged, true);
	  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
	  option("showCursorWhenSelecting", false, updateSelection, true);

	  option("resetSelectionOnContextMenu", true);

	  option("readOnly", false, function(cm, val) {
	    if (val == "nocursor") {
	      onBlur(cm);
	      cm.display.input.blur();
	      cm.display.disabled = true;
	    } else {
	      cm.display.disabled = false;
	      if (!val) resetInput(cm);
	    }
	  });
	  option("disableInput", false, function(cm, val) {if (!val) resetInput(cm);}, true);
	  option("dragDrop", true);

	  option("cursorBlinkRate", 530);
	  option("cursorScrollMargin", 0);
	  option("cursorHeight", 1, updateSelection, true);
	  option("singleCursorHeightPerLine", true, updateSelection, true);
	  option("workTime", 100);
	  option("workDelay", 100);
	  option("flattenSpans", true, resetModeState, true);
	  option("addModeClass", false, resetModeState, true);
	  option("pollInterval", 100);
	  option("undoDepth", 200, function(cm, val){cm.doc.history.undoDepth = val;});
	  option("historyEventDelay", 1250);
	  option("viewportMargin", 10, function(cm){cm.refresh();}, true);
	  option("maxHighlightLength", 10000, resetModeState, true);
	  option("moveInputWithCursor", true, function(cm, val) {
	    if (!val) cm.display.inputDiv.style.top = cm.display.inputDiv.style.left = 0;
	  });

	  option("tabindex", null, function(cm, val) {
	    cm.display.input.tabIndex = val || "";
	  });
	  option("autofocus", null);

	  // MODE DEFINITION AND QUERYING

	  // Known modes, by name and by MIME
	  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

	  // Extra arguments are stored as the mode's dependencies, which is
	  // used by (legacy) mechanisms like loadmode.js to automatically
	  // load a mode. (Preferred mechanism is the require/define calls.)
	  CodeMirror.defineMode = function(name, mode) {
	    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
	    if (arguments.length > 2)
	      mode.dependencies = Array.prototype.slice.call(arguments, 2);
	    modes[name] = mode;
	  };

	  CodeMirror.defineMIME = function(mime, spec) {
	    mimeModes[mime] = spec;
	  };

	  // Given a MIME type, a {name, ...options} config object, or a name
	  // string, return a mode config object.
	  CodeMirror.resolveMode = function(spec) {
	    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
	      spec = mimeModes[spec];
	    } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
	      var found = mimeModes[spec.name];
	      if (typeof found == "string") found = {name: found};
	      spec = createObj(found, spec);
	      spec.name = found.name;
	    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
	      return CodeMirror.resolveMode("application/xml");
	    }
	    if (typeof spec == "string") return {name: spec};
	    else return spec || {name: "null"};
	  };

	  // Given a mode spec (anything that resolveMode accepts), find and
	  // initialize an actual mode object.
	  CodeMirror.getMode = function(options, spec) {
	    var spec = CodeMirror.resolveMode(spec);
	    var mfactory = modes[spec.name];
	    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
	    var modeObj = mfactory(options, spec);
	    if (modeExtensions.hasOwnProperty(spec.name)) {
	      var exts = modeExtensions[spec.name];
	      for (var prop in exts) {
	        if (!exts.hasOwnProperty(prop)) continue;
	        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
	        modeObj[prop] = exts[prop];
	      }
	    }
	    modeObj.name = spec.name;
	    if (spec.helperType) modeObj.helperType = spec.helperType;
	    if (spec.modeProps) for (var prop in spec.modeProps)
	      modeObj[prop] = spec.modeProps[prop];

	    return modeObj;
	  };

	  // Minimal default mode.
	  CodeMirror.defineMode("null", function() {
	    return {token: function(stream) {stream.skipToEnd();}};
	  });
	  CodeMirror.defineMIME("text/plain", "null");

	  // This can be used to attach properties to mode objects from
	  // outside the actual mode definition.
	  var modeExtensions = CodeMirror.modeExtensions = {};
	  CodeMirror.extendMode = function(mode, properties) {
	    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
	    copyObj(properties, exts);
	  };

	  // EXTENSIONS

	  CodeMirror.defineExtension = function(name, func) {
	    CodeMirror.prototype[name] = func;
	  };
	  CodeMirror.defineDocExtension = function(name, func) {
	    Doc.prototype[name] = func;
	  };
	  CodeMirror.defineOption = option;

	  var initHooks = [];
	  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};

	  var helpers = CodeMirror.helpers = {};
	  CodeMirror.registerHelper = function(type, name, value) {
	    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {_global: []};
	    helpers[type][name] = value;
	  };
	  CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
	    CodeMirror.registerHelper(type, name, value);
	    helpers[type]._global.push({pred: predicate, val: value});
	  };

	  // MODE STATE HANDLING

	  // Utility functions for working with state. Exported because nested
	  // modes need to do this for their inner modes.

	  var copyState = CodeMirror.copyState = function(mode, state) {
	    if (state === true) return state;
	    if (mode.copyState) return mode.copyState(state);
	    var nstate = {};
	    for (var n in state) {
	      var val = state[n];
	      if (val instanceof Array) val = val.concat([]);
	      nstate[n] = val;
	    }
	    return nstate;
	  };

	  var startState = CodeMirror.startState = function(mode, a1, a2) {
	    return mode.startState ? mode.startState(a1, a2) : true;
	  };

	  // Given a mode and a state (for that mode), find the inner mode and
	  // state at the position that the state refers to.
	  CodeMirror.innerMode = function(mode, state) {
	    while (mode.innerMode) {
	      var info = mode.innerMode(state);
	      if (!info || info.mode == mode) break;
	      state = info.state;
	      mode = info.mode;
	    }
	    return info || {mode: mode, state: state};
	  };

	  // STANDARD COMMANDS

	  // Commands are parameter-less actions that can be performed on an
	  // editor, mostly used for keybindings.
	  var commands = CodeMirror.commands = {
	    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);},
	    singleSelection: function(cm) {
	      cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
	    },
	    killLine: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        if (range.empty()) {
	          var len = getLine(cm.doc, range.head.line).text.length;
	          if (range.head.ch == len && range.head.line < cm.lastLine())
	            return {from: range.head, to: Pos(range.head.line + 1, 0)};
	          else
	            return {from: range.head, to: Pos(range.head.line, len)};
	        } else {
	          return {from: range.from(), to: range.to()};
	        }
	      });
	    },
	    deleteLine: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        return {from: Pos(range.from().line, 0),
	                to: clipPos(cm.doc, Pos(range.to().line + 1, 0))};
	      });
	    },
	    delLineLeft: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        return {from: Pos(range.from().line, 0), to: range.from()};
	      });
	    },
	    delWrappedLineLeft: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        var leftPos = cm.coordsChar({left: 0, top: top}, "div");
	        return {from: leftPos, to: range.from()};
	      });
	    },
	    delWrappedLineRight: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        var rightPos = cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
	        return {from: range.from(), to: rightPos };
	      });
	    },
	    undo: function(cm) {cm.undo();},
	    redo: function(cm) {cm.redo();},
	    undoSelection: function(cm) {cm.undoSelection();},
	    redoSelection: function(cm) {cm.redoSelection();},
	    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
	    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
	    goLineStart: function(cm) {
	      cm.extendSelectionsBy(function(range) { return lineStart(cm, range.head.line); },
	                            {origin: "+move", bias: 1});
	    },
	    goLineStartSmart: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        return lineStartSmart(cm, range.head);
	      }, {origin: "+move", bias: 1});
	    },
	    goLineEnd: function(cm) {
	      cm.extendSelectionsBy(function(range) { return lineEnd(cm, range.head.line); },
	                            {origin: "+move", bias: -1});
	    },
	    goLineRight: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
	      }, sel_move);
	    },
	    goLineLeft: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        return cm.coordsChar({left: 0, top: top}, "div");
	      }, sel_move);
	    },
	    goLineLeftSmart: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        var pos = cm.coordsChar({left: 0, top: top}, "div");
	        if (pos.ch < cm.getLine(pos.line).search(/\S/)) return lineStartSmart(cm, range.head);
	        return pos;
	      }, sel_move);
	    },
	    goLineUp: function(cm) {cm.moveV(-1, "line");},
	    goLineDown: function(cm) {cm.moveV(1, "line");},
	    goPageUp: function(cm) {cm.moveV(-1, "page");},
	    goPageDown: function(cm) {cm.moveV(1, "page");},
	    goCharLeft: function(cm) {cm.moveH(-1, "char");},
	    goCharRight: function(cm) {cm.moveH(1, "char");},
	    goColumnLeft: function(cm) {cm.moveH(-1, "column");},
	    goColumnRight: function(cm) {cm.moveH(1, "column");},
	    goWordLeft: function(cm) {cm.moveH(-1, "word");},
	    goGroupRight: function(cm) {cm.moveH(1, "group");},
	    goGroupLeft: function(cm) {cm.moveH(-1, "group");},
	    goWordRight: function(cm) {cm.moveH(1, "word");},
	    delCharBefore: function(cm) {cm.deleteH(-1, "char");},
	    delCharAfter: function(cm) {cm.deleteH(1, "char");},
	    delWordBefore: function(cm) {cm.deleteH(-1, "word");},
	    delWordAfter: function(cm) {cm.deleteH(1, "word");},
	    delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
	    delGroupAfter: function(cm) {cm.deleteH(1, "group");},
	    indentAuto: function(cm) {cm.indentSelection("smart");},
	    indentMore: function(cm) {cm.indentSelection("add");},
	    indentLess: function(cm) {cm.indentSelection("subtract");},
	    insertTab: function(cm) {cm.replaceSelection("\t");},
	    insertSoftTab: function(cm) {
	      var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
	      for (var i = 0; i < ranges.length; i++) {
	        var pos = ranges[i].from();
	        var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
	        spaces.push(new Array(tabSize - col % tabSize + 1).join(" "));
	      }
	      cm.replaceSelections(spaces);
	    },
	    defaultTab: function(cm) {
	      if (cm.somethingSelected()) cm.indentSelection("add");
	      else cm.execCommand("insertTab");
	    },
	    transposeChars: function(cm) {
	      runInOp(cm, function() {
	        var ranges = cm.listSelections(), newSel = [];
	        for (var i = 0; i < ranges.length; i++) {
	          var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
	          if (line) {
	            if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);
	            if (cur.ch > 0) {
	              cur = new Pos(cur.line, cur.ch + 1);
	              cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
	                              Pos(cur.line, cur.ch - 2), cur, "+transpose");
	            } else if (cur.line > cm.doc.first) {
	              var prev = getLine(cm.doc, cur.line - 1).text;
	              if (prev)
	                cm.replaceRange(line.charAt(0) + "\n" + prev.charAt(prev.length - 1),
	                                Pos(cur.line - 1, prev.length - 1), Pos(cur.line, 1), "+transpose");
	            }
	          }
	          newSel.push(new Range(cur, cur));
	        }
	        cm.setSelections(newSel);
	      });
	    },
	    newlineAndIndent: function(cm) {
	      runInOp(cm, function() {
	        var len = cm.listSelections().length;
	        for (var i = 0; i < len; i++) {
	          var range = cm.listSelections()[i];
	          cm.replaceRange("\n", range.anchor, range.head, "+input");
	          cm.indentLine(range.from().line + 1, null, true);
	          ensureCursorVisible(cm);
	        }
	      });
	    },
	    toggleOverwrite: function(cm) {cm.toggleOverwrite();}
	  };

	  // STANDARD KEYMAPS

	  var keyMap = CodeMirror.keyMap = {};
	  keyMap.basic = {
	    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
	    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
	    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
	    "Tab": "defaultTab", "Shift-Tab": "indentAuto",
	    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite",
	    "Esc": "singleSelection"
	  };
	  // Note that the save and find-related commands aren't defined by
	  // default. User code or addons can define them. Unknown commands
	  // are simply ignored.
	  keyMap.pcDefault = {
	    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
	    "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
	    "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
	    "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
	    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
	    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
	    "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
	    fallthrough: "basic"
	  };
	  keyMap.macDefault = {
	    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
	    "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
	    "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
	    "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
	    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
	    "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
	    "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
	    fallthrough: ["basic", "emacsy"]
	  };
	  // Very basic readline/emacs-style bindings, which are standard on Mac.
	  keyMap.emacsy = {
	    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
	    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
	    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
	    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
	  };
	  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;

	  // KEYMAP DISPATCH

	  function getKeyMap(val) {
	    if (typeof val == "string") return keyMap[val];
	    else return val;
	  }

	  // Given an array of keymaps and a key name, call handle on any
	  // bindings found, until that returns a truthy value, at which point
	  // we consider the key handled. Implements things like binding a key
	  // to false stopping further handling and keymap fallthrough.
	  var lookupKey = CodeMirror.lookupKey = function(name, maps, handle) {
	    function lookup(map) {
	      map = getKeyMap(map);
	      var found = map[name];
	      if (found === false) return "stop";
	      if (found != null && handle(found)) return true;
	      if (map.nofallthrough) return "stop";

	      var fallthrough = map.fallthrough;
	      if (fallthrough == null) return false;
	      if (Object.prototype.toString.call(fallthrough) != "[object Array]")
	        return lookup(fallthrough);
	      for (var i = 0; i < fallthrough.length; ++i) {
	        var done = lookup(fallthrough[i]);
	        if (done) return done;
	      }
	      return false;
	    }

	    for (var i = 0; i < maps.length; ++i) {
	      var done = lookup(maps[i]);
	      if (done) return done != "stop";
	    }
	  };

	  // Modifier key presses don't count as 'real' key presses for the
	  // purpose of keymap fallthrough.
	  var isModifierKey = CodeMirror.isModifierKey = function(event) {
	    var name = keyNames[event.keyCode];
	    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
	  };

	  // Look up the name of a key as indicated by an event object.
	  var keyName = CodeMirror.keyName = function(event, noShift) {
	    if (presto && event.keyCode == 34 && event["char"]) return false;
	    var name = keyNames[event.keyCode];
	    if (name == null || event.altGraphKey) return false;
	    if (event.altKey) name = "Alt-" + name;
	    if (flipCtrlCmd ? event.metaKey : event.ctrlKey) name = "Ctrl-" + name;
	    if (flipCtrlCmd ? event.ctrlKey : event.metaKey) name = "Cmd-" + name;
	    if (!noShift && event.shiftKey) name = "Shift-" + name;
	    return name;
	  };

	  // FROMTEXTAREA

	  CodeMirror.fromTextArea = function(textarea, options) {
	    if (!options) options = {};
	    options.value = textarea.value;
	    if (!options.tabindex && textarea.tabindex)
	      options.tabindex = textarea.tabindex;
	    if (!options.placeholder && textarea.placeholder)
	      options.placeholder = textarea.placeholder;
	    // Set autofocus to true if this textarea is focused, or if it has
	    // autofocus and no other element is focused.
	    if (options.autofocus == null) {
	      var hasFocus = activeElt();
	      options.autofocus = hasFocus == textarea ||
	        textarea.getAttribute("autofocus") != null && hasFocus == document.body;
	    }

	    function save() {textarea.value = cm.getValue();}
	    if (textarea.form) {
	      on(textarea.form, "submit", save);
	      // Deplorable hack to make the submit method do the right thing.
	      if (!options.leaveSubmitMethodAlone) {
	        var form = textarea.form, realSubmit = form.submit;
	        try {
	          var wrappedSubmit = form.submit = function() {
	            save();
	            form.submit = realSubmit;
	            form.submit();
	            form.submit = wrappedSubmit;
	          };
	        } catch(e) {}
	      }
	    }

	    textarea.style.display = "none";
	    var cm = CodeMirror(function(node) {
	      textarea.parentNode.insertBefore(node, textarea.nextSibling);
	    }, options);
	    cm.save = save;
	    cm.getTextArea = function() { return textarea; };
	    cm.toTextArea = function() {
	      cm.toTextArea = isNaN; // Prevent this from being ran twice
	      save();
	      textarea.parentNode.removeChild(cm.getWrapperElement());
	      textarea.style.display = "";
	      if (textarea.form) {
	        off(textarea.form, "submit", save);
	        if (typeof textarea.form.submit == "function")
	          textarea.form.submit = realSubmit;
	      }
	    };
	    return cm;
	  };

	  // STRING STREAM

	  // Fed to the mode parsers, provides helper functions to make
	  // parsers more succinct.

	  var StringStream = CodeMirror.StringStream = function(string, tabSize) {
	    this.pos = this.start = 0;
	    this.string = string;
	    this.tabSize = tabSize || 8;
	    this.lastColumnPos = this.lastColumnValue = 0;
	    this.lineStart = 0;
	  };

	  StringStream.prototype = {
	    eol: function() {return this.pos >= this.string.length;},
	    sol: function() {return this.pos == this.lineStart;},
	    peek: function() {return this.string.charAt(this.pos) || undefined;},
	    next: function() {
	      if (this.pos < this.string.length)
	        return this.string.charAt(this.pos++);
	    },
	    eat: function(match) {
	      var ch = this.string.charAt(this.pos);
	      if (typeof match == "string") var ok = ch == match;
	      else var ok = ch && (match.test ? match.test(ch) : match(ch));
	      if (ok) {++this.pos; return ch;}
	    },
	    eatWhile: function(match) {
	      var start = this.pos;
	      while (this.eat(match)){}
	      return this.pos > start;
	    },
	    eatSpace: function() {
	      var start = this.pos;
	      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
	      return this.pos > start;
	    },
	    skipToEnd: function() {this.pos = this.string.length;},
	    skipTo: function(ch) {
	      var found = this.string.indexOf(ch, this.pos);
	      if (found > -1) {this.pos = found; return true;}
	    },
	    backUp: function(n) {this.pos -= n;},
	    column: function() {
	      if (this.lastColumnPos < this.start) {
	        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
	        this.lastColumnPos = this.start;
	      }
	      return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
	    },
	    indentation: function() {
	      return countColumn(this.string, null, this.tabSize) -
	        (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
	    },
	    match: function(pattern, consume, caseInsensitive) {
	      if (typeof pattern == "string") {
	        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
	        var substr = this.string.substr(this.pos, pattern.length);
	        if (cased(substr) == cased(pattern)) {
	          if (consume !== false) this.pos += pattern.length;
	          return true;
	        }
	      } else {
	        var match = this.string.slice(this.pos).match(pattern);
	        if (match && match.index > 0) return null;
	        if (match && consume !== false) this.pos += match[0].length;
	        return match;
	      }
	    },
	    current: function(){return this.string.slice(this.start, this.pos);},
	    hideFirstChars: function(n, inner) {
	      this.lineStart += n;
	      try { return inner(); }
	      finally { this.lineStart -= n; }
	    }
	  };

	  // TEXTMARKERS

	  // Created with markText and setBookmark methods. A TextMarker is a
	  // handle that can be used to clear or find a marked position in the
	  // document. Line objects hold arrays (markedSpans) containing
	  // {from, to, marker} object pointing to such marker objects, and
	  // indicating that such a marker is present on that line. Multiple
	  // lines may point to the same marker when it spans across lines.
	  // The spans will have null for their from/to properties when the
	  // marker continues beyond the start/end of the line. Markers have
	  // links back to the lines they currently touch.

	  var TextMarker = CodeMirror.TextMarker = function(doc, type) {
	    this.lines = [];
	    this.type = type;
	    this.doc = doc;
	  };
	  eventMixin(TextMarker);

	  // Clear the marker.
	  TextMarker.prototype.clear = function() {
	    if (this.explicitlyCleared) return;
	    var cm = this.doc.cm, withOp = cm && !cm.curOp;
	    if (withOp) startOperation(cm);
	    if (hasHandler(this, "clear")) {
	      var found = this.find();
	      if (found) signalLater(this, "clear", found.from, found.to);
	    }
	    var min = null, max = null;
	    for (var i = 0; i < this.lines.length; ++i) {
	      var line = this.lines[i];
	      var span = getMarkedSpanFor(line.markedSpans, this);
	      if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");
	      else if (cm) {
	        if (span.to != null) max = lineNo(line);
	        if (span.from != null) min = lineNo(line);
	      }
	      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
	      if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm)
	        updateLineHeight(line, textHeight(cm.display));
	    }
	    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
	      var visual = visualLine(this.lines[i]), len = lineLength(visual);
	      if (len > cm.display.maxLineLength) {
	        cm.display.maxLine = visual;
	        cm.display.maxLineLength = len;
	        cm.display.maxLineChanged = true;
	      }
	    }

	    if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
	    this.lines.length = 0;
	    this.explicitlyCleared = true;
	    if (this.atomic && this.doc.cantEdit) {
	      this.doc.cantEdit = false;
	      if (cm) reCheckSelection(cm.doc);
	    }
	    if (cm) signalLater(cm, "markerCleared", cm, this);
	    if (withOp) endOperation(cm);
	    if (this.parent) this.parent.clear();
	  };

	  // Find the position of the marker in the document. Returns a {from,
	  // to} object by default. Side can be passed to get a specific side
	  // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
	  // Pos objects returned contain a line object, rather than a line
	  // number (used to prevent looking up the same line twice).
	  TextMarker.prototype.find = function(side, lineObj) {
	    if (side == null && this.type == "bookmark") side = 1;
	    var from, to;
	    for (var i = 0; i < this.lines.length; ++i) {
	      var line = this.lines[i];
	      var span = getMarkedSpanFor(line.markedSpans, this);
	      if (span.from != null) {
	        from = Pos(lineObj ? line : lineNo(line), span.from);
	        if (side == -1) return from;
	      }
	      if (span.to != null) {
	        to = Pos(lineObj ? line : lineNo(line), span.to);
	        if (side == 1) return to;
	      }
	    }
	    return from && {from: from, to: to};
	  };

	  // Signals that the marker's widget changed, and surrounding layout
	  // should be recomputed.
	  TextMarker.prototype.changed = function() {
	    var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
	    if (!pos || !cm) return;
	    runInOp(cm, function() {
	      var line = pos.line, lineN = lineNo(pos.line);
	      var view = findViewForLine(cm, lineN);
	      if (view) {
	        clearLineMeasurementCacheFor(view);
	        cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
	      }
	      cm.curOp.updateMaxLine = true;
	      if (!lineIsHidden(widget.doc, line) && widget.height != null) {
	        var oldHeight = widget.height;
	        widget.height = null;
	        var dHeight = widgetHeight(widget) - oldHeight;
	        if (dHeight)
	          updateLineHeight(line, line.height + dHeight);
	      }
	    });
	  };

	  TextMarker.prototype.attachLine = function(line) {
	    if (!this.lines.length && this.doc.cm) {
	      var op = this.doc.cm.curOp;
	      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
	        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
	    }
	    this.lines.push(line);
	  };
	  TextMarker.prototype.detachLine = function(line) {
	    this.lines.splice(indexOf(this.lines, line), 1);
	    if (!this.lines.length && this.doc.cm) {
	      var op = this.doc.cm.curOp;
	      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
	    }
	  };

	  // Collapsed markers have unique ids, in order to be able to order
	  // them, which is needed for uniquely determining an outer marker
	  // when they overlap (they may nest, but not partially overlap).
	  var nextMarkerId = 0;

	  // Create a marker, wire it up to the right lines, and
	  function markText(doc, from, to, options, type) {
	    // Shared markers (across linked documents) are handled separately
	    // (markTextShared will call out to this again, once per
	    // document).
	    if (options && options.shared) return markTextShared(doc, from, to, options, type);
	    // Ensure we are in an operation.
	    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

	    var marker = new TextMarker(doc, type), diff = cmp(from, to);
	    if (options) copyObj(options, marker, false);
	    // Don't connect empty markers unless clearWhenEmpty is false
	    if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
	      return marker;
	    if (marker.replacedWith) {
	      // Showing up as a widget implies collapsed (widget replaces text)
	      marker.collapsed = true;
	      marker.widgetNode = elt("span", [marker.replacedWith], "CodeMirror-widget");
	      if (!options.handleMouseEvents) marker.widgetNode.ignoreEvents = true;
	      if (options.insertLeft) marker.widgetNode.insertLeft = true;
	    }
	    if (marker.collapsed) {
	      if (conflictingCollapsedRange(doc, from.line, from, to, marker) ||
	          from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker))
	        throw new Error("Inserting collapsed marker partially overlapping an existing one");
	      sawCollapsedSpans = true;
	    }

	    if (marker.addToHistory)
	      addChangeToHistory(doc, {from: from, to: to, origin: "markText"}, doc.sel, NaN);

	    var curLine = from.line, cm = doc.cm, updateMaxLine;
	    doc.iter(curLine, to.line + 1, function(line) {
	      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine)
	        updateMaxLine = true;
	      if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
	      addMarkedSpan(line, new MarkedSpan(marker,
	                                         curLine == from.line ? from.ch : null,
	                                         curLine == to.line ? to.ch : null));
	      ++curLine;
	    });
	    // lineIsHidden depends on the presence of the spans, so needs a second pass
	    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
	      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
	    });

	    if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });

	    if (marker.readOnly) {
	      sawReadOnlySpans = true;
	      if (doc.history.done.length || doc.history.undone.length)
	        doc.clearHistory();
	    }
	    if (marker.collapsed) {
	      marker.id = ++nextMarkerId;
	      marker.atomic = true;
	    }
	    if (cm) {
	      // Sync editor state
	      if (updateMaxLine) cm.curOp.updateMaxLine = true;
	      if (marker.collapsed)
	        regChange(cm, from.line, to.line + 1);
	      else if (marker.className || marker.title || marker.startStyle || marker.endStyle)
	        for (var i = from.line; i <= to.line; i++) regLineChange(cm, i, "text");
	      if (marker.atomic) reCheckSelection(cm.doc);
	      signalLater(cm, "markerAdded", cm, marker);
	    }
	    return marker;
	  }

	  // SHARED TEXTMARKERS

	  // A shared marker spans multiple linked documents. It is
	  // implemented as a meta-marker-object controlling multiple normal
	  // markers.
	  var SharedTextMarker = CodeMirror.SharedTextMarker = function(markers, primary) {
	    this.markers = markers;
	    this.primary = primary;
	    for (var i = 0; i < markers.length; ++i)
	      markers[i].parent = this;
	  };
	  eventMixin(SharedTextMarker);

	  SharedTextMarker.prototype.clear = function() {
	    if (this.explicitlyCleared) return;
	    this.explicitlyCleared = true;
	    for (var i = 0; i < this.markers.length; ++i)
	      this.markers[i].clear();
	    signalLater(this, "clear");
	  };
	  SharedTextMarker.prototype.find = function(side, lineObj) {
	    return this.primary.find(side, lineObj);
	  };

	  function markTextShared(doc, from, to, options, type) {
	    options = copyObj(options);
	    options.shared = false;
	    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
	    var widget = options.widgetNode;
	    linkedDocs(doc, function(doc) {
	      if (widget) options.widgetNode = widget.cloneNode(true);
	      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
	      for (var i = 0; i < doc.linked.length; ++i)
	        if (doc.linked[i].isParent) return;
	      primary = lst(markers);
	    });
	    return new SharedTextMarker(markers, primary);
	  }

	  function findSharedMarkers(doc) {
	    return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())),
	                         function(m) { return m.parent; });
	  }

	  function copySharedMarkers(doc, markers) {
	    for (var i = 0; i < markers.length; i++) {
	      var marker = markers[i], pos = marker.find();
	      var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
	      if (cmp(mFrom, mTo)) {
	        var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
	        marker.markers.push(subMark);
	        subMark.parent = marker;
	      }
	    }
	  }

	  function detachSharedMarkers(markers) {
	    for (var i = 0; i < markers.length; i++) {
	      var marker = markers[i], linked = [marker.primary.doc];;
	      linkedDocs(marker.primary.doc, function(d) { linked.push(d); });
	      for (var j = 0; j < marker.markers.length; j++) {
	        var subMarker = marker.markers[j];
	        if (indexOf(linked, subMarker.doc) == -1) {
	          subMarker.parent = null;
	          marker.markers.splice(j--, 1);
	        }
	      }
	    }
	  }

	  // TEXTMARKER SPANS

	  function MarkedSpan(marker, from, to) {
	    this.marker = marker;
	    this.from = from; this.to = to;
	  }

	  // Search an array of spans for a span matching the given marker.
	  function getMarkedSpanFor(spans, marker) {
	    if (spans) for (var i = 0; i < spans.length; ++i) {
	      var span = spans[i];
	      if (span.marker == marker) return span;
	    }
	  }
	  // Remove a span from an array, returning undefined if no spans are
	  // left (we don't store arrays for lines without spans).
	  function removeMarkedSpan(spans, span) {
	    for (var r, i = 0; i < spans.length; ++i)
	      if (spans[i] != span) (r || (r = [])).push(spans[i]);
	    return r;
	  }
	  // Add a span to a line.
	  function addMarkedSpan(line, span) {
	    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
	    span.marker.attachLine(line);
	  }

	  // Used for the algorithm that adjusts markers for a change in the
	  // document. These functions cut an array of spans at a given
	  // character position, returning an array of remaining chunks (or
	  // undefined if nothing remains).
	  function markedSpansBefore(old, startCh, isInsert) {
	    if (old) for (var i = 0, nw; i < old.length; ++i) {
	      var span = old[i], marker = span.marker;
	      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
	      if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
	        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
	        (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
	      }
	    }
	    return nw;
	  }
	  function markedSpansAfter(old, endCh, isInsert) {
	    if (old) for (var i = 0, nw; i < old.length; ++i) {
	      var span = old[i], marker = span.marker;
	      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
	      if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
	        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
	        (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh,
	                                              span.to == null ? null : span.to - endCh));
	      }
	    }
	    return nw;
	  }

	  // Given a change object, compute the new set of marker spans that
	  // cover the line in which the change took place. Removes spans
	  // entirely within the change, reconnects spans belonging to the
	  // same marker that appear on both sides of the change, and cuts off
	  // spans partially within the change. Returns an array of span
	  // arrays with one element for each line in (after) the change.
	  function stretchSpansOverChange(doc, change) {
	    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
	    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
	    if (!oldFirst && !oldLast) return null;

	    var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
	    // Get the spans that 'stick out' on both sides
	    var first = markedSpansBefore(oldFirst, startCh, isInsert);
	    var last = markedSpansAfter(oldLast, endCh, isInsert);

	    // Next, merge those two ends
	    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
	    if (first) {
	      // Fix up .to properties of first
	      for (var i = 0; i < first.length; ++i) {
	        var span = first[i];
	        if (span.to == null) {
	          var found = getMarkedSpanFor(last, span.marker);
	          if (!found) span.to = startCh;
	          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
	        }
	      }
	    }
	    if (last) {
	      // Fix up .from in last (or move them into first in case of sameLine)
	      for (var i = 0; i < last.length; ++i) {
	        var span = last[i];
	        if (span.to != null) span.to += offset;
	        if (span.from == null) {
	          var found = getMarkedSpanFor(first, span.marker);
	          if (!found) {
	            span.from = offset;
	            if (sameLine) (first || (first = [])).push(span);
	          }
	        } else {
	          span.from += offset;
	          if (sameLine) (first || (first = [])).push(span);
	        }
	      }
	    }
	    // Make sure we didn't create any zero-length spans
	    if (first) first = clearEmptySpans(first);
	    if (last && last != first) last = clearEmptySpans(last);

	    var newMarkers = [first];
	    if (!sameLine) {
	      // Fill gap with whole-line-spans
	      var gap = change.text.length - 2, gapMarkers;
	      if (gap > 0 && first)
	        for (var i = 0; i < first.length; ++i)
	          if (first[i].to == null)
	            (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
	      for (var i = 0; i < gap; ++i)
	        newMarkers.push(gapMarkers);
	      newMarkers.push(last);
	    }
	    return newMarkers;
	  }

	  // Remove spans that are empty and don't have a clearWhenEmpty
	  // option of false.
	  function clearEmptySpans(spans) {
	    for (var i = 0; i < spans.length; ++i) {
	      var span = spans[i];
	      if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
	        spans.splice(i--, 1);
	    }
	    if (!spans.length) return null;
	    return spans;
	  }

	  // Used for un/re-doing changes from the history. Combines the
	  // result of computing the existing spans with the set of spans that
	  // existed in the history (so that deleting around a span and then
	  // undoing brings back the span).
	  function mergeOldSpans(doc, change) {
	    var old = getOldSpans(doc, change);
	    var stretched = stretchSpansOverChange(doc, change);
	    if (!old) return stretched;
	    if (!stretched) return old;

	    for (var i = 0; i < old.length; ++i) {
	      var oldCur = old[i], stretchCur = stretched[i];
	      if (oldCur && stretchCur) {
	        spans: for (var j = 0; j < stretchCur.length; ++j) {
	          var span = stretchCur[j];
	          for (var k = 0; k < oldCur.length; ++k)
	            if (oldCur[k].marker == span.marker) continue spans;
	          oldCur.push(span);
	        }
	      } else if (stretchCur) {
	        old[i] = stretchCur;
	      }
	    }
	    return old;
	  }

	  // Used to 'clip' out readOnly ranges when making a change.
	  function removeReadOnlyRanges(doc, from, to) {
	    var markers = null;
	    doc.iter(from.line, to.line + 1, function(line) {
	      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
	        var mark = line.markedSpans[i].marker;
	        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
	          (markers || (markers = [])).push(mark);
	      }
	    });
	    if (!markers) return null;
	    var parts = [{from: from, to: to}];
	    for (var i = 0; i < markers.length; ++i) {
	      var mk = markers[i], m = mk.find(0);
	      for (var j = 0; j < parts.length; ++j) {
	        var p = parts[j];
	        if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
	        var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
	        if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
	          newParts.push({from: p.from, to: m.from});
	        if (dto > 0 || !mk.inclusiveRight && !dto)
	          newParts.push({from: m.to, to: p.to});
	        parts.splice.apply(parts, newParts);
	        j += newParts.length - 1;
	      }
	    }
	    return parts;
	  }

	  // Connect or disconnect spans from a line.
	  function detachMarkedSpans(line) {
	    var spans = line.markedSpans;
	    if (!spans) return;
	    for (var i = 0; i < spans.length; ++i)
	      spans[i].marker.detachLine(line);
	    line.markedSpans = null;
	  }
	  function attachMarkedSpans(line, spans) {
	    if (!spans) return;
	    for (var i = 0; i < spans.length; ++i)
	      spans[i].marker.attachLine(line);
	    line.markedSpans = spans;
	  }

	  // Helpers used when computing which overlapping collapsed span
	  // counts as the larger one.
	  function extraLeft(marker) { return marker.inclusiveLeft ? -1 : 0; }
	  function extraRight(marker) { return marker.inclusiveRight ? 1 : 0; }

	  // Returns a number indicating which of two overlapping collapsed
	  // spans is larger (and thus includes the other). Falls back to
	  // comparing ids when the spans cover exactly the same range.
	  function compareCollapsedMarkers(a, b) {
	    var lenDiff = a.lines.length - b.lines.length;
	    if (lenDiff != 0) return lenDiff;
	    var aPos = a.find(), bPos = b.find();
	    var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
	    if (fromCmp) return -fromCmp;
	    var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
	    if (toCmp) return toCmp;
	    return b.id - a.id;
	  }

	  // Find out whether a line ends or starts in a collapsed span. If
	  // so, return the marker for that span.
	  function collapsedSpanAtSide(line, start) {
	    var sps = sawCollapsedSpans && line.markedSpans, found;
	    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
	      sp = sps[i];
	      if (sp.marker.collapsed && (start ? sp.from : sp.to) == null &&
	          (!found || compareCollapsedMarkers(found, sp.marker) < 0))
	        found = sp.marker;
	    }
	    return found;
	  }
	  function collapsedSpanAtStart(line) { return collapsedSpanAtSide(line, true); }
	  function collapsedSpanAtEnd(line) { return collapsedSpanAtSide(line, false); }

	  // Test whether there exists a collapsed span that partially
	  // overlaps (covers the start or end, but not both) of a new span.
	  // Such overlap is not allowed.
	  function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
	    var line = getLine(doc, lineNo);
	    var sps = sawCollapsedSpans && line.markedSpans;
	    if (sps) for (var i = 0; i < sps.length; ++i) {
	      var sp = sps[i];
	      if (!sp.marker.collapsed) continue;
	      var found = sp.marker.find(0);
	      var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
	      var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
	      if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
	      if (fromCmp <= 0 && (cmp(found.to, from) > 0 || (sp.marker.inclusiveRight && marker.inclusiveLeft)) ||
	          fromCmp >= 0 && (cmp(found.from, to) < 0 || (sp.marker.inclusiveLeft && marker.inclusiveRight)))
	        return true;
	    }
	  }

	  // A visual line is a line as drawn on the screen. Folding, for
	  // example, can cause multiple logical lines to appear on the same
	  // visual line. This finds the start of the visual line that the
	  // given line is part of (usually that is the line itself).
	  function visualLine(line) {
	    var merged;
	    while (merged = collapsedSpanAtStart(line))
	      line = merged.find(-1, true).line;
	    return line;
	  }

	  // Returns an array of logical lines that continue the visual line
	  // started by the argument, or undefined if there are no such lines.
	  function visualLineContinued(line) {
	    var merged, lines;
	    while (merged = collapsedSpanAtEnd(line)) {
	      line = merged.find(1, true).line;
	      (lines || (lines = [])).push(line);
	    }
	    return lines;
	  }

	  // Get the line number of the start of the visual line that the
	  // given line number is part of.
	  function visualLineNo(doc, lineN) {
	    var line = getLine(doc, lineN), vis = visualLine(line);
	    if (line == vis) return lineN;
	    return lineNo(vis);
	  }
	  // Get the line number of the start of the next visual line after
	  // the given line.
	  function visualLineEndNo(doc, lineN) {
	    if (lineN > doc.lastLine()) return lineN;
	    var line = getLine(doc, lineN), merged;
	    if (!lineIsHidden(doc, line)) return lineN;
	    while (merged = collapsedSpanAtEnd(line))
	      line = merged.find(1, true).line;
	    return lineNo(line) + 1;
	  }

	  // Compute whether a line is hidden. Lines count as hidden when they
	  // are part of a visual line that starts with another line, or when
	  // they are entirely covered by collapsed, non-widget span.
	  function lineIsHidden(doc, line) {
	    var sps = sawCollapsedSpans && line.markedSpans;
	    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
	      sp = sps[i];
	      if (!sp.marker.collapsed) continue;
	      if (sp.from == null) return true;
	      if (sp.marker.widgetNode) continue;
	      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
	        return true;
	    }
	  }
	  function lineIsHiddenInner(doc, line, span) {
	    if (span.to == null) {
	      var end = span.marker.find(1, true);
	      return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
	    }
	    if (span.marker.inclusiveRight && span.to == line.text.length)
	      return true;
	    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
	      sp = line.markedSpans[i];
	      if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to &&
	          (sp.to == null || sp.to != span.from) &&
	          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
	          lineIsHiddenInner(doc, line, sp)) return true;
	    }
	  }

	  // LINE WIDGETS

	  // Line widgets are block elements displayed above or below a line.

	  var LineWidget = CodeMirror.LineWidget = function(cm, node, options) {
	    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
	      this[opt] = options[opt];
	    this.cm = cm;
	    this.node = node;
	  };
	  eventMixin(LineWidget);

	  function adjustScrollWhenAboveVisible(cm, line, diff) {
	    if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
	      addToScrollPos(cm, null, diff);
	  }

	  LineWidget.prototype.clear = function() {
	    var cm = this.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
	    if (no == null || !ws) return;
	    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
	    if (!ws.length) line.widgets = null;
	    var height = widgetHeight(this);
	    runInOp(cm, function() {
	      adjustScrollWhenAboveVisible(cm, line, -height);
	      regLineChange(cm, no, "widget");
	      updateLineHeight(line, Math.max(0, line.height - height));
	    });
	  };
	  LineWidget.prototype.changed = function() {
	    var oldH = this.height, cm = this.cm, line = this.line;
	    this.height = null;
	    var diff = widgetHeight(this) - oldH;
	    if (!diff) return;
	    runInOp(cm, function() {
	      cm.curOp.forceUpdate = true;
	      adjustScrollWhenAboveVisible(cm, line, diff);
	      updateLineHeight(line, line.height + diff);
	    });
	  };

	  function widgetHeight(widget) {
	    if (widget.height != null) return widget.height;
	    if (!contains(document.body, widget.node)) {
	      var parentStyle = "position: relative;";
	      if (widget.coverGutter)
	        parentStyle += "margin-left: -" + widget.cm.getGutterElement().offsetWidth + "px;";
	      removeChildrenAndAdd(widget.cm.display.measure, elt("div", [widget.node], null, parentStyle));
	    }
	    return widget.height = widget.node.offsetHeight;
	  }

	  function addLineWidget(cm, handle, node, options) {
	    var widget = new LineWidget(cm, node, options);
	    if (widget.noHScroll) cm.display.alignWidgets = true;
	    changeLine(cm.doc, handle, "widget", function(line) {
	      var widgets = line.widgets || (line.widgets = []);
	      if (widget.insertAt == null) widgets.push(widget);
	      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
	      widget.line = line;
	      if (!lineIsHidden(cm.doc, line)) {
	        var aboveVisible = heightAtLine(line) < cm.doc.scrollTop;
	        updateLineHeight(line, line.height + widgetHeight(widget));
	        if (aboveVisible) addToScrollPos(cm, null, widget.height);
	        cm.curOp.forceUpdate = true;
	      }
	      return true;
	    });
	    return widget;
	  }

	  // LINE DATA STRUCTURE

	  // Line objects. These hold state related to a line, including
	  // highlighting info (the styles array).
	  var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
	    this.text = text;
	    attachMarkedSpans(this, markedSpans);
	    this.height = estimateHeight ? estimateHeight(this) : 1;
	  };
	  eventMixin(Line);
	  Line.prototype.lineNo = function() { return lineNo(this); };

	  // Change the content (text, markers) of a line. Automatically
	  // invalidates cached information and tries to re-estimate the
	  // line's height.
	  function updateLine(line, text, markedSpans, estimateHeight) {
	    line.text = text;
	    if (line.stateAfter) line.stateAfter = null;
	    if (line.styles) line.styles = null;
	    if (line.order != null) line.order = null;
	    detachMarkedSpans(line);
	    attachMarkedSpans(line, markedSpans);
	    var estHeight = estimateHeight ? estimateHeight(line) : 1;
	    if (estHeight != line.height) updateLineHeight(line, estHeight);
	  }

	  // Detach a line from the document tree and its markers.
	  function cleanUpLine(line) {
	    line.parent = null;
	    detachMarkedSpans(line);
	  }

	  function extractLineClasses(type, output) {
	    if (type) for (;;) {
	      var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
	      if (!lineClass) break;
	      type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
	      var prop = lineClass[1] ? "bgClass" : "textClass";
	      if (output[prop] == null)
	        output[prop] = lineClass[2];
	      else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(output[prop]))
	        output[prop] += " " + lineClass[2];
	    }
	    return type;
	  }

	  function callBlankLine(mode, state) {
	    if (mode.blankLine) return mode.blankLine(state);
	    if (!mode.innerMode) return;
	    var inner = CodeMirror.innerMode(mode, state);
	    if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
	  }

	  function readToken(mode, stream, state) {
	    for (var i = 0; i < 10; i++) {
	      var style = mode.token(stream, state);
	      if (stream.pos > stream.start) return style;
	    }
	    throw new Error("Mode " + mode.name + " failed to advance stream.");
	  }

	  // Run the given mode's parser over a line, calling f for each token.
	  function runMode(cm, text, mode, state, f, lineClasses, forceToEnd) {
	    var flattenSpans = mode.flattenSpans;
	    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
	    var curStart = 0, curStyle = null;
	    var stream = new StringStream(text, cm.options.tabSize), style;
	    if (text == "") extractLineClasses(callBlankLine(mode, state), lineClasses);
	    while (!stream.eol()) {
	      if (stream.pos > cm.options.maxHighlightLength) {
	        flattenSpans = false;
	        if (forceToEnd) processLine(cm, text, state, stream.pos);
	        stream.pos = text.length;
	        style = null;
	      } else {
	        style = extractLineClasses(readToken(mode, stream, state), lineClasses);
	      }
	      if (cm.options.addModeClass) {
	        var mName = CodeMirror.innerMode(mode, state).mode.name;
	        if (mName) style = "m-" + (style ? mName + " " + style : mName);
	      }
	      if (!flattenSpans || curStyle != style) {
	        if (curStart < stream.start) f(stream.start, curStyle);
	        curStart = stream.start; curStyle = style;
	      }
	      stream.start = stream.pos;
	    }
	    while (curStart < stream.pos) {
	      // Webkit seems to refuse to render text nodes longer than 57444 characters
	      var pos = Math.min(stream.pos, curStart + 50000);
	      f(pos, curStyle);
	      curStart = pos;
	    }
	  }

	  // Compute a style array (an array starting with a mode generation
	  // -- for invalidation -- followed by pairs of end positions and
	  // style strings), which is used to highlight the tokens on the
	  // line.
	  function highlightLine(cm, line, state, forceToEnd) {
	    // A styles array always starts with a number identifying the
	    // mode/overlays that it is based on (for easy invalidation).
	    var st = [cm.state.modeGen], lineClasses = {};
	    // Compute the base array of styles
	    runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
	      st.push(end, style);
	    }, lineClasses, forceToEnd);

	    // Run overlays, adjust style array.
	    for (var o = 0; o < cm.state.overlays.length; ++o) {
	      var overlay = cm.state.overlays[o], i = 1, at = 0;
	      runMode(cm, line.text, overlay.mode, true, function(end, style) {
	        var start = i;
	        // Ensure there's a token end at the current position, and that i points at it
	        while (at < end) {
	          var i_end = st[i];
	          if (i_end > end)
	            st.splice(i, 1, end, st[i+1], i_end);
	          i += 2;
	          at = Math.min(end, i_end);
	        }
	        if (!style) return;
	        if (overlay.opaque) {
	          st.splice(start, i - start, end, "cm-overlay " + style);
	          i = start + 2;
	        } else {
	          for (; start < i; start += 2) {
	            var cur = st[start+1];
	            st[start+1] = (cur ? cur + " " : "") + "cm-overlay " + style;
	          }
	        }
	      }, lineClasses);
	    }

	    return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null};
	  }

	  function getLineStyles(cm, line) {
	    if (!line.styles || line.styles[0] != cm.state.modeGen) {
	      var result = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));
	      line.styles = result.styles;
	      if (result.classes) line.styleClasses = result.classes;
	      else if (line.styleClasses) line.styleClasses = null;
	    }
	    return line.styles;
	  }

	  // Lightweight form of highlight -- proceed over this line and
	  // update state, but don't save a style array. Used for lines that
	  // aren't currently visible.
	  function processLine(cm, text, state, startAt) {
	    var mode = cm.doc.mode;
	    var stream = new StringStream(text, cm.options.tabSize);
	    stream.start = stream.pos = startAt || 0;
	    if (text == "") callBlankLine(mode, state);
	    while (!stream.eol() && stream.pos <= cm.options.maxHighlightLength) {
	      readToken(mode, stream, state);
	      stream.start = stream.pos;
	    }
	  }

	  // Convert a style as returned by a mode (either null, or a string
	  // containing one or more styles) to a CSS style. This is cached,
	  // and also looks for line-wide styles.
	  var styleToClassCache = {}, styleToClassCacheWithMode = {};
	  function interpretTokenStyle(style, options) {
	    if (!style || /^\s*$/.test(style)) return null;
	    var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
	    return cache[style] ||
	      (cache[style] = style.replace(/\S+/g, "cm-$&"));
	  }

	  // Render the DOM representation of the text of a line. Also builds
	  // up a 'line map', which points at the DOM nodes that represent
	  // specific stretches of text, and is used by the measuring code.
	  // The returned object contains the DOM node, this map, and
	  // information about line-wide styles that were set by the mode.
	  function buildLineContent(cm, lineView) {
	    // The padding-right forces the element to have a 'border', which
	    // is needed on Webkit to be able to get line-level bounding
	    // rectangles for it (in measureChar).
	    var content = elt("span", null, null, webkit ? "padding-right: .1px" : null);
	    var builder = {pre: elt("pre", [content]), content: content, col: 0, pos: 0, cm: cm};
	    lineView.measure = {};

	    // Iterate over the logical lines that make up this visual line.
	    for (var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
	      var line = i ? lineView.rest[i - 1] : lineView.line, order;
	      builder.pos = 0;
	      builder.addToken = buildToken;
	      // Optionally wire in some hacks into the token-rendering
	      // algorithm, to deal with browser quirks.
	      if ((ie || webkit) && cm.getOption("lineWrapping"))
	        builder.addToken = buildTokenSplitSpaces(builder.addToken);
	      if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line)))
	        builder.addToken = buildTokenBadBidi(builder.addToken, order);
	      builder.map = [];
	      insertLineContent(line, builder, getLineStyles(cm, line));
	      if (line.styleClasses) {
	        if (line.styleClasses.bgClass)
	          builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
	        if (line.styleClasses.textClass)
	          builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
	      }

	      // Ensure at least a single node is present, for measuring.
	      if (builder.map.length == 0)
	        builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));

	      // Store the map and a cache object for the current logical line
	      if (i == 0) {
	        lineView.measure.map = builder.map;
	        lineView.measure.cache = {};
	      } else {
	        (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
	        (lineView.measure.caches || (lineView.measure.caches = [])).push({});
	      }
	    }

	    signal(cm, "renderLine", cm, lineView.line, builder.pre);
	    if (builder.pre.className)
	      builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
	    return builder;
	  }

	  function defaultSpecialCharPlaceholder(ch) {
	    var token = elt("span", "\u2022", "cm-invalidchar");
	    token.title = "\\u" + ch.charCodeAt(0).toString(16);
	    return token;
	  }

	  // Build up the DOM representation for a single token, and add it to
	  // the line map. Takes care to render special characters separately.
	  function buildToken(builder, text, style, startStyle, endStyle, title) {
	    if (!text) return;
	    var special = builder.cm.options.specialChars, mustWrap = false;
	    if (!special.test(text)) {
	      builder.col += text.length;
	      var content = document.createTextNode(text);
	      builder.map.push(builder.pos, builder.pos + text.length, content);
	      if (ie && ie_version < 9) mustWrap = true;
	      builder.pos += text.length;
	    } else {
	      var content = document.createDocumentFragment(), pos = 0;
	      while (true) {
	        special.lastIndex = pos;
	        var m = special.exec(text);
	        var skipped = m ? m.index - pos : text.length - pos;
	        if (skipped) {
	          var txt = document.createTextNode(text.slice(pos, pos + skipped));
	          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
	          else content.appendChild(txt);
	          builder.map.push(builder.pos, builder.pos + skipped, txt);
	          builder.col += skipped;
	          builder.pos += skipped;
	        }
	        if (!m) break;
	        pos += skipped + 1;
	        if (m[0] == "\t") {
	          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
	          var txt = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
	          builder.col += tabWidth;
	        } else {
	          var txt = builder.cm.options.specialCharPlaceholder(m[0]);
	          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
	          else content.appendChild(txt);
	          builder.col += 1;
	        }
	        builder.map.push(builder.pos, builder.pos + 1, txt);
	        builder.pos++;
	      }
	    }
	    if (style || startStyle || endStyle || mustWrap) {
	      var fullStyle = style || "";
	      if (startStyle) fullStyle += startStyle;
	      if (endStyle) fullStyle += endStyle;
	      var token = elt("span", [content], fullStyle);
	      if (title) token.title = title;
	      return builder.content.appendChild(token);
	    }
	    builder.content.appendChild(content);
	  }

	  function buildTokenSplitSpaces(inner) {
	    function split(old) {
	      var out = " ";
	      for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : "\u00a0";
	      out += " ";
	      return out;
	    }
	    return function(builder, text, style, startStyle, endStyle, title) {
	      inner(builder, text.replace(/ {3,}/g, split), style, startStyle, endStyle, title);
	    };
	  }

	  // Work around nonsense dimensions being reported for stretches of
	  // right-to-left text.
	  function buildTokenBadBidi(inner, order) {
	    return function(builder, text, style, startStyle, endStyle, title) {
	      style = style ? style + " cm-force-border" : "cm-force-border";
	      var start = builder.pos, end = start + text.length;
	      for (;;) {
	        // Find the part that overlaps with the start of this text
	        for (var i = 0; i < order.length; i++) {
	          var part = order[i];
	          if (part.to > start && part.from <= start) break;
	        }
	        if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, title);
	        inner(builder, text.slice(0, part.to - start), style, startStyle, null, title);
	        startStyle = null;
	        text = text.slice(part.to - start);
	        start = part.to;
	      }
	    };
	  }

	  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
	    var widget = !ignoreWidget && marker.widgetNode;
	    if (widget) {
	      builder.map.push(builder.pos, builder.pos + size, widget);
	      builder.content.appendChild(widget);
	    }
	    builder.pos += size;
	  }

	  // Outputs a number of spans to make up a line, taking highlighting
	  // and marked text into account.
	  function insertLineContent(line, builder, styles) {
	    var spans = line.markedSpans, allText = line.text, at = 0;
	    if (!spans) {
	      for (var i = 1; i < styles.length; i+=2)
	        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder.cm.options));
	      return;
	    }

	    var len = allText.length, pos = 0, i = 1, text = "", style;
	    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
	    for (;;) {
	      if (nextChange == pos) { // Update current marker set
	        spanStyle = spanEndStyle = spanStartStyle = title = "";
	        collapsed = null; nextChange = Infinity;
	        var foundBookmarks = [];
	        for (var j = 0; j < spans.length; ++j) {
	          var sp = spans[j], m = sp.marker;
	          if (sp.from <= pos && (sp.to == null || sp.to > pos)) {
	            if (sp.to != null && nextChange > sp.to) { nextChange = sp.to; spanEndStyle = ""; }
	            if (m.className) spanStyle += " " + m.className;
	            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
	            if (m.endStyle && sp.to == nextChange) spanEndStyle += " " + m.endStyle;
	            if (m.title && !title) title = m.title;
	            if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0))
	              collapsed = sp;
	          } else if (sp.from > pos && nextChange > sp.from) {
	            nextChange = sp.from;
	          }
	          if (m.type == "bookmark" && sp.from == pos && m.widgetNode) foundBookmarks.push(m);
	        }
	        if (collapsed && (collapsed.from || 0) == pos) {
	          buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos,
	                             collapsed.marker, collapsed.from == null);
	          if (collapsed.to == null) return;
	        }
	        if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
	          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
	      }
	      if (pos >= len) break;

	      var upto = Math.min(len, nextChange);
	      while (true) {
	        if (text) {
	          var end = pos + text.length;
	          if (!collapsed) {
	            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
	            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
	                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title);
	          }
	          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
	          pos = end;
	          spanStartStyle = "";
	        }
	        text = allText.slice(at, at = styles[i++]);
	        style = interpretTokenStyle(styles[i++], builder.cm.options);
	      }
	    }
	  }

	  // DOCUMENT DATA STRUCTURE

	  // By default, updates that start and end at the beginning of a line
	  // are treated specially, in order to make the association of line
	  // widgets and marker elements with the text behave more intuitive.
	  function isWholeLineUpdate(doc, change) {
	    return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" &&
	      (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
	  }

	  // Perform a change on the document data structure.
	  function updateDoc(doc, change, markedSpans, estimateHeight) {
	    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
	    function update(line, text, spans) {
	      updateLine(line, text, spans, estimateHeight);
	      signalLater(line, "change", line, change);
	    }

	    var from = change.from, to = change.to, text = change.text;
	    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
	    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

	    // Adjust the line structure
	    if (isWholeLineUpdate(doc, change)) {
	      // This is a whole-line replace. Treated specially to make
	      // sure line objects move the way they are supposed to.
	      for (var i = 0, added = []; i < text.length - 1; ++i)
	        added.push(new Line(text[i], spansFor(i), estimateHeight));
	      update(lastLine, lastLine.text, lastSpans);
	      if (nlines) doc.remove(from.line, nlines);
	      if (added.length) doc.insert(from.line, added);
	    } else if (firstLine == lastLine) {
	      if (text.length == 1) {
	        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
	      } else {
	        for (var added = [], i = 1; i < text.length - 1; ++i)
	          added.push(new Line(text[i], spansFor(i), estimateHeight));
	        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
	        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
	        doc.insert(from.line + 1, added);
	      }
	    } else if (text.length == 1) {
	      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
	      doc.remove(from.line + 1, nlines);
	    } else {
	      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
	      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
	      for (var i = 1, added = []; i < text.length - 1; ++i)
	        added.push(new Line(text[i], spansFor(i), estimateHeight));
	      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
	      doc.insert(from.line + 1, added);
	    }

	    signalLater(doc, "change", doc, change);
	  }

	  // The document is represented as a BTree consisting of leaves, with
	  // chunk of lines in them, and branches, with up to ten leaves or
	  // other branch nodes below them. The top node is always a branch
	  // node, and is the document object itself (meaning it has
	  // additional methods and properties).
	  //
	  // All nodes have parent links. The tree is used both to go from
	  // line numbers to line objects, and to go from objects to numbers.
	  // It also indexes by height, and is used to convert between height
	  // and line object, and to find the total height of the document.
	  //
	  // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html

	  function LeafChunk(lines) {
	    this.lines = lines;
	    this.parent = null;
	    for (var i = 0, height = 0; i < lines.length; ++i) {
	      lines[i].parent = this;
	      height += lines[i].height;
	    }
	    this.height = height;
	  }

	  LeafChunk.prototype = {
	    chunkSize: function() { return this.lines.length; },
	    // Remove the n lines at offset 'at'.
	    removeInner: function(at, n) {
	      for (var i = at, e = at + n; i < e; ++i) {
	        var line = this.lines[i];
	        this.height -= line.height;
	        cleanUpLine(line);
	        signalLater(line, "delete");
	      }
	      this.lines.splice(at, n);
	    },
	    // Helper used to collapse a small branch into a single leaf.
	    collapse: function(lines) {
	      lines.push.apply(lines, this.lines);
	    },
	    // Insert the given array of lines at offset 'at', count them as
	    // having the given height.
	    insertInner: function(at, lines, height) {
	      this.height += height;
	      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
	      for (var i = 0; i < lines.length; ++i) lines[i].parent = this;
	    },
	    // Used to iterate over a part of the tree.
	    iterN: function(at, n, op) {
	      for (var e = at + n; at < e; ++at)
	        if (op(this.lines[at])) return true;
	    }
	  };

	  function BranchChunk(children) {
	    this.children = children;
	    var size = 0, height = 0;
	    for (var i = 0; i < children.length; ++i) {
	      var ch = children[i];
	      size += ch.chunkSize(); height += ch.height;
	      ch.parent = this;
	    }
	    this.size = size;
	    this.height = height;
	    this.parent = null;
	  }

	  BranchChunk.prototype = {
	    chunkSize: function() { return this.size; },
	    removeInner: function(at, n) {
	      this.size -= n;
	      for (var i = 0; i < this.children.length; ++i) {
	        var child = this.children[i], sz = child.chunkSize();
	        if (at < sz) {
	          var rm = Math.min(n, sz - at), oldHeight = child.height;
	          child.removeInner(at, rm);
	          this.height -= oldHeight - child.height;
	          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
	          if ((n -= rm) == 0) break;
	          at = 0;
	        } else at -= sz;
	      }
	      // If the result is smaller than 25 lines, ensure that it is a
	      // single leaf node.
	      if (this.size - n < 25 &&
	          (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
	        var lines = [];
	        this.collapse(lines);
	        this.children = [new LeafChunk(lines)];
	        this.children[0].parent = this;
	      }
	    },
	    collapse: function(lines) {
	      for (var i = 0; i < this.children.length; ++i) this.children[i].collapse(lines);
	    },
	    insertInner: function(at, lines, height) {
	      this.size += lines.length;
	      this.height += height;
	      for (var i = 0; i < this.children.length; ++i) {
	        var child = this.children[i], sz = child.chunkSize();
	        if (at <= sz) {
	          child.insertInner(at, lines, height);
	          if (child.lines && child.lines.length > 50) {
	            while (child.lines.length > 50) {
	              var spilled = child.lines.splice(child.lines.length - 25, 25);
	              var newleaf = new LeafChunk(spilled);
	              child.height -= newleaf.height;
	              this.children.splice(i + 1, 0, newleaf);
	              newleaf.parent = this;
	            }
	            this.maybeSpill();
	          }
	          break;
	        }
	        at -= sz;
	      }
	    },
	    // When a node has grown, check whether it should be split.
	    maybeSpill: function() {
	      if (this.children.length <= 10) return;
	      var me = this;
	      do {
	        var spilled = me.children.splice(me.children.length - 5, 5);
	        var sibling = new BranchChunk(spilled);
	        if (!me.parent) { // Become the parent node
	          var copy = new BranchChunk(me.children);
	          copy.parent = me;
	          me.children = [copy, sibling];
	          me = copy;
	        } else {
	          me.size -= sibling.size;
	          me.height -= sibling.height;
	          var myIndex = indexOf(me.parent.children, me);
	          me.parent.children.splice(myIndex + 1, 0, sibling);
	        }
	        sibling.parent = me.parent;
	      } while (me.children.length > 10);
	      me.parent.maybeSpill();
	    },
	    iterN: function(at, n, op) {
	      for (var i = 0; i < this.children.length; ++i) {
	        var child = this.children[i], sz = child.chunkSize();
	        if (at < sz) {
	          var used = Math.min(n, sz - at);
	          if (child.iterN(at, used, op)) return true;
	          if ((n -= used) == 0) break;
	          at = 0;
	        } else at -= sz;
	      }
	    }
	  };

	  var nextDocId = 0;
	  var Doc = CodeMirror.Doc = function(text, mode, firstLine) {
	    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
	    if (firstLine == null) firstLine = 0;

	    BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
	    this.first = firstLine;
	    this.scrollTop = this.scrollLeft = 0;
	    this.cantEdit = false;
	    this.cleanGeneration = 1;
	    this.frontier = firstLine;
	    var start = Pos(firstLine, 0);
	    this.sel = simpleSelection(start);
	    this.history = new History(null);
	    this.id = ++nextDocId;
	    this.modeOption = mode;

	    if (typeof text == "string") text = splitLines(text);
	    updateDoc(this, {from: start, to: start, text: text});
	    setSelection(this, simpleSelection(start), sel_dontScroll);
	  };

	  Doc.prototype = createObj(BranchChunk.prototype, {
	    constructor: Doc,
	    // Iterate over the document. Supports two forms -- with only one
	    // argument, it calls that for each line in the document. With
	    // three, it iterates over the range given by the first two (with
	    // the second being non-inclusive).
	    iter: function(from, to, op) {
	      if (op) this.iterN(from - this.first, to - from, op);
	      else this.iterN(this.first, this.first + this.size, from);
	    },

	    // Non-public interface for adding and removing lines.
	    insert: function(at, lines) {
	      var height = 0;
	      for (var i = 0; i < lines.length; ++i) height += lines[i].height;
	      this.insertInner(at - this.first, lines, height);
	    },
	    remove: function(at, n) { this.removeInner(at - this.first, n); },

	    // From here, the methods are part of the public interface. Most
	    // are also available from CodeMirror (editor) instances.

	    getValue: function(lineSep) {
	      var lines = getLines(this, this.first, this.first + this.size);
	      if (lineSep === false) return lines;
	      return lines.join(lineSep || "\n");
	    },
	    setValue: docMethodOp(function(code) {
	      var top = Pos(this.first, 0), last = this.first + this.size - 1;
	      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
	                        text: splitLines(code), origin: "setValue"}, true);
	      setSelection(this, simpleSelection(top));
	    }),
	    replaceRange: function(code, from, to, origin) {
	      from = clipPos(this, from);
	      to = to ? clipPos(this, to) : from;
	      replaceRange(this, code, from, to, origin);
	    },
	    getRange: function(from, to, lineSep) {
	      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
	      if (lineSep === false) return lines;
	      return lines.join(lineSep || "\n");
	    },

	    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},

	    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
	    getLineNumber: function(line) {return lineNo(line);},

	    getLineHandleVisualStart: function(line) {
	      if (typeof line == "number") line = getLine(this, line);
	      return visualLine(line);
	    },

	    lineCount: function() {return this.size;},
	    firstLine: function() {return this.first;},
	    lastLine: function() {return this.first + this.size - 1;},

	    clipPos: function(pos) {return clipPos(this, pos);},

	    getCursor: function(start) {
	      var range = this.sel.primary(), pos;
	      if (start == null || start == "head") pos = range.head;
	      else if (start == "anchor") pos = range.anchor;
	      else if (start == "end" || start == "to" || start === false) pos = range.to();
	      else pos = range.from();
	      return pos;
	    },
	    listSelections: function() { return this.sel.ranges; },
	    somethingSelected: function() {return this.sel.somethingSelected();},

	    setCursor: docMethodOp(function(line, ch, options) {
	      setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
	    }),
	    setSelection: docMethodOp(function(anchor, head, options) {
	      setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
	    }),
	    extendSelection: docMethodOp(function(head, other, options) {
	      extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
	    }),
	    extendSelections: docMethodOp(function(heads, options) {
	      extendSelections(this, clipPosArray(this, heads, options));
	    }),
	    extendSelectionsBy: docMethodOp(function(f, options) {
	      extendSelections(this, map(this.sel.ranges, f), options);
	    }),
	    setSelections: docMethodOp(function(ranges, primary, options) {
	      if (!ranges.length) return;
	      for (var i = 0, out = []; i < ranges.length; i++)
	        out[i] = new Range(clipPos(this, ranges[i].anchor),
	                           clipPos(this, ranges[i].head));
	      if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
	      setSelection(this, normalizeSelection(out, primary), options);
	    }),
	    addSelection: docMethodOp(function(anchor, head, options) {
	      var ranges = this.sel.ranges.slice(0);
	      ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
	      setSelection(this, normalizeSelection(ranges, ranges.length - 1), options);
	    }),

	    getSelection: function(lineSep) {
	      var ranges = this.sel.ranges, lines;
	      for (var i = 0; i < ranges.length; i++) {
	        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
	        lines = lines ? lines.concat(sel) : sel;
	      }
	      if (lineSep === false) return lines;
	      else return lines.join(lineSep || "\n");
	    },
	    getSelections: function(lineSep) {
	      var parts = [], ranges = this.sel.ranges;
	      for (var i = 0; i < ranges.length; i++) {
	        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
	        if (lineSep !== false) sel = sel.join(lineSep || "\n");
	        parts[i] = sel;
	      }
	      return parts;
	    },
	    replaceSelection: function(code, collapse, origin) {
	      var dup = [];
	      for (var i = 0; i < this.sel.ranges.length; i++)
	        dup[i] = code;
	      this.replaceSelections(dup, collapse, origin || "+input");
	    },
	    replaceSelections: docMethodOp(function(code, collapse, origin) {
	      var changes = [], sel = this.sel;
	      for (var i = 0; i < sel.ranges.length; i++) {
	        var range = sel.ranges[i];
	        changes[i] = {from: range.from(), to: range.to(), text: splitLines(code[i]), origin: origin};
	      }
	      var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
	      for (var i = changes.length - 1; i >= 0; i--)
	        makeChange(this, changes[i]);
	      if (newSel) setSelectionReplaceHistory(this, newSel);
	      else if (this.cm) ensureCursorVisible(this.cm);
	    }),
	    undo: docMethodOp(function() {makeChangeFromHistory(this, "undo");}),
	    redo: docMethodOp(function() {makeChangeFromHistory(this, "redo");}),
	    undoSelection: docMethodOp(function() {makeChangeFromHistory(this, "undo", true);}),
	    redoSelection: docMethodOp(function() {makeChangeFromHistory(this, "redo", true);}),

	    setExtending: function(val) {this.extend = val;},
	    getExtending: function() {return this.extend;},

	    historySize: function() {
	      var hist = this.history, done = 0, undone = 0;
	      for (var i = 0; i < hist.done.length; i++) if (!hist.done[i].ranges) ++done;
	      for (var i = 0; i < hist.undone.length; i++) if (!hist.undone[i].ranges) ++undone;
	      return {undo: done, redo: undone};
	    },
	    clearHistory: function() {this.history = new History(this.history.maxGeneration);},

	    markClean: function() {
	      this.cleanGeneration = this.changeGeneration(true);
	    },
	    changeGeneration: function(forceSplit) {
	      if (forceSplit)
	        this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
	      return this.history.generation;
	    },
	    isClean: function (gen) {
	      return this.history.generation == (gen || this.cleanGeneration);
	    },

	    getHistory: function() {
	      return {done: copyHistoryArray(this.history.done),
	              undone: copyHistoryArray(this.history.undone)};
	    },
	    setHistory: function(histData) {
	      var hist = this.history = new History(this.history.maxGeneration);
	      hist.done = copyHistoryArray(histData.done.slice(0), null, true);
	      hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
	    },

	    addLineClass: docMethodOp(function(handle, where, cls) {
	      return changeLine(this, handle, "class", function(line) {
	        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
	        if (!line[prop]) line[prop] = cls;
	        else if (new RegExp("(?:^|\\s)" + cls + "(?:$|\\s)").test(line[prop])) return false;
	        else line[prop] += " " + cls;
	        return true;
	      });
	    }),
	    removeLineClass: docMethodOp(function(handle, where, cls) {
	      return changeLine(this, handle, "class", function(line) {
	        var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : "wrapClass";
	        var cur = line[prop];
	        if (!cur) return false;
	        else if (cls == null) line[prop] = null;
	        else {
	          var found = cur.match(new RegExp("(?:^|\\s+)" + cls + "(?:$|\\s+)"));
	          if (!found) return false;
	          var end = found.index + found[0].length;
	          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
	        }
	        return true;
	      });
	    }),

	    markText: function(from, to, options) {
	      return markText(this, clipPos(this, from), clipPos(this, to), options, "range");
	    },
	    setBookmark: function(pos, options) {
	      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
	                      insertLeft: options && options.insertLeft,
	                      clearWhenEmpty: false, shared: options && options.shared};
	      pos = clipPos(this, pos);
	      return markText(this, pos, pos, realOpts, "bookmark");
	    },
	    findMarksAt: function(pos) {
	      pos = clipPos(this, pos);
	      var markers = [], spans = getLine(this, pos.line).markedSpans;
	      if (spans) for (var i = 0; i < spans.length; ++i) {
	        var span = spans[i];
	        if ((span.from == null || span.from <= pos.ch) &&
	            (span.to == null || span.to >= pos.ch))
	          markers.push(span.marker.parent || span.marker);
	      }
	      return markers;
	    },
	    findMarks: function(from, to, filter) {
	      from = clipPos(this, from); to = clipPos(this, to);
	      var found = [], lineNo = from.line;
	      this.iter(from.line, to.line + 1, function(line) {
	        var spans = line.markedSpans;
	        if (spans) for (var i = 0; i < spans.length; i++) {
	          var span = spans[i];
	          if (!(lineNo == from.line && from.ch > span.to ||
	                span.from == null && lineNo != from.line||
	                lineNo == to.line && span.from > to.ch) &&
	              (!filter || filter(span.marker)))
	            found.push(span.marker.parent || span.marker);
	        }
	        ++lineNo;
	      });
	      return found;
	    },
	    getAllMarks: function() {
	      var markers = [];
	      this.iter(function(line) {
	        var sps = line.markedSpans;
	        if (sps) for (var i = 0; i < sps.length; ++i)
	          if (sps[i].from != null) markers.push(sps[i].marker);
	      });
	      return markers;
	    },

	    posFromIndex: function(off) {
	      var ch, lineNo = this.first;
	      this.iter(function(line) {
	        var sz = line.text.length + 1;
	        if (sz > off) { ch = off; return true; }
	        off -= sz;
	        ++lineNo;
	      });
	      return clipPos(this, Pos(lineNo, ch));
	    },
	    indexFromPos: function (coords) {
	      coords = clipPos(this, coords);
	      var index = coords.ch;
	      if (coords.line < this.first || coords.ch < 0) return 0;
	      this.iter(this.first, coords.line, function (line) {
	        index += line.text.length + 1;
	      });
	      return index;
	    },

	    copy: function(copyHistory) {
	      var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
	      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
	      doc.sel = this.sel;
	      doc.extend = false;
	      if (copyHistory) {
	        doc.history.undoDepth = this.history.undoDepth;
	        doc.setHistory(this.getHistory());
	      }
	      return doc;
	    },

	    linkedDoc: function(options) {
	      if (!options) options = {};
	      var from = this.first, to = this.first + this.size;
	      if (options.from != null && options.from > from) from = options.from;
	      if (options.to != null && options.to < to) to = options.to;
	      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
	      if (options.sharedHist) copy.history = this.history;
	      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
	      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
	      copySharedMarkers(copy, findSharedMarkers(this));
	      return copy;
	    },
	    unlinkDoc: function(other) {
	      if (other instanceof CodeMirror) other = other.doc;
	      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
	        var link = this.linked[i];
	        if (link.doc != other) continue;
	        this.linked.splice(i, 1);
	        other.unlinkDoc(this);
	        detachSharedMarkers(findSharedMarkers(this));
	        break;
	      }
	      // If the histories were shared, split them again
	      if (other.history == this.history) {
	        var splitIds = [other.id];
	        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
	        other.history = new History(null);
	        other.history.done = copyHistoryArray(this.history.done, splitIds);
	        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
	      }
	    },
	    iterLinkedDocs: function(f) {linkedDocs(this, f);},

	    getMode: function() {return this.mode;},
	    getEditor: function() {return this.cm;}
	  });

	  // Public alias.
	  Doc.prototype.eachLine = Doc.prototype.iter;

	  // Set up methods on CodeMirror's prototype to redirect to the editor's document.
	  var dontDelegate = "iter insert remove copy getEditor".split(" ");
	  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
	    CodeMirror.prototype[prop] = (function(method) {
	      return function() {return method.apply(this.doc, arguments);};
	    })(Doc.prototype[prop]);

	  eventMixin(Doc);

	  // Call f for all linked documents.
	  function linkedDocs(doc, f, sharedHistOnly) {
	    function propagate(doc, skip, sharedHist) {
	      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
	        var rel = doc.linked[i];
	        if (rel.doc == skip) continue;
	        var shared = sharedHist && rel.sharedHist;
	        if (sharedHistOnly && !shared) continue;
	        f(rel.doc, shared);
	        propagate(rel.doc, doc, shared);
	      }
	    }
	    propagate(doc, null, true);
	  }

	  // Attach a document to an editor.
	  function attachDoc(cm, doc) {
	    if (doc.cm) throw new Error("This document is already in use.");
	    cm.doc = doc;
	    doc.cm = cm;
	    estimateLineHeights(cm);
	    loadMode(cm);
	    if (!cm.options.lineWrapping) findMaxLine(cm);
	    cm.options.mode = doc.modeOption;
	    regChange(cm);
	  }

	  // LINE UTILITIES

	  // Find the line object corresponding to the given line number.
	  function getLine(doc, n) {
	    n -= doc.first;
	    if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
	    for (var chunk = doc; !chunk.lines;) {
	      for (var i = 0;; ++i) {
	        var child = chunk.children[i], sz = child.chunkSize();
	        if (n < sz) { chunk = child; break; }
	        n -= sz;
	      }
	    }
	    return chunk.lines[n];
	  }

	  // Get the part of a document between two positions, as an array of
	  // strings.
	  function getBetween(doc, start, end) {
	    var out = [], n = start.line;
	    doc.iter(start.line, end.line + 1, function(line) {
	      var text = line.text;
	      if (n == end.line) text = text.slice(0, end.ch);
	      if (n == start.line) text = text.slice(start.ch);
	      out.push(text);
	      ++n;
	    });
	    return out;
	  }
	  // Get the lines between from and to, as array of strings.
	  function getLines(doc, from, to) {
	    var out = [];
	    doc.iter(from, to, function(line) { out.push(line.text); });
	    return out;
	  }

	  // Update the height of a line, propagating the height change
	  // upwards to parent nodes.
	  function updateLineHeight(line, height) {
	    var diff = height - line.height;
	    if (diff) for (var n = line; n; n = n.parent) n.height += diff;
	  }

	  // Given a line object, find its line number by walking up through
	  // its parent links.
	  function lineNo(line) {
	    if (line.parent == null) return null;
	    var cur = line.parent, no = indexOf(cur.lines, line);
	    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
	      for (var i = 0;; ++i) {
	        if (chunk.children[i] == cur) break;
	        no += chunk.children[i].chunkSize();
	      }
	    }
	    return no + cur.first;
	  }

	  // Find the line at the given vertical position, using the height
	  // information in the document tree.
	  function lineAtHeight(chunk, h) {
	    var n = chunk.first;
	    outer: do {
	      for (var i = 0; i < chunk.children.length; ++i) {
	        var child = chunk.children[i], ch = child.height;
	        if (h < ch) { chunk = child; continue outer; }
	        h -= ch;
	        n += child.chunkSize();
	      }
	      return n;
	    } while (!chunk.lines);
	    for (var i = 0; i < chunk.lines.length; ++i) {
	      var line = chunk.lines[i], lh = line.height;
	      if (h < lh) break;
	      h -= lh;
	    }
	    return n + i;
	  }


	  // Find the height above the given line.
	  function heightAtLine(lineObj) {
	    lineObj = visualLine(lineObj);

	    var h = 0, chunk = lineObj.parent;
	    for (var i = 0; i < chunk.lines.length; ++i) {
	      var line = chunk.lines[i];
	      if (line == lineObj) break;
	      else h += line.height;
	    }
	    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
	      for (var i = 0; i < p.children.length; ++i) {
	        var cur = p.children[i];
	        if (cur == chunk) break;
	        else h += cur.height;
	      }
	    }
	    return h;
	  }

	  // Get the bidi ordering for the given line (and cache it). Returns
	  // false for lines that are fully left-to-right, and an array of
	  // BidiSpan objects otherwise.
	  function getOrder(line) {
	    var order = line.order;
	    if (order == null) order = line.order = bidiOrdering(line.text);
	    return order;
	  }

	  // HISTORY

	  function History(startGen) {
	    // Arrays of change events and selections. Doing something adds an
	    // event to done and clears undo. Undoing moves events from done
	    // to undone, redoing moves them in the other direction.
	    this.done = []; this.undone = [];
	    this.undoDepth = Infinity;
	    // Used to track when changes can be merged into a single undo
	    // event
	    this.lastModTime = this.lastSelTime = 0;
	    this.lastOp = this.lastSelOp = null;
	    this.lastOrigin = this.lastSelOrigin = null;
	    // Used by the isClean() method
	    this.generation = this.maxGeneration = startGen || 1;
	  }

	  // Create a history change event from an updateDoc-style change
	  // object.
	  function historyChangeFromChange(doc, change) {
	    var histChange = {from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
	    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
	    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
	    return histChange;
	  }

	  // Pop all selection events off the end of a history array. Stop at
	  // a change event.
	  function clearSelectionEvents(array) {
	    while (array.length) {
	      var last = lst(array);
	      if (last.ranges) array.pop();
	      else break;
	    }
	  }

	  // Find the top change event in the history. Pop off selection
	  // events that are in the way.
	  function lastChangeEvent(hist, force) {
	    if (force) {
	      clearSelectionEvents(hist.done);
	      return lst(hist.done);
	    } else if (hist.done.length && !lst(hist.done).ranges) {
	      return lst(hist.done);
	    } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
	      hist.done.pop();
	      return lst(hist.done);
	    }
	  }

	  // Register a change in the history. Merges changes that are within
	  // a single operation, ore are close together with an origin that
	  // allows merging (starting with "+") into a single event.
	  function addChangeToHistory(doc, change, selAfter, opId) {
	    var hist = doc.history;
	    hist.undone.length = 0;
	    var time = +new Date, cur;

	    if ((hist.lastOp == opId ||
	         hist.lastOrigin == change.origin && change.origin &&
	         ((change.origin.charAt(0) == "+" && doc.cm && hist.lastModTime > time - doc.cm.options.historyEventDelay) ||
	          change.origin.charAt(0) == "*")) &&
	        (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
	      // Merge this change into the last event
	      var last = lst(cur.changes);
	      if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
	        // Optimized case for simple insertion -- don't want to add
	        // new changesets for every character typed
	        last.to = changeEnd(change);
	      } else {
	        // Add new sub-event
	        cur.changes.push(historyChangeFromChange(doc, change));
	      }
	    } else {
	      // Can not be merged, start a new event.
	      var before = lst(hist.done);
	      if (!before || !before.ranges)
	        pushSelectionToHistory(doc.sel, hist.done);
	      cur = {changes: [historyChangeFromChange(doc, change)],
	             generation: hist.generation};
	      hist.done.push(cur);
	      while (hist.done.length > hist.undoDepth) {
	        hist.done.shift();
	        if (!hist.done[0].ranges) hist.done.shift();
	      }
	    }
	    hist.done.push(selAfter);
	    hist.generation = ++hist.maxGeneration;
	    hist.lastModTime = hist.lastSelTime = time;
	    hist.lastOp = hist.lastSelOp = opId;
	    hist.lastOrigin = hist.lastSelOrigin = change.origin;

	    if (!last) signal(doc, "historyAdded");
	  }

	  function selectionEventCanBeMerged(doc, origin, prev, sel) {
	    var ch = origin.charAt(0);
	    return ch == "*" ||
	      ch == "+" &&
	      prev.ranges.length == sel.ranges.length &&
	      prev.somethingSelected() == sel.somethingSelected() &&
	      new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
	  }

	  // Called whenever the selection changes, sets the new selection as
	  // the pending selection in the history, and pushes the old pending
	  // selection into the 'done' array when it was significantly
	  // different (in number of selected ranges, emptiness, or time).
	  function addSelectionToHistory(doc, sel, opId, options) {
	    var hist = doc.history, origin = options && options.origin;

	    // A new event is started when the previous origin does not match
	    // the current, or the origins don't allow matching. Origins
	    // starting with * are always merged, those starting with + are
	    // merged when similar and close together in time.
	    if (opId == hist.lastSelOp ||
	        (origin && hist.lastSelOrigin == origin &&
	         (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin ||
	          selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))))
	      hist.done[hist.done.length - 1] = sel;
	    else
	      pushSelectionToHistory(sel, hist.done);

	    hist.lastSelTime = +new Date;
	    hist.lastSelOrigin = origin;
	    hist.lastSelOp = opId;
	    if (options && options.clearRedo !== false)
	      clearSelectionEvents(hist.undone);
	  }

	  function pushSelectionToHistory(sel, dest) {
	    var top = lst(dest);
	    if (!(top && top.ranges && top.equals(sel)))
	      dest.push(sel);
	  }

	  // Used to store marked span information in the history.
	  function attachLocalSpans(doc, change, from, to) {
	    var existing = change["spans_" + doc.id], n = 0;
	    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
	      if (line.markedSpans)
	        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
	      ++n;
	    });
	  }

	  // When un/re-doing restores text containing marked spans, those
	  // that have been explicitly cleared should not be restored.
	  function removeClearedSpans(spans) {
	    if (!spans) return null;
	    for (var i = 0, out; i < spans.length; ++i) {
	      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
	      else if (out) out.push(spans[i]);
	    }
	    return !out ? spans : out.length ? out : null;
	  }

	  // Retrieve and filter the old marked spans stored in a change event.
	  function getOldSpans(doc, change) {
	    var found = change["spans_" + doc.id];
	    if (!found) return null;
	    for (var i = 0, nw = []; i < change.text.length; ++i)
	      nw.push(removeClearedSpans(found[i]));
	    return nw;
	  }

	  // Used both to provide a JSON-safe object in .getHistory, and, when
	  // detaching a document, to split the history in two
	  function copyHistoryArray(events, newGroup, instantiateSel) {
	    for (var i = 0, copy = []; i < events.length; ++i) {
	      var event = events[i];
	      if (event.ranges) {
	        copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
	        continue;
	      }
	      var changes = event.changes, newChanges = [];
	      copy.push({changes: newChanges});
	      for (var j = 0; j < changes.length; ++j) {
	        var change = changes[j], m;
	        newChanges.push({from: change.from, to: change.to, text: change.text});
	        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
	          if (indexOf(newGroup, Number(m[1])) > -1) {
	            lst(newChanges)[prop] = change[prop];
	            delete change[prop];
	          }
	        }
	      }
	    }
	    return copy;
	  }

	  // Rebasing/resetting history to deal with externally-sourced changes

	  function rebaseHistSelSingle(pos, from, to, diff) {
	    if (to < pos.line) {
	      pos.line += diff;
	    } else if (from < pos.line) {
	      pos.line = from;
	      pos.ch = 0;
	    }
	  }

	  // Tries to rebase an array of history events given a change in the
	  // document. If the change touches the same lines as the event, the
	  // event, and everything 'behind' it, is discarded. If the change is
	  // before the event, the event's positions are updated. Uses a
	  // copy-on-write scheme for the positions, to avoid having to
	  // reallocate them all on every rebase, but also avoid problems with
	  // shared position objects being unsafely updated.
	  function rebaseHistArray(array, from, to, diff) {
	    for (var i = 0; i < array.length; ++i) {
	      var sub = array[i], ok = true;
	      if (sub.ranges) {
	        if (!sub.copied) { sub = array[i] = sub.deepCopy(); sub.copied = true; }
	        for (var j = 0; j < sub.ranges.length; j++) {
	          rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
	          rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
	        }
	        continue;
	      }
	      for (var j = 0; j < sub.changes.length; ++j) {
	        var cur = sub.changes[j];
	        if (to < cur.from.line) {
	          cur.from = Pos(cur.from.line + diff, cur.from.ch);
	          cur.to = Pos(cur.to.line + diff, cur.to.ch);
	        } else if (from <= cur.to.line) {
	          ok = false;
	          break;
	        }
	      }
	      if (!ok) {
	        array.splice(0, i + 1);
	        i = 0;
	      }
	    }
	  }

	  function rebaseHist(hist, change) {
	    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
	    rebaseHistArray(hist.done, from, to, diff);
	    rebaseHistArray(hist.undone, from, to, diff);
	  }

	  // EVENT UTILITIES

	  // Due to the fact that we still support jurassic IE versions, some
	  // compatibility wrappers are needed.

	  var e_preventDefault = CodeMirror.e_preventDefault = function(e) {
	    if (e.preventDefault) e.preventDefault();
	    else e.returnValue = false;
	  };
	  var e_stopPropagation = CodeMirror.e_stopPropagation = function(e) {
	    if (e.stopPropagation) e.stopPropagation();
	    else e.cancelBubble = true;
	  };
	  function e_defaultPrevented(e) {
	    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
	  }
	  var e_stop = CodeMirror.e_stop = function(e) {e_preventDefault(e); e_stopPropagation(e);};

	  function e_target(e) {return e.target || e.srcElement;}
	  function e_button(e) {
	    var b = e.which;
	    if (b == null) {
	      if (e.button & 1) b = 1;
	      else if (e.button & 2) b = 3;
	      else if (e.button & 4) b = 2;
	    }
	    if (mac && e.ctrlKey && b == 1) b = 3;
	    return b;
	  }

	  // EVENT HANDLING

	  // Lightweight event framework. on/off also work on DOM nodes,
	  // registering native DOM handlers.

	  var on = CodeMirror.on = function(emitter, type, f) {
	    if (emitter.addEventListener)
	      emitter.addEventListener(type, f, false);
	    else if (emitter.attachEvent)
	      emitter.attachEvent("on" + type, f);
	    else {
	      var map = emitter._handlers || (emitter._handlers = {});
	      var arr = map[type] || (map[type] = []);
	      arr.push(f);
	    }
	  };

	  var off = CodeMirror.off = function(emitter, type, f) {
	    if (emitter.removeEventListener)
	      emitter.removeEventListener(type, f, false);
	    else if (emitter.detachEvent)
	      emitter.detachEvent("on" + type, f);
	    else {
	      var arr = emitter._handlers && emitter._handlers[type];
	      if (!arr) return;
	      for (var i = 0; i < arr.length; ++i)
	        if (arr[i] == f) { arr.splice(i, 1); break; }
	    }
	  };

	  var signal = CodeMirror.signal = function(emitter, type /*, values...*/) {
	    var arr = emitter._handlers && emitter._handlers[type];
	    if (!arr) return;
	    var args = Array.prototype.slice.call(arguments, 2);
	    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
	  };

	  var orphanDelayedCallbacks = null;

	  // Often, we want to signal events at a point where we are in the
	  // middle of some work, but don't want the handler to start calling
	  // other methods on the editor, which might be in an inconsistent
	  // state or simply not expect any other events to happen.
	  // signalLater looks whether there are any handlers, and schedules
	  // them to be executed when the last operation ends, or, if no
	  // operation is active, when a timeout fires.
	  function signalLater(emitter, type /*, values...*/) {
	    var arr = emitter._handlers && emitter._handlers[type];
	    if (!arr) return;
	    var args = Array.prototype.slice.call(arguments, 2), list;
	    if (operationGroup) {
	      list = operationGroup.delayedCallbacks;
	    } else if (orphanDelayedCallbacks) {
	      list = orphanDelayedCallbacks;
	    } else {
	      list = orphanDelayedCallbacks = [];
	      setTimeout(fireOrphanDelayed, 0);
	    }
	    function bnd(f) {return function(){f.apply(null, args);};};
	    for (var i = 0; i < arr.length; ++i)
	      list.push(bnd(arr[i]));
	  }

	  function fireOrphanDelayed() {
	    var delayed = orphanDelayedCallbacks;
	    orphanDelayedCallbacks = null;
	    for (var i = 0; i < delayed.length; ++i) delayed[i]();
	  }

	  // The DOM events that CodeMirror handles can be overridden by
	  // registering a (non-DOM) handler on the editor for the event name,
	  // and preventDefault-ing the event in that handler.
	  function signalDOMEvent(cm, e, override) {
	    signal(cm, override || e.type, cm, e);
	    return e_defaultPrevented(e) || e.codemirrorIgnore;
	  }

	  function signalCursorActivity(cm) {
	    var arr = cm._handlers && cm._handlers.cursorActivity;
	    if (!arr) return;
	    var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
	    for (var i = 0; i < arr.length; ++i) if (indexOf(set, arr[i]) == -1)
	      set.push(arr[i]);
	  }

	  function hasHandler(emitter, type) {
	    var arr = emitter._handlers && emitter._handlers[type];
	    return arr && arr.length > 0;
	  }

	  // Add on and off methods to a constructor's prototype, to make
	  // registering events on such objects more convenient.
	  function eventMixin(ctor) {
	    ctor.prototype.on = function(type, f) {on(this, type, f);};
	    ctor.prototype.off = function(type, f) {off(this, type, f);};
	  }

	  // MISC UTILITIES

	  // Number of pixels added to scroller and sizer to hide scrollbar
	  var scrollerCutOff = 30;

	  // Returned or thrown by various protocols to signal 'I'm not
	  // handling this'.
	  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};

	  // Reused option objects for setSelection & friends
	  var sel_dontScroll = {scroll: false}, sel_mouse = {origin: "*mouse"}, sel_move = {origin: "+move"};

	  function Delayed() {this.id = null;}
	  Delayed.prototype.set = function(ms, f) {
	    clearTimeout(this.id);
	    this.id = setTimeout(f, ms);
	  };

	  // Counts the column offset in a string, taking tabs into account.
	  // Used mostly to find indentation.
	  var countColumn = CodeMirror.countColumn = function(string, end, tabSize, startIndex, startValue) {
	    if (end == null) {
	      end = string.search(/[^\s\u00a0]/);
	      if (end == -1) end = string.length;
	    }
	    for (var i = startIndex || 0, n = startValue || 0;;) {
	      var nextTab = string.indexOf("\t", i);
	      if (nextTab < 0 || nextTab >= end)
	        return n + (end - i);
	      n += nextTab - i;
	      n += tabSize - (n % tabSize);
	      i = nextTab + 1;
	    }
	  };

	  // The inverse of countColumn -- find the offset that corresponds to
	  // a particular column.
	  function findColumn(string, goal, tabSize) {
	    for (var pos = 0, col = 0;;) {
	      var nextTab = string.indexOf("\t", pos);
	      if (nextTab == -1) nextTab = string.length;
	      var skipped = nextTab - pos;
	      if (nextTab == string.length || col + skipped >= goal)
	        return pos + Math.min(skipped, goal - col);
	      col += nextTab - pos;
	      col += tabSize - (col % tabSize);
	      pos = nextTab + 1;
	      if (col >= goal) return pos;
	    }
	  }

	  var spaceStrs = [""];
	  function spaceStr(n) {
	    while (spaceStrs.length <= n)
	      spaceStrs.push(lst(spaceStrs) + " ");
	    return spaceStrs[n];
	  }

	  function lst(arr) { return arr[arr.length-1]; }

	  var selectInput = function(node) { node.select(); };
	  if (ios) // Mobile Safari apparently has a bug where select() is broken.
	    selectInput = function(node) { node.selectionStart = 0; node.selectionEnd = node.value.length; };
	  else if (ie) // Suppress mysterious IE10 errors
	    selectInput = function(node) { try { node.select(); } catch(_e) {} };

	  function indexOf(array, elt) {
	    for (var i = 0; i < array.length; ++i)
	      if (array[i] == elt) return i;
	    return -1;
	  }
	  if ([].indexOf) indexOf = function(array, elt) { return array.indexOf(elt); };
	  function map(array, f) {
	    var out = [];
	    for (var i = 0; i < array.length; i++) out[i] = f(array[i], i);
	    return out;
	  }
	  if ([].map) map = function(array, f) { return array.map(f); };

	  function createObj(base, props) {
	    var inst;
	    if (Object.create) {
	      inst = Object.create(base);
	    } else {
	      var ctor = function() {};
	      ctor.prototype = base;
	      inst = new ctor();
	    }
	    if (props) copyObj(props, inst);
	    return inst;
	  };

	  function copyObj(obj, target, overwrite) {
	    if (!target) target = {};
	    for (var prop in obj)
	      if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
	        target[prop] = obj[prop];
	    return target;
	  }

	  function bind(f) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    return function(){return f.apply(null, args);};
	  }

	  var nonASCIISingleCaseWordChar = /[\u00df\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
	  var isWordCharBasic = CodeMirror.isWordChar = function(ch) {
	    return /\w/.test(ch) || ch > "\x80" &&
	      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
	  };
	  function isWordChar(ch, helper) {
	    if (!helper) return isWordCharBasic(ch);
	    if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
	    return helper.test(ch);
	  }

	  function isEmpty(obj) {
	    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
	    return true;
	  }

	  // Extending unicode characters. A series of a non-extending char +
	  // any number of extending chars is treated as a single unit as far
	  // as editing and measuring is concerned. This is not fully correct,
	  // since some scripts/fonts/browsers also treat other configurations
	  // of code points as a group.
	  var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
	  function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch); }

	  // DOM UTILITIES

	  function elt(tag, content, className, style) {
	    var e = document.createElement(tag);
	    if (className) e.className = className;
	    if (style) e.style.cssText = style;
	    if (typeof content == "string") e.appendChild(document.createTextNode(content));
	    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
	    return e;
	  }

	  var range;
	  if (document.createRange) range = function(node, start, end) {
	    var r = document.createRange();
	    r.setEnd(node, end);
	    r.setStart(node, start);
	    return r;
	  };
	  else range = function(node, start, end) {
	    var r = document.body.createTextRange();
	    r.moveToElementText(node.parentNode);
	    r.collapse(true);
	    r.moveEnd("character", end);
	    r.moveStart("character", start);
	    return r;
	  };

	  function removeChildren(e) {
	    for (var count = e.childNodes.length; count > 0; --count)
	      e.removeChild(e.firstChild);
	    return e;
	  }

	  function removeChildrenAndAdd(parent, e) {
	    return removeChildren(parent).appendChild(e);
	  }

	  function contains(parent, child) {
	    if (parent.contains)
	      return parent.contains(child);
	    while (child = child.parentNode)
	      if (child == parent) return true;
	  }

	  function activeElt() { return document.activeElement; }
	  // Older versions of IE throws unspecified error when touching
	  // document.activeElement in some cases (during loading, in iframe)
	  if (ie && ie_version < 11) activeElt = function() {
	    try { return document.activeElement; }
	    catch(e) { return document.body; }
	  };

	  function classTest(cls) { return new RegExp("\\b" + cls + "\\b\\s*"); }
	  function rmClass(node, cls) {
	    var test = classTest(cls);
	    if (test.test(node.className)) node.className = node.className.replace(test, "");
	  }
	  function addClass(node, cls) {
	    if (!classTest(cls).test(node.className)) node.className += " " + cls;
	  }
	  function joinClasses(a, b) {
	    var as = a.split(" ");
	    for (var i = 0; i < as.length; i++)
	      if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];
	    return b;
	  }

	  // WINDOW-WIDE EVENTS

	  // These must be handled carefully, because naively registering a
	  // handler for each editor will cause the editors to never be
	  // garbage collected.

	  function forEachCodeMirror(f) {
	    if (!document.body.getElementsByClassName) return;
	    var byClass = document.body.getElementsByClassName("CodeMirror");
	    for (var i = 0; i < byClass.length; i++) {
	      var cm = byClass[i].CodeMirror;
	      if (cm) f(cm);
	    }
	  }

	  var globalsRegistered = false;
	  function ensureGlobalHandlers() {
	    if (globalsRegistered) return;
	    registerGlobalHandlers();
	    globalsRegistered = true;
	  }
	  function registerGlobalHandlers() {
	    // When the window resizes, we need to refresh active editors.
	    var resizeTimer;
	    on(window, "resize", function() {
	      if (resizeTimer == null) resizeTimer = setTimeout(function() {
	        resizeTimer = null;
	        knownScrollbarWidth = null;
	        forEachCodeMirror(onResize);
	      }, 100);
	    });
	    // When the window loses focus, we want to show the editor as blurred
	    on(window, "blur", function() {
	      forEachCodeMirror(onBlur);
	    });
	  }

	  // FEATURE DETECTION

	  // Detect drag-and-drop
	  var dragAndDrop = function() {
	    // There is *some* kind of drag-and-drop support in IE6-8, but I
	    // couldn't get it to work yet.
	    if (ie && ie_version < 9) return false;
	    var div = elt('div');
	    return "draggable" in div || "dragDrop" in div;
	  }();

	  var knownScrollbarWidth;
	  function scrollbarWidth(measure) {
	    if (knownScrollbarWidth != null) return knownScrollbarWidth;
	    var test = elt("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
	    removeChildrenAndAdd(measure, test);
	    if (test.offsetWidth)
	      knownScrollbarWidth = test.offsetHeight - test.clientHeight;
	    return knownScrollbarWidth || 0;
	  }

	  var zwspSupported;
	  function zeroWidthElement(measure) {
	    if (zwspSupported == null) {
	      var test = elt("span", "\u200b");
	      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
	      if (measure.firstChild.offsetHeight != 0)
	        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
	    }
	    if (zwspSupported) return elt("span", "\u200b");
	    else return elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
	  }

	  // Feature-detect IE's crummy client rect reporting for bidi text
	  var badBidiRects;
	  function hasBadBidiRects(measure) {
	    if (badBidiRects != null) return badBidiRects;
	    var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
	    var r0 = range(txt, 0, 1).getBoundingClientRect();
	    if (!r0 || r0.left == r0.right) return false; // Safari returns null in some cases (#2780)
	    var r1 = range(txt, 1, 2).getBoundingClientRect();
	    return badBidiRects = (r1.right - r0.right < 3);
	  }

	  // See if "".split is the broken IE version, if so, provide an
	  // alternative way to split lines.
	  var splitLines = CodeMirror.splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
	    var pos = 0, result = [], l = string.length;
	    while (pos <= l) {
	      var nl = string.indexOf("\n", pos);
	      if (nl == -1) nl = string.length;
	      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
	      var rt = line.indexOf("\r");
	      if (rt != -1) {
	        result.push(line.slice(0, rt));
	        pos += rt + 1;
	      } else {
	        result.push(line);
	        pos = nl + 1;
	      }
	    }
	    return result;
	  } : function(string){return string.split(/\r\n?|\n/);};

	  var hasSelection = window.getSelection ? function(te) {
	    try { return te.selectionStart != te.selectionEnd; }
	    catch(e) { return false; }
	  } : function(te) {
	    try {var range = te.ownerDocument.selection.createRange();}
	    catch(e) {}
	    if (!range || range.parentElement() != te) return false;
	    return range.compareEndPoints("StartToEnd", range) != 0;
	  };

	  var hasCopyEvent = (function() {
	    var e = elt("div");
	    if ("oncopy" in e) return true;
	    e.setAttribute("oncopy", "return;");
	    return typeof e.oncopy == "function";
	  })();

	  var badZoomedRects = null;
	  function hasBadZoomedRects(measure) {
	    if (badZoomedRects != null) return badZoomedRects;
	    var node = removeChildrenAndAdd(measure, elt("span", "x"));
	    var normal = node.getBoundingClientRect();
	    var fromRange = range(node, 0, 1).getBoundingClientRect();
	    return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
	  }

	  // KEY NAMES

	  var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
	                  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
	                  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
	                  46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 107: "=", 109: "-", 127: "Delete",
	                  173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
	                  221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
	                  63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"};
	  CodeMirror.keyNames = keyNames;
	  (function() {
	    // Number keys
	    for (var i = 0; i < 10; i++) keyNames[i + 48] = keyNames[i + 96] = String(i);
	    // Alphabetic keys
	    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
	    // Function keys
	    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
	  })();

	  // BIDI HELPERS

	  function iterateBidiSections(order, from, to, f) {
	    if (!order) return f(from, to, "ltr");
	    var found = false;
	    for (var i = 0; i < order.length; ++i) {
	      var part = order[i];
	      if (part.from < to && part.to > from || from == to && part.to == from) {
	        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
	        found = true;
	      }
	    }
	    if (!found) f(from, to, "ltr");
	  }

	  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
	  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }

	  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
	  function lineRight(line) {
	    var order = getOrder(line);
	    if (!order) return line.text.length;
	    return bidiRight(lst(order));
	  }

	  function lineStart(cm, lineN) {
	    var line = getLine(cm.doc, lineN);
	    var visual = visualLine(line);
	    if (visual != line) lineN = lineNo(visual);
	    var order = getOrder(visual);
	    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
	    return Pos(lineN, ch);
	  }
	  function lineEnd(cm, lineN) {
	    var merged, line = getLine(cm.doc, lineN);
	    while (merged = collapsedSpanAtEnd(line)) {
	      line = merged.find(1, true).line;
	      lineN = null;
	    }
	    var order = getOrder(line);
	    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
	    return Pos(lineN == null ? lineNo(line) : lineN, ch);
	  }
	  function lineStartSmart(cm, pos) {
	    var start = lineStart(cm, pos.line);
	    var line = getLine(cm.doc, start.line);
	    var order = getOrder(line);
	    if (!order || order[0].level == 0) {
	      var firstNonWS = Math.max(0, line.text.search(/\S/));
	      var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
	      return Pos(start.line, inWS ? 0 : firstNonWS);
	    }
	    return start;
	  }

	  function compareBidiLevel(order, a, b) {
	    var linedir = order[0].level;
	    if (a == linedir) return true;
	    if (b == linedir) return false;
	    return a < b;
	  }
	  var bidiOther;
	  function getBidiPartAt(order, pos) {
	    bidiOther = null;
	    for (var i = 0, found; i < order.length; ++i) {
	      var cur = order[i];
	      if (cur.from < pos && cur.to > pos) return i;
	      if ((cur.from == pos || cur.to == pos)) {
	        if (found == null) {
	          found = i;
	        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
	          if (cur.from != cur.to) bidiOther = found;
	          return i;
	        } else {
	          if (cur.from != cur.to) bidiOther = i;
	          return found;
	        }
	      }
	    }
	    return found;
	  }

	  function moveInLine(line, pos, dir, byUnit) {
	    if (!byUnit) return pos + dir;
	    do pos += dir;
	    while (pos > 0 && isExtendingChar(line.text.charAt(pos)));
	    return pos;
	  }

	  // This is needed in order to move 'visually' through bi-directional
	  // text -- i.e., pressing left should make the cursor go left, even
	  // when in RTL text. The tricky part is the 'jumps', where RTL and
	  // LTR text touch each other. This often requires the cursor offset
	  // to move more than one unit, in order to visually move one unit.
	  function moveVisually(line, start, dir, byUnit) {
	    var bidi = getOrder(line);
	    if (!bidi) return moveLogically(line, start, dir, byUnit);
	    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
	    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

	    for (;;) {
	      if (target > part.from && target < part.to) return target;
	      if (target == part.from || target == part.to) {
	        if (getBidiPartAt(bidi, target) == pos) return target;
	        part = bidi[pos += dir];
	        return (dir > 0) == part.level % 2 ? part.to : part.from;
	      } else {
	        part = bidi[pos += dir];
	        if (!part) return null;
	        if ((dir > 0) == part.level % 2)
	          target = moveInLine(line, part.to, -1, byUnit);
	        else
	          target = moveInLine(line, part.from, 1, byUnit);
	      }
	    }
	  }

	  function moveLogically(line, start, dir, byUnit) {
	    var target = start + dir;
	    if (byUnit) while (target > 0 && isExtendingChar(line.text.charAt(target))) target += dir;
	    return target < 0 || target > line.text.length ? null : target;
	  }

	  // Bidirectional ordering algorithm
	  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
	  // that this (partially) implements.

	  // One-char codes used for character types:
	  // L (L):   Left-to-Right
	  // R (R):   Right-to-Left
	  // r (AL):  Right-to-Left Arabic
	  // 1 (EN):  European Number
	  // + (ES):  European Number Separator
	  // % (ET):  European Number Terminator
	  // n (AN):  Arabic Number
	  // , (CS):  Common Number Separator
	  // m (NSM): Non-Spacing Mark
	  // b (BN):  Boundary Neutral
	  // s (B):   Paragraph Separator
	  // t (S):   Segment Separator
	  // w (WS):  Whitespace
	  // N (ON):  Other Neutrals

	  // Returns null if characters are ordered as they appear
	  // (left-to-right), or an array of sections ({from, to, level}
	  // objects) in the order in which they occur visually.
	  var bidiOrdering = (function() {
	    // Character types for codepoints 0 to 0xff
	    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
	    // Character types for codepoints 0x600 to 0x6ff
	    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm";
	    function charType(code) {
	      if (code <= 0xf7) return lowTypes.charAt(code);
	      else if (0x590 <= code && code <= 0x5f4) return "R";
	      else if (0x600 <= code && code <= 0x6ed) return arabicTypes.charAt(code - 0x600);
	      else if (0x6ee <= code && code <= 0x8ac) return "r";
	      else if (0x2000 <= code && code <= 0x200b) return "w";
	      else if (code == 0x200c) return "b";
	      else return "L";
	    }

	    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
	    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
	    // Browsers seem to always treat the boundaries of block elements as being L.
	    var outerType = "L";

	    function BidiSpan(level, from, to) {
	      this.level = level;
	      this.from = from; this.to = to;
	    }

	    return function(str) {
	      if (!bidiRE.test(str)) return false;
	      var len = str.length, types = [];
	      for (var i = 0, type; i < len; ++i)
	        types.push(type = charType(str.charCodeAt(i)));

	      // W1. Examine each non-spacing mark (NSM) in the level run, and
	      // change the type of the NSM to the type of the previous
	      // character. If the NSM is at the start of the level run, it will
	      // get the type of sor.
	      for (var i = 0, prev = outerType; i < len; ++i) {
	        var type = types[i];
	        if (type == "m") types[i] = prev;
	        else prev = type;
	      }

	      // W2. Search backwards from each instance of a European number
	      // until the first strong type (R, L, AL, or sor) is found. If an
	      // AL is found, change the type of the European number to Arabic
	      // number.
	      // W3. Change all ALs to R.
	      for (var i = 0, cur = outerType; i < len; ++i) {
	        var type = types[i];
	        if (type == "1" && cur == "r") types[i] = "n";
	        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
	      }

	      // W4. A single European separator between two European numbers
	      // changes to a European number. A single common separator between
	      // two numbers of the same type changes to that type.
	      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
	        var type = types[i];
	        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
	        else if (type == "," && prev == types[i+1] &&
	                 (prev == "1" || prev == "n")) types[i] = prev;
	        prev = type;
	      }

	      // W5. A sequence of European terminators adjacent to European
	      // numbers changes to all European numbers.
	      // W6. Otherwise, separators and terminators change to Other
	      // Neutral.
	      for (var i = 0; i < len; ++i) {
	        var type = types[i];
	        if (type == ",") types[i] = "N";
	        else if (type == "%") {
	          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
	          var replace = (i && types[i-1] == "!") || (end < len && types[end] == "1") ? "1" : "N";
	          for (var j = i; j < end; ++j) types[j] = replace;
	          i = end - 1;
	        }
	      }

	      // W7. Search backwards from each instance of a European number
	      // until the first strong type (R, L, or sor) is found. If an L is
	      // found, then change the type of the European number to L.
	      for (var i = 0, cur = outerType; i < len; ++i) {
	        var type = types[i];
	        if (cur == "L" && type == "1") types[i] = "L";
	        else if (isStrong.test(type)) cur = type;
	      }

	      // N1. A sequence of neutrals takes the direction of the
	      // surrounding strong text if the text on both sides has the same
	      // direction. European and Arabic numbers act as if they were R in
	      // terms of their influence on neutrals. Start-of-level-run (sor)
	      // and end-of-level-run (eor) are used at level run boundaries.
	      // N2. Any remaining neutrals take the embedding direction.
	      for (var i = 0; i < len; ++i) {
	        if (isNeutral.test(types[i])) {
	          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
	          var before = (i ? types[i-1] : outerType) == "L";
	          var after = (end < len ? types[end] : outerType) == "L";
	          var replace = before || after ? "L" : "R";
	          for (var j = i; j < end; ++j) types[j] = replace;
	          i = end - 1;
	        }
	      }

	      // Here we depart from the documented algorithm, in order to avoid
	      // building up an actual levels array. Since there are only three
	      // levels (0, 1, 2) in an implementation that doesn't take
	      // explicit embedding into account, we can build up the order on
	      // the fly, without following the level-based algorithm.
	      var order = [], m;
	      for (var i = 0; i < len;) {
	        if (countsAsLeft.test(types[i])) {
	          var start = i;
	          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
	          order.push(new BidiSpan(0, start, i));
	        } else {
	          var pos = i, at = order.length;
	          for (++i; i < len && types[i] != "L"; ++i) {}
	          for (var j = pos; j < i;) {
	            if (countsAsNum.test(types[j])) {
	              if (pos < j) order.splice(at, 0, new BidiSpan(1, pos, j));
	              var nstart = j;
	              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
	              order.splice(at, 0, new BidiSpan(2, nstart, j));
	              pos = j;
	            } else ++j;
	          }
	          if (pos < i) order.splice(at, 0, new BidiSpan(1, pos, i));
	        }
	      }
	      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
	        order[0].from = m[0].length;
	        order.unshift(new BidiSpan(0, 0, m[0].length));
	      }
	      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
	        lst(order).to -= m[0].length;
	        order.push(new BidiSpan(0, len - m[0].length, len));
	      }
	      if (order[0].level != lst(order).level)
	        order.push(new BidiSpan(order[0].level, len, len));

	      return order;
	    };
	  })();

	  // THE END

	  CodeMirror.version = "4.7.0";

	  return CodeMirror;
	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*global exports:true*/
	var es6ArrowFunctions = __webpack_require__(8);
	var es6Classes = __webpack_require__(9);
	var es6Destructuring = __webpack_require__(10);
	var es6ObjectConciseMethod = __webpack_require__(11);
	var es6ObjectShortNotation = __webpack_require__(12);
	var es6RestParameters = __webpack_require__(13);
	var es6Templates = __webpack_require__(14);
	var es7SpreadProperty = __webpack_require__(15);
	var react = __webpack_require__(17);
	var reactDisplayName = __webpack_require__(18);
	var typesSyntax = __webpack_require__(16);

	/**
	 * Map from transformName => orderedListOfVisitors.
	 */
	var transformVisitors = {
	  'es6-arrow-functions': es6ArrowFunctions.visitorList,
	  'es6-classes': es6Classes.visitorList,
	  'es6-destructuring': es6Destructuring.visitorList,
	  'es6-object-concise-method': es6ObjectConciseMethod.visitorList,
	  'es6-object-short-notation': es6ObjectShortNotation.visitorList,
	  'es6-rest-params': es6RestParameters.visitorList,
	  'es6-templates': es6Templates.visitorList,
	  'es7-spread-property': es7SpreadProperty.visitorList,
	  'react': react.visitorList.concat(reactDisplayName.visitorList),
	  'types': typesSyntax.visitorList
	};

	var transformSets = {
	  'harmony': [
	    'es6-arrow-functions',
	    'es6-object-concise-method',
	    'es6-object-short-notation',
	    'es6-classes',
	    'es6-rest-params',
	    'es6-templates',
	    'es6-destructuring',
	    'es7-spread-property'
	  ],
	  'react': [
	    'react'
	  ],
	  'type-annotations': [
	    'types'
	  ]
	};

	/**
	 * Specifies the order in which each transform should run.
	 */
	var transformRunOrder = [
	  'types',
	  'es6-arrow-functions',
	  'es6-object-concise-method',
	  'es6-object-short-notation',
	  'es6-classes',
	  'es6-rest-params',
	  'es6-templates',
	  'es6-destructuring',
	  'es7-spread-property',
	  'react'
	];

	/**
	 * Given a list of transform names, return the ordered list of visitors to be
	 * passed to the transform() function.
	 *
	 * @param {array?} excludes
	 * @return {array}
	 */
	function getAllVisitors(excludes) {
	  var ret = [];
	  for (var i = 0, il = transformRunOrder.length; i < il; i++) {
	    if (!excludes || excludes.indexOf(transformRunOrder[i]) === -1) {
	      ret = ret.concat(transformVisitors[transformRunOrder[i]]);
	    }
	  }
	  return ret;
	}

	/**
	 * Given a list of visitor set names, return the ordered list of visitors to be
	 * passed to jstransform.
	 *
	 * @param {array}
	 * @return {array}
	 */
	function getVisitorsBySet(sets) {
	  var visitorsToInclude = sets.reduce(function(visitors, set) {
	    if (!transformSets.hasOwnProperty(set)) {
	      throw new Error('Unknown visitor set: ' + set);
	    }
	    transformSets[set].forEach(function(visitor) {
	      visitors[visitor] = true;
	    });
	    return visitors;
	  }, {});

	  var visitorList = [];
	  for (var i = 0; i < transformRunOrder.length; i++) {
	    if (visitorsToInclude.hasOwnProperty(transformRunOrder[i])) {
	      visitorList = visitorList.concat(transformVisitors[transformRunOrder[i]]);
	    }
	  }

	  return visitorList;
	}

	exports.getVisitorsBySet = getVisitorsBySet;
	exports.getAllVisitors = getAllVisitors;
	exports.transformVisitors = transformVisitors;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(25)
	var ieee754 = __webpack_require__(24)
	var isArray = __webpack_require__(23)

	exports.Buffer = Buffer
	exports.SlowBuffer = Buffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var kMaxLength = 0x3fffffff

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Note:
	 *
	 * - Implementation must support adding new properties to `Uint8Array` instances.
	 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
	 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *    incorrect length in some situations.
	 *
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
	 * get the Object implementation, which is slower but will work correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    return 42 === arr.foo() && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (subject, encoding, noZero) {
	  if (!(this instanceof Buffer))
	    return new Buffer(subject, encoding, noZero)

	  var type = typeof subject

	  // Find the length
	  var length
	  if (type === 'number')
	    length = subject > 0 ? subject >>> 0 : 0
	  else if (type === 'string') {
	    if (encoding === 'base64')
	      subject = base64clean(subject)
	    length = Buffer.byteLength(subject, encoding)
	  } else if (type === 'object' && subject !== null) { // assume object is array-like
	    if (subject.type === 'Buffer' && isArray(subject.data))
	      subject = subject.data
	    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
	  } else
	    throw new TypeError('must start with number, buffer, array or string')

	  if (this.length > kMaxLength)
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	      'size: 0x' + kMaxLength.toString(16) + ' bytes')

	  var buf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Preferred: Return an augmented `Uint8Array` instance for best performance
	    buf = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return THIS instance of Buffer (created by `new`)
	    buf = this
	    buf.length = length
	    buf._isBuffer = true
	  }

	  var i
	  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
	    // Speed optimization -- use set if we're copying from a typed array
	    buf._set(subject)
	  } else if (isArrayish(subject)) {
	    // Treat array-ish objects as a byte array
	    if (Buffer.isBuffer(subject)) {
	      for (i = 0; i < length; i++)
	        buf[i] = subject.readUInt8(i)
	    } else {
	      for (i = 0; i < length; i++)
	        buf[i] = ((subject[i] % 256) + 256) % 256
	    }
	  } else if (type === 'string') {
	    buf.write(subject, 0, encoding)
	  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
	    for (i = 0; i < length; i++) {
	      buf[i] = 0
	    }
	  }

	  return buf
	}

	Buffer.isBuffer = function (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
	    throw new TypeError('Arguments must be Buffers')

	  var x = a.length
	  var y = b.length
	  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function (list, totalLength) {
	  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (totalLength === undefined) {
	    totalLength = 0
	    for (i = 0; i < list.length; i++) {
	      totalLength += list[i].length
	    }
	  }

	  var buf = new Buffer(totalLength)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	Buffer.byteLength = function (str, encoding) {
	  var ret
	  str = str + ''
	  switch (encoding || 'utf8') {
	    case 'ascii':
	    case 'binary':
	    case 'raw':
	      ret = str.length
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = str.length * 2
	      break
	    case 'hex':
	      ret = str.length >>> 1
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8ToBytes(str).length
	      break
	    case 'base64':
	      ret = base64ToBytes(str).length
	      break
	    default:
	      ret = str.length
	  }
	  return ret
	}

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function (encoding, start, end) {
	  var loweredCase = false

	  start = start >>> 0
	  end = end === undefined || end === Infinity ? this.length : end >>> 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase)
	          throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.equals = function (b) {
	  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max)
	      str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  return Buffer.compare(this, b)
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var byte = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(byte)) throw new Error('Invalid hex string')
	    buf[offset + i] = byte
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function asciiWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
	  return charsWritten
	}

	function utf16leWrite (buf, string, offset, length) {
	  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
	  return charsWritten
	}

	Buffer.prototype.write = function (string, offset, length, encoding) {
	  // Support both (string, offset, length, encoding)
	  // and the legacy (string, encoding, offset, length)
	  if (isFinite(offset)) {
	    if (!isFinite(length)) {
	      encoding = length
	      length = undefined
	    }
	  } else {  // legacy
	    var swap = encoding
	    encoding = offset
	    offset = length
	    length = swap
	  }

	  offset = Number(offset) || 0
	  var remaining = this.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	  encoding = String(encoding || 'utf8').toLowerCase()

	  var ret
	  switch (encoding) {
	    case 'hex':
	      ret = hexWrite(this, string, offset, length)
	      break
	    case 'utf8':
	    case 'utf-8':
	      ret = utf8Write(this, string, offset, length)
	      break
	    case 'ascii':
	      ret = asciiWrite(this, string, offset, length)
	      break
	    case 'binary':
	      ret = binaryWrite(this, string, offset, length)
	      break
	    case 'base64':
	      ret = base64Write(this, string, offset, length)
	      break
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      ret = utf16leWrite(this, string, offset, length)
	      break
	    default:
	      throw new TypeError('Unknown encoding: ' + encoding)
	  }
	  return ret
	}

	Buffer.prototype.toJSON = function () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  return asciiSlice(buf, start, end)
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len;
	    if (start < 0)
	      start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0)
	      end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start)
	    end = start

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    return Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    var newBuf = new Buffer(sliceLen, undefined, true)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	    return newBuf
	  }
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0)
	    throw new RangeError('offset is not uint')
	  if (offset + ext > length)
	    throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUInt8 = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	      ((this[offset + 1] << 16) |
	      (this[offset + 2] << 8) |
	      this[offset + 3])
	}

	Buffer.prototype.readInt8 = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80))
	    return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16) |
	      (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	      (this[offset + 1] << 16) |
	      (this[offset + 2] << 8) |
	      (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function (offset, noAssert) {
	  if (!noAssert)
	    checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new TypeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new TypeError('index out of range')
	}

	Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else objectWriteUInt16(this, value, offset, true)
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else objectWriteUInt16(this, value, offset, false)
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else objectWriteUInt32(this, value, offset, true)
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else objectWriteUInt32(this, value, offset, false)
	  return offset + 4
	}

	Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else objectWriteUInt16(this, value, offset, true)
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else objectWriteUInt16(this, value, offset, false)
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else objectWriteUInt32(this, value, offset, true)
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert)
	    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else objectWriteUInt32(this, value, offset, false)
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new TypeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new TypeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert)
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert)
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function (target, target_start, start, end) {
	  var source = this

	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (!target_start) target_start = 0

	  // Copy 0 bytes; we're done
	  if (end === start) return
	  if (target.length === 0 || source.length === 0) return

	  // Fatal error conditions
	  if (end < start) throw new TypeError('sourceEnd < sourceStart')
	  if (target_start < 0 || target_start >= target.length)
	    throw new TypeError('targetStart out of bounds')
	  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
	  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length)
	    end = this.length
	  if (target.length - target_start < end - start)
	    end = target.length - target_start + start

	  var len = end - start

	  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < len; i++) {
	      target[i + target_start] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), target_start)
	  }
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new TypeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array get/set methods before overwriting
	  arr._get = arr.get
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function isArrayish (subject) {
	  return isArray(subject) || Buffer.isBuffer(subject) ||
	      subject && typeof subject === 'object' &&
	      typeof subject.length === 'number'
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    var b = str.charCodeAt(i)
	    if (b <= 0x7F) {
	      byteArray.push(b)
	    } else {
	      var start = i
	      if (b >= 0xD800 && b <= 0xDFFF) i++
	      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
	      for (var j = 0; j < h.length; j++) {
	        byteArray.push(parseInt(h[j], 16))
	      }
	    }
	  }
	  return byteArray
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(str)
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length))
	      break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/*jslint node: true*/
	"use strict";

	var esprima = __webpack_require__(26);
	var utils = __webpack_require__(19);

	var getBoundaryNode = utils.getBoundaryNode;
	var declareIdentInScope = utils.declareIdentInLocalScope;
	var initScopeMetadata = utils.initScopeMetadata;
	var Syntax = esprima.Syntax;

	/**
	 * @param {object} node
	 * @param {object} parentNode
	 * @return {boolean}
	 */
	function _nodeIsClosureScopeBoundary(node, parentNode) {
	  if (node.type === Syntax.Program) {
	    return true;
	  }

	  var parentIsFunction =
	    parentNode.type === Syntax.FunctionDeclaration
	    || parentNode.type === Syntax.FunctionExpression
	    || parentNode.type === Syntax.ArrowFunctionExpression;

	  return node.type === Syntax.BlockStatement && parentIsFunction;
	}

	function _nodeIsBlockScopeBoundary(node, parentNode) {
	  if (node.type === Syntax.Program) {
	    return false;
	  }

	  return node.type === Syntax.BlockStatement
	         && parentNode.type === Syntax.CatchClause;
	}

	/**
	 * @param {object} node
	 * @param {function} visitor
	 * @param {array} path
	 * @param {object} state
	 */
	function traverse(node, path, state) {
	  // Create a scope stack entry if this is the first node we've encountered in
	  // its local scope
	  var parentNode = path[0];
	  if (!Array.isArray(node) && state.localScope.parentNode !== parentNode) {
	    if (_nodeIsClosureScopeBoundary(node, parentNode)) {
	      var scopeIsStrict =
	        state.scopeIsStrict
	        || node.body.length > 0
	           && node.body[0].type === Syntax.ExpressionStatement
	           && node.body[0].expression.type === Syntax.Literal
	           && node.body[0].expression.value === 'use strict';

	      if (node.type === Syntax.Program) {
	        state = utils.updateState(state, {
	          scopeIsStrict: scopeIsStrict
	        });
	      } else {
	        state = utils.updateState(state, {
	          localScope: {
	            parentNode: parentNode,
	            parentScope: state.localScope,
	            identifiers: {},
	            tempVarIndex: 0
	          },
	          scopeIsStrict: scopeIsStrict
	        });

	        // All functions have an implicit 'arguments' object in scope
	        declareIdentInScope('arguments', initScopeMetadata(node), state);

	        // Include function arg identifiers in the scope boundaries of the
	        // function
	        if (parentNode.params.length > 0) {
	          var param;
	          for (var i = 0; i < parentNode.params.length; i++) {
	            param = parentNode.params[i];
	            if (param.type === Syntax.Identifier) {
	              declareIdentInScope(
	                param.name, initScopeMetadata(parentNode), state
	              );
	            }
	          }
	        }

	        // Named FunctionExpressions scope their name within the body block of
	        // themselves only
	        if (parentNode.type === Syntax.FunctionExpression && parentNode.id) {
	          var metaData =
	            initScopeMetadata(parentNode, path.parentNodeslice, parentNode);
	          declareIdentInScope(parentNode.id.name, metaData, state);
	        }
	      }

	      // Traverse and find all local identifiers in this closure first to
	      // account for function/variable declaration hoisting
	      collectClosureIdentsAndTraverse(node, path, state);
	    }

	    if (_nodeIsBlockScopeBoundary(node, parentNode)) {
	      state = utils.updateState(state, {
	        localScope: {
	          parentNode: parentNode,
	          parentScope: state.localScope,
	          identifiers: {}
	        }
	      });

	      if (parentNode.type === Syntax.CatchClause) {
	        declareIdentInScope(
	          parentNode.param.name, initScopeMetadata(parentNode), state
	        );
	      }
	      collectBlockIdentsAndTraverse(node, path, state);
	    }
	  }

	  // Only catchup() before and after traversing a child node
	  function traverser(node, path, state) {
	    node.range && utils.catchup(node.range[0], state);
	    traverse(node, path, state);
	    node.range && utils.catchup(node.range[1], state);
	  }

	  utils.analyzeAndTraverse(walker, traverser, node, path, state);
	}

	function collectClosureIdentsAndTraverse(node, path, state) {
	  utils.analyzeAndTraverse(
	    visitLocalClosureIdentifiers,
	    collectClosureIdentsAndTraverse,
	    node,
	    path,
	    state
	  );
	}

	function collectBlockIdentsAndTraverse(node, path, state) {
	  utils.analyzeAndTraverse(
	    visitLocalBlockIdentifiers,
	    collectBlockIdentsAndTraverse,
	    node,
	    path,
	    state
	  );
	}

	function visitLocalClosureIdentifiers(node, path, state) {
	  var metaData;
	  switch (node.type) {
	    case Syntax.FunctionExpression:
	      // Function expressions don't get their names (if there is one) added to
	      // the closure scope they're defined in
	      return false;
	    case Syntax.ClassDeclaration:
	    case Syntax.ClassExpression:
	    case Syntax.FunctionDeclaration:
	      if (node.id) {
	        metaData = initScopeMetadata(getBoundaryNode(path), path.slice(), node);
	        declareIdentInScope(node.id.name, metaData, state);
	      }
	      return false;
	    case Syntax.VariableDeclarator:
	      // Variables have function-local scope
	      if (path[0].kind === 'var') {
	        metaData = initScopeMetadata(getBoundaryNode(path), path.slice(), node);
	        declareIdentInScope(node.id.name, metaData, state);
	      }
	      break;
	  }
	}

	function visitLocalBlockIdentifiers(node, path, state) {
	  // TODO: Support 'let' here...maybe...one day...or something...
	  if (node.type === Syntax.CatchClause) {
	    return false;
	  }
	}

	function walker(node, path, state) {
	  var visitors = state.g.visitors;
	  for (var i = 0; i < visitors.length; i++) {
	    if (visitors[i].test(node, path, state)) {
	      return visitors[i](traverse, node, path, state);
	    }
	  }
	}

	var _astCache = {};

	/**
	 * Applies all available transformations to the source
	 * @param {array} visitors
	 * @param {string} source
	 * @param {?object} options
	 * @return {object}
	 */
	function transform(visitors, source, options) {
	  options = options || {};
	  var ast;
	  try {
	    var cachedAst = _astCache[source];
	    ast = cachedAst ||
	      (_astCache[source] = esprima.parse(source, {
	        comment: true,
	        loc: true,
	        range: true
	      }));
	    } catch (e) {
	    e.message = 'Parse Error: ' + e.message;
	    throw e;
	  }
	  var state = utils.createState(source, ast, options);
	  state.g.visitors = visitors;

	  if (options.sourceMap) {
	    var SourceMapGenerator = __webpack_require__(29).SourceMapGenerator;
	    state.g.sourceMap = new SourceMapGenerator({file: options.filename || 'transformed.js'});
	  }

	  traverse(ast, [], state);
	  utils.catchup(source.length, state);

	  var ret = {code: state.g.buffer, extra: state.g.extra};
	  if (options.sourceMap) {
	    ret.sourceMap = state.g.sourceMap;
	    ret.sourceMapFilename =  options.filename || 'source.js';
	  }
	  return ret;
	}

	exports.transform = transform;
	exports.Syntax = Syntax;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*global exports:true*/

	/**
	 * Desugars ES6 Arrow functions to ES3 function expressions.
	 * If the function contains `this` expression -- automatically
	 * binds the function to current value of `this`.
	 *
	 * Single parameter, simple expression:
	 *
	 * [1, 2, 3].map(x => x * x);
	 *
	 * [1, 2, 3].map(function(x) { return x * x; });
	 *
	 * Several parameters, complex block:
	 *
	 * this.users.forEach((user, idx) => {
	 *   return this.isActive(idx) && this.send(user);
	 * });
	 *
	 * this.users.forEach(function(user, idx) {
	 *   return this.isActive(idx) && this.send(user);
	 * }.bind(this));
	 *
	 */
	var restParamVisitors = __webpack_require__(13);
	var destructuringVisitors = __webpack_require__(10);

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	/**
	 * @public
	 */
	function visitArrowFunction(traverse, node, path, state) {
	  var notInExpression = (path[0].type === Syntax.ExpressionStatement);

	  // Wrap a function into a grouping operator, if it's not
	  // in the expression position.
	  if (notInExpression) {
	    utils.append('(', state);
	  }

	  utils.append('function', state);
	  renderParams(traverse, node, path, state);

	  // Skip arrow.
	  utils.catchupWhiteSpace(node.body.range[0], state);

	  var renderBody = node.body.type == Syntax.BlockStatement
	    ? renderStatementBody
	    : renderExpressionBody;

	  path.unshift(node);
	  renderBody(traverse, node, path, state);
	  path.shift();

	  // Bind the function only if `this` value is used
	  // inside it or inside any sub-expression.
	  if (utils.containsChildOfType(node.body, Syntax.ThisExpression)) {
	    utils.append('.bind(this)', state);
	  }

	  utils.catchupWhiteSpace(node.range[1], state);

	  // Close wrapper if not in the expression.
	  if (notInExpression) {
	    utils.append(')', state);
	  }

	  return false;
	}

	function renderParams(traverse, node, path, state) {
	  // To preserve inline typechecking directives, we
	  // distinguish between parens-free and paranthesized single param.
	  if (isParensFreeSingleParam(node, state) || !node.params.length) {
	    utils.append('(', state);
	  }
	  if (node.params.length !== 0) {
	    path.unshift(node);
	    traverse(node.params, path, state);
	    path.unshift();
	  }
	  utils.append(')', state);
	}

	function isParensFreeSingleParam(node, state) {
	  return node.params.length === 1 &&
	    state.g.source[state.g.position] !== '(';
	}

	function renderExpressionBody(traverse, node, path, state) {
	  // Wrap simple expression bodies into a block
	  // with explicit return statement.
	  utils.append('{', state);

	  // Special handling of rest param.
	  if (node.rest) {
	    utils.append(
	      restParamVisitors.renderRestParamSetup(node),
	      state
	    );
	  }

	  // Special handling of destructured params.
	  destructuringVisitors.renderDestructuredComponents(
	    node,
	    utils.updateState(state, {
	      localScope: {
	        parentNode: state.parentNode,
	        parentScope: state.parentScope,
	        identifiers: state.identifiers,
	        tempVarIndex: 0
	      }
	    })
	  );

	  utils.append('return ', state);
	  renderStatementBody(traverse, node, path, state);
	  utils.append(';}', state);
	}

	function renderStatementBody(traverse, node, path, state) {
	  traverse(node.body, path, state);
	  utils.catchup(node.body.range[1], state);
	}

	visitArrowFunction.test = function(node, path, state) {
	  return node.type === Syntax.ArrowFunctionExpression;
	};

	exports.visitorList = [
	  visitArrowFunction
	];



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * @typechecks
	 */
	'use strict';

	var base62 = __webpack_require__(28);
	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);
	var reservedWordsHelper = __webpack_require__(20);

	var declareIdentInLocalScope = utils.declareIdentInLocalScope;
	var initScopeMetadata = utils.initScopeMetadata;

	var SUPER_PROTO_IDENT_PREFIX = '____SuperProtoOf';

	var _anonClassUUIDCounter = 0;
	var _mungedSymbolMaps = {};

	function resetSymbols() {
	  _anonClassUUIDCounter = 0;
	  _mungedSymbolMaps = {};
	}

	/**
	 * Used to generate a unique class for use with code-gens for anonymous class
	 * expressions.
	 *
	 * @param {object} state
	 * @return {string}
	 */
	function _generateAnonymousClassName(state) {
	  var mungeNamespace = state.mungeNamespace || '';
	  return '____Class' + mungeNamespace + base62.encode(_anonClassUUIDCounter++);
	}

	/**
	 * Given an identifier name, munge it using the current state's mungeNamespace.
	 *
	 * @param {string} identName
	 * @param {object} state
	 * @return {string}
	 */
	function _getMungedName(identName, state) {
	  var mungeNamespace = state.mungeNamespace;
	  var shouldMinify = state.g.opts.minify;

	  if (shouldMinify) {
	    if (!_mungedSymbolMaps[mungeNamespace]) {
	      _mungedSymbolMaps[mungeNamespace] = {
	        symbolMap: {},
	        identUUIDCounter: 0
	      };
	    }

	    var symbolMap = _mungedSymbolMaps[mungeNamespace].symbolMap;
	    if (!symbolMap[identName]) {
	      symbolMap[identName] =
	        base62.encode(_mungedSymbolMaps[mungeNamespace].identUUIDCounter++);
	    }
	    identName = symbolMap[identName];
	  }
	  return '$' + mungeNamespace + identName;
	}

	/**
	 * Extracts super class information from a class node.
	 *
	 * Information includes name of the super class and/or the expression string
	 * (if extending from an expression)
	 *
	 * @param {object} node
	 * @param {object} state
	 * @return {object}
	 */
	function _getSuperClassInfo(node, state) {
	  var ret = {
	    name: null,
	    expression: null
	  };
	  if (node.superClass) {
	    if (node.superClass.type === Syntax.Identifier) {
	      ret.name = node.superClass.name;
	    } else {
	      // Extension from an expression
	      ret.name = _generateAnonymousClassName(state);
	      ret.expression = state.g.source.substring(
	        node.superClass.range[0],
	        node.superClass.range[1]
	      );
	    }
	  }
	  return ret;
	}

	/**
	 * Used with .filter() to find the constructor method in a list of
	 * MethodDefinition nodes.
	 *
	 * @param {object} classElement
	 * @return {boolean}
	 */
	function _isConstructorMethod(classElement) {
	  return classElement.type === Syntax.MethodDefinition &&
	         classElement.key.type === Syntax.Identifier &&
	         classElement.key.name === 'constructor';
	}

	/**
	 * @param {object} node
	 * @param {object} state
	 * @return {boolean}
	 */
	function _shouldMungeIdentifier(node, state) {
	  return (
	    !!state.methodFuncNode &&
	    !utils.getDocblock(state).hasOwnProperty('preventMunge') &&
	    /^_(?!_)/.test(node.name)
	  );
	}

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassMethod(traverse, node, path, state) {
	  if (!state.g.opts.es5 && (node.kind === 'get' || node.kind === 'set')) {
	    throw new Error(
	      'This transform does not support ' + node.kind + 'ter methods for ES6 ' +
	      'classes. (line: ' + node.loc.start.line + ', col: ' +
	      node.loc.start.column + ')'
	    );
	  }
	  state = utils.updateState(state, {
	    methodNode: node
	  });
	  utils.catchup(node.range[0], state);
	  path.unshift(node);
	  traverse(node.value, path, state);
	  path.shift();
	  return false;
	}
	visitClassMethod.test = function(node, path, state) {
	  return node.type === Syntax.MethodDefinition;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassFunctionExpression(traverse, node, path, state) {
	  var methodNode = path[0];
	  var isGetter = methodNode.kind === 'get';
	  var isSetter = methodNode.kind === 'set';

	  state = utils.updateState(state, {
	    methodFuncNode: node
	  });

	  if (methodNode.key.name === 'constructor') {
	    utils.append('function ' + state.className, state);
	  } else {
	    var methodAccessor;
	    var prototypeOrStatic = methodNode.static ? '' : '.prototype';
	    var objectAccessor = state.className + prototypeOrStatic;

	    if (methodNode.key.type === Syntax.Identifier) {
	      // foo() {}
	      methodAccessor = methodNode.key.name;
	      if (_shouldMungeIdentifier(methodNode.key, state)) {
	        methodAccessor = _getMungedName(methodAccessor, state);
	      }
	      if (isGetter || isSetter) {
	        methodAccessor = JSON.stringify(methodAccessor);
	      } else if (reservedWordsHelper.isReservedWord(methodAccessor)) {
	        methodAccessor = '[' + JSON.stringify(methodAccessor) + ']';
	      } else {
	        methodAccessor = '.' + methodAccessor;
	      }
	    } else if (methodNode.key.type === Syntax.Literal) {
	      // 'foo bar'() {}  | get 'foo bar'() {} | set 'foo bar'() {}
	      methodAccessor = JSON.stringify(methodNode.key.value);
	      if (!(isGetter || isSetter)) {
	        methodAccessor = '[' + methodAccessor + ']';
	      }
	    }

	    if (isSetter || isGetter) {
	      utils.append(
	        'Object.defineProperty(' +
	          objectAccessor + ',' +
	          methodAccessor + ',' +
	          '{enumerable:true,configurable:true,' +
	          methodNode.kind + ':function',
	        state
	      );
	    } else {
	      utils.append(
	        objectAccessor +
	        methodAccessor + '=function' + (node.generator ? '*' : ''),
	        state
	      );
	    }
	  }
	  utils.move(methodNode.key.range[1], state);
	  utils.append('(', state);

	  var params = node.params;
	  if (params.length > 0) {
	    utils.move(params[0].range[0], state);
	    for (var i = 0; i < params.length; i++) {
	      utils.catchup(node.params[i].range[0], state);
	      path.unshift(node);
	      traverse(params[i], path, state);
	      path.shift();
	    }
	  }
	  utils.append(')', state);
	  utils.catchupWhiteSpace(node.body.range[0], state);
	  utils.append('{', state);
	  if (!state.scopeIsStrict) {
	    utils.append('"use strict";', state);
	    state = utils.updateState(state, {
	      scopeIsStrict: true
	    });
	  }
	  utils.move(node.body.range[0] + '{'.length, state);

	  path.unshift(node);
	  traverse(node.body, path, state);
	  path.shift();
	  utils.catchup(node.body.range[1], state);

	  if (methodNode.key.name !== 'constructor') {
	    if (isGetter || isSetter) {
	      utils.append('})', state);
	    }
	    utils.append(';', state);
	  }
	  return false;
	}
	visitClassFunctionExpression.test = function(node, path, state) {
	  return node.type === Syntax.FunctionExpression
	         && path[0].type === Syntax.MethodDefinition;
	};

	function visitClassMethodParam(traverse, node, path, state) {
	  var paramName = node.name;
	  if (_shouldMungeIdentifier(node, state)) {
	    paramName = _getMungedName(node.name, state);
	  }
	  utils.append(paramName, state);
	  utils.move(node.range[1], state);
	}
	visitClassMethodParam.test = function(node, path, state) {
	  if (!path[0] || !path[1]) {
	    return;
	  }

	  var parentFuncExpr = path[0];
	  var parentClassMethod = path[1];

	  return parentFuncExpr.type === Syntax.FunctionExpression
	         && parentClassMethod.type === Syntax.MethodDefinition
	         && node.type === Syntax.Identifier;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function _renderClassBody(traverse, node, path, state) {
	  var className = state.className;
	  var superClass = state.superClass;

	  // Set up prototype of constructor on same line as `extends` for line-number
	  // preservation. This relies on function-hoisting if a constructor function is
	  // defined in the class body.
	  if (superClass.name) {
	    // If the super class is an expression, we need to memoize the output of the
	    // expression into the generated class name variable and use that to refer
	    // to the super class going forward. Example:
	    //
	    //   class Foo extends mixin(Bar, Baz) {}
	    //     --transforms to--
	    //   function Foo() {} var ____Class0Blah = mixin(Bar, Baz);
	    if (superClass.expression !== null) {
	      utils.append(
	        'var ' + superClass.name + '=' + superClass.expression + ';',
	        state
	      );
	    }

	    var keyName = superClass.name + '____Key';
	    var keyNameDeclarator = '';
	    if (!utils.identWithinLexicalScope(keyName, state)) {
	      keyNameDeclarator = 'var ';
	      declareIdentInLocalScope(keyName, initScopeMetadata(node), state);
	    }
	    utils.append(
	      'for(' + keyNameDeclarator + keyName + ' in ' + superClass.name + '){' +
	        'if(' + superClass.name + '.hasOwnProperty(' + keyName + ')){' +
	          className + '[' + keyName + ']=' +
	            superClass.name + '[' + keyName + '];' +
	        '}' +
	      '}',
	      state
	    );

	    var superProtoIdentStr = SUPER_PROTO_IDENT_PREFIX + superClass.name;
	    if (!utils.identWithinLexicalScope(superProtoIdentStr, state)) {
	      utils.append(
	        'var ' + superProtoIdentStr + '=' + superClass.name + '===null?' +
	        'null:' + superClass.name + '.prototype;',
	        state
	      );
	      declareIdentInLocalScope(superProtoIdentStr, initScopeMetadata(node), state);
	    }

	    utils.append(
	      className + '.prototype=Object.create(' + superProtoIdentStr + ');',
	      state
	    );
	    utils.append(
	      className + '.prototype.constructor=' + className + ';',
	      state
	    );
	    utils.append(
	      className + '.__superConstructor__=' + superClass.name + ';',
	      state
	    );
	  }

	  // If there's no constructor method specified in the class body, create an
	  // empty constructor function at the top (same line as the class keyword)
	  if (!node.body.body.filter(_isConstructorMethod).pop()) {
	    utils.append('function ' + className + '(){', state);
	    if (!state.scopeIsStrict) {
	      utils.append('"use strict";', state);
	    }
	    if (superClass.name) {
	      utils.append(
	        'if(' + superClass.name + '!==null){' +
	        superClass.name + '.apply(this,arguments);}',
	        state
	      );
	    }
	    utils.append('}', state);
	  }

	  utils.move(node.body.range[0] + '{'.length, state);
	  traverse(node.body, path, state);
	  utils.catchupWhiteSpace(node.range[1], state);
	}

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassDeclaration(traverse, node, path, state) {
	  var className = node.id.name;
	  var superClass = _getSuperClassInfo(node, state);

	  state = utils.updateState(state, {
	    mungeNamespace: className,
	    className: className,
	    superClass: superClass
	  });

	  _renderClassBody(traverse, node, path, state);

	  return false;
	}
	visitClassDeclaration.test = function(node, path, state) {
	  return node.type === Syntax.ClassDeclaration;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassExpression(traverse, node, path, state) {
	  var className = node.id && node.id.name || _generateAnonymousClassName(state);
	  var superClass = _getSuperClassInfo(node, state);

	  utils.append('(function(){', state);

	  state = utils.updateState(state, {
	    mungeNamespace: className,
	    className: className,
	    superClass: superClass
	  });

	  _renderClassBody(traverse, node, path, state);

	  utils.append('return ' + className + ';})()', state);
	  return false;
	}
	visitClassExpression.test = function(node, path, state) {
	  return node.type === Syntax.ClassExpression;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitPrivateIdentifier(traverse, node, path, state) {
	  utils.append(_getMungedName(node.name, state), state);
	  utils.move(node.range[1], state);
	}
	visitPrivateIdentifier.test = function(node, path, state) {
	  if (node.type === Syntax.Identifier && _shouldMungeIdentifier(node, state)) {
	    // Always munge non-computed properties of MemberExpressions
	    // (a la preventing access of properties of unowned objects)
	    if (path[0].type === Syntax.MemberExpression && path[0].object !== node
	        && path[0].computed === false) {
	      return true;
	    }

	    // Always munge identifiers that were declared within the method function
	    // scope
	    if (utils.identWithinLexicalScope(node.name, state, state.methodFuncNode)) {
	      return true;
	    }

	    // Always munge private keys on object literals defined within a method's
	    // scope.
	    if (path[0].type === Syntax.Property
	        && path[1].type === Syntax.ObjectExpression) {
	      return true;
	    }

	    // Always munge function parameters
	    if (path[0].type === Syntax.FunctionExpression
	        || path[0].type === Syntax.FunctionDeclaration
	        || path[0].type === Syntax.ArrowFunctionExpression) {
	      for (var i = 0; i < path[0].params.length; i++) {
	        if (path[0].params[i] === node) {
	          return true;
	        }
	      }
	    }
	  }
	  return false;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitSuperCallExpression(traverse, node, path, state) {
	  var superClassName = state.superClass.name;

	  if (node.callee.type === Syntax.Identifier) {
	    if (_isConstructorMethod(state.methodNode)) {
	      utils.append(superClassName + '.call(', state);
	    } else {
	      var protoProp = SUPER_PROTO_IDENT_PREFIX + superClassName;
	      if (state.methodNode.key.type === Syntax.Identifier) {
	        protoProp += '.' + state.methodNode.key.name;
	      } else if (state.methodNode.key.type === Syntax.Literal) {
	        protoProp += '[' + JSON.stringify(state.methodNode.key.value) + ']';
	      }
	      utils.append(protoProp + ".call(", state);
	    }
	    utils.move(node.callee.range[1], state);
	  } else if (node.callee.type === Syntax.MemberExpression) {
	    utils.append(SUPER_PROTO_IDENT_PREFIX + superClassName, state);
	    utils.move(node.callee.object.range[1], state);

	    if (node.callee.computed) {
	      // ["a" + "b"]
	      utils.catchup(node.callee.property.range[1] + ']'.length, state);
	    } else {
	      // .ab
	      utils.append('.' + node.callee.property.name, state);
	    }

	    utils.append('.call(', state);
	    utils.move(node.callee.range[1], state);
	  }

	  utils.append('this', state);
	  if (node.arguments.length > 0) {
	    utils.append(',', state);
	    utils.catchupWhiteSpace(node.arguments[0].range[0], state);
	    traverse(node.arguments, path, state);
	  }

	  utils.catchupWhiteSpace(node.range[1], state);
	  utils.append(')', state);
	  return false;
	}
	visitSuperCallExpression.test = function(node, path, state) {
	  if (state.superClass && node.type === Syntax.CallExpression) {
	    var callee = node.callee;
	    if (callee.type === Syntax.Identifier && callee.name === 'super'
	        || callee.type == Syntax.MemberExpression
	           && callee.object.name === 'super') {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitSuperMemberExpression(traverse, node, path, state) {
	  var superClassName = state.superClass.name;

	  utils.append(SUPER_PROTO_IDENT_PREFIX + superClassName, state);
	  utils.move(node.object.range[1], state);
	}
	visitSuperMemberExpression.test = function(node, path, state) {
	  return state.superClass
	         && node.type === Syntax.MemberExpression
	         && node.object.type === Syntax.Identifier
	         && node.object.name === 'super';
	};

	exports.resetSymbols = resetSymbols;

	exports.visitorList = [
	  visitClassDeclaration,
	  visitClassExpression,
	  visitClassFunctionExpression,
	  visitClassMethod,
	  visitClassMethodParam,
	  visitPrivateIdentifier,
	  visitSuperCallExpression,
	  visitSuperMemberExpression
	];


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/*global exports:true*/

	/**
	 * Implements ES6 destructuring assignment and pattern matchng.
	 *
	 * function init({port, ip, coords: [x, y]}) {
	 *   return (x && y) ? {id, port} : {ip};
	 * };
	 *
	 * function init($__0) {
	 *   var
	 *    port = $__0.port,
	 *    ip = $__0.ip,
	 *    $__1 = $__0.coords,
	 *    x = $__1[0],
	 *    y = $__1[1];
	 *   return (x && y) ? {id, port} : {ip};
	 * }
	 *
	 * var x, {ip, port} = init({ip, port});
	 *
	 * var x, $__0 = init({ip, port}), ip = $__0.ip, port = $__0.port;
	 *
	 */
	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	var reservedWordsHelper = __webpack_require__(20);
	var restParamVisitors = __webpack_require__(13);
	var restPropertyHelpers = __webpack_require__(21);

	// -------------------------------------------------------
	// 1. Structured variable declarations.
	//
	// var [a, b] = [b, a];
	// var {x, y} = {y, x};
	// -------------------------------------------------------

	function visitStructuredVariable(traverse, node, path, state) {
	  // Allocate new temp for the pattern.
	  utils.append(getTmpVar(state.localScope.tempVarIndex) + '=', state);
	  // Skip the pattern and assign the init to the temp.
	  utils.catchupWhiteSpace(node.init.range[0], state);
	  traverse(node.init, path, state);
	  utils.catchup(node.init.range[1], state);
	  // Render the destructured data.
	  utils.append(',' + getDestructuredComponents(node.id, state), state);
	  state.localScope.tempVarIndex++;
	  return false;
	}

	visitStructuredVariable.test = function(node, path, state) {
	  return node.type === Syntax.VariableDeclarator &&
	    isStructuredPattern(node.id);
	};

	function isStructuredPattern(node) {
	  return node.type === Syntax.ObjectPattern ||
	    node.type === Syntax.ArrayPattern;
	}

	// Main function which does actual recursive destructuring
	// of nested complex structures.
	function getDestructuredComponents(node, state) {
	  var tmpIndex = state.localScope.tempVarIndex;
	  var components = [];
	  var patternItems = getPatternItems(node);

	  for (var idx = 0; idx < patternItems.length; idx++) {
	    var item = patternItems[idx];
	    if (!item) {
	      continue;
	    }

	    if (item.type === Syntax.SpreadElement) {
	      // Spread/rest of an array.
	      // TODO(dmitrys): support spread in the middle of a pattern
	      // and also for function param patterns: [x, ...xs, y]
	      components.push(item.argument.name +
	        '=Array.prototype.slice.call(' +
	        getTmpVar(tmpIndex) + ',' + idx + ')'
	      );
	      continue;
	    }

	    if (item.type === Syntax.SpreadProperty) {
	      var restExpression = restPropertyHelpers.renderRestExpression(
	        getTmpVar(tmpIndex),
	        patternItems
	      );
	      components.push(item.argument.name + '=' + restExpression);
	      continue;
	    }

	    // Depending on pattern type (Array or Object), we get
	    // corresponding pattern item parts.
	    var accessor = getPatternItemAccessor(node, item, tmpIndex, idx);
	    var value = getPatternItemValue(node, item);

	    // TODO(dmitrys): implement default values: {x, y=5}
	    if (value.type === Syntax.Identifier) {
	      // Simple pattern item.
	      components.push(value.name + '=' + accessor);
	    } else {
	      // Complex sub-structure.
	      components.push(
	        getInitialValue(++state.localScope.tempVarIndex, accessor) + ',' +
	        getDestructuredComponents(value, state)
	      );
	    }
	  }

	  return components.join(',');
	}

	function getPatternItems(node) {
	  return node.properties || node.elements;
	}

	function getPatternItemAccessor(node, patternItem, tmpIndex, idx) {
	  var tmpName = getTmpVar(tmpIndex);
	  if (node.type === Syntax.ObjectPattern) {
	    if (reservedWordsHelper.isReservedWord(patternItem.key.name)) {
	      return tmpName + '["' + patternItem.key.name + '"]';
	    } else {
	      return tmpName + '.' + patternItem.key.name;
	    }
	  } else {
	    return tmpName + '[' + idx + ']';
	  }
	}

	function getPatternItemValue(node, patternItem) {
	  return node.type === Syntax.ObjectPattern
	    ? patternItem.value
	    : patternItem;
	}

	function getInitialValue(index, value) {
	  return getTmpVar(index) + '=' + value;
	}

	function getTmpVar(index) {
	  return '$__' + index;
	}

	// -------------------------------------------------------
	// 2. Assignment expression.
	//
	// [a, b] = [b, a];
	// ({x, y} = {y, x});
	// -------------------------------------------------------

	function visitStructuredAssignment(traverse, node, path, state) {
	  var exprNode = node.expression;
	  utils.append('var ' + getTmpVar(state.localScope.tempVarIndex) + '=', state);

	  utils.catchupWhiteSpace(exprNode.right.range[0], state);
	  traverse(exprNode.right, path, state);
	  utils.catchup(exprNode.right.range[1], state);

	  utils.append(
	    ',' + getDestructuredComponents(exprNode.left, state) + ';',
	    state
	  );

	  utils.catchupWhiteSpace(node.range[1], state);
	  state.localScope.tempVarIndex++;
	  return false;
	}

	visitStructuredAssignment.test = function(node, path, state) {
	  // We consider the expression statement rather than just assignment
	  // expression to cover case with object patters which should be
	  // wrapped in grouping operator: ({x, y} = {y, x});
	  return node.type === Syntax.ExpressionStatement &&
	    node.expression.type === Syntax.AssignmentExpression &&
	    isStructuredPattern(node.expression.left);
	};

	// -------------------------------------------------------
	// 3. Structured parameter.
	//
	// function foo({x, y}) { ... }
	// -------------------------------------------------------

	function visitStructuredParameter(traverse, node, path, state) {
	  utils.append(getTmpVar(getParamIndex(node, path)), state);
	  utils.catchupWhiteSpace(node.range[1], state);
	  return true;
	}

	function getParamIndex(paramNode, path) {
	  var funcNode = path[0];
	  var tmpIndex = 0;
	  for (var k = 0; k < funcNode.params.length; k++) {
	    var param = funcNode.params[k];
	    if (param === paramNode) {
	      break;
	    }
	    if (isStructuredPattern(param)) {
	      tmpIndex++;
	    }
	  }
	  return tmpIndex;
	}

	visitStructuredParameter.test = function(node, path, state) {
	  return isStructuredPattern(node) && isFunctionNode(path[0]);
	};

	function isFunctionNode(node) {
	  return (node.type == Syntax.FunctionDeclaration ||
	    node.type == Syntax.FunctionExpression ||
	    node.type == Syntax.MethodDefinition ||
	    node.type == Syntax.ArrowFunctionExpression);
	}

	// -------------------------------------------------------
	// 4. Function body for structured parameters.
	//
	// function foo({x, y}) { x; y; }
	// -------------------------------------------------------

	function visitFunctionBodyForStructuredParameter(traverse, node, path, state) {
	  var funcNode = path[0];

	  utils.catchup(funcNode.body.range[0] + 1, state);
	  renderDestructuredComponents(funcNode, state);

	  if (funcNode.rest) {
	    utils.append(
	      restParamVisitors.renderRestParamSetup(funcNode),
	      state
	    );
	  }

	  return true;
	}

	function renderDestructuredComponents(funcNode, state) {
	  var destructuredComponents = [];

	  for (var k = 0; k < funcNode.params.length; k++) {
	    var param = funcNode.params[k];
	    if (isStructuredPattern(param)) {
	      destructuredComponents.push(
	        getDestructuredComponents(param, state)
	      );
	      state.localScope.tempVarIndex++;
	    }
	  }

	  if (destructuredComponents.length) {
	    utils.append('var ' + destructuredComponents.join(',') + ';', state);
	  }
	}

	visitFunctionBodyForStructuredParameter.test = function(node, path, state) {
	  return node.type === Syntax.BlockStatement && isFunctionNode(path[0]);
	};

	exports.visitorList = [
	  visitStructuredVariable,
	  visitStructuredAssignment,
	  visitStructuredParameter,
	  visitFunctionBodyForStructuredParameter
	];

	exports.renderDestructuredComponents = renderDestructuredComponents;



/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * Desugars concise methods of objects to function expressions.
	 *
	 * var foo = {
	 *   method(x, y) { ... }
	 * };
	 *
	 * var foo = {
	 *   method: function(x, y) { ... }
	 * };
	 *
	 */

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);
	var reservedWordsHelper = __webpack_require__(20);

	function visitObjectConciseMethod(traverse, node, path, state) {
	  var isGenerator = node.value.generator;
	  if (isGenerator) {
	    utils.catchupWhiteSpace(node.range[0] + 1, state);
	  }
	  if (node.computed) { // [<expr>]() { ...}
	    utils.catchup(node.key.range[1] + 1, state);
	  } else if (reservedWordsHelper.isReservedWord(node.key.name)) {
	    utils.catchup(node.key.range[0], state);
	    utils.append('"', state);
	    utils.catchup(node.key.range[1], state);
	    utils.append('"', state);
	  }

	  utils.catchup(node.key.range[1], state);
	  utils.append(
	    ':function' + (isGenerator ? '*' : ''),
	    state
	  );
	  path.unshift(node);
	  traverse(node.value, path, state);
	  path.shift();
	  return false;
	}

	visitObjectConciseMethod.test = function(node, path, state) {
	  return node.type === Syntax.Property &&
	    node.value.type === Syntax.FunctionExpression &&
	    node.method === true;
	};

	exports.visitorList = [
	  visitObjectConciseMethod
	];


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node: true*/

	/**
	 * Desugars ES6 Object Literal short notations into ES3 full notation.
	 *
	 * // Easier return values.
	 * function foo(x, y) {
	 *   return {x, y}; // {x: x, y: y}
	 * };
	 *
	 * // Destrucruting.
	 * function init({port, ip, coords: {x, y}}) { ... }
	 *
	 */
	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	/**
	 * @public
	 */
	function visitObjectLiteralShortNotation(traverse, node, path, state) {
	  utils.catchup(node.key.range[1], state);
	  utils.append(':' + node.key.name, state);
	  return false;
	}

	visitObjectLiteralShortNotation.test = function(node, path, state) {
	  return node.type === Syntax.Property &&
	    node.kind === 'init' &&
	    node.shorthand === true &&
	    path[0].type !== Syntax.ObjectPattern;
	};

	exports.visitorList = [
	  visitObjectLiteralShortNotation
	];



/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * Desugars ES6 rest parameters into ES3 arguments slicing.
	 *
	 * function printf(template, ...args) {
	 *   args.forEach(...);
	 * };
	 *
	 * function printf(template) {
	 *   var args = [].slice.call(arguments, 1);
	 *   args.forEach(...);
	 * };
	 *
	 */
	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);



	function _nodeIsFunctionWithRestParam(node) {
	  return (node.type === Syntax.FunctionDeclaration
	          || node.type === Syntax.FunctionExpression
	          || node.type === Syntax.ArrowFunctionExpression)
	         && node.rest;
	}

	function visitFunctionParamsWithRestParam(traverse, node, path, state) {
	  if (node.parametricType) {
	    utils.catchup(node.parametricType.range[0], state);
	    path.unshift(node);
	    traverse(node.parametricType, path, state);
	    path.shift();
	  }

	  // Render params.
	  if (node.params.length) {
	    path.unshift(node);
	    traverse(node.params, path, state);
	    path.shift();
	  } else {
	    // -3 is for ... of the rest.
	    utils.catchup(node.rest.range[0] - 3, state);
	  }
	  utils.catchupWhiteSpace(node.rest.range[1], state);

	  path.unshift(node);
	  traverse(node.body, path, state);
	  path.shift();

	  return false;
	}

	visitFunctionParamsWithRestParam.test = function(node, path, state) {
	  return _nodeIsFunctionWithRestParam(node);
	};

	function renderRestParamSetup(functionNode) {
	  return 'var ' + functionNode.rest.name + '=Array.prototype.slice.call(' +
	           'arguments,' +
	           functionNode.params.length +
	         ');';
	}

	function visitFunctionBodyWithRestParam(traverse, node, path, state) {
	  utils.catchup(node.range[0] + 1, state);
	  var parentNode = path[0];
	  utils.append(renderRestParamSetup(parentNode), state);
	  return true;
	}

	visitFunctionBodyWithRestParam.test = function(node, path, state) {
	  return node.type === Syntax.BlockStatement
	         && _nodeIsFunctionWithRestParam(path[0]);
	};

	exports.renderRestParamSetup = renderRestParamSetup;
	exports.visitorList = [
	  visitFunctionParamsWithRestParam,
	  visitFunctionBodyWithRestParam
	];


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * @typechecks
	 */
	'use strict';

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	/**
	 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-12.1.9
	 */
	function visitTemplateLiteral(traverse, node, path, state) {
	  var templateElements = node.quasis;

	  utils.append('(', state);
	  for (var ii = 0; ii < templateElements.length; ii++) {
	    var templateElement = templateElements[ii];
	    if (templateElement.value.raw !== '') {
	      utils.append(getCookedValue(templateElement), state);
	      if (!templateElement.tail) {
	        // + between element and substitution
	        utils.append(' + ', state);
	      }
	      // maintain line numbers
	      utils.move(templateElement.range[0], state);
	      utils.catchupNewlines(templateElement.range[1], state);
	    } else {  // templateElement.value.raw === ''
	      // Concatenat adjacent substitutions, e.g. `${x}${y}`. Empty templates
	      // appear before the first and after the last element - nothing to add in
	      // those cases.
	      if (ii > 0 && !templateElement.tail) {
	        // + between substitution and substitution
	        utils.append(' + ', state);
	      }
	    }

	    utils.move(templateElement.range[1], state);
	    if (!templateElement.tail) {
	      var substitution = node.expressions[ii];
	      if (substitution.type === Syntax.Identifier ||
	          substitution.type === Syntax.MemberExpression ||
	          substitution.type === Syntax.CallExpression) {
	        utils.catchup(substitution.range[1], state);
	      } else {
	        utils.append('(', state);
	        traverse(substitution, path, state);
	        utils.catchup(substitution.range[1], state);
	        utils.append(')', state);
	      }
	      // if next templateElement isn't empty...
	      if (templateElements[ii + 1].value.cooked !== '') {
	        utils.append(' + ', state);
	      }
	    }
	  }
	  utils.move(node.range[1], state);
	  utils.append(')', state);
	  return false;
	}

	visitTemplateLiteral.test = function(node, path, state) {
	  return node.type === Syntax.TemplateLiteral;
	};

	/**
	 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-12.2.6
	 */
	function visitTaggedTemplateExpression(traverse, node, path, state) {
	  var template = node.quasi;
	  var numQuasis = template.quasis.length;

	  // print the tag
	  utils.move(node.tag.range[0], state);
	  traverse(node.tag, path, state);
	  utils.catchup(node.tag.range[1], state);

	  // print array of template elements
	  utils.append('(function() { var siteObj = [', state);
	  for (var ii = 0; ii < numQuasis; ii++) {
	    utils.append(getCookedValue(template.quasis[ii]), state);
	    if (ii !== numQuasis - 1) {
	      utils.append(', ', state);
	    }
	  }
	  utils.append(']; siteObj.raw = [', state);
	  for (ii = 0; ii < numQuasis; ii++) {
	    utils.append(getRawValue(template.quasis[ii]), state);
	    if (ii !== numQuasis - 1) {
	      utils.append(', ', state);
	    }
	  }
	  utils.append(
	    ']; Object.freeze(siteObj.raw); Object.freeze(siteObj); return siteObj; }()',
	    state
	  );

	  // print substitutions
	  if (numQuasis > 1) {
	    for (ii = 0; ii < template.expressions.length; ii++) {
	      var expression = template.expressions[ii];
	      utils.append(', ', state);

	      // maintain line numbers by calling catchupWhiteSpace over the whole
	      // previous TemplateElement
	      utils.move(template.quasis[ii].range[0], state);
	      utils.catchupNewlines(template.quasis[ii].range[1], state);

	      utils.move(expression.range[0], state);
	      traverse(expression, path, state);
	      utils.catchup(expression.range[1], state);
	    }
	  }

	  // print blank lines to push the closing ) down to account for the final
	  // TemplateElement.
	  utils.catchupNewlines(node.range[1], state);

	  utils.append(')', state);

	  return false;
	}

	visitTaggedTemplateExpression.test = function(node, path, state) {
	  return node.type === Syntax.TaggedTemplateExpression;
	};

	function getCookedValue(templateElement) {
	  return JSON.stringify(templateElement.value.cooked);
	}

	function getRawValue(templateElement) {
	  return JSON.stringify(templateElement.value.raw);
	}

	exports.visitorList = [
	  visitTemplateLiteral,
	  visitTaggedTemplateExpression
	];


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2004-present Facebook. All Rights Reserved.
	 */
	/*global exports:true*/

	/**
	 * Implements ES7 object spread property.
	 * https://gist.github.com/sebmarkbage/aa849c7973cb4452c547
	 *
	 * { ...a, x: 1 }
	 *
	 * Object.assign({}, a, {x: 1 })
	 *
	 */

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	function visitObjectLiteralSpread(traverse, node, path, state) {
	  utils.catchup(node.range[0], state);

	  utils.append('Object.assign({', state);

	  // Skip the original {
	  utils.move(node.range[0] + 1, state);

	  var previousWasSpread = false;

	  for (var i = 0; i < node.properties.length; i++) {
	    var property = node.properties[i];
	    if (property.type === Syntax.SpreadProperty) {

	      // Close the previous object or initial object
	      if (!previousWasSpread) {
	        utils.append('}', state);
	      }

	      if (i === 0) {
	        // Normally there will be a comma when we catch up, but not before
	        // the first property.
	        utils.append(',', state);
	      }

	      utils.catchup(property.range[0], state);

	      // skip ...
	      utils.move(property.range[0] + 3, state);

	      traverse(property.argument, path, state);

	      utils.catchup(property.range[1], state);

	      previousWasSpread = true;

	    } else {

	      utils.catchup(property.range[0], state);

	      if (previousWasSpread) {
	        utils.append('{', state);
	      }

	      traverse(property, path, state);

	      utils.catchup(property.range[1], state);

	      previousWasSpread = false;

	    }
	  }

	  utils.catchup(node.range[1] - 1, state);

	  // Skip the trailing }
	  utils.move(node.range[1], state);

	  if (!previousWasSpread) {
	    utils.append('}', state);
	  }

	  utils.append(')', state);
	  return false;
	}

	visitObjectLiteralSpread.test = function(node, path, state) {
	  if (node.type !== Syntax.ObjectExpression) {
	    return false;
	  }
	  // Tight loop optimization
	  var hasAtLeastOneSpreadProperty = false;
	  for (var i = 0; i < node.properties.length; i++) {
	    var property = node.properties[i];
	    if (property.type === Syntax.SpreadProperty) {
	      hasAtLeastOneSpreadProperty = true;
	    } else if (property.kind !== 'init') {
	      return false;
	    }
	  }
	  return hasAtLeastOneSpreadProperty;
	};

	exports.visitorList = [
	  visitObjectLiteralSpread
	];


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var esprima = __webpack_require__(26);
	var utils = __webpack_require__(19);

	var Syntax = esprima.Syntax;

	function _isFunctionNode(node) {
	  return node.type === Syntax.FunctionDeclaration
	         || node.type === Syntax.FunctionExpression
	         || node.type === Syntax.ArrowFunctionExpression;
	}

	function visitClassProperty(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitClassProperty.test = function(node, path, state) {
	  return node.type === Syntax.ClassProperty;
	};

	function visitFunctionParametricAnnotation(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitFunctionParametricAnnotation.test = function(node, path, state) {
	  return node.type === Syntax.ParametricTypeAnnotation
	         && path[0]
	         && _isFunctionNode(path[0])
	         && node === path[0].parametricType;
	};

	function visitFunctionReturnAnnotation(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitFunctionReturnAnnotation.test = function(node, path, state) {
	  return path[0] && _isFunctionNode(path[0]) && node === path[0].returnType;
	};

	function visitOptionalFunctionParameterAnnotation(traverse, node, path, state) {
	  path.unshift(node);
	  traverse(node.id, path, state);
	  path.shift();
	  utils.catchup(node.id.range[1], state);
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitOptionalFunctionParameterAnnotation.test = function(node, path, state) {
	  return node.type === Syntax.OptionalParameter
	         && path[0]
	         && _isFunctionNode(path[0]);
	};

	function visitTypeAnnotatedIdentifier(traverse, node, path, state) {
	  traverse(node.id, path, state);
	  utils.catchup(node.id.range[1], state);
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitTypeAnnotatedIdentifier.test = function(node, path, state) {
	  return node.type === Syntax.TypeAnnotatedIdentifier;
	};

	exports.visitorList = [
	  visitClassProperty,
	  visitFunctionParametricAnnotation,
	  visitFunctionReturnAnnotation,
	  visitOptionalFunctionParameterAnnotation,
	  visitTypeAnnotatedIdentifier
	];


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/*global exports:true*/
	"use strict";

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	var FALLBACK_TAGS = __webpack_require__(22).knownTags;
	var renderXJSExpressionContainer =
	  __webpack_require__(22).renderXJSExpressionContainer;
	var renderXJSLiteral = __webpack_require__(22).renderXJSLiteral;
	var quoteAttrName = __webpack_require__(22).quoteAttrName;

	var trimLeft = __webpack_require__(22).trimLeft;

	/**
	 * Customized desugar processor for React JSX. Currently:
	 *
	 * <X> </X> => React.createElement(X, null)
	 * <X prop="1" /> => React.createElement(X, {prop: '1'}, null)
	 * <X prop="2"><Y /></X> => React.createElement(X, {prop:'2'},
	 *   React.createElement(Y, null)
	 * )
	 * <div /> => React.createElement("div", null)
	 */

	/**
	 * Removes all non-whitespace/parenthesis characters
	 */
	var reNonWhiteParen = /([^\s\(\)])/g;
	function stripNonWhiteParen(value) {
	  return value.replace(reNonWhiteParen, '');
	}

	var tagConvention = /^[a-z]|\-/;
	function isTagName(name) {
	  return tagConvention.test(name);
	}

	function visitReactTag(traverse, object, path, state) {
	  var openingElement = object.openingElement;
	  var nameObject = openingElement.name;
	  var attributesObject = openingElement.attributes;

	  utils.catchup(openingElement.range[0], state, trimLeft);

	  if (nameObject.type === Syntax.XJSNamespacedName && nameObject.namespace) {
	    throw new Error('Namespace tags are not supported. ReactJSX is not XML.');
	  }

	  // We assume that the React runtime is already in scope
	  utils.append('React.createElement(', state);

	  // Identifiers with lower case or hypthens are fallback tags (strings).
	  // XJSMemberExpressions are not.
	  if (nameObject.type === Syntax.XJSIdentifier && isTagName(nameObject.name)) {
	    // This is a temporary error message to assist upgrades
	    if (!FALLBACK_TAGS.hasOwnProperty(nameObject.name)) {
	      throw new Error(
	        'Lower case component names (' + nameObject.name + ') are no longer ' +
	        'supported in JSX: See http://fb.me/react-jsx-lower-case'
	      );
	    }

	    utils.append('"' + nameObject.name + '"', state);
	    utils.move(nameObject.range[1], state);
	  } else {
	    // Use utils.catchup in this case so we can easily handle
	    // XJSMemberExpressions which look like Foo.Bar.Baz. This also handles
	    // XJSIdentifiers that aren't fallback tags.
	    utils.move(nameObject.range[0], state);
	    utils.catchup(nameObject.range[1], state);
	  }

	  utils.append(', ', state);

	  var hasAttributes = attributesObject.length;

	  var hasAtLeastOneSpreadProperty = attributesObject.some(function(attr) {
	    return attr.type === Syntax.XJSSpreadAttribute;
	  });

	  // if we don't have any attributes, pass in null
	  if (hasAtLeastOneSpreadProperty) {
	    utils.append('React.__spread({', state);
	  } else if (hasAttributes) {
	    utils.append('{', state);
	  } else {
	    utils.append('null', state);
	  }

	  // keep track of if the previous attribute was a spread attribute
	  var previousWasSpread = false;

	  // write attributes
	  attributesObject.forEach(function(attr, index) {
	    var isLast = index === attributesObject.length - 1;

	    if (attr.type === Syntax.XJSSpreadAttribute) {
	      // Close the previous object or initial object
	      if (!previousWasSpread) {
	        utils.append('}, ', state);
	      }

	      // Move to the expression start, ignoring everything except parenthesis
	      // and whitespace.
	      utils.catchup(attr.range[0], state, stripNonWhiteParen);
	      // Plus 1 to skip `{`.
	      utils.move(attr.range[0] + 1, state);
	      utils.catchup(attr.argument.range[0], state, stripNonWhiteParen);

	      traverse(attr.argument, path, state);

	      utils.catchup(attr.argument.range[1], state);

	      // Move to the end, ignoring parenthesis and the closing `}`
	      utils.catchup(attr.range[1] - 1, state, stripNonWhiteParen);

	      if (!isLast) {
	        utils.append(', ', state);
	      }

	      utils.move(attr.range[1], state);

	      previousWasSpread = true;

	      return;
	    }

	    // If the next attribute is a spread, we're effective last in this object
	    if (!isLast) {
	      isLast = attributesObject[index + 1].type === Syntax.XJSSpreadAttribute;
	    }

	    if (attr.name.namespace) {
	      throw new Error(
	         'Namespace attributes are not supported. ReactJSX is not XML.');
	    }
	    var name = attr.name.name;

	    utils.catchup(attr.range[0], state, trimLeft);

	    if (previousWasSpread) {
	      utils.append('{', state);
	    }

	    utils.append(quoteAttrName(name), state);
	    utils.append(': ', state);

	    if (!attr.value) {
	      state.g.buffer += 'true';
	      state.g.position = attr.name.range[1];
	      if (!isLast) {
	        utils.append(', ', state);
	      }
	    } else {
	      utils.move(attr.name.range[1], state);
	      // Use catchupNewlines to skip over the '=' in the attribute
	      utils.catchupNewlines(attr.value.range[0], state);
	      if (attr.value.type === Syntax.Literal) {
	        renderXJSLiteral(attr.value, isLast, state);
	      } else {
	        renderXJSExpressionContainer(traverse, attr.value, isLast, path, state);
	      }
	    }

	    utils.catchup(attr.range[1], state, trimLeft);

	    previousWasSpread = false;

	  });

	  if (!openingElement.selfClosing) {
	    utils.catchup(openingElement.range[1] - 1, state, trimLeft);
	    utils.move(openingElement.range[1], state);
	  }

	  if (hasAttributes && !previousWasSpread) {
	    utils.append('}', state);
	  }

	  if (hasAtLeastOneSpreadProperty) {
	    utils.append(')', state);
	  }

	  // filter out whitespace
	  var childrenToRender = object.children.filter(function(child) {
	    return !(child.type === Syntax.Literal
	             && typeof child.value === 'string'
	             && child.value.match(/^[ \t]*[\r\n][ \t\r\n]*$/));
	  });
	  if (childrenToRender.length > 0) {
	    var lastRenderableIndex;

	    childrenToRender.forEach(function(child, index) {
	      if (child.type !== Syntax.XJSExpressionContainer ||
	          child.expression.type !== Syntax.XJSEmptyExpression) {
	        lastRenderableIndex = index;
	      }
	    });

	    if (lastRenderableIndex !== undefined) {
	      utils.append(', ', state);
	    }

	    childrenToRender.forEach(function(child, index) {
	      utils.catchup(child.range[0], state, trimLeft);

	      var isLast = index >= lastRenderableIndex;

	      if (child.type === Syntax.Literal) {
	        renderXJSLiteral(child, isLast, state);
	      } else if (child.type === Syntax.XJSExpressionContainer) {
	        renderXJSExpressionContainer(traverse, child, isLast, path, state);
	      } else {
	        traverse(child, path, state);
	        if (!isLast) {
	          utils.append(', ', state);
	        }
	      }

	      utils.catchup(child.range[1], state, trimLeft);
	    });
	  }

	  if (openingElement.selfClosing) {
	    // everything up to />
	    utils.catchup(openingElement.range[1] - 2, state, trimLeft);
	    utils.move(openingElement.range[1], state);
	  } else {
	    // everything up to </ sdflksjfd>
	    utils.catchup(object.closingElement.range[0], state, trimLeft);
	    utils.move(object.closingElement.range[1], state);
	  }

	  utils.append(')', state);
	  return false;
	}

	visitReactTag.test = function(object, path, state) {
	  return object.type === Syntax.XJSElement;
	};

	exports.visitorList = [
	  visitReactTag
	];


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/*global exports:true*/
	"use strict";

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	function addDisplayName(displayName, object, state) {
	  if (object &&
	      object.type === Syntax.CallExpression &&
	      object.callee.type === Syntax.MemberExpression &&
	      object.callee.object.type === Syntax.Identifier &&
	      object.callee.object.name === 'React' &&
	      object.callee.property.type === Syntax.Identifier &&
	      object.callee.property.name === 'createClass' &&
	      object['arguments'].length === 1 &&
	      object['arguments'][0].type === Syntax.ObjectExpression) {
	    // Verify that the displayName property isn't already set
	    var properties = object['arguments'][0].properties;
	    var safe = properties.every(function(property) {
	      var value = property.key.type === Syntax.Identifier ?
	        property.key.name :
	        property.key.value;
	      return value !== 'displayName';
	    });

	    if (safe) {
	      utils.catchup(object['arguments'][0].range[0] + 1, state);
	      utils.append("displayName: '" + displayName + "',", state);
	    }
	  }
	}

	/**
	 * Transforms the following:
	 *
	 * var MyComponent = React.createClass({
	 *    render: ...
	 * });
	 *
	 * into:
	 *
	 * var MyComponent = React.createClass({
	 *    displayName: 'MyComponent',
	 *    render: ...
	 * });
	 *
	 * Also catches:
	 *
	 * MyComponent = React.createClass(...);
	 * exports.MyComponent = React.createClass(...);
	 * module.exports = {MyComponent: React.createClass(...)};
	 */
	function visitReactDisplayName(traverse, object, path, state) {
	  var left, right;

	  if (object.type === Syntax.AssignmentExpression) {
	    left = object.left;
	    right = object.right;
	  } else if (object.type === Syntax.Property) {
	    left = object.key;
	    right = object.value;
	  } else if (object.type === Syntax.VariableDeclarator) {
	    left = object.id;
	    right = object.init;
	  }

	  if (left && left.type === Syntax.MemberExpression) {
	    left = left.property;
	  }
	  if (left && left.type === Syntax.Identifier) {
	    addDisplayName(left.name, right, state);
	  }
	}

	visitReactDisplayName.test = function(object, path, state) {
	  return (
	    object.type === Syntax.AssignmentExpression ||
	    object.type === Syntax.Property ||
	    object.type === Syntax.VariableDeclarator
	  );
	};

	exports.visitorList = [
	  visitReactDisplayName
	];


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/*jslint node: true*/
	var Syntax = __webpack_require__(26).Syntax;
	var leadingIndentRegexp = /(^|\n)( {2}|\t)/g;
	var nonWhiteRegexp = /(\S)/g;

	/**
	 * A `state` object represents the state of the parser. It has "local" and
	 * "global" parts. Global contains parser position, source, etc. Local contains
	 * scope based properties like current class name. State should contain all the
	 * info required for transformation. It's the only mandatory object that is
	 * being passed to every function in transform chain.
	 *
	 * @param  {string} source
	 * @param  {object} transformOptions
	 * @return {object}
	 */
	function createState(source, rootNode, transformOptions) {
	  return {
	    /**
	     * A tree representing the current local scope (and its lexical scope chain)
	     * Useful for tracking identifiers from parent scopes, etc.
	     * @type {Object}
	     */
	    localScope: {
	      parentNode: rootNode,
	      parentScope: null,
	      identifiers: {},
	      tempVarIndex: 0
	    },
	    /**
	     * The name (and, if applicable, expression) of the super class
	     * @type {Object}
	     */
	    superClass: null,
	    /**
	     * The namespace to use when munging identifiers
	     * @type {String}
	     */
	    mungeNamespace: '',
	    /**
	     * Ref to the node for the current MethodDefinition
	     * @type {Object}
	     */
	    methodNode: null,
	    /**
	     * Ref to the node for the FunctionExpression of the enclosing
	     * MethodDefinition
	     * @type {Object}
	     */
	    methodFuncNode: null,
	    /**
	     * Name of the enclosing class
	     * @type {String}
	     */
	    className: null,
	    /**
	     * Whether we're currently within a `strict` scope
	     * @type {Bool}
	     */
	    scopeIsStrict: null,
	    /**
	     * Indentation offset
	     * @type {Number}
	     */
	    indentBy: 0,
	    /**
	     * Global state (not affected by updateState)
	     * @type {Object}
	     */
	    g: {
	      /**
	       * A set of general options that transformations can consider while doing
	       * a transformation:
	       *
	       * - minify
	       *   Specifies that transformation steps should do their best to minify
	       *   the output source when possible. This is useful for places where
	       *   minification optimizations are possible with higher-level context
	       *   info than what jsxmin can provide.
	       *
	       *   For example, the ES6 class transform will minify munged private
	       *   variables if this flag is set.
	       */
	      opts: transformOptions,
	      /**
	       * Current position in the source code
	       * @type {Number}
	       */
	      position: 0,
	      /**
	       * Auxiliary data to be returned by transforms
	       * @type {Object}
	       */
	      extra: {},
	      /**
	       * Buffer containing the result
	       * @type {String}
	       */
	      buffer: '',
	      /**
	       * Source that is being transformed
	       * @type {String}
	       */
	      source: source,

	      /**
	       * Cached parsed docblock (see getDocblock)
	       * @type {object}
	       */
	      docblock: null,

	      /**
	       * Whether the thing was used
	       * @type {Boolean}
	       */
	      tagNamespaceUsed: false,

	      /**
	       * If using bolt xjs transformation
	       * @type {Boolean}
	       */
	      isBolt: undefined,

	      /**
	       * Whether to record source map (expensive) or not
	       * @type {SourceMapGenerator|null}
	       */
	      sourceMap: null,

	      /**
	       * Filename of the file being processed. Will be returned as a source
	       * attribute in the source map
	       */
	      sourceMapFilename: 'source.js',

	      /**
	       * Only when source map is used: last line in the source for which
	       * source map was generated
	       * @type {Number}
	       */
	      sourceLine: 1,

	      /**
	       * Only when source map is used: last line in the buffer for which
	       * source map was generated
	       * @type {Number}
	       */
	      bufferLine: 1,

	      /**
	       * The top-level Program AST for the original file.
	       */
	      originalProgramAST: null,

	      sourceColumn: 0,
	      bufferColumn: 0
	    }
	  };
	}

	/**
	 * Updates a copy of a given state with "update" and returns an updated state.
	 *
	 * @param  {object} state
	 * @param  {object} update
	 * @return {object}
	 */
	function updateState(state, update) {
	  var ret = Object.create(state);
	  Object.keys(update).forEach(function(updatedKey) {
	    ret[updatedKey] = update[updatedKey];
	  });
	  return ret;
	}

	/**
	 * Given a state fill the resulting buffer from the original source up to
	 * the end
	 *
	 * @param {number} end
	 * @param {object} state
	 * @param {?function} contentTransformer Optional callback to transform newly
	 *                                       added content.
	 */
	function catchup(end, state, contentTransformer) {
	  if (end < state.g.position) {
	    // cannot move backwards
	    return;
	  }
	  var source = state.g.source.substring(state.g.position, end);
	  var transformed = updateIndent(source, state);
	  if (state.g.sourceMap && transformed) {
	    // record where we are
	    state.g.sourceMap.addMapping({
	      generated: { line: state.g.bufferLine, column: state.g.bufferColumn },
	      original: { line: state.g.sourceLine, column: state.g.sourceColumn },
	      source: state.g.sourceMapFilename
	    });

	    // record line breaks in transformed source
	    var sourceLines = source.split('\n');
	    var transformedLines = transformed.split('\n');
	    // Add line break mappings between last known mapping and the end of the
	    // added piece. So for the code piece
	    //  (foo, bar);
	    // > var x = 2;
	    // > var b = 3;
	    //   var c =
	    // only add lines marked with ">": 2, 3.
	    for (var i = 1; i < sourceLines.length - 1; i++) {
	      state.g.sourceMap.addMapping({
	        generated: { line: state.g.bufferLine, column: 0 },
	        original: { line: state.g.sourceLine, column: 0 },
	        source: state.g.sourceMapFilename
	      });
	      state.g.sourceLine++;
	      state.g.bufferLine++;
	    }
	    // offset for the last piece
	    if (sourceLines.length > 1) {
	      state.g.sourceLine++;
	      state.g.bufferLine++;
	      state.g.sourceColumn = 0;
	      state.g.bufferColumn = 0;
	    }
	    state.g.sourceColumn += sourceLines[sourceLines.length - 1].length;
	    state.g.bufferColumn +=
	      transformedLines[transformedLines.length - 1].length;
	  }
	  state.g.buffer +=
	    contentTransformer ? contentTransformer(transformed) : transformed;
	  state.g.position = end;
	}

	/**
	 * Returns original source for an AST node.
	 * @param {object} node
	 * @param {object} state
	 * @return {string}
	 */
	function getNodeSourceText(node, state) {
	  return state.g.source.substring(node.range[0], node.range[1]);
	}

	function replaceNonWhite(value) {
	  return value.replace(nonWhiteRegexp, ' ');
	}

	/**
	 * Removes all non-whitespace characters
	 */
	function stripNonWhite(value) {
	  return value.replace(nonWhiteRegexp, '');
	}

	/**
	 * Catches up as `catchup` but replaces non-whitespace chars with spaces.
	 */
	function catchupWhiteOut(end, state) {
	  catchup(end, state, replaceNonWhite);
	}

	/**
	 * Catches up as `catchup` but removes all non-whitespace characters.
	 */
	function catchupWhiteSpace(end, state) {
	  catchup(end, state, stripNonWhite);
	}

	/**
	 * Removes all non-newline characters
	 */
	var reNonNewline = /[^\n]/g;
	function stripNonNewline(value) {
	  return value.replace(reNonNewline, function() {
	    return '';
	  });
	}

	/**
	 * Catches up as `catchup` but removes all non-newline characters.
	 *
	 * Equivalent to appending as many newlines as there are in the original source
	 * between the current position and `end`.
	 */
	function catchupNewlines(end, state) {
	  catchup(end, state, stripNonNewline);
	}


	/**
	 * Same as catchup but does not touch the buffer
	 *
	 * @param  {number} end
	 * @param  {object} state
	 */
	function move(end, state) {
	  // move the internal cursors
	  if (state.g.sourceMap) {
	    if (end < state.g.position) {
	      state.g.position = 0;
	      state.g.sourceLine = 1;
	      state.g.sourceColumn = 0;
	    }

	    var source = state.g.source.substring(state.g.position, end);
	    var sourceLines = source.split('\n');
	    if (sourceLines.length > 1) {
	      state.g.sourceLine += sourceLines.length - 1;
	      state.g.sourceColumn = 0;
	    }
	    state.g.sourceColumn += sourceLines[sourceLines.length - 1].length;
	  }
	  state.g.position = end;
	}

	/**
	 * Appends a string of text to the buffer
	 *
	 * @param {string} str
	 * @param {object} state
	 */
	function append(str, state) {
	  if (state.g.sourceMap && str) {
	    state.g.sourceMap.addMapping({
	      generated: { line: state.g.bufferLine, column: state.g.bufferColumn },
	      original: { line: state.g.sourceLine, column: state.g.sourceColumn },
	      source: state.g.sourceMapFilename
	    });
	    var transformedLines = str.split('\n');
	    if (transformedLines.length > 1) {
	      state.g.bufferLine += transformedLines.length - 1;
	      state.g.bufferColumn = 0;
	    }
	    state.g.bufferColumn +=
	      transformedLines[transformedLines.length - 1].length;
	  }
	  state.g.buffer += str;
	}

	/**
	 * Update indent using state.indentBy property. Indent is measured in
	 * double spaces. Updates a single line only.
	 *
	 * @param {string} str
	 * @param {object} state
	 * @return {string}
	 */
	function updateIndent(str, state) {
	  var indentBy = state.indentBy;
	  if (indentBy < 0) {
	    for (var i = 0; i < -indentBy; i++) {
	      str = str.replace(leadingIndentRegexp, '$1');
	    }
	  } else {
	    for (var i = 0; i < indentBy; i++) {
	      str = str.replace(leadingIndentRegexp, '$1$2$2');
	    }
	  }
	  return str;
	}

	/**
	 * Calculates indent from the beginning of the line until "start" or the first
	 * character before start.
	 * @example
	 *   "  foo.bar()"
	 *         ^
	 *       start
	 *   indent will be "  "
	 *
	 * @param  {number} start
	 * @param  {object} state
	 * @return {string}
	 */
	function indentBefore(start, state) {
	  var end = start;
	  start = start - 1;

	  while (start > 0 && state.g.source[start] != '\n') {
	    if (!state.g.source[start].match(/[ \t]/)) {
	      end = start;
	    }
	    start--;
	  }
	  return state.g.source.substring(start + 1, end);
	}

	function getDocblock(state) {
	  if (!state.g.docblock) {
	    var docblock = __webpack_require__(27);
	    state.g.docblock =
	      docblock.parseAsObject(docblock.extract(state.g.source));
	  }
	  return state.g.docblock;
	}

	function identWithinLexicalScope(identName, state, stopBeforeNode) {
	  var currScope = state.localScope;
	  while (currScope) {
	    if (currScope.identifiers[identName] !== undefined) {
	      return true;
	    }

	    if (stopBeforeNode && currScope.parentNode === stopBeforeNode) {
	      break;
	    }

	    currScope = currScope.parentScope;
	  }
	  return false;
	}

	function identInLocalScope(identName, state) {
	  return state.localScope.identifiers[identName] !== undefined;
	}

	/**
	 * @param {object} boundaryNode
	 * @param {?array} path
	 * @return {?object} node
	 */
	function initScopeMetadata(boundaryNode, path, node) {
	  return {
	    boundaryNode: boundaryNode,
	    bindingPath: path,
	    bindingNode: node
	  };
	}

	function declareIdentInLocalScope(identName, metaData, state) {
	  state.localScope.identifiers[identName] = {
	    boundaryNode: metaData.boundaryNode,
	    path: metaData.path,
	    node: metaData.node,
	    state: Object.create(state)
	  };
	}

	function getLexicalBindingMetadata(identName, state) {
	  return state.localScope.identifiers[identName];
	}

	/**
	 * Apply the given analyzer function to the current node. If the analyzer
	 * doesn't return false, traverse each child of the current node using the given
	 * traverser function.
	 *
	 * @param {function} analyzer
	 * @param {function} traverser
	 * @param {object} node
	 * @param {function} visitor
	 * @param {array} path
	 * @param {object} state
	 */
	function analyzeAndTraverse(analyzer, traverser, node, path, state) {
	  if (node.type) {
	    if (analyzer(node, path, state) === false) {
	      return;
	    }
	    path.unshift(node);
	  }

	  getOrderedChildren(node).forEach(function(child) {
	    traverser(child, path, state);
	  });

	  node.type && path.shift();
	}

	/**
	 * It is crucial that we traverse in order, or else catchup() on a later
	 * node that is processed out of order can move the buffer past a node
	 * that we haven't handled yet, preventing us from modifying that node.
	 *
	 * This can happen when a node has multiple properties containing children.
	 * For example, XJSElement nodes have `openingElement`, `closingElement` and
	 * `children`. If we traverse `openingElement`, then `closingElement`, then
	 * when we get to `children`, the buffer has already caught up to the end of
	 * the closing element, after the children.
	 *
	 * This is basically a Schwartzian transform. Collects an array of children,
	 * each one represented as [child, startIndex]; sorts the array by start
	 * index; then traverses the children in that order.
	 */
	function getOrderedChildren(node) {
	  var queue = [];
	  for (var key in node) {
	    if (node.hasOwnProperty(key)) {
	      enqueueNodeWithStartIndex(queue, node[key]);
	    }
	  }
	  queue.sort(function(a, b) { return a[1] - b[1]; });
	  return queue.map(function(pair) { return pair[0]; });
	}

	/**
	 * Helper function for analyzeAndTraverse which queues up all of the children
	 * of the given node.
	 *
	 * Children can also be found in arrays, so we basically want to merge all of
	 * those arrays together so we can sort them and then traverse the children
	 * in order.
	 *
	 * One example is the Program node. It contains `body` and `comments`, both
	 * arrays. Lexographically, comments are interspersed throughout the body
	 * nodes, but esprima's AST groups them together.
	 */
	function enqueueNodeWithStartIndex(queue, node) {
	  if (typeof node !== 'object' || node === null) {
	    return;
	  }
	  if (node.range) {
	    queue.push([node, node.range[0]]);
	  } else if (Array.isArray(node)) {
	    for (var ii = 0; ii < node.length; ii++) {
	      enqueueNodeWithStartIndex(queue, node[ii]);
	    }
	  }
	}

	/**
	 * Checks whether a node or any of its sub-nodes contains
	 * a syntactic construct of the passed type.
	 * @param {object} node - AST node to test.
	 * @param {string} type - node type to lookup.
	 */
	function containsChildOfType(node, type) {
	  var foundMatchingChild = false;
	  function nodeTypeAnalyzer(node) {
	    if (node.type === type) {
	      foundMatchingChild = true;
	      return false;
	    }
	  }
	  function nodeTypeTraverser(child, path, state) {
	    if (!foundMatchingChild) {
	      foundMatchingChild = containsChildOfType(child, type);
	    }
	  }
	  analyzeAndTraverse(
	    nodeTypeAnalyzer,
	    nodeTypeTraverser,
	    node,
	    []
	  );
	  return foundMatchingChild;
	}

	var scopeTypes = {};
	scopeTypes[Syntax.FunctionExpression] = true;
	scopeTypes[Syntax.FunctionDeclaration] = true;
	scopeTypes[Syntax.Program] = true;

	function getBoundaryNode(path) {
	  for (var ii = 0; ii < path.length; ++ii) {
	    if (scopeTypes[path[ii].type]) {
	      return path[ii];
	    }
	  }
	  throw new Error(
	    'Expected to find a node with one of the following types in path:\n' +
	    JSON.stringify(Object.keys(scopeTypes))
	  );
	}

	exports.append = append;
	exports.catchup = catchup;
	exports.catchupWhiteOut = catchupWhiteOut;
	exports.catchupWhiteSpace = catchupWhiteSpace;
	exports.catchupNewlines = catchupNewlines;
	exports.containsChildOfType = containsChildOfType;
	exports.createState = createState;
	exports.declareIdentInLocalScope = declareIdentInLocalScope;
	exports.getBoundaryNode = getBoundaryNode;
	exports.getDocblock = getDocblock;
	exports.getLexicalBindingMetadata = getLexicalBindingMetadata;
	exports.initScopeMetadata = initScopeMetadata;
	exports.identWithinLexicalScope = identWithinLexicalScope;
	exports.identInLocalScope = identInLocalScope;
	exports.indentBefore = indentBefore;
	exports.move = move;
	exports.scopeTypes = scopeTypes;
	exports.updateIndent = updateIndent;
	exports.updateState = updateState;
	exports.analyzeAndTraverse = analyzeAndTraverse;
	exports.getOrderedChildren = getOrderedChildren;
	exports.getNodeSourceText = getNodeSourceText;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	var KEYWORDS = [
	  'break', 'do', 'in', 'typeof', 'case', 'else', 'instanceof', 'var', 'catch',
	  'export', 'new', 'void', 'class', 'extends', 'return', 'while', 'const',
	  'finally', 'super', 'with', 'continue', 'for', 'switch', 'yield', 'debugger',
	  'function', 'this', 'default', 'if', 'throw', 'delete', 'import', 'try'
	];

	var FUTURE_RESERVED_WORDS = [
	  'enum', 'await', 'implements', 'package', 'protected', 'static', 'interface',
	  'private', 'public'
	];

	var LITERALS = [
	  'null',
	  'true',
	  'false'
	];

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-reserved-words
	var RESERVED_WORDS = [].concat(
	  KEYWORDS,
	  FUTURE_RESERVED_WORDS,
	  LITERALS
	);

	var reservedWordsMap = {};
	RESERVED_WORDS.forEach(function(k) {
	    reservedWordsMap[k] = true;
	});

	exports.isReservedWord = function(word) {
	  return !!reservedWordsMap[word];
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * Desugars ES7 rest properties into ES5 object iteration.
	 */

	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	// TODO: This is a pretty massive helper, it should only be defined once, in the
	// transform's runtime environment. We don't currently have a runtime though.
	var restFunction =
	  '(function(source, exclusion) {' +
	    'var rest = {};' +
	    'var hasOwn = Object.prototype.hasOwnProperty;' +
	    'if (source == null) {' +
	      'throw new TypeError();' +
	    '}' +
	    'for (var key in source) {' +
	      'if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {' +
	        'rest[key] = source[key];' +
	      '}' +
	    '}' +
	    'return rest;' +
	  '})';

	function getPropertyNames(properties) {
	  var names = [];
	  for (var i = 0; i < properties.length; i++) {
	    var property = properties[i];
	    if (property.type === Syntax.SpreadProperty) {
	      continue;
	    }
	    if (property.type === Syntax.Identifier) {
	      names.push(property.name);
	    } else {
	      names.push(property.key.name);
	    }
	  }
	  return names;
	}

	function getRestFunctionCall(source, exclusion) {
	  return restFunction + '(' + source + ',' + exclusion + ')';
	}

	function getSimpleShallowCopy(accessorExpression) {
	  // This could be faster with 'Object.assign({}, ' + accessorExpression + ')'
	  // but to unify code paths and avoid a ES6 dependency we use the same
	  // helper as for the exclusion case.
	  return getRestFunctionCall(accessorExpression, '{}');
	}

	function renderRestExpression(accessorExpression, excludedProperties) {
	  var excludedNames = getPropertyNames(excludedProperties);
	  if (!excludedNames.length) {
	    return getSimpleShallowCopy(accessorExpression);
	  }
	  return getRestFunctionCall(
	    accessorExpression,
	    '{' + excludedNames.join(':1,') + ':1}'
	  );
	}

	exports.renderRestExpression = renderRestExpression;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/*global exports:true*/
	"use strict";
	var Syntax = __webpack_require__(26).Syntax;
	var utils = __webpack_require__(19);

	var knownTags = {
	  a: true,
	  abbr: true,
	  address: true,
	  applet: true,
	  area: true,
	  article: true,
	  aside: true,
	  audio: true,
	  b: true,
	  base: true,
	  bdi: true,
	  bdo: true,
	  big: true,
	  blockquote: true,
	  body: true,
	  br: true,
	  button: true,
	  canvas: true,
	  caption: true,
	  circle: true,
	  cite: true,
	  code: true,
	  col: true,
	  colgroup: true,
	  command: true,
	  data: true,
	  datalist: true,
	  dd: true,
	  defs: true,
	  del: true,
	  details: true,
	  dfn: true,
	  dialog: true,
	  div: true,
	  dl: true,
	  dt: true,
	  ellipse: true,
	  em: true,
	  embed: true,
	  fieldset: true,
	  figcaption: true,
	  figure: true,
	  footer: true,
	  form: true,
	  g: true,
	  h1: true,
	  h2: true,
	  h3: true,
	  h4: true,
	  h5: true,
	  h6: true,
	  head: true,
	  header: true,
	  hgroup: true,
	  hr: true,
	  html: true,
	  i: true,
	  iframe: true,
	  img: true,
	  input: true,
	  ins: true,
	  kbd: true,
	  keygen: true,
	  label: true,
	  legend: true,
	  li: true,
	  line: true,
	  linearGradient: true,
	  link: true,
	  main: true,
	  map: true,
	  mark: true,
	  marquee: true,
	  mask: false,
	  menu: true,
	  menuitem: true,
	  meta: true,
	  meter: true,
	  nav: true,
	  noscript: true,
	  object: true,
	  ol: true,
	  optgroup: true,
	  option: true,
	  output: true,
	  p: true,
	  param: true,
	  path: true,
	  pattern: false,
	  picture: true,
	  polygon: true,
	  polyline: true,
	  pre: true,
	  progress: true,
	  q: true,
	  radialGradient: true,
	  rect: true,
	  rp: true,
	  rt: true,
	  ruby: true,
	  s: true,
	  samp: true,
	  script: true,
	  section: true,
	  select: true,
	  small: true,
	  source: true,
	  span: true,
	  stop: true,
	  strong: true,
	  style: true,
	  sub: true,
	  summary: true,
	  sup: true,
	  svg: true,
	  table: true,
	  tbody: true,
	  td: true,
	  text: true,
	  textarea: true,
	  tfoot: true,
	  th: true,
	  thead: true,
	  time: true,
	  title: true,
	  tr: true,
	  track: true,
	  tspan: true,
	  u: true,
	  ul: true,
	  'var': true,
	  video: true,
	  wbr: true
	};

	function renderXJSLiteral(object, isLast, state, start, end) {
	  var lines = object.value.split(/\r\n|\n|\r/);

	  if (start) {
	    utils.append(start, state);
	  }

	  var lastNonEmptyLine = 0;

	  lines.forEach(function (line, index) {
	    if (line.match(/[^ \t]/)) {
	      lastNonEmptyLine = index;
	    }
	  });

	  lines.forEach(function (line, index) {
	    var isFirstLine = index === 0;
	    var isLastLine = index === lines.length - 1;
	    var isLastNonEmptyLine = index === lastNonEmptyLine;

	    // replace rendered whitespace tabs with spaces
	    var trimmedLine = line.replace(/\t/g, ' ');

	    // trim whitespace touching a newline
	    if (!isFirstLine) {
	      trimmedLine = trimmedLine.replace(/^[ ]+/, '');
	    }
	    if (!isLastLine) {
	      trimmedLine = trimmedLine.replace(/[ ]+$/, '');
	    }

	    if (!isFirstLine) {
	      utils.append(line.match(/^[ \t]*/)[0], state);
	    }

	    if (trimmedLine || isLastNonEmptyLine) {
	      utils.append(
	        JSON.stringify(trimmedLine) +
	        (!isLastNonEmptyLine ? " + ' ' +" : ''),
	        state);

	      if (isLastNonEmptyLine) {
	        if (end) {
	          utils.append(end, state);
	        }
	        if (!isLast) {
	          utils.append(', ', state);
	        }
	      }

	      // only restore tail whitespace if line had literals
	      if (trimmedLine && !isLastLine) {
	        utils.append(line.match(/[ \t]*$/)[0], state);
	      }
	    }

	    if (!isLastLine) {
	      utils.append('\n', state);
	    }
	  });

	  utils.move(object.range[1], state);
	}

	function renderXJSExpressionContainer(traverse, object, isLast, path, state) {
	  // Plus 1 to skip `{`.
	  utils.move(object.range[0] + 1, state);
	  traverse(object.expression, path, state);

	  if (!isLast && object.expression.type !== Syntax.XJSEmptyExpression) {
	    // If we need to append a comma, make sure to do so after the expression.
	    utils.catchup(object.expression.range[1], state, trimLeft);
	    utils.append(', ', state);
	  }

	  // Minus 1 to skip `}`.
	  utils.catchup(object.range[1] - 1, state, trimLeft);
	  utils.move(object.range[1], state);
	  return false;
	}

	function quoteAttrName(attr) {
	  // Quote invalid JS identifiers.
	  if (!/^[a-z_$][a-z\d_$]*$/i.test(attr)) {
	    return "'" + attr + "'";
	  }
	  return attr;
	}

	function trimLeft(value) {
	  return value.replace(/^[ ]+/, '');
	}

	exports.knownTags = knownTags;
	exports.renderXJSExpressionContainer = renderXJSExpressionContainer;
	exports.renderXJSLiteral = renderXJSLiteral;
	exports.quoteAttrName = quoteAttrName;
	exports.trimLeft = trimLeft;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	exports.read = function(buffer, offset, isLE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isLE ? (nBytes - 1) : 0,
	      d = isLE ? -1 : 1,
	      s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity);
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isLE ? 0 : (nBytes - 1),
	      d = isLE ? 1 : -1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

	  buffer[offset + i - d] |= s * 128;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS)
				return 62 // '+'
			if (code === SLASH)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}(false ? (this.base64js = {}) : exports))


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/*jslint bitwise:true plusplus:true */
	/*global esprima:true, define:true, exports:true, window: true,
	throwError: true, generateStatement: true, peek: true,
	parseAssignmentExpression: true, parseBlock: true,
	parseClassExpression: true, parseClassDeclaration: true, parseExpression: true,
	parseForStatement: true,
	parseFunctionDeclaration: true, parseFunctionExpression: true,
	parseFunctionSourceElements: true, parseVariableIdentifier: true,
	parseImportSpecifier: true,
	parseLeftHandSideExpression: true, parseParams: true, validateParam: true,
	parseSpreadOrAssignmentExpression: true,
	parseStatement: true, parseSourceElement: true, parseModuleBlock: true, parseConciseBody: true,
	advanceXJSChild: true, isXJSIdentifierStart: true, isXJSIdentifierPart: true,
	scanXJSStringLiteral: true, scanXJSIdentifier: true,
	parseXJSAttributeValue: true, parseXJSChild: true, parseXJSElement: true, parseXJSExpressionContainer: true, parseXJSEmptyExpression: true,
	parseTypeAnnotation: true, parseTypeAnnotatableIdentifier: true,
	parseYieldExpression: true
	*/

	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // Rhino, and plain browser loading.
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.esprima = {}));
	    }
	}(this, function (exports) {
	    'use strict';

	    var Token,
	        TokenName,
	        FnExprTokens,
	        Syntax,
	        PropertyKind,
	        Messages,
	        Regex,
	        SyntaxTreeDelegate,
	        XHTMLEntities,
	        ClassPropertyType,
	        source,
	        strict,
	        index,
	        lineNumber,
	        lineStart,
	        length,
	        delegate,
	        lookahead,
	        state,
	        extra;

	    Token = {
	        BooleanLiteral: 1,
	        EOF: 2,
	        Identifier: 3,
	        Keyword: 4,
	        NullLiteral: 5,
	        NumericLiteral: 6,
	        Punctuator: 7,
	        StringLiteral: 8,
	        RegularExpression: 9,
	        Template: 10,
	        XJSIdentifier: 11,
	        XJSText: 12
	    };

	    TokenName = {};
	    TokenName[Token.BooleanLiteral] = 'Boolean';
	    TokenName[Token.EOF] = '<end>';
	    TokenName[Token.Identifier] = 'Identifier';
	    TokenName[Token.Keyword] = 'Keyword';
	    TokenName[Token.NullLiteral] = 'Null';
	    TokenName[Token.NumericLiteral] = 'Numeric';
	    TokenName[Token.Punctuator] = 'Punctuator';
	    TokenName[Token.StringLiteral] = 'String';
	    TokenName[Token.XJSIdentifier] = 'XJSIdentifier';
	    TokenName[Token.XJSText] = 'XJSText';
	    TokenName[Token.RegularExpression] = 'RegularExpression';

	    // A function following one of those tokens is an expression.
	    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	                    'return', 'case', 'delete', 'throw', 'void',
	                    // assignment operators
	                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
	                    '&=', '|=', '^=', ',',
	                    // binary/unary operators
	                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	                    '<=', '<', '>', '!=', '!=='];

	    Syntax = {
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AssignmentExpression: 'AssignmentExpression',
	        BinaryExpression: 'BinaryExpression',
	        BlockStatement: 'BlockStatement',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ClassProperty: 'ClassProperty',
	        ComprehensionBlock: 'ComprehensionBlock',
	        ComprehensionExpression: 'ComprehensionExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportDeclaration: 'ExportDeclaration',
	        ExportBatchSpecifier: 'ExportBatchSpecifier',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        ForStatement: 'ForStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportSpecifier: 'ImportSpecifier',
	        LabeledStatement: 'LabeledStatement',
	        Literal: 'Literal',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        ModuleDeclaration: 'ModuleDeclaration',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        ObjectTypeAnnotation: 'ObjectTypeAnnotation',
	        OptionalParameter: 'OptionalParameter',
	        ParametricTypeAnnotation: 'ParametricTypeAnnotation',
	        ParametricallyTypedIdentifier: 'ParametricallyTypedIdentifier',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        SpreadProperty: 'SpreadProperty',
	        SwitchCase: 'SwitchCase',
	        SwitchStatement: 'SwitchStatement',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        TypeAnnotatedIdentifier: 'TypeAnnotatedIdentifier',
	        TypeAnnotation: 'TypeAnnotation',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        VoidTypeAnnotation: 'VoidTypeAnnotation',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        XJSIdentifier: 'XJSIdentifier',
	        XJSNamespacedName: 'XJSNamespacedName',
	        XJSMemberExpression: 'XJSMemberExpression',
	        XJSEmptyExpression: 'XJSEmptyExpression',
	        XJSExpressionContainer: 'XJSExpressionContainer',
	        XJSElement: 'XJSElement',
	        XJSClosingElement: 'XJSClosingElement',
	        XJSOpeningElement: 'XJSOpeningElement',
	        XJSAttribute: 'XJSAttribute',
	        XJSSpreadAttribute: 'XJSSpreadAttribute',
	        XJSText: 'XJSText',
	        YieldExpression: 'YieldExpression'
	    };

	    PropertyKind = {
	        Data: 1,
	        Get: 2,
	        Set: 4
	    };

	    ClassPropertyType = {
	        'static': 'static',
	        prototype: 'prototype'
	    };

	    // Error messages should be identical to V8.
	    Messages = {
	        UnexpectedToken:  'Unexpected token %0',
	        UnexpectedNumber:  'Unexpected number',
	        UnexpectedString:  'Unexpected string',
	        UnexpectedIdentifier:  'Unexpected identifier',
	        UnexpectedReserved:  'Unexpected reserved word',
	        UnexpectedTemplate:  'Unexpected quasi %0',
	        UnexpectedEOS:  'Unexpected end of input',
	        NewlineAfterThrow:  'Illegal newline after throw',
	        InvalidRegExp: 'Invalid regular expression',
	        UnterminatedRegExp:  'Invalid regular expression: missing /',
	        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
	        InvalidLHSInFormalsList:  'Invalid left-hand side in formals list',
	        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
	        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	        NoCatchOrFinally:  'Missing catch or finally after try',
	        UnknownLabel: 'Undefined label \'%0\'',
	        Redeclaration: '%0 \'%1\' has already been declared',
	        IllegalContinue: 'Illegal continue statement',
	        IllegalBreak: 'Illegal break statement',
	        IllegalDuplicateClassProperty: 'Illegal duplicate property in class definition',
	        IllegalReturn: 'Illegal return statement',
	        IllegalYield: 'Illegal yield expression',
	        IllegalSpread: 'Illegal spread element',
	        StrictModeWith:  'Strict mode code may not include a with statement',
	        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
	        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
	        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
	        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	        ParameterAfterRestParameter: 'Rest parameter must be final parameter of an argument list',
	        DefaultRestParameter: 'Rest parameter can not have a default value',
	        ElementAfterSpreadElement: 'Spread must be the final element of an element list',
	        PropertyAfterSpreadProperty: 'A rest property must be the final property of an object literal',
	        ObjectPatternAsRestParameter: 'Invalid rest parameter',
	        ObjectPatternAsSpread: 'Invalid spread argument',
	        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
	        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
	        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
	        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
	        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
	        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
	        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
	        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictReservedWord:  'Use of future reserved word in strict mode',
	        NewlineAfterModule:  'Illegal newline after module',
	        NoFromAfterImport: 'Missing from after import',
	        InvalidModuleSpecifier: 'Invalid module specifier',
	        NestedModule: 'Module declaration can not be nested',
	        NoUnintializedConst: 'Const must be initialized',
	        ComprehensionRequiresBlock: 'Comprehension must have at least one block',
	        ComprehensionError:  'Comprehension Error',
	        EachNotAllowed:  'Each is not supported',
	        InvalidXJSAttributeValue: 'XJS value should be either an expression or a quoted XJS text',
	        ExpectedXJSClosingTag: 'Expected corresponding XJS closing tag for %0',
	        AdjacentXJSElements: 'Adjacent XJS elements must be wrapped in an enclosing tag'
	    };

	    // See also tools/generate-unicode-regex.py.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
	        NonAsciiIdentifierPart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0\u08a2-\u08ac\u08e4-\u08fe\u0900-\u0963\u0966-\u096f\u0971-\u0977\u0979-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1d00-\u1de6\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua697\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a\uaa7b\uaa80-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]')
	    };

	    // Ensure the condition is true, otherwise throw an error.
	    // This is only to have a better contract semantic, i.e. another safety net
	    // to catch a logic error. The condition shall be fulfilled in normal case.
	    // Do NOT use this to enforce a certain condition on any user input.

	    function assert(condition, message) {
	        if (!condition) {
	            throw new Error('ASSERT: ' + message);
	        }
	    }

	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }

	    function isHexDigit(ch) {
	        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	    }

	    function isOctalDigit(ch) {
	        return '01234567'.indexOf(ch) >= 0;
	    }


	    // 7.2 White Space

	    function isWhiteSpace(ch) {
	        return (ch === 32) ||  // space
	            (ch === 9) ||      // tab
	            (ch === 0xB) ||
	            (ch === 0xC) ||
	            (ch === 0xA0) ||
	            (ch >= 0x1680 && '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(String.fromCharCode(ch)) > 0);
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return (ch === 10) || (ch === 13) || (ch === 0x2028) || (ch === 0x2029);
	    }

	    // 7.6 Identifier Names and Identifiers

	    function isIdentifierStart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }

	    function isIdentifierPart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch >= 48 && ch <= 57) ||         // 0..9
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }

	    // 7.6.1.2 Future Reserved Words

	    function isFutureReservedWord(id) {
	        switch (id) {
	        case 'class':
	        case 'enum':
	        case 'export':
	        case 'extends':
	        case 'import':
	        case 'super':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isStrictModeReservedWord(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'yield':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    // 7.6.1.1 Keywords

	    function isKeyword(id) {
	        if (strict && isStrictModeReservedWord(id)) {
	            return true;
	        }

	        // 'const' is specialized as Keyword in V8.
	        // 'yield' is only treated as a keyword in strict mode.
	        // 'let' is for compatiblity with SpiderMonkey and ES.next.
	        // Some others are from future reserved words.

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') ||
	                (id === 'try') || (id === 'let');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    // 7.4 Comments

	    function skipComment() {
	        var ch, blockComment, lineComment;

	        blockComment = false;
	        lineComment = false;

	        while (index < length) {
	            ch = source.charCodeAt(index);

	            if (lineComment) {
	                ++index;
	                if (isLineTerminator(ch)) {
	                    lineComment = false;
	                    if (ch === 13 && source.charCodeAt(index) === 10) {
	                        ++index;
	                    }
	                    ++lineNumber;
	                    lineStart = index;
	                }
	            } else if (blockComment) {
	                if (isLineTerminator(ch)) {
	                    if (ch === 13) {
	                        ++index;
	                    }
	                    if (ch !== 13 || source.charCodeAt(index) === 10) {
	                        ++lineNumber;
	                        ++index;
	                        lineStart = index;
	                        if (index >= length) {
	                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                        }
	                    }
	                } else {
	                    ch = source.charCodeAt(index++);
	                    if (index >= length) {
	                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                    }
	                    // Block comment ends with '*/' (char #42, char #47).
	                    if (ch === 42) {
	                        ch = source.charCodeAt(index);
	                        if (ch === 47) {
	                            ++index;
	                            blockComment = false;
	                        }
	                    }
	                }
	            } else if (ch === 47) {
	                ch = source.charCodeAt(index + 1);
	                // Line comment starts with '//' (char #47, char #47).
	                if (ch === 47) {
	                    index += 2;
	                    lineComment = true;
	                } else if (ch === 42) {
	                    // Block comment starts with '/*' (char #47, char #42).
	                    index += 2;
	                    blockComment = true;
	                    if (index >= length) {
	                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                    }
	                } else {
	                    break;
	                }
	            } else if (isWhiteSpace(ch)) {
	                ++index;
	            } else if (isLineTerminator(ch)) {
	                ++index;
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	            } else {
	                break;
	            }
	        }
	    }

	    function scanHexEscape(prefix) {
	        var i, len, ch, code = 0;

	        len = (prefix === 'u') ? 4 : 2;
	        for (i = 0; i < len; ++i) {
	            if (index < length && isHexDigit(source[index])) {
	                ch = source[index++];
	                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	            } else {
	                return '';
	            }
	        }
	        return String.fromCharCode(code);
	    }

	    function scanUnicodeCodePointEscape() {
	        var ch, code, cu1, cu2;

	        ch = source[index];
	        code = 0;

	        // At least, one hex digit is required.
	        if (ch === '}') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        while (index < length) {
	            ch = source[index++];
	            if (!isHexDigit(ch)) {
	                break;
	            }
	            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	        }

	        if (code > 0x10FFFF || ch !== '}') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        // UTF-16 Encoding
	        if (code <= 0xFFFF) {
	            return String.fromCharCode(code);
	        }
	        cu1 = ((code - 0x10000) >> 10) + 0xD800;
	        cu2 = ((code - 0x10000) & 1023) + 0xDC00;
	        return String.fromCharCode(cu1, cu2);
	    }

	    function getEscapedIdentifier() {
	        var ch, id;

	        ch = source.charCodeAt(index++);
	        id = String.fromCharCode(ch);

	        // '\u' (char #92, char #117) denotes an escaped character.
	        if (ch === 92) {
	            if (source.charCodeAt(index) !== 117) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            ++index;
	            ch = scanHexEscape('u');
	            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            id = ch;
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isIdentifierPart(ch)) {
	                break;
	            }
	            ++index;
	            id += String.fromCharCode(ch);

	            // '\u' (char #92, char #117) denotes an escaped character.
	            if (ch === 92) {
	                id = id.substr(0, id.length - 1);
	                if (source.charCodeAt(index) !== 117) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                ++index;
	                ch = scanHexEscape('u');
	                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                id += ch;
	            }
	        }

	        return id;
	    }

	    function getIdentifier() {
	        var start, ch;

	        start = index++;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 92) {
	                // Blackslash (char #92) marks Unicode escape sequence.
	                index = start;
	                return getEscapedIdentifier();
	            }
	            if (isIdentifierPart(ch)) {
	                ++index;
	            } else {
	                break;
	            }
	        }

	        return source.slice(start, index);
	    }

	    function scanIdentifier() {
	        var start, id, type;

	        start = index;

	        // Backslash (char #92) starts an escaped character.
	        id = (source.charCodeAt(index) === 92) ? getEscapedIdentifier() : getIdentifier();

	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = Token.Identifier;
	        } else if (isKeyword(id)) {
	            type = Token.Keyword;
	        } else if (id === 'null') {
	            type = Token.NullLiteral;
	        } else if (id === 'true' || id === 'false') {
	            type = Token.BooleanLiteral;
	        } else {
	            type = Token.Identifier;
	        }

	        return {
	            type: type,
	            value: id,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }


	    // 7.7 Punctuators

	    function scanPunctuator() {
	        var start = index,
	            code = source.charCodeAt(index),
	            code2,
	            ch1 = source[index],
	            ch2,
	            ch3,
	            ch4;

	        switch (code) {
	        // Check for most common single-character punctuators.
	        case 40:   // ( open bracket
	        case 41:   // ) close bracket
	        case 59:   // ; semicolon
	        case 44:   // , comma
	        case 123:  // { open curly brace
	        case 125:  // } close curly brace
	        case 91:   // [
	        case 93:   // ]
	        case 58:   // :
	        case 63:   // ?
	        case 126:  // ~
	            ++index;
	            if (extra.tokenize) {
	                if (code === 40) {
	                    extra.openParenToken = extra.tokens.length;
	                } else if (code === 123) {
	                    extra.openCurlyToken = extra.tokens.length;
	                }
	            }
	            return {
	                type: Token.Punctuator,
	                value: String.fromCharCode(code),
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };

	        default:
	            code2 = source.charCodeAt(index + 1);

	            // '=' (char #61) marks an assignment or comparison operator.
	            if (code2 === 61) {
	                switch (code) {
	                case 37:  // %
	                case 38:  // &
	                case 42:  // *:
	                case 43:  // +
	                case 45:  // -
	                case 47:  // /
	                case 60:  // <
	                case 62:  // >
	                case 94:  // ^
	                case 124: // |
	                    index += 2;
	                    return {
	                        type: Token.Punctuator,
	                        value: String.fromCharCode(code) + String.fromCharCode(code2),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };

	                case 33: // !
	                case 61: // =
	                    index += 2;

	                    // !== and ===
	                    if (source.charCodeAt(index) === 61) {
	                        ++index;
	                    }
	                    return {
	                        type: Token.Punctuator,
	                        value: source.slice(start, index),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };
	                default:
	                    break;
	                }
	            }
	            break;
	        }

	        // Peek more characters.

	        ch2 = source[index + 1];
	        ch3 = source[index + 2];
	        ch4 = source[index + 3];

	        // 4-character punctuator: >>>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
	            if (ch4 === '=') {
	                index += 4;
	                return {
	                    type: Token.Punctuator,
	                    value: '>>>=',
	                    lineNumber: lineNumber,
	                    lineStart: lineStart,
	                    range: [start, index]
	                };
	            }
	        }

	        // 3-character punctuators: === !== >>> <<= >>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '<' && ch2 === '<' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '<<=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '>' && ch2 === '>' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '.' && ch2 === '.' && ch3 === '.') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '...',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        // Other 2-character punctuators: ++ -- << >> && ||

	        if (ch1 === ch2 && ('+-<>&|'.indexOf(ch1) >= 0)) {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: ch1 + ch2,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '=' && ch2 === '>') {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: '=>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '.') {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    // 7.8.3 Numeric Literals

	    function scanHexLiteral(start) {
	        var number = '';

	        while (index < length) {
	            if (!isHexDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt('0x' + number, 16),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanOctalLiteral(prefix, start) {
	        var number, octal;

	        if (isOctalDigit(prefix)) {
	            octal = true;
	            number = '0' + source[index++];
	        } else {
	            octal = false;
	            ++index;
	            number = '';
	        }

	        while (index < length) {
	            if (!isOctalDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (!octal && number.length === 0) {
	            // only 0o or 0O
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 8),
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanNumericLiteral() {
	        var number, start, ch, octal;

	        ch = source[index];
	        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
	            'Numeric literal must start with a decimal digit or a decimal point');

	        start = index;
	        number = '';
	        if (ch !== '.') {
	            number = source[index++];
	            ch = source[index];

	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            // Octal number in ES6 starts with '0o'.
	            // Binary number in ES6 starts with '0b'.
	            if (number === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++index;
	                    return scanHexLiteral(start);
	                }
	                if (ch === 'b' || ch === 'B') {
	                    ++index;
	                    number = '';

	                    while (index < length) {
	                        ch = source[index];
	                        if (ch !== '0' && ch !== '1') {
	                            break;
	                        }
	                        number += source[index++];
	                    }

	                    if (number.length === 0) {
	                        // only 0b or 0B
	                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                    }

	                    if (index < length) {
	                        ch = source.charCodeAt(index);
	                        if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
	                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                        }
	                    }
	                    return {
	                        type: Token.NumericLiteral,
	                        value: parseInt(number, 2),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };
	                }
	                if (ch === 'o' || ch === 'O' || isOctalDigit(ch)) {
	                    return scanOctalLiteral(ch, start);
	                }
	                // decimal number starts with '0' such as '09' is illegal.
	                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            }

	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === '.') {
	            number += source[index++];
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === 'e' || ch === 'E') {
	            number += source[index++];

	            ch = source[index];
	            if (ch === '+' || ch === '-') {
	                number += source[index++];
	            }
	            if (isDecimalDigit(source.charCodeAt(index))) {
	                while (isDecimalDigit(source.charCodeAt(index))) {
	                    number += source[index++];
	                }
	            } else {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseFloat(number),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    // 7.8.4 String Literals

	    function scanStringLiteral() {
	        var str = '', quote, start, ch, code, unescaped, restore, octal = false;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        while (index < length) {
	            ch = source[index++];

	            if (ch === quote) {
	                quote = '';
	                break;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        str += '\n';
	                        break;
	                    case 'r':
	                        str += '\r';
	                        break;
	                    case 't':
	                        str += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        if (source[index] === '{') {
	                            ++index;
	                            str += scanUnicodeCodePointEscape();
	                        } else {
	                            restore = index;
	                            unescaped = scanHexEscape(ch);
	                            if (unescaped) {
	                                str += unescaped;
	                            } else {
	                                index = restore;
	                                str += ch;
	                            }
	                        }
	                        break;
	                    case 'b':
	                        str += '\b';
	                        break;
	                    case 'f':
	                        str += '\f';
	                        break;
	                    case 'v':
	                        str += '\x0B';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            str += String.fromCharCode(code);
	                        } else {
	                            str += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch ===  '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            } else {
	                str += ch;
	            }
	        }

	        if (quote !== '') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.StringLiteral,
	            value: str,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanTemplate() {
	        var cooked = '', ch, start, terminated, tail, restore, unescaped, code, octal;

	        terminated = false;
	        tail = false;
	        start = index;

	        ++index;

	        while (index < length) {
	            ch = source[index++];
	            if (ch === '`') {
	                tail = true;
	                terminated = true;
	                break;
	            } else if (ch === '$') {
	                if (source[index] === '{') {
	                    ++index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        cooked += '\n';
	                        break;
	                    case 'r':
	                        cooked += '\r';
	                        break;
	                    case 't':
	                        cooked += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        if (source[index] === '{') {
	                            ++index;
	                            cooked += scanUnicodeCodePointEscape();
	                        } else {
	                            restore = index;
	                            unescaped = scanHexEscape(ch);
	                            if (unescaped) {
	                                cooked += unescaped;
	                            } else {
	                                index = restore;
	                                cooked += ch;
	                            }
	                        }
	                        break;
	                    case 'b':
	                        cooked += '\b';
	                        break;
	                    case 'f':
	                        cooked += '\f';
	                        break;
	                    case 'v':
	                        cooked += '\v';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            cooked += String.fromCharCode(code);
	                        } else {
	                            cooked += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch ===  '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                ++lineNumber;
	                if (ch ===  '\r' && source[index] === '\n') {
	                    ++index;
	                }
	                lineStart = index;
	                cooked += '\n';
	            } else {
	                cooked += ch;
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.Template,
	            value: {
	                cooked: cooked,
	                raw: source.slice(start + 1, index - ((tail) ? 1 : 2))
	            },
	            tail: tail,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanTemplateElement(option) {
	        var startsWith, template;

	        lookahead = null;
	        skipComment();

	        startsWith = (option.head) ? '`' : '}';

	        if (source[index] !== startsWith) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        template = scanTemplate();

	        peek();

	        return template;
	    }

	    function scanRegExp() {
	        var str, ch, start, pattern, flags, value, classMarker = false, restore, terminated = false;

	        lookahead = null;
	        skipComment();

	        start = index;
	        ch = source[index];
	        assert(ch === '/', 'Regular expression literal must start with a slash');
	        str = source[index++];

	        while (index < length) {
	            ch = source[index++];
	            str += ch;
	            if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            } else {
	                if (ch === '\\') {
	                    ch = source[index++];
	                    // ECMA-262 7.8.5
	                    if (isLineTerminator(ch.charCodeAt(0))) {
	                        throwError({}, Messages.UnterminatedRegExp);
	                    }
	                    str += ch;
	                } else if (ch === '/') {
	                    terminated = true;
	                    break;
	                } else if (ch === '[') {
	                    classMarker = true;
	                } else if (isLineTerminator(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnterminatedRegExp);
	                }
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnterminatedRegExp);
	        }

	        // Exclude leading and trailing slash.
	        pattern = str.substr(1, str.length - 2);

	        flags = '';
	        while (index < length) {
	            ch = source[index];
	            if (!isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }

	            ++index;
	            if (ch === '\\' && index < length) {
	                ch = source[index];
	                if (ch === 'u') {
	                    ++index;
	                    restore = index;
	                    ch = scanHexEscape('u');
	                    if (ch) {
	                        flags += ch;
	                        for (str += '\\u'; restore < index; ++restore) {
	                            str += source[restore];
	                        }
	                    } else {
	                        index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                } else {
	                    str += '\\';
	                }
	            } else {
	                flags += ch;
	                str += ch;
	            }
	        }

	        try {
	            value = new RegExp(pattern, flags);
	        } catch (e) {
	            throwError({}, Messages.InvalidRegExp);
	        }

	        peek();


	        if (extra.tokenize) {
	            return {
	                type: Token.RegularExpression,
	                value: value,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }
	        return {
	            literal: str,
	            value: value,
	            range: [start, index]
	        };
	    }

	    function isIdentifierName(token) {
	        return token.type === Token.Identifier ||
	            token.type === Token.Keyword ||
	            token.type === Token.BooleanLiteral ||
	            token.type === Token.NullLiteral;
	    }

	    function advanceSlash() {
	        var prevToken,
	            checkToken;
	        // Using the following algorithm:
	        // https://github.com/mozilla/sweet.js/wiki/design
	        prevToken = extra.tokens[extra.tokens.length - 1];
	        if (!prevToken) {
	            // Nothing before that: it cannot be a division.
	            return scanRegExp();
	        }
	        if (prevToken.type === 'Punctuator') {
	            if (prevToken.value === ')') {
	                checkToken = extra.tokens[extra.openParenToken - 1];
	                if (checkToken &&
	                        checkToken.type === 'Keyword' &&
	                        (checkToken.value === 'if' ||
	                         checkToken.value === 'while' ||
	                         checkToken.value === 'for' ||
	                         checkToken.value === 'with')) {
	                    return scanRegExp();
	                }
	                return scanPunctuator();
	            }
	            if (prevToken.value === '}') {
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                if (extra.tokens[extra.openCurlyToken - 3] &&
	                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
	                    // Anonymous function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 4];
	                    if (!checkToken) {
	                        return scanPunctuator();
	                    }
	                } else if (extra.tokens[extra.openCurlyToken - 4] &&
	                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
	                    // Named function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 5];
	                    if (!checkToken) {
	                        return scanRegExp();
	                    }
	                } else {
	                    return scanPunctuator();
	                }
	                // checkToken determines whether the function is
	                // a declaration or an expression.
	                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
	                    // It is an expression.
	                    return scanPunctuator();
	                }
	                // It is a declaration.
	                return scanRegExp();
	            }
	            return scanRegExp();
	        }
	        if (prevToken.type === 'Keyword') {
	            return scanRegExp();
	        }
	        return scanPunctuator();
	    }

	    function advance() {
	        var ch;

	        if (!state.inXJSChild) {
	            skipComment();
	        }

	        if (index >= length) {
	            return {
	                type: Token.EOF,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [index, index]
	            };
	        }

	        if (state.inXJSChild) {
	            return advanceXJSChild();
	        }

	        ch = source.charCodeAt(index);

	        // Very common: ( and ) and ;
	        if (ch === 40 || ch === 41 || ch === 58) {
	            return scanPunctuator();
	        }

	        // String literal starts with single quote (#39) or double quote (#34).
	        if (ch === 39 || ch === 34) {
	            if (state.inXJSTag) {
	                return scanXJSStringLiteral();
	            }
	            return scanStringLiteral();
	        }

	        if (state.inXJSTag && isXJSIdentifierStart(ch)) {
	            return scanXJSIdentifier();
	        }

	        if (ch === 96) {
	            return scanTemplate();
	        }
	        if (isIdentifierStart(ch)) {
	            return scanIdentifier();
	        }

	        // Dot (.) char #46 can also start a floating-point number, hence the need
	        // to check the next character.
	        if (ch === 46) {
	            if (isDecimalDigit(source.charCodeAt(index + 1))) {
	                return scanNumericLiteral();
	            }
	            return scanPunctuator();
	        }

	        if (isDecimalDigit(ch)) {
	            return scanNumericLiteral();
	        }

	        // Slash (/) char #47 can also start a regex.
	        if (extra.tokenize && ch === 47) {
	            return advanceSlash();
	        }

	        return scanPunctuator();
	    }

	    function lex() {
	        var token;

	        token = lookahead;
	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        lookahead = advance();

	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        return token;
	    }

	    function peek() {
	        var pos, line, start;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        lookahead = advance();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;
	    }

	    function lookahead2() {
	        var adv, pos, line, start, result;

	        // If we are collecting the tokens, don't grab the next one yet.
	        adv = (typeof extra.advance === 'function') ? extra.advance : advance;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;

	        // Scan for the next immediate token.
	        if (lookahead === null) {
	            lookahead = adv();
	        }
	        index = lookahead.range[1];
	        lineNumber = lookahead.lineNumber;
	        lineStart = lookahead.lineStart;

	        // Grab the token right after.
	        result = adv();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return result;
	    }

	    function markerCreate() {
	        if (!extra.loc && !extra.range) {
	            return undefined;
	        }
	        skipComment();
	        return {offset: index, line: lineNumber, col: index - lineStart};
	    }

	    function markerCreatePreserveWhitespace() {
	        if (!extra.loc && !extra.range) {
	            return undefined;
	        }
	        return {offset: index, line: lineNumber, col: index - lineStart};
	    }

	    function processComment(node) {
	        var lastChild,
	            trailingComments,
	            bottomRight = extra.bottomRightStack,
	            last = bottomRight[bottomRight.length - 1];

	        if (node.type === Syntax.Program) {
	            if (node.body.length > 0) {
	                return;
	            }
	        }

	        if (extra.trailingComments.length > 0) {
	            if (extra.trailingComments[0].range[0] >= node.range[1]) {
	                trailingComments = extra.trailingComments;
	                extra.trailingComments = [];
	            } else {
	                extra.trailingComments.length = 0;
	            }
	        } else {
	            if (last && last.trailingComments && last.trailingComments[0].range[0] >= node.range[1]) {
	                trailingComments = last.trailingComments;
	                delete last.trailingComments;
	            }
	        }

	        // Eating the stack.
	        if (last) {
	            while (last && last.range[0] >= node.range[0]) {
	                lastChild = last;
	                last = bottomRight.pop();
	            }
	        }

	        if (lastChild) {
	            if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
	                node.leadingComments = lastChild.leadingComments;
	                delete lastChild.leadingComments;
	            }
	        } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
	            node.leadingComments = extra.leadingComments;
	            extra.leadingComments = [];
	        }

	        if (trailingComments) {
	            node.trailingComments = trailingComments;
	        }

	        bottomRight.push(node);
	    }

	    function markerApply(marker, node) {
	        if (extra.range) {
	            node.range = [marker.offset, index];
	        }
	        if (extra.loc) {
	            node.loc = {
	                start: {
	                    line: marker.line,
	                    column: marker.col
	                },
	                end: {
	                    line: lineNumber,
	                    column: index - lineStart
	                }
	            };
	            node = delegate.postProcess(node);
	        }
	        if (extra.attachComment) {
	            processComment(node);
	        }
	        return node;
	    }

	    SyntaxTreeDelegate = {

	        name: 'SyntaxTree',

	        postProcess: function (node) {
	            return node;
	        },

	        createArrayExpression: function (elements) {
	            return {
	                type: Syntax.ArrayExpression,
	                elements: elements
	            };
	        },

	        createAssignmentExpression: function (operator, left, right) {
	            return {
	                type: Syntax.AssignmentExpression,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBinaryExpression: function (operator, left, right) {
	            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
	                        Syntax.BinaryExpression;
	            return {
	                type: type,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBlockStatement: function (body) {
	            return {
	                type: Syntax.BlockStatement,
	                body: body
	            };
	        },

	        createBreakStatement: function (label) {
	            return {
	                type: Syntax.BreakStatement,
	                label: label
	            };
	        },

	        createCallExpression: function (callee, args) {
	            return {
	                type: Syntax.CallExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createCatchClause: function (param, body) {
	            return {
	                type: Syntax.CatchClause,
	                param: param,
	                body: body
	            };
	        },

	        createConditionalExpression: function (test, consequent, alternate) {
	            return {
	                type: Syntax.ConditionalExpression,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createContinueStatement: function (label) {
	            return {
	                type: Syntax.ContinueStatement,
	                label: label
	            };
	        },

	        createDebuggerStatement: function () {
	            return {
	                type: Syntax.DebuggerStatement
	            };
	        },

	        createDoWhileStatement: function (body, test) {
	            return {
	                type: Syntax.DoWhileStatement,
	                body: body,
	                test: test
	            };
	        },

	        createEmptyStatement: function () {
	            return {
	                type: Syntax.EmptyStatement
	            };
	        },

	        createExpressionStatement: function (expression) {
	            return {
	                type: Syntax.ExpressionStatement,
	                expression: expression
	            };
	        },

	        createForStatement: function (init, test, update, body) {
	            return {
	                type: Syntax.ForStatement,
	                init: init,
	                test: test,
	                update: update,
	                body: body
	            };
	        },

	        createForInStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForInStatement,
	                left: left,
	                right: right,
	                body: body,
	                each: false
	            };
	        },

	        createForOfStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForOfStatement,
	                left: left,
	                right: right,
	                body: body
	            };
	        },

	        createFunctionDeclaration: function (id, params, defaults, body, rest, generator, expression,
	                                             returnType, parametricType) {
	            return {
	                type: Syntax.FunctionDeclaration,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: generator,
	                expression: expression,
	                returnType: returnType,
	                parametricType: parametricType
	            };
	        },

	        createFunctionExpression: function (id, params, defaults, body, rest, generator, expression,
	                                            returnType, parametricType) {
	            return {
	                type: Syntax.FunctionExpression,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: generator,
	                expression: expression,
	                returnType: returnType,
	                parametricType: parametricType
	            };
	        },

	        createIdentifier: function (name) {
	            return {
	                type: Syntax.Identifier,
	                name: name,
	                // Only here to initialize the shape of the object to ensure
	                // that the 'typeAnnotation' key is ordered before others that
	                // are added later (like 'loc' and 'range'). This just helps
	                // keep the shape of Identifier nodes consistent with everything
	                // else.
	                typeAnnotation: undefined
	            };
	        },

	        createTypeAnnotation: function (typeIdentifier, parametricType, params, returnType, nullable) {
	            return {
	                type: Syntax.TypeAnnotation,
	                id: typeIdentifier,
	                parametricType: parametricType,
	                params: params,
	                returnType: returnType,
	                nullable: nullable
	            };
	        },

	        createParametricTypeAnnotation: function (parametricTypes) {
	            return {
	                type: Syntax.ParametricTypeAnnotation,
	                params: parametricTypes
	            };
	        },

	        createVoidTypeAnnotation: function () {
	            return {
	                type: Syntax.VoidTypeAnnotation
	            };
	        },

	        createObjectTypeAnnotation: function (properties, nullable) {
	            return {
	                type: Syntax.ObjectTypeAnnotation,
	                properties: properties,
	                nullable: nullable
	            };
	        },

	        createTypeAnnotatedIdentifier: function (identifier, annotation, isOptionalParam) {
	            return {
	                type: Syntax.TypeAnnotatedIdentifier,
	                id: identifier,
	                annotation: annotation
	            };
	        },

	        createOptionalParameter: function (identifier) {
	            return {
	                type: Syntax.OptionalParameter,
	                id: identifier
	            };
	        },

	        createXJSAttribute: function (name, value) {
	            return {
	                type: Syntax.XJSAttribute,
	                name: name,
	                value: value || null
	            };
	        },

	        createXJSSpreadAttribute: function (argument) {
	            return {
	                type: Syntax.XJSSpreadAttribute,
	                argument: argument
	            };
	        },

	        createXJSIdentifier: function (name) {
	            return {
	                type: Syntax.XJSIdentifier,
	                name: name
	            };
	        },

	        createXJSNamespacedName: function (namespace, name) {
	            return {
	                type: Syntax.XJSNamespacedName,
	                namespace: namespace,
	                name: name
	            };
	        },

	        createXJSMemberExpression: function (object, property) {
	            return {
	                type: Syntax.XJSMemberExpression,
	                object: object,
	                property: property
	            };
	        },

	        createXJSElement: function (openingElement, closingElement, children) {
	            return {
	                type: Syntax.XJSElement,
	                openingElement: openingElement,
	                closingElement: closingElement,
	                children: children
	            };
	        },

	        createXJSEmptyExpression: function () {
	            return {
	                type: Syntax.XJSEmptyExpression
	            };
	        },

	        createXJSExpressionContainer: function (expression) {
	            return {
	                type: Syntax.XJSExpressionContainer,
	                expression: expression
	            };
	        },

	        createXJSOpeningElement: function (name, attributes, selfClosing) {
	            return {
	                type: Syntax.XJSOpeningElement,
	                name: name,
	                selfClosing: selfClosing,
	                attributes: attributes
	            };
	        },

	        createXJSClosingElement: function (name) {
	            return {
	                type: Syntax.XJSClosingElement,
	                name: name
	            };
	        },

	        createIfStatement: function (test, consequent, alternate) {
	            return {
	                type: Syntax.IfStatement,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createLabeledStatement: function (label, body) {
	            return {
	                type: Syntax.LabeledStatement,
	                label: label,
	                body: body
	            };
	        },

	        createLiteral: function (token) {
	            return {
	                type: Syntax.Literal,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	        },

	        createMemberExpression: function (accessor, object, property) {
	            return {
	                type: Syntax.MemberExpression,
	                computed: accessor === '[',
	                object: object,
	                property: property
	            };
	        },

	        createNewExpression: function (callee, args) {
	            return {
	                type: Syntax.NewExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createObjectExpression: function (properties) {
	            return {
	                type: Syntax.ObjectExpression,
	                properties: properties
	            };
	        },

	        createPostfixExpression: function (operator, argument) {
	            return {
	                type: Syntax.UpdateExpression,
	                operator: operator,
	                argument: argument,
	                prefix: false
	            };
	        },

	        createProgram: function (body) {
	            return {
	                type: Syntax.Program,
	                body: body
	            };
	        },

	        createProperty: function (kind, key, value, method, shorthand, computed) {
	            return {
	                type: Syntax.Property,
	                key: key,
	                value: value,
	                kind: kind,
	                method: method,
	                shorthand: shorthand,
	                computed: computed
	            };
	        },

	        createReturnStatement: function (argument) {
	            return {
	                type: Syntax.ReturnStatement,
	                argument: argument
	            };
	        },

	        createSequenceExpression: function (expressions) {
	            return {
	                type: Syntax.SequenceExpression,
	                expressions: expressions
	            };
	        },

	        createSwitchCase: function (test, consequent) {
	            return {
	                type: Syntax.SwitchCase,
	                test: test,
	                consequent: consequent
	            };
	        },

	        createSwitchStatement: function (discriminant, cases) {
	            return {
	                type: Syntax.SwitchStatement,
	                discriminant: discriminant,
	                cases: cases
	            };
	        },

	        createThisExpression: function () {
	            return {
	                type: Syntax.ThisExpression
	            };
	        },

	        createThrowStatement: function (argument) {
	            return {
	                type: Syntax.ThrowStatement,
	                argument: argument
	            };
	        },

	        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
	            return {
	                type: Syntax.TryStatement,
	                block: block,
	                guardedHandlers: guardedHandlers,
	                handlers: handlers,
	                finalizer: finalizer
	            };
	        },

	        createUnaryExpression: function (operator, argument) {
	            if (operator === '++' || operator === '--') {
	                return {
	                    type: Syntax.UpdateExpression,
	                    operator: operator,
	                    argument: argument,
	                    prefix: true
	                };
	            }
	            return {
	                type: Syntax.UnaryExpression,
	                operator: operator,
	                argument: argument,
	                prefix: true
	            };
	        },

	        createVariableDeclaration: function (declarations, kind) {
	            return {
	                type: Syntax.VariableDeclaration,
	                declarations: declarations,
	                kind: kind
	            };
	        },

	        createVariableDeclarator: function (id, init) {
	            return {
	                type: Syntax.VariableDeclarator,
	                id: id,
	                init: init
	            };
	        },

	        createWhileStatement: function (test, body) {
	            return {
	                type: Syntax.WhileStatement,
	                test: test,
	                body: body
	            };
	        },

	        createWithStatement: function (object, body) {
	            return {
	                type: Syntax.WithStatement,
	                object: object,
	                body: body
	            };
	        },

	        createTemplateElement: function (value, tail) {
	            return {
	                type: Syntax.TemplateElement,
	                value: value,
	                tail: tail
	            };
	        },

	        createTemplateLiteral: function (quasis, expressions) {
	            return {
	                type: Syntax.TemplateLiteral,
	                quasis: quasis,
	                expressions: expressions
	            };
	        },

	        createSpreadElement: function (argument) {
	            return {
	                type: Syntax.SpreadElement,
	                argument: argument
	            };
	        },

	        createSpreadProperty: function (argument) {
	            return {
	                type: Syntax.SpreadProperty,
	                argument: argument
	            };
	        },

	        createTaggedTemplateExpression: function (tag, quasi) {
	            return {
	                type: Syntax.TaggedTemplateExpression,
	                tag: tag,
	                quasi: quasi
	            };
	        },

	        createArrowFunctionExpression: function (params, defaults, body, rest, expression) {
	            return {
	                type: Syntax.ArrowFunctionExpression,
	                id: null,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: false,
	                expression: expression
	            };
	        },

	        createMethodDefinition: function (propertyType, kind, key, value) {
	            return {
	                type: Syntax.MethodDefinition,
	                key: key,
	                value: value,
	                kind: kind,
	                'static': propertyType === ClassPropertyType.static
	            };
	        },

	        createClassProperty: function (propertyIdentifier) {
	            return {
	                type: Syntax.ClassProperty,
	                id: propertyIdentifier
	            };
	        },

	        createClassBody: function (body) {
	            return {
	                type: Syntax.ClassBody,
	                body: body
	            };
	        },

	        createClassExpression: function (id, superClass, body, parametricType) {
	            return {
	                type: Syntax.ClassExpression,
	                id: id,
	                superClass: superClass,
	                body: body,
	                parametricType: parametricType
	            };
	        },

	        createClassDeclaration: function (id, superClass, body, parametricType, superParametricType) {
	            return {
	                type: Syntax.ClassDeclaration,
	                id: id,
	                superClass: superClass,
	                body: body,
	                parametricType: parametricType,
	                superParametricType: superParametricType
	            };
	        },

	        createExportSpecifier: function (id, name) {
	            return {
	                type: Syntax.ExportSpecifier,
	                id: id,
	                name: name
	            };
	        },

	        createExportBatchSpecifier: function () {
	            return {
	                type: Syntax.ExportBatchSpecifier
	            };
	        },

	        createExportDeclaration: function (declaration, specifiers, source) {
	            return {
	                type: Syntax.ExportDeclaration,
	                declaration: declaration,
	                specifiers: specifiers,
	                source: source
	            };
	        },

	        createImportSpecifier: function (id, name) {
	            return {
	                type: Syntax.ImportSpecifier,
	                id: id,
	                name: name
	            };
	        },

	        createImportDeclaration: function (specifiers, kind, source) {
	            return {
	                type: Syntax.ImportDeclaration,
	                specifiers: specifiers,
	                kind: kind,
	                source: source
	            };
	        },

	        createYieldExpression: function (argument, delegate) {
	            return {
	                type: Syntax.YieldExpression,
	                argument: argument,
	                delegate: delegate
	            };
	        },

	        createModuleDeclaration: function (id, source, body) {
	            return {
	                type: Syntax.ModuleDeclaration,
	                id: id,
	                source: source,
	                body: body
	            };
	        },

	        createComprehensionExpression: function (filter, blocks, body) {
	            return {
	                type: Syntax.ComprehensionExpression,
	                filter: filter,
	                blocks: blocks,
	                body: body
	            };
	        }

	    };

	    // Return true if there is a line terminator before the next token.

	    function peekLineTerminator() {
	        var pos, line, start, found;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        skipComment();
	        found = lineNumber !== line;
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return found;
	    }

	    // Throw an exception

	    function throwError(token, messageFormat) {
	        var error,
	            args = Array.prototype.slice.call(arguments, 2),
	            msg = messageFormat.replace(
	                /%(\d)/g,
	                function (whole, index) {
	                    assert(index < args.length, 'Message reference must be in range');
	                    return args[index];
	                }
	            );

	        if (typeof token.lineNumber === 'number') {
	            error = new Error('Line ' + token.lineNumber + ': ' + msg);
	            error.index = token.range[0];
	            error.lineNumber = token.lineNumber;
	            error.column = token.range[0] - lineStart + 1;
	        } else {
	            error = new Error('Line ' + lineNumber + ': ' + msg);
	            error.index = index;
	            error.lineNumber = lineNumber;
	            error.column = index - lineStart + 1;
	        }

	        error.description = msg;
	        throw error;
	    }

	    function throwErrorTolerant() {
	        try {
	            throwError.apply(null, arguments);
	        } catch (e) {
	            if (extra.errors) {
	                extra.errors.push(e);
	            } else {
	                throw e;
	            }
	        }
	    }


	    // Throw an exception because of the token.

	    function throwUnexpected(token) {
	        if (token.type === Token.EOF) {
	            throwError(token, Messages.UnexpectedEOS);
	        }

	        if (token.type === Token.NumericLiteral) {
	            throwError(token, Messages.UnexpectedNumber);
	        }

	        if (token.type === Token.StringLiteral || token.type === Token.XJSText) {
	            throwError(token, Messages.UnexpectedString);
	        }

	        if (token.type === Token.Identifier) {
	            throwError(token, Messages.UnexpectedIdentifier);
	        }

	        if (token.type === Token.Keyword) {
	            if (isFutureReservedWord(token.value)) {
	                throwError(token, Messages.UnexpectedReserved);
	            } else if (strict && isStrictModeReservedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictReservedWord);
	                return;
	            }
	            throwError(token, Messages.UnexpectedToken, token.value);
	        }

	        if (token.type === Token.Template) {
	            throwError(token, Messages.UnexpectedTemplate, token.value.raw);
	        }

	        // BooleanLiteral, NullLiteral, or Punctuator.
	        throwError(token, Messages.UnexpectedToken, token.value);
	    }

	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.

	    function expect(value) {
	        var token = lex();
	        if (token.type !== Token.Punctuator || token.value !== value) {
	            throwUnexpected(token);
	        }
	    }

	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.

	    function expectKeyword(keyword) {
	        var token = lex();
	        if (token.type !== Token.Keyword || token.value !== keyword) {
	            throwUnexpected(token);
	        }
	    }

	    // Return true if the next token matches the specified punctuator.

	    function match(value) {
	        return lookahead.type === Token.Punctuator && lookahead.value === value;
	    }

	    // Return true if the next token matches the specified keyword

	    function matchKeyword(keyword) {
	        return lookahead.type === Token.Keyword && lookahead.value === keyword;
	    }


	    // Return true if the next token matches the specified contextual keyword

	    function matchContextualKeyword(keyword) {
	        return lookahead.type === Token.Identifier && lookahead.value === keyword;
	    }

	    // Return true if the next token is an assignment operator

	    function matchAssign() {
	        var op;

	        if (lookahead.type !== Token.Punctuator) {
	            return false;
	        }
	        op = lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    }

	    function consumeSemicolon() {
	        var line, oldIndex = index, oldLineNumber = lineNumber,
	            oldLineStart = lineStart, oldLookahead = lookahead;

	        // Catch the very common case first: immediately a semicolon (char #59).
	        if (source.charCodeAt(index) === 59) {
	            lex();
	            return;
	        }

	        line = lineNumber;
	        skipComment();
	        if (lineNumber !== line) {
	            index = oldIndex;
	            lineNumber = oldLineNumber;
	            lineStart = oldLineStart;
	            lookahead = oldLookahead;
	            return;
	        }

	        if (match(';')) {
	            lex();
	            return;
	        }

	        if (lookahead.type !== Token.EOF && !match('}')) {
	            throwUnexpected(lookahead);
	        }
	    }

	    // Return true if provided expression is LeftHandSideExpression

	    function isLeftHandSide(expr) {
	        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
	    }

	    function isAssignableLeftHandSide(expr) {
	        return isLeftHandSide(expr) || expr.type === Syntax.ObjectPattern || expr.type === Syntax.ArrayPattern;
	    }

	    // 11.1.4 Array Initialiser

	    function parseArrayInitialiser() {
	        var elements = [], blocks = [], filter = null, tmp, possiblecomprehension = true, body,
	            marker = markerCreate();

	        expect('[');
	        while (!match(']')) {
	            if (lookahead.value === 'for' &&
	                    lookahead.type === Token.Keyword) {
	                if (!possiblecomprehension) {
	                    throwError({}, Messages.ComprehensionError);
	                }
	                matchKeyword('for');
	                tmp = parseForStatement({ignoreBody: true});
	                tmp.of = tmp.type === Syntax.ForOfStatement;
	                tmp.type = Syntax.ComprehensionBlock;
	                if (tmp.left.kind) { // can't be let or const
	                    throwError({}, Messages.ComprehensionError);
	                }
	                blocks.push(tmp);
	            } else if (lookahead.value === 'if' &&
	                           lookahead.type === Token.Keyword) {
	                if (!possiblecomprehension) {
	                    throwError({}, Messages.ComprehensionError);
	                }
	                expectKeyword('if');
	                expect('(');
	                filter = parseExpression();
	                expect(')');
	            } else if (lookahead.value === ',' &&
	                           lookahead.type === Token.Punctuator) {
	                possiblecomprehension = false; // no longer allowed.
	                lex();
	                elements.push(null);
	            } else {
	                tmp = parseSpreadOrAssignmentExpression();
	                elements.push(tmp);
	                if (tmp && tmp.type === Syntax.SpreadElement) {
	                    if (!match(']')) {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                } else if (!(match(']') || matchKeyword('for') || matchKeyword('if'))) {
	                    expect(','); // this lexes.
	                    possiblecomprehension = false;
	                }
	            }
	        }

	        expect(']');

	        if (filter && !blocks.length) {
	            throwError({}, Messages.ComprehensionRequiresBlock);
	        }

	        if (blocks.length) {
	            if (elements.length !== 1) {
	                throwError({}, Messages.ComprehensionError);
	            }
	            return markerApply(marker, delegate.createComprehensionExpression(filter, blocks, elements[0]));
	        }
	        return markerApply(marker, delegate.createArrayExpression(elements));
	    }

	    // 11.1.5 Object Initialiser

	    function parsePropertyFunction(options) {
	        var previousStrict, previousYieldAllowed, params, defaults, body,
	            marker = markerCreate();

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = options.generator;
	        params = options.params || [];
	        defaults = options.defaults || [];

	        body = parseConciseBody();
	        if (options.name && strict && isRestrictedWord(params[0].name)) {
	            throwErrorTolerant(options.name, Messages.StrictParamName);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;

	        return markerApply(marker, delegate.createFunctionExpression(
	            null,
	            params,
	            defaults,
	            body,
	            options.rest || null,
	            options.generator,
	            body.type !== Syntax.BlockStatement,
	            options.returnType,
	            options.parametricType
	        ));
	    }


	    function parsePropertyMethodFunction(options) {
	        var previousStrict, tmp, method;

	        previousStrict = strict;
	        strict = true;

	        tmp = parseParams();

	        if (tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, tmp.message);
	        }


	        method = parsePropertyFunction({
	            params: tmp.params,
	            defaults: tmp.defaults,
	            rest: tmp.rest,
	            generator: options.generator,
	            returnType: tmp.returnType,
	            parametricType: options.parametricType
	        });

	        strict = previousStrict;

	        return method;
	    }


	    function parseObjectPropertyKey() {
	        var marker = markerCreate(),
	            token = lex(),
	            propertyKey,
	            result;

	        // Note: This function is called only from parseObjectProperty(), where
	        // EOF and Punctuator tokens are already filtered out.

	        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
	            if (strict && token.octal) {
	                throwErrorTolerant(token, Messages.StrictOctalLiteral);
	            }
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (token.type === Token.Punctuator && token.value === '[') {
	            // For computed properties we should skip the [ and ], and
	            // capture in marker only the assignment expression itself.
	            marker = markerCreate();
	            propertyKey = parseAssignmentExpression();
	            result = markerApply(marker, propertyKey);
	            expect(']');
	            return result;
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseObjectProperty() {
	        var token, key, id, value, param, expr, computed,
	            marker = markerCreate();

	        token = lookahead;
	        computed = (token.value === '[');

	        if (token.type === Token.Identifier || computed) {

	            id = parseObjectPropertyKey();

	            // Property Assignment: Getter and Setter.

	            if (token.value === 'get' && !(match(':') || match('('))) {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();
	                expect('(');
	                expect(')');
	                return markerApply(marker, delegate.createProperty('get', key, parsePropertyFunction({ generator: false }), false, false, computed));
	            }
	            if (token.value === 'set' && !(match(':') || match('('))) {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();
	                expect('(');
	                token = lookahead;
	                param = [ parseTypeAnnotatableIdentifier() ];
	                expect(')');
	                return markerApply(marker, delegate.createProperty('set', key, parsePropertyFunction({ params: param, generator: false, name: token }), false, false, computed));
	            }
	            if (match(':')) {
	                lex();
	                return markerApply(marker, delegate.createProperty('init', id, parseAssignmentExpression(), false, false, computed));
	            }
	            if (match('(')) {
	                return markerApply(marker, delegate.createProperty('init', id, parsePropertyMethodFunction({ generator: false }), true, false, computed));
	            }
	            if (computed) {
	                // Computed properties can only be used with full notation.
	                throwUnexpected(lookahead);
	            }
	            return markerApply(marker, delegate.createProperty('init', id, id, false, true, false));
	        }
	        if (token.type === Token.EOF || token.type === Token.Punctuator) {
	            if (!match('*')) {
	                throwUnexpected(token);
	            }
	            lex();

	            computed = (lookahead.type === Token.Punctuator && lookahead.value === '[');

	            id = parseObjectPropertyKey();

	            if (!match('(')) {
	                throwUnexpected(lex());
	            }

	            return markerApply(marker, delegate.createProperty('init', id, parsePropertyMethodFunction({ generator: true }), true, false, computed));
	        }
	        key = parseObjectPropertyKey();
	        if (match(':')) {
	            lex();
	            return markerApply(marker, delegate.createProperty('init', key, parseAssignmentExpression(), false, false, false));
	        }
	        if (match('(')) {
	            return markerApply(marker, delegate.createProperty('init', key, parsePropertyMethodFunction({ generator: false }), true, false, false));
	        }
	        throwUnexpected(lex());
	    }

	    function parseObjectSpreadProperty() {
	        var marker = markerCreate();
	        expect('...');
	        return markerApply(marker, delegate.createSpreadProperty(parseAssignmentExpression()));
	    }

	    function parseObjectInitialiser() {
	        var properties = [], property, name, key, kind, map = {}, toString = String,
	            marker = markerCreate();

	        expect('{');

	        while (!match('}')) {
	            if (match('...')) {
	                property = parseObjectSpreadProperty();
	            } else {
	                property = parseObjectProperty();

	                if (property.key.type === Syntax.Identifier) {
	                    name = property.key.name;
	                } else {
	                    name = toString(property.key.value);
	                }
	                kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;

	                key = '$' + name;
	                if (Object.prototype.hasOwnProperty.call(map, key)) {
	                    if (map[key] === PropertyKind.Data) {
	                        if (strict && kind === PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.StrictDuplicateProperty);
	                        } else if (kind !== PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.AccessorDataProperty);
	                        }
	                    } else {
	                        if (kind === PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.AccessorDataProperty);
	                        } else if (map[key] & kind) {
	                            throwErrorTolerant({}, Messages.AccessorGetSet);
	                        }
	                    }
	                    map[key] |= kind;
	                } else {
	                    map[key] = kind;
	                }
	            }

	            properties.push(property);

	            if (!match('}')) {
	                expect(',');
	            }
	        }

	        expect('}');

	        return markerApply(marker, delegate.createObjectExpression(properties));
	    }

	    function parseTemplateElement(option) {
	        var marker = markerCreate(),
	            token = scanTemplateElement(option);
	        if (strict && token.octal) {
	            throwError(token, Messages.StrictOctalLiteral);
	        }
	        return markerApply(marker, delegate.createTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail));
	    }

	    function parseTemplateLiteral() {
	        var quasi, quasis, expressions, marker = markerCreate();

	        quasi = parseTemplateElement({ head: true });
	        quasis = [ quasi ];
	        expressions = [];

	        while (!quasi.tail) {
	            expressions.push(parseExpression());
	            quasi = parseTemplateElement({ head: false });
	            quasis.push(quasi);
	        }

	        return markerApply(marker, delegate.createTemplateLiteral(quasis, expressions));
	    }

	    // 11.1.6 The Grouping Operator

	    function parseGroupExpression() {
	        var expr;

	        expect('(');

	        ++state.parenthesizedCount;

	        expr = parseExpression();

	        expect(')');

	        return expr;
	    }


	    // 11.1 Primary Expressions

	    function parsePrimaryExpression() {
	        var marker, type, token, expr;

	        type = lookahead.type;

	        if (type === Token.Identifier) {
	            marker = markerCreate();
	            return markerApply(marker, delegate.createIdentifier(lex().value));
	        }

	        if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            marker = markerCreate();
	            return markerApply(marker, delegate.createLiteral(lex()));
	        }

	        if (type === Token.Keyword) {
	            if (matchKeyword('this')) {
	                marker = markerCreate();
	                lex();
	                return markerApply(marker, delegate.createThisExpression());
	            }

	            if (matchKeyword('function')) {
	                return parseFunctionExpression();
	            }

	            if (matchKeyword('class')) {
	                return parseClassExpression();
	            }

	            if (matchKeyword('super')) {
	                marker = markerCreate();
	                lex();
	                return markerApply(marker, delegate.createIdentifier('super'));
	            }
	        }

	        if (type === Token.BooleanLiteral) {
	            marker = markerCreate();
	            token = lex();
	            token.value = (token.value === 'true');
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (type === Token.NullLiteral) {
	            marker = markerCreate();
	            token = lex();
	            token.value = null;
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (match('[')) {
	            return parseArrayInitialiser();
	        }

	        if (match('{')) {
	            return parseObjectInitialiser();
	        }

	        if (match('(')) {
	            return parseGroupExpression();
	        }

	        if (match('/') || match('/=')) {
	            marker = markerCreate();
	            return markerApply(marker, delegate.createLiteral(scanRegExp()));
	        }

	        if (type === Token.Template) {
	            return parseTemplateLiteral();
	        }

	        if (match('<')) {
	            return parseXJSElement();
	        }

	        throwUnexpected(lex());
	    }

	    // 11.2 Left-Hand-Side Expressions

	    function parseArguments() {
	        var args = [], arg;

	        expect('(');

	        if (!match(')')) {
	            while (index < length) {
	                arg = parseSpreadOrAssignmentExpression();
	                args.push(arg);

	                if (match(')')) {
	                    break;
	                } else if (arg.type === Syntax.SpreadElement) {
	                    throwError({}, Messages.ElementAfterSpreadElement);
	                }

	                expect(',');
	            }
	        }

	        expect(')');

	        return args;
	    }

	    function parseSpreadOrAssignmentExpression() {
	        if (match('...')) {
	            var marker = markerCreate();
	            lex();
	            return markerApply(marker, delegate.createSpreadElement(parseAssignmentExpression()));
	        }
	        return parseAssignmentExpression();
	    }

	    function parseNonComputedProperty() {
	        var marker = markerCreate(),
	            token = lex();

	        if (!isIdentifierName(token)) {
	            throwUnexpected(token);
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseNonComputedMember() {
	        expect('.');

	        return parseNonComputedProperty();
	    }

	    function parseComputedMember() {
	        var expr;

	        expect('[');

	        expr = parseExpression();

	        expect(']');

	        return expr;
	    }

	    function parseNewExpression() {
	        var callee, args, marker = markerCreate();

	        expectKeyword('new');
	        callee = parseLeftHandSideExpression();
	        args = match('(') ? parseArguments() : [];

	        return markerApply(marker, delegate.createNewExpression(callee, args));
	    }

	    function parseLeftHandSideExpressionAllowCall() {
	        var expr, args, marker = markerCreate();

	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

	        while (match('.') || match('[') || match('(') || lookahead.type === Token.Template) {
	            if (match('(')) {
	                args = parseArguments();
	                expr = markerApply(marker, delegate.createCallExpression(expr, args));
	            } else if (match('[')) {
	                expr = markerApply(marker, delegate.createMemberExpression('[', expr, parseComputedMember()));
	            } else if (match('.')) {
	                expr = markerApply(marker, delegate.createMemberExpression('.', expr, parseNonComputedMember()));
	            } else {
	                expr = markerApply(marker, delegate.createTaggedTemplateExpression(expr, parseTemplateLiteral()));
	            }
	        }

	        return expr;
	    }

	    function parseLeftHandSideExpression() {
	        var expr, marker = markerCreate();

	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

	        while (match('.') || match('[') || lookahead.type === Token.Template) {
	            if (match('[')) {
	                expr = markerApply(marker, delegate.createMemberExpression('[', expr, parseComputedMember()));
	            } else if (match('.')) {
	                expr = markerApply(marker, delegate.createMemberExpression('.', expr, parseNonComputedMember()));
	            } else {
	                expr = markerApply(marker, delegate.createTaggedTemplateExpression(expr, parseTemplateLiteral()));
	            }
	        }

	        return expr;
	    }

	    // 11.3 Postfix Expressions

	    function parsePostfixExpression() {
	        var marker = markerCreate(),
	            expr = parseLeftHandSideExpressionAllowCall(),
	            token;

	        if (lookahead.type !== Token.Punctuator) {
	            return expr;
	        }

	        if ((match('++') || match('--')) && !peekLineTerminator()) {
	            // 11.3.1, 11.3.2
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPostfix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            token = lex();
	            expr = markerApply(marker, delegate.createPostfixExpression(token.value, expr));
	        }

	        return expr;
	    }

	    // 11.4 Unary Operators

	    function parseUnaryExpression() {
	        var marker, token, expr;

	        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	            return parsePostfixExpression();
	        }

	        if (match('++') || match('--')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            // 11.4.4, 11.4.5
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPrefix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            return markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	        }

	        if (match('+') || match('-') || match('~') || match('!')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            return markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	        }

	        if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
	                throwErrorTolerant({}, Messages.StrictDelete);
	            }
	            return expr;
	        }

	        return parsePostfixExpression();
	    }

	    function binaryPrecedence(token, allowIn) {
	        var prec = 0;

	        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	            return 0;
	        }

	        switch (token.value) {
	        case '||':
	            prec = 1;
	            break;

	        case '&&':
	            prec = 2;
	            break;

	        case '|':
	            prec = 3;
	            break;

	        case '^':
	            prec = 4;
	            break;

	        case '&':
	            prec = 5;
	            break;

	        case '==':
	        case '!=':
	        case '===':
	        case '!==':
	            prec = 6;
	            break;

	        case '<':
	        case '>':
	        case '<=':
	        case '>=':
	        case 'instanceof':
	            prec = 7;
	            break;

	        case 'in':
	            prec = allowIn ? 7 : 0;
	            break;

	        case '<<':
	        case '>>':
	        case '>>>':
	            prec = 8;
	            break;

	        case '+':
	        case '-':
	            prec = 9;
	            break;

	        case '*':
	        case '/':
	        case '%':
	            prec = 11;
	            break;

	        default:
	            break;
	        }

	        return prec;
	    }

	    // 11.5 Multiplicative Operators
	    // 11.6 Additive Operators
	    // 11.7 Bitwise Shift Operators
	    // 11.8 Relational Operators
	    // 11.9 Equality Operators
	    // 11.10 Binary Bitwise Operators
	    // 11.11 Binary Logical Operators

	    function parseBinaryExpression() {
	        var expr, token, prec, previousAllowIn, stack, right, operator, left, i,
	            marker, markers;

	        previousAllowIn = state.allowIn;
	        state.allowIn = true;

	        marker = markerCreate();
	        left = parseUnaryExpression();

	        token = lookahead;
	        prec = binaryPrecedence(token, previousAllowIn);
	        if (prec === 0) {
	            return left;
	        }
	        token.prec = prec;
	        lex();

	        markers = [marker, markerCreate()];
	        right = parseUnaryExpression();

	        stack = [left, token, right];

	        while ((prec = binaryPrecedence(lookahead, previousAllowIn)) > 0) {

	            // Reduce: make a binary expression from the three topmost entries.
	            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
	                right = stack.pop();
	                operator = stack.pop().value;
	                left = stack.pop();
	                expr = delegate.createBinaryExpression(operator, left, right);
	                markers.pop();
	                marker = markers.pop();
	                markerApply(marker, expr);
	                stack.push(expr);
	                markers.push(marker);
	            }

	            // Shift.
	            token = lex();
	            token.prec = prec;
	            stack.push(token);
	            markers.push(markerCreate());
	            expr = parseUnaryExpression();
	            stack.push(expr);
	        }

	        state.allowIn = previousAllowIn;

	        // Final reduce to clean-up the stack.
	        i = stack.length - 1;
	        expr = stack[i];
	        markers.pop();
	        while (i > 1) {
	            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	            i -= 2;
	            marker = markers.pop();
	            markerApply(marker, expr);
	        }

	        return expr;
	    }


	    // 11.12 Conditional Operator

	    function parseConditionalExpression() {
	        var expr, previousAllowIn, consequent, alternate, marker = markerCreate();
	        expr = parseBinaryExpression();

	        if (match('?')) {
	            lex();
	            previousAllowIn = state.allowIn;
	            state.allowIn = true;
	            consequent = parseAssignmentExpression();
	            state.allowIn = previousAllowIn;
	            expect(':');
	            alternate = parseAssignmentExpression();

	            expr = markerApply(marker, delegate.createConditionalExpression(expr, consequent, alternate));
	        }

	        return expr;
	    }

	    // 11.13 Assignment Operators

	    function reinterpretAsAssignmentBindingPattern(expr) {
	        var i, len, property, element;

	        if (expr.type === Syntax.ObjectExpression) {
	            expr.type = Syntax.ObjectPattern;
	            for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                property = expr.properties[i];
	                if (property.type === Syntax.SpreadProperty) {
	                    if (i < len - 1) {
	                        throwError({}, Messages.PropertyAfterSpreadProperty);
	                    }
	                    reinterpretAsAssignmentBindingPattern(property.argument);
	                } else {
	                    if (property.kind !== 'init') {
	                        throwError({}, Messages.InvalidLHSInAssignment);
	                    }
	                    reinterpretAsAssignmentBindingPattern(property.value);
	                }
	            }
	        } else if (expr.type === Syntax.ArrayExpression) {
	            expr.type = Syntax.ArrayPattern;
	            for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                element = expr.elements[i];
	                if (element) {
	                    reinterpretAsAssignmentBindingPattern(element);
	                }
	            }
	        } else if (expr.type === Syntax.Identifier) {
	            if (isRestrictedWord(expr.name)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }
	        } else if (expr.type === Syntax.SpreadElement) {
	            reinterpretAsAssignmentBindingPattern(expr.argument);
	            if (expr.argument.type === Syntax.ObjectPattern) {
	                throwError({}, Messages.ObjectPatternAsSpread);
	            }
	        } else {
	            if (expr.type !== Syntax.MemberExpression && expr.type !== Syntax.CallExpression && expr.type !== Syntax.NewExpression) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }
	        }
	    }


	    function reinterpretAsDestructuredParameter(options, expr) {
	        var i, len, property, element;

	        if (expr.type === Syntax.ObjectExpression) {
	            expr.type = Syntax.ObjectPattern;
	            for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                property = expr.properties[i];
	                if (property.type === Syntax.SpreadProperty) {
	                    if (i < len - 1) {
	                        throwError({}, Messages.PropertyAfterSpreadProperty);
	                    }
	                    reinterpretAsDestructuredParameter(options, property.argument);
	                } else {
	                    if (property.kind !== 'init') {
	                        throwError({}, Messages.InvalidLHSInFormalsList);
	                    }
	                    reinterpretAsDestructuredParameter(options, property.value);
	                }
	            }
	        } else if (expr.type === Syntax.ArrayExpression) {
	            expr.type = Syntax.ArrayPattern;
	            for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                element = expr.elements[i];
	                if (element) {
	                    reinterpretAsDestructuredParameter(options, element);
	                }
	            }
	        } else if (expr.type === Syntax.Identifier) {
	            validateParam(options, expr, expr.name);
	        } else {
	            if (expr.type !== Syntax.MemberExpression) {
	                throwError({}, Messages.InvalidLHSInFormalsList);
	            }
	        }
	    }

	    function reinterpretAsCoverFormalsList(expressions) {
	        var i, len, param, params, defaults, defaultCount, options, rest;

	        params = [];
	        defaults = [];
	        defaultCount = 0;
	        rest = null;
	        options = {
	            paramSet: {}
	        };

	        for (i = 0, len = expressions.length; i < len; i += 1) {
	            param = expressions[i];
	            if (param.type === Syntax.Identifier) {
	                params.push(param);
	                defaults.push(null);
	                validateParam(options, param, param.name);
	            } else if (param.type === Syntax.ObjectExpression || param.type === Syntax.ArrayExpression) {
	                reinterpretAsDestructuredParameter(options, param);
	                params.push(param);
	                defaults.push(null);
	            } else if (param.type === Syntax.SpreadElement) {
	                assert(i === len - 1, 'It is guaranteed that SpreadElement is last element by parseExpression');
	                reinterpretAsDestructuredParameter(options, param.argument);
	                rest = param.argument;
	            } else if (param.type === Syntax.AssignmentExpression) {
	                params.push(param.left);
	                defaults.push(param.right);
	                ++defaultCount;
	                validateParam(options, param.left, param.left.name);
	            } else {
	                return null;
	            }
	        }

	        if (options.message === Messages.StrictParamDupe) {
	            throwError(
	                strict ? options.stricted : options.firstRestricted,
	                options.message
	            );
	        }

	        if (defaultCount === 0) {
	            defaults = [];
	        }

	        return {
	            params: params,
	            defaults: defaults,
	            rest: rest,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    }

	    function parseArrowFunctionExpression(options, marker) {
	        var previousStrict, previousYieldAllowed, body;

	        expect('=>');

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = false;
	        body = parseConciseBody();

	        if (strict && options.firstRestricted) {
	            throwError(options.firstRestricted, options.message);
	        }
	        if (strict && options.stricted) {
	            throwErrorTolerant(options.stricted, options.message);
	        }

	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;

	        return markerApply(marker, delegate.createArrowFunctionExpression(
	            options.params,
	            options.defaults,
	            body,
	            options.rest,
	            body.type !== Syntax.BlockStatement
	        ));
	    }

	    function parseAssignmentExpression() {
	        var marker, expr, token, params, oldParenthesizedCount;

	        // Note that 'yield' is treated as a keyword in strict mode, but a
	        // contextual keyword (identifier) in non-strict mode, so we need
	        // to use matchKeyword and matchContextualKeyword appropriately.
	        if ((state.yieldAllowed && matchContextualKeyword('yield')) || (strict && matchKeyword('yield'))) {
	            return parseYieldExpression();
	        }

	        oldParenthesizedCount = state.parenthesizedCount;

	        marker = markerCreate();

	        if (match('(')) {
	            token = lookahead2();
	            if ((token.type === Token.Punctuator && token.value === ')') || token.value === '...') {
	                params = parseParams();
	                if (!match('=>')) {
	                    throwUnexpected(lex());
	                }
	                return parseArrowFunctionExpression(params, marker);
	            }
	        }

	        token = lookahead;
	        expr = parseConditionalExpression();

	        if (match('=>') &&
	                (state.parenthesizedCount === oldParenthesizedCount ||
	                state.parenthesizedCount === (oldParenthesizedCount + 1))) {
	            if (expr.type === Syntax.Identifier) {
	                params = reinterpretAsCoverFormalsList([ expr ]);
	            } else if (expr.type === Syntax.SequenceExpression) {
	                params = reinterpretAsCoverFormalsList(expr.expressions);
	            }
	            if (params) {
	                return parseArrowFunctionExpression(params, marker);
	            }
	        }

	        if (matchAssign()) {
	            // 11.13.1
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant(token, Messages.StrictLHSAssignment);
	            }

	            // ES.next draf 11.13 Runtime Semantics step 1
	            if (match('=') && (expr.type === Syntax.ObjectExpression || expr.type === Syntax.ArrayExpression)) {
	                reinterpretAsAssignmentBindingPattern(expr);
	            } else if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            expr = markerApply(marker, delegate.createAssignmentExpression(lex().value, expr, parseAssignmentExpression()));
	        }

	        return expr;
	    }

	    // 11.14 Comma Operator

	    function parseExpression() {
	        var marker, expr, expressions, sequence, coverFormalsList, spreadFound, oldParenthesizedCount;

	        oldParenthesizedCount = state.parenthesizedCount;

	        marker = markerCreate();
	        expr = parseAssignmentExpression();
	        expressions = [ expr ];

	        if (match(',')) {
	            while (index < length) {
	                if (!match(',')) {
	                    break;
	                }

	                lex();
	                expr = parseSpreadOrAssignmentExpression();
	                expressions.push(expr);

	                if (expr.type === Syntax.SpreadElement) {
	                    spreadFound = true;
	                    if (!match(')')) {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                    break;
	                }
	            }

	            sequence = markerApply(marker, delegate.createSequenceExpression(expressions));
	        }

	        if (match('=>')) {
	            // Do not allow nested parentheses on the LHS of the =>.
	            if (state.parenthesizedCount === oldParenthesizedCount || state.parenthesizedCount === (oldParenthesizedCount + 1)) {
	                expr = expr.type === Syntax.SequenceExpression ? expr.expressions : expressions;
	                coverFormalsList = reinterpretAsCoverFormalsList(expr);
	                if (coverFormalsList) {
	                    return parseArrowFunctionExpression(coverFormalsList, marker);
	                }
	            }
	            throwUnexpected(lex());
	        }

	        if (spreadFound && lookahead2().value !== '=>') {
	            throwError({}, Messages.IllegalSpread);
	        }

	        return sequence || expr;
	    }

	    // 12.1 Block

	    function parseStatementList() {
	        var list = [],
	            statement;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            statement = parseSourceElement();
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            list.push(statement);
	        }

	        return list;
	    }

	    function parseBlock() {
	        var block, marker = markerCreate();

	        expect('{');

	        block = parseStatementList();

	        expect('}');

	        return markerApply(marker, delegate.createBlockStatement(block));
	    }

	    // 12.2 Variable Statement

	    function parseObjectTypeAnnotation(nullable) {
	        var isMethod, marker, properties = [], property, propertyKey,
	            propertyTypeAnnotation;

	        expect('{');

	        while (!match('}')) {
	            marker = markerCreate();
	            propertyKey = parseObjectPropertyKey();
	            isMethod = match('(');
	            propertyTypeAnnotation = parseTypeAnnotation();
	            properties.push(markerApply(marker, delegate.createProperty(
	                'init',
	                propertyKey,
	                propertyTypeAnnotation,
	                isMethod,
	                false
	            )));

	            if (!match('}')) {
	                if (match(',') || match(';')) {
	                    lex();
	                } else {
	                    throwUnexpected(lookahead);
	                }
	            }
	        }

	        expect('}');

	        return delegate.createObjectTypeAnnotation(properties, nullable);
	    }

	    function parseVoidTypeAnnotation() {
	        var marker = markerCreate();
	        expectKeyword('void');
	        return markerApply(marker, delegate.createVoidTypeAnnotation());
	    }

	    function parseParametricTypeAnnotation() {
	        var marker = markerCreate(), typeIdentifier, paramTypes = [];

	        expect('<');
	        while (!match('>')) {
	            paramTypes.push(parseVariableIdentifier());
	            if (!match('>')) {
	                expect(',');
	            }
	        }
	        expect('>');

	        return markerApply(marker, delegate.createParametricTypeAnnotation(
	            paramTypes
	        ));
	    }

	    function parseTypeAnnotation(dontExpectColon) {
	        var typeIdentifier = null, params = null, returnType = null,
	            nullable = false, marker = markerCreate(), returnTypeMarker = null,
	            parametricType, annotation;

	        if (!dontExpectColon) {
	            expect(':');
	        }

	        if (match('?')) {
	            lex();
	            nullable = true;
	        }

	        if (match('{')) {
	            return markerApply(marker, parseObjectTypeAnnotation(nullable));
	        }

	        if (lookahead.type === Token.Identifier) {
	            typeIdentifier = parseVariableIdentifier();
	            if (match('<')) {
	                parametricType = parseParametricTypeAnnotation();
	            }
	        } else if (match('(')) {
	            lex();
	            params = [];
	            while (lookahead.type === Token.Identifier || match('?')) {
	                params.push(parseTypeAnnotatableIdentifier(
	                    true, /* requireTypeAnnotation */
	                    true /* canBeOptionalParam */
	                ));
	                if (!match(')')) {
	                    expect(',');
	                }
	            }
	            expect(')');

	            returnTypeMarker = markerCreate();
	            expect('=>');

	            returnType = parseTypeAnnotation(true);
	        } else {
	            if (!matchKeyword('void')) {
	                throwUnexpected(lookahead);
	            } else {
	                return markerApply(marker, parseVoidTypeAnnotation());
	            }
	        }

	        return markerApply(marker, delegate.createTypeAnnotation(
	            typeIdentifier,
	            parametricType,
	            params,
	            returnType,
	            nullable
	        ));
	    }

	    function parseVariableIdentifier() {
	        var marker = markerCreate(),
	            token = lex();

	        if (token.type !== Token.Identifier) {
	            throwUnexpected(token);
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseTypeAnnotatableIdentifier(requireTypeAnnotation, canBeOptionalParam) {
	        var marker = markerCreate(),
	            ident = parseVariableIdentifier(),
	            isOptionalParam = false;

	        if (canBeOptionalParam && match('?')) {
	            expect('?');
	            isOptionalParam = true;
	        }

	        if (requireTypeAnnotation || match(':')) {
	            ident = markerApply(marker, delegate.createTypeAnnotatedIdentifier(
	                ident,
	                parseTypeAnnotation()
	            ));
	        }

	        if (isOptionalParam) {
	            ident = markerApply(marker, delegate.createOptionalParameter(ident));
	        }

	        return ident;
	    }

	    function parseVariableDeclaration(kind) {
	        var id,
	            marker = markerCreate(),
	            init = null;
	        if (match('{')) {
	            id = parseObjectInitialiser();
	            reinterpretAsAssignmentBindingPattern(id);
	        } else if (match('[')) {
	            id = parseArrayInitialiser();
	            reinterpretAsAssignmentBindingPattern(id);
	        } else {
	            id = state.allowKeyword ? parseNonComputedProperty() : parseTypeAnnotatableIdentifier();
	            // 12.2.1
	            if (strict && isRestrictedWord(id.name)) {
	                throwErrorTolerant({}, Messages.StrictVarName);
	            }
	        }

	        if (kind === 'const') {
	            if (!match('=')) {
	                throwError({}, Messages.NoUnintializedConst);
	            }
	            expect('=');
	            init = parseAssignmentExpression();
	        } else if (match('=')) {
	            lex();
	            init = parseAssignmentExpression();
	        }

	        return markerApply(marker, delegate.createVariableDeclarator(id, init));
	    }

	    function parseVariableDeclarationList(kind) {
	        var list = [];

	        do {
	            list.push(parseVariableDeclaration(kind));
	            if (!match(',')) {
	                break;
	            }
	            lex();
	        } while (index < length);

	        return list;
	    }

	    function parseVariableStatement() {
	        var declarations, marker = markerCreate();

	        expectKeyword('var');

	        declarations = parseVariableDeclarationList();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, 'var'));
	    }

	    // kind may be `const` or `let`
	    // Both are experimental and not in the specification yet.
	    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
	    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
	    function parseConstLetDeclaration(kind) {
	        var declarations, marker = markerCreate();

	        expectKeyword(kind);

	        declarations = parseVariableDeclarationList(kind);

	        consumeSemicolon();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, kind));
	    }

	    // http://wiki.ecmascript.org/doku.php?id=harmony:modules

	    function parseModuleDeclaration() {
	        var id, src, body, marker = markerCreate();

	        lex();   // 'module'

	        if (peekLineTerminator()) {
	            throwError({}, Messages.NewlineAfterModule);
	        }

	        switch (lookahead.type) {

	        case Token.StringLiteral:
	            id = parsePrimaryExpression();
	            body = parseModuleBlock();
	            src = null;
	            break;

	        case Token.Identifier:
	            id = parseVariableIdentifier();
	            body = null;
	            if (!matchContextualKeyword('from')) {
	                throwUnexpected(lex());
	            }
	            lex();
	            src = parsePrimaryExpression();
	            if (src.type !== Syntax.Literal) {
	                throwError({}, Messages.InvalidModuleSpecifier);
	            }
	            break;
	        }

	        consumeSemicolon();
	        return markerApply(marker, delegate.createModuleDeclaration(id, src, body));
	    }

	    function parseExportBatchSpecifier() {
	        var marker = markerCreate();
	        expect('*');
	        return markerApply(marker, delegate.createExportBatchSpecifier());
	    }

	    function parseExportSpecifier() {
	        var id, name = null, marker = markerCreate();

	        id = parseVariableIdentifier();
	        if (matchContextualKeyword('as')) {
	            lex();
	            name = parseNonComputedProperty();
	        }

	        return markerApply(marker, delegate.createExportSpecifier(id, name));
	    }

	    function parseExportDeclaration() {
	        var previousAllowKeyword, decl, def, src, specifiers,
	            marker = markerCreate();

	        expectKeyword('export');

	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'let':
	            case 'const':
	            case 'var':
	            case 'class':
	            case 'function':
	                return markerApply(marker, delegate.createExportDeclaration(parseSourceElement(), null, null));
	            }
	        }

	        if (isIdentifierName(lookahead)) {
	            previousAllowKeyword = state.allowKeyword;
	            state.allowKeyword = true;
	            decl = parseVariableDeclarationList('let');
	            state.allowKeyword = previousAllowKeyword;
	            return markerApply(marker, delegate.createExportDeclaration(decl, null, null));
	        }

	        specifiers = [];
	        src = null;

	        if (match('*')) {
	            specifiers.push(parseExportBatchSpecifier());
	        } else {
	            expect('{');
	            do {
	                specifiers.push(parseExportSpecifier());
	            } while (match(',') && lex());
	            expect('}');
	        }

	        if (matchContextualKeyword('from')) {
	            lex();
	            src = parsePrimaryExpression();
	            if (src.type !== Syntax.Literal) {
	                throwError({}, Messages.InvalidModuleSpecifier);
	            }
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createExportDeclaration(null, specifiers, src));
	    }

	    function parseImportDeclaration() {
	        var specifiers, kind, src, marker = markerCreate();

	        expectKeyword('import');
	        specifiers = [];

	        if (isIdentifierName(lookahead)) {
	            kind = 'default';
	            specifiers.push(parseImportSpecifier());

	            if (!matchContextualKeyword('from')) {
	                throwError({}, Messages.NoFromAfterImport);
	            }
	            lex();
	        } else if (match('{')) {
	            kind = 'named';
	            lex();
	            do {
	                specifiers.push(parseImportSpecifier());
	            } while (match(',') && lex());
	            expect('}');

	            if (!matchContextualKeyword('from')) {
	                throwError({}, Messages.NoFromAfterImport);
	            }
	            lex();
	        }

	        src = parsePrimaryExpression();
	        if (src.type !== Syntax.Literal) {
	            throwError({}, Messages.InvalidModuleSpecifier);
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createImportDeclaration(specifiers, kind, src));
	    }

	    function parseImportSpecifier() {
	        var id, name = null, marker = markerCreate();

	        id = parseNonComputedProperty();
	        if (matchContextualKeyword('as')) {
	            lex();
	            name = parseVariableIdentifier();
	        }

	        return markerApply(marker, delegate.createImportSpecifier(id, name));
	    }

	    // 12.3 Empty Statement

	    function parseEmptyStatement() {
	        var marker = markerCreate();
	        expect(';');
	        return markerApply(marker, delegate.createEmptyStatement());
	    }

	    // 12.4 Expression Statement

	    function parseExpressionStatement() {
	        var marker = markerCreate(), expr = parseExpression();
	        consumeSemicolon();
	        return markerApply(marker, delegate.createExpressionStatement(expr));
	    }

	    // 12.5 If statement

	    function parseIfStatement() {
	        var test, consequent, alternate, marker = markerCreate();

	        expectKeyword('if');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        consequent = parseStatement();

	        if (matchKeyword('else')) {
	            lex();
	            alternate = parseStatement();
	        } else {
	            alternate = null;
	        }

	        return markerApply(marker, delegate.createIfStatement(test, consequent, alternate));
	    }

	    // 12.6 Iteration Statements

	    function parseDoWhileStatement() {
	        var body, test, oldInIteration, marker = markerCreate();

	        expectKeyword('do');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        if (match(';')) {
	            lex();
	        }

	        return markerApply(marker, delegate.createDoWhileStatement(body, test));
	    }

	    function parseWhileStatement() {
	        var test, body, oldInIteration, marker = markerCreate();

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        return markerApply(marker, delegate.createWhileStatement(test, body));
	    }

	    function parseForVariableDeclaration() {
	        var marker = markerCreate(),
	            token = lex(),
	            declarations = parseVariableDeclarationList();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, token.value));
	    }

	    function parseForStatement(opts) {
	        var init, test, update, left, right, body, operator, oldInIteration,
	            marker = markerCreate();
	        init = test = update = null;
	        expectKeyword('for');

	        // http://wiki.ecmascript.org/doku.php?id=proposals:iterators_and_generators&s=each
	        if (matchContextualKeyword('each')) {
	            throwError({}, Messages.EachNotAllowed);
	        }

	        expect('(');

	        if (match(';')) {
	            lex();
	        } else {
	            if (matchKeyword('var') || matchKeyword('let') || matchKeyword('const')) {
	                state.allowIn = false;
	                init = parseForVariableDeclaration();
	                state.allowIn = true;

	                if (init.declarations.length === 1) {
	                    if (matchKeyword('in') || matchContextualKeyword('of')) {
	                        operator = lookahead;
	                        if (!((operator.value === 'in' || init.kind !== 'var') && init.declarations[0].init)) {
	                            lex();
	                            left = init;
	                            right = parseExpression();
	                            init = null;
	                        }
	                    }
	                }
	            } else {
	                state.allowIn = false;
	                init = parseExpression();
	                state.allowIn = true;

	                if (matchContextualKeyword('of')) {
	                    operator = lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                } else if (matchKeyword('in')) {
	                    // LeftHandSideExpression
	                    if (!isAssignableLeftHandSide(init)) {
	                        throwError({}, Messages.InvalidLHSInForIn);
	                    }
	                    operator = lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            }

	            if (typeof left === 'undefined') {
	                expect(';');
	            }
	        }

	        if (typeof left === 'undefined') {

	            if (!match(';')) {
	                test = parseExpression();
	            }
	            expect(';');

	            if (!match(')')) {
	                update = parseExpression();
	            }
	        }

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        if (!(opts !== undefined && opts.ignoreBody)) {
	            body = parseStatement();
	        }

	        state.inIteration = oldInIteration;

	        if (typeof left === 'undefined') {
	            return markerApply(marker, delegate.createForStatement(init, test, update, body));
	        }

	        if (operator.value === 'in') {
	            return markerApply(marker, delegate.createForInStatement(left, right, body));
	        }
	        return markerApply(marker, delegate.createForOfStatement(left, right, body));
	    }

	    // 12.7 The continue statement

	    function parseContinueStatement() {
	        var label = null, key, marker = markerCreate();

	        expectKeyword('continue');

	        // Optimize the most common form: 'continue;'.
	        if (source.charCodeAt(index) === 59) {
	            lex();

	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return markerApply(marker, delegate.createContinueStatement(null));
	        }

	        if (peekLineTerminator()) {
	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return markerApply(marker, delegate.createContinueStatement(null));
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !state.inIteration) {
	            throwError({}, Messages.IllegalContinue);
	        }

	        return markerApply(marker, delegate.createContinueStatement(label));
	    }

	    // 12.8 The break statement

	    function parseBreakStatement() {
	        var label = null, key, marker = markerCreate();

	        expectKeyword('break');

	        // Catch the very common case first: immediately a semicolon (char #59).
	        if (source.charCodeAt(index) === 59) {
	            lex();

	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return markerApply(marker, delegate.createBreakStatement(null));
	        }

	        if (peekLineTerminator()) {
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return markerApply(marker, delegate.createBreakStatement(null));
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !(state.inIteration || state.inSwitch)) {
	            throwError({}, Messages.IllegalBreak);
	        }

	        return markerApply(marker, delegate.createBreakStatement(label));
	    }

	    // 12.9 The return statement

	    function parseReturnStatement() {
	        var argument = null, marker = markerCreate();

	        expectKeyword('return');

	        if (!state.inFunctionBody) {
	            throwErrorTolerant({}, Messages.IllegalReturn);
	        }

	        // 'return' followed by a space and an identifier is very common.
	        if (source.charCodeAt(index) === 32) {
	            if (isIdentifierStart(source.charCodeAt(index + 1))) {
	                argument = parseExpression();
	                consumeSemicolon();
	                return markerApply(marker, delegate.createReturnStatement(argument));
	            }
	        }

	        if (peekLineTerminator()) {
	            return markerApply(marker, delegate.createReturnStatement(null));
	        }

	        if (!match(';')) {
	            if (!match('}') && lookahead.type !== Token.EOF) {
	                argument = parseExpression();
	            }
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createReturnStatement(argument));
	    }

	    // 12.10 The with statement

	    function parseWithStatement() {
	        var object, body, marker = markerCreate();

	        if (strict) {
	            throwErrorTolerant({}, Messages.StrictModeWith);
	        }

	        expectKeyword('with');

	        expect('(');

	        object = parseExpression();

	        expect(')');

	        body = parseStatement();

	        return markerApply(marker, delegate.createWithStatement(object, body));
	    }

	    // 12.10 The swith statement

	    function parseSwitchCase() {
	        var test,
	            consequent = [],
	            sourceElement,
	            marker = markerCreate();

	        if (matchKeyword('default')) {
	            lex();
	            test = null;
	        } else {
	            expectKeyword('case');
	            test = parseExpression();
	        }
	        expect(':');

	        while (index < length) {
	            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            consequent.push(sourceElement);
	        }

	        return markerApply(marker, delegate.createSwitchCase(test, consequent));
	    }

	    function parseSwitchStatement() {
	        var discriminant, cases, clause, oldInSwitch, defaultFound, marker = markerCreate();

	        expectKeyword('switch');

	        expect('(');

	        discriminant = parseExpression();

	        expect(')');

	        expect('{');

	        cases = [];

	        if (match('}')) {
	            lex();
	            return markerApply(marker, delegate.createSwitchStatement(discriminant, cases));
	        }

	        oldInSwitch = state.inSwitch;
	        state.inSwitch = true;
	        defaultFound = false;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            clause = parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    throwError({}, Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }

	        state.inSwitch = oldInSwitch;

	        expect('}');

	        return markerApply(marker, delegate.createSwitchStatement(discriminant, cases));
	    }

	    // 12.13 The throw statement

	    function parseThrowStatement() {
	        var argument, marker = markerCreate();

	        expectKeyword('throw');

	        if (peekLineTerminator()) {
	            throwError({}, Messages.NewlineAfterThrow);
	        }

	        argument = parseExpression();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createThrowStatement(argument));
	    }

	    // 12.14 The try statement

	    function parseCatchClause() {
	        var param, body, marker = markerCreate();

	        expectKeyword('catch');

	        expect('(');
	        if (match(')')) {
	            throwUnexpected(lookahead);
	        }

	        param = parseExpression();
	        // 12.14.1
	        if (strict && param.type === Syntax.Identifier && isRestrictedWord(param.name)) {
	            throwErrorTolerant({}, Messages.StrictCatchVariable);
	        }

	        expect(')');
	        body = parseBlock();
	        return markerApply(marker, delegate.createCatchClause(param, body));
	    }

	    function parseTryStatement() {
	        var block, handlers = [], finalizer = null, marker = markerCreate();

	        expectKeyword('try');

	        block = parseBlock();

	        if (matchKeyword('catch')) {
	            handlers.push(parseCatchClause());
	        }

	        if (matchKeyword('finally')) {
	            lex();
	            finalizer = parseBlock();
	        }

	        if (handlers.length === 0 && !finalizer) {
	            throwError({}, Messages.NoCatchOrFinally);
	        }

	        return markerApply(marker, delegate.createTryStatement(block, [], handlers, finalizer));
	    }

	    // 12.15 The debugger statement

	    function parseDebuggerStatement() {
	        var marker = markerCreate();
	        expectKeyword('debugger');

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDebuggerStatement());
	    }

	    // 12 Statements

	    function parseStatement() {
	        var type = lookahead.type,
	            marker,
	            expr,
	            labeledBody,
	            key;

	        if (type === Token.EOF) {
	            throwUnexpected(lookahead);
	        }

	        if (type === Token.Punctuator) {
	            switch (lookahead.value) {
	            case ';':
	                return parseEmptyStatement();
	            case '{':
	                return parseBlock();
	            case '(':
	                return parseExpressionStatement();
	            default:
	                break;
	            }
	        }

	        if (type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'break':
	                return parseBreakStatement();
	            case 'continue':
	                return parseContinueStatement();
	            case 'debugger':
	                return parseDebuggerStatement();
	            case 'do':
	                return parseDoWhileStatement();
	            case 'for':
	                return parseForStatement();
	            case 'function':
	                return parseFunctionDeclaration();
	            case 'class':
	                return parseClassDeclaration();
	            case 'if':
	                return parseIfStatement();
	            case 'return':
	                return parseReturnStatement();
	            case 'switch':
	                return parseSwitchStatement();
	            case 'throw':
	                return parseThrowStatement();
	            case 'try':
	                return parseTryStatement();
	            case 'var':
	                return parseVariableStatement();
	            case 'while':
	                return parseWhileStatement();
	            case 'with':
	                return parseWithStatement();
	            default:
	                break;
	            }
	        }

	        marker = markerCreate();
	        expr = parseExpression();

	        // 12.12 Labelled Statements
	        if ((expr.type === Syntax.Identifier) && match(':')) {
	            lex();

	            key = '$' + expr.name;
	            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.Redeclaration, 'Label', expr.name);
	            }

	            state.labelSet[key] = true;
	            labeledBody = parseStatement();
	            delete state.labelSet[key];
	            return markerApply(marker, delegate.createLabeledStatement(expr, labeledBody));
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createExpressionStatement(expr));
	    }

	    // 13 Function Definition

	    function parseConciseBody() {
	        if (match('{')) {
	            return parseFunctionSourceElements();
	        }
	        return parseAssignmentExpression();
	    }

	    function parseFunctionSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted,
	            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, oldParenthesizedCount,
	            marker = markerCreate();

	        expect('{');

	        while (index < length) {
	            if (lookahead.type !== Token.StringLiteral) {
	                break;
	            }
	            token = lookahead;

	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        oldLabelSet = state.labelSet;
	        oldInIteration = state.inIteration;
	        oldInSwitch = state.inSwitch;
	        oldInFunctionBody = state.inFunctionBody;
	        oldParenthesizedCount = state.parenthesizedCount;

	        state.labelSet = {};
	        state.inIteration = false;
	        state.inSwitch = false;
	        state.inFunctionBody = true;
	        state.parenthesizedCount = 0;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }

	        expect('}');

	        state.labelSet = oldLabelSet;
	        state.inIteration = oldInIteration;
	        state.inSwitch = oldInSwitch;
	        state.inFunctionBody = oldInFunctionBody;
	        state.parenthesizedCount = oldParenthesizedCount;

	        return markerApply(marker, delegate.createBlockStatement(sourceElements));
	    }

	    function validateParam(options, param, name) {
	        var key = '$' + name;
	        if (strict) {
	            if (isRestrictedWord(name)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamName;
	            }
	            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        } else if (!options.firstRestricted) {
	            if (isRestrictedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamName;
	            } else if (isStrictModeReservedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictReservedWord;
	            } else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        }
	        options.paramSet[key] = true;
	    }

	    function parseParam(options) {
	        var token, rest, param, def;

	        token = lookahead;
	        if (token.value === '...') {
	            token = lex();
	            rest = true;
	        }

	        if (match('[')) {
	            param = parseArrayInitialiser();
	            reinterpretAsDestructuredParameter(options, param);
	        } else if (match('{')) {
	            if (rest) {
	                throwError({}, Messages.ObjectPatternAsRestParameter);
	            }
	            param = parseObjectInitialiser();
	            reinterpretAsDestructuredParameter(options, param);
	        } else {
	            // Typing rest params is awkward, so punting on that for now
	            param =
	                rest
	                ? parseVariableIdentifier()
	                : parseTypeAnnotatableIdentifier(
	                    false, /* requireTypeAnnotation */
	                    true /* canBeOptionalParam */
	                );

	            validateParam(options, token, token.value);
	        }

	        if (match('=')) {
	            if (rest) {
	                throwErrorTolerant(lookahead, Messages.DefaultRestParameter);
	            }
	            lex();
	            def = parseAssignmentExpression();
	            ++options.defaultCount;
	        }

	        if (rest) {
	            if (!match(')')) {
	                throwError({}, Messages.ParameterAfterRestParameter);
	            }
	            options.rest = param;
	            return false;
	        }

	        options.params.push(param);
	        options.defaults.push(def);
	        return !match(')');
	    }

	    function parseParams(firstRestricted) {
	        var options, marker = markerCreate();

	        options = {
	            params: [],
	            defaultCount: 0,
	            defaults: [],
	            rest: null,
	            firstRestricted: firstRestricted
	        };

	        expect('(');

	        if (!match(')')) {
	            options.paramSet = {};
	            while (index < length) {
	                if (!parseParam(options)) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        expect(')');

	        if (options.defaultCount === 0) {
	            options.defaults = [];
	        }

	        if (match(':')) {
	            options.returnType = parseTypeAnnotation();
	        }

	        return markerApply(marker, options);
	    }

	    function parseFunctionDeclaration() {
	        var id, body, token, tmp, firstRestricted, message, previousStrict, previousYieldAllowed, generator,
	            marker = markerCreate(), parametricType;

	        expectKeyword('function');

	        generator = false;
	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        token = lookahead;

	        id = parseVariableIdentifier();

	        if (match('<')) {
	            parametricType = parseParametricTypeAnnotation();
	        }

	        if (strict) {
	            if (isRestrictedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictFunctionName);
	            }
	        } else {
	            if (isRestrictedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictFunctionName;
	            } else if (isStrictModeReservedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictReservedWord;
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = generator;

	        body = parseFunctionSourceElements();

	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, message);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;

	        return markerApply(marker, delegate.createFunctionDeclaration(id, tmp.params, tmp.defaults, body, tmp.rest, generator, false,
	            tmp.returnType, parametricType));
	    }

	    function parseFunctionExpression() {
	        var token, id = null, firstRestricted, message, tmp, body, previousStrict, previousYieldAllowed, generator,
	            marker = markerCreate(), parametricType;

	        expectKeyword('function');

	        generator = false;

	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        if (!match('(')) {
	            if (!match('<')) {
	                token = lookahead;
	                id = parseVariableIdentifier();

	                if (strict) {
	                    if (isRestrictedWord(token.value)) {
	                        throwErrorTolerant(token, Messages.StrictFunctionName);
	                    }
	                } else {
	                    if (isRestrictedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictFunctionName;
	                    } else if (isStrictModeReservedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictReservedWord;
	                    }
	                }
	            }

	            if (match('<')) {
	                parametricType = parseParametricTypeAnnotation();
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = generator;

	        body = parseFunctionSourceElements();

	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, message);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;

	        return markerApply(marker, delegate.createFunctionExpression(id, tmp.params, tmp.defaults, body, tmp.rest, generator, false,
	            tmp.returnType, parametricType));
	    }

	    function parseYieldExpression() {
	        var yieldToken, delegateFlag, expr, marker = markerCreate();

	        yieldToken = lex();
	        assert(yieldToken.value === 'yield', 'Called parseYieldExpression with non-yield lookahead.');

	        if (!state.yieldAllowed) {
	            throwErrorTolerant({}, Messages.IllegalYield);
	        }

	        delegateFlag = false;
	        if (match('*')) {
	            lex();
	            delegateFlag = true;
	        }

	        expr = parseAssignmentExpression();

	        return markerApply(marker, delegate.createYieldExpression(expr, delegateFlag));
	    }

	    // 14 Classes

	    function parseMethodDefinition(existingPropNames) {
	        var token, key, param, propType, isValidDuplicateProp = false,
	            marker = markerCreate(), token2, parametricType,
	            parametricTypeMarker, annotationMarker;

	        if (lookahead.value === 'static') {
	            propType = ClassPropertyType.static;
	            lex();
	        } else {
	            propType = ClassPropertyType.prototype;
	        }

	        if (match('*')) {
	            lex();
	            return markerApply(marker, delegate.createMethodDefinition(
	                propType,
	                '',
	                parseObjectPropertyKey(),
	                parsePropertyMethodFunction({ generator: true })
	            ));
	        }

	        token = lookahead;
	        //parametricTypeMarker = markerCreate();
	        key = parseObjectPropertyKey();

	        if (token.value === 'get' && !match('(')) {
	            key = parseObjectPropertyKey();

	            // It is a syntax error if any other properties have a name
	            // duplicating this one unless they are a setter
	            if (existingPropNames[propType].hasOwnProperty(key.name)) {
	                isValidDuplicateProp =
	                    // There isn't already a getter for this prop
	                    existingPropNames[propType][key.name].get === undefined
	                    // There isn't already a data prop by this name
	                    && existingPropNames[propType][key.name].data === undefined
	                    // The only existing prop by this name is a setter
	                    && existingPropNames[propType][key.name].set !== undefined;
	                if (!isValidDuplicateProp) {
	                    throwError(key, Messages.IllegalDuplicateClassProperty);
	                }
	            } else {
	                existingPropNames[propType][key.name] = {};
	            }
	            existingPropNames[propType][key.name].get = true;

	            expect('(');
	            expect(')');
	            return markerApply(marker, delegate.createMethodDefinition(
	                propType,
	                'get',
	                key,
	                parsePropertyFunction({ generator: false })
	            ));
	        }
	        if (token.value === 'set' && !match('(')) {
	            key = parseObjectPropertyKey();

	            // It is a syntax error if any other properties have a name
	            // duplicating this one unless they are a getter
	            if (existingPropNames[propType].hasOwnProperty(key.name)) {
	                isValidDuplicateProp =
	                    // There isn't already a setter for this prop
	                    existingPropNames[propType][key.name].set === undefined
	                    // There isn't already a data prop by this name
	                    && existingPropNames[propType][key.name].data === undefined
	                    // The only existing prop by this name is a getter
	                    && existingPropNames[propType][key.name].get !== undefined;
	                if (!isValidDuplicateProp) {
	                    throwError(key, Messages.IllegalDuplicateClassProperty);
	                }
	            } else {
	                existingPropNames[propType][key.name] = {};
	            }
	            existingPropNames[propType][key.name].set = true;

	            expect('(');
	            token = lookahead;
	            param = [ parseTypeAnnotatableIdentifier() ];
	            expect(')');
	            return markerApply(marker, delegate.createMethodDefinition(
	                propType,
	                'set',
	                key,
	                parsePropertyFunction({ params: param, generator: false, name: token })
	            ));
	        }

	        if (match('<')) {
	            parametricType = parseParametricTypeAnnotation();
	        }

	        // It is a syntax error if any other properties have the same name as a
	        // non-getter, non-setter method
	        if (existingPropNames[propType].hasOwnProperty(key.name)) {
	            throwError(key, Messages.IllegalDuplicateClassProperty);
	        } else {
	            existingPropNames[propType][key.name] = {};
	        }
	        existingPropNames[propType][key.name].data = true;

	        return markerApply(marker, delegate.createMethodDefinition(
	            propType,
	            '',
	            key,
	            parsePropertyMethodFunction({
	                generator: false,
	                parametricType: parametricType
	            })
	        ));
	    }

	    function parseClassProperty(existingPropNames) {
	        var marker = markerCreate(), propertyIdentifier;

	        propertyIdentifier = parseTypeAnnotatableIdentifier();
	        expect(';');

	        return markerApply(marker, delegate.createClassProperty(
	            propertyIdentifier
	        ));
	    }

	    function parseClassElement(existingProps) {
	        if (match(';')) {
	            lex();
	            return;
	        }

	        var doubleLookahead = lookahead2();
	        if (doubleLookahead.type === Token.Punctuator) {
	            if (doubleLookahead.value === ':') {
	                return parseClassProperty(existingProps);
	            }
	        }

	        return parseMethodDefinition(existingProps);
	    }

	    function parseClassBody() {
	        var classElement, classElements = [], existingProps = {}, marker = markerCreate();

	        existingProps[ClassPropertyType.static] = {};
	        existingProps[ClassPropertyType.prototype] = {};

	        expect('{');

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            classElement = parseClassElement(existingProps);

	            if (typeof classElement !== 'undefined') {
	                classElements.push(classElement);
	            }
	        }

	        expect('}');

	        return markerApply(marker, delegate.createClassBody(classElements));
	    }

	    function parseClassExpression() {
	        var id, previousYieldAllowed, superClass = null, marker = markerCreate(),
	            parametricType;

	        expectKeyword('class');

	        if (!matchKeyword('extends') && !match('{')) {
	            id = parseVariableIdentifier();
	        }

	        if (match('<')) {
	            parametricType = parseParametricTypeAnnotation();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');
	            previousYieldAllowed = state.yieldAllowed;
	            state.yieldAllowed = false;
	            superClass = parseAssignmentExpression();
	            state.yieldAllowed = previousYieldAllowed;
	        }

	        return markerApply(marker, delegate.createClassExpression(id, superClass, parseClassBody(), parametricType));
	    }

	    function parseClassDeclaration() {
	        var id, previousYieldAllowed, superClass = null, marker = markerCreate(),
	            parametricType, superParametricType;

	        expectKeyword('class');

	        id = parseVariableIdentifier();

	        if (match('<')) {
	            parametricType = parseParametricTypeAnnotation();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');
	            previousYieldAllowed = state.yieldAllowed;
	            state.yieldAllowed = false;
	            superClass = parseAssignmentExpression();
	            state.yieldAllowed = previousYieldAllowed;
	        }

	        return markerApply(marker, delegate.createClassDeclaration(id, superClass, parseClassBody(), parametricType, superParametricType));
	    }

	    // 15 Program

	    function matchModuleDeclaration() {
	        var id;
	        if (matchContextualKeyword('module')) {
	            id = lookahead2();
	            return id.type === Token.StringLiteral || id.type === Token.Identifier;
	        }
	        return false;
	    }

	    function parseSourceElement() {
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'const':
	            case 'let':
	                return parseConstLetDeclaration(lookahead.value);
	            case 'function':
	                return parseFunctionDeclaration();
	            case 'export':
	                return parseExportDeclaration();
	            case 'import':
	                return parseImportDeclaration();
	            default:
	                return parseStatement();
	            }
	        }

	        if (matchModuleDeclaration()) {
	            throwError({}, Messages.NestedModule);
	        }

	        if (lookahead.type !== Token.EOF) {
	            return parseStatement();
	        }
	    }

	    function parseProgramElement() {
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'export':
	                return parseExportDeclaration();
	            case 'import':
	                return parseImportDeclaration();
	            }
	        }

	        if (matchModuleDeclaration()) {
	            return parseModuleDeclaration();
	        }

	        return parseSourceElement();
	    }

	    function parseProgramElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted;

	        while (index < length) {
	            token = lookahead;
	            if (token.type !== Token.StringLiteral) {
	                break;
	            }

	            sourceElement = parseProgramElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        while (index < length) {
	            sourceElement = parseProgramElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }
	        return sourceElements;
	    }

	    function parseModuleElement() {
	        return parseSourceElement();
	    }

	    function parseModuleElements() {
	        var list = [],
	            statement;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            statement = parseModuleElement();
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            list.push(statement);
	        }

	        return list;
	    }

	    function parseModuleBlock() {
	        var block, marker = markerCreate();

	        expect('{');

	        block = parseModuleElements();

	        expect('}');

	        return markerApply(marker, delegate.createBlockStatement(block));
	    }

	    function parseProgram() {
	        var body, marker = markerCreate();
	        strict = false;
	        peek();
	        body = parseProgramElements();
	        return markerApply(marker, delegate.createProgram(body));
	    }

	    // The following functions are needed only when the option to preserve
	    // the comments is active.

	    function addComment(type, value, start, end, loc) {
	        var comment;

	        assert(typeof start === 'number', 'Comment must have valid position');

	        // Because the way the actual token is scanned, often the comments
	        // (if any) are skipped twice during the lexical analysis.
	        // Thus, we need to skip adding a comment if the comment array already
	        // handled it.
	        if (state.lastCommentStart >= start) {
	            return;
	        }
	        state.lastCommentStart = start;

	        comment = {
	            type: type,
	            value: value
	        };
	        if (extra.range) {
	            comment.range = [start, end];
	        }
	        if (extra.loc) {
	            comment.loc = loc;
	        }
	        extra.comments.push(comment);
	        if (extra.attachComment) {
	            extra.leadingComments.push(comment);
	            extra.trailingComments.push(comment);
	        }
	    }

	    function scanComment() {
	        var comment, ch, loc, start, blockComment, lineComment;

	        comment = '';
	        blockComment = false;
	        lineComment = false;

	        while (index < length) {
	            ch = source[index];

	            if (lineComment) {
	                ch = source[index++];
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    loc.end = {
	                        line: lineNumber,
	                        column: index - lineStart - 1
	                    };
	                    lineComment = false;
	                    addComment('Line', comment, start, index - 1, loc);
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    ++lineNumber;
	                    lineStart = index;
	                    comment = '';
	                } else if (index >= length) {
	                    lineComment = false;
	                    comment += ch;
	                    loc.end = {
	                        line: lineNumber,
	                        column: length - lineStart
	                    };
	                    addComment('Line', comment, start, length, loc);
	                } else {
	                    comment += ch;
	                }
	            } else if (blockComment) {
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    if (ch === '\r') {
	                        ++index;
	                        comment += '\r';
	                    }
	                    if (ch !== '\r' || source[index] === '\n') {
	                        comment += source[index];
	                        ++lineNumber;
	                        ++index;
	                        lineStart = index;
	                        if (index >= length) {
	                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                        }
	                    }
	                } else {
	                    ch = source[index++];
	                    if (index >= length) {
	                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                    }
	                    comment += ch;
	                    if (ch === '*') {
	                        ch = source[index];
	                        if (ch === '/') {
	                            comment = comment.substr(0, comment.length - 1);
	                            blockComment = false;
	                            ++index;
	                            loc.end = {
	                                line: lineNumber,
	                                column: index - lineStart
	                            };
	                            addComment('Block', comment, start, index, loc);
	                            comment = '';
	                        }
	                    }
	                }
	            } else if (ch === '/') {
	                ch = source[index + 1];
	                if (ch === '/') {
	                    loc = {
	                        start: {
	                            line: lineNumber,
	                            column: index - lineStart
	                        }
	                    };
	                    start = index;
	                    index += 2;
	                    lineComment = true;
	                    if (index >= length) {
	                        loc.end = {
	                            line: lineNumber,
	                            column: index - lineStart
	                        };
	                        lineComment = false;
	                        addComment('Line', comment, start, index, loc);
	                    }
	                } else if (ch === '*') {
	                    start = index;
	                    index += 2;
	                    blockComment = true;
	                    loc = {
	                        start: {
	                            line: lineNumber,
	                            column: index - lineStart - 2
	                        }
	                    };
	                    if (index >= length) {
	                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                    }
	                } else {
	                    break;
	                }
	            } else if (isWhiteSpace(ch.charCodeAt(0))) {
	                ++index;
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                ++index;
	                if (ch ===  '\r' && source[index] === '\n') {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	            } else {
	                break;
	            }
	        }
	    }

	    // 16 XJS

	    XHTMLEntities = {
	        quot: '\u0022',
	        amp: '&',
	        apos: '\u0027',
	        lt: '<',
	        gt: '>',
	        nbsp: '\u00A0',
	        iexcl: '\u00A1',
	        cent: '\u00A2',
	        pound: '\u00A3',
	        curren: '\u00A4',
	        yen: '\u00A5',
	        brvbar: '\u00A6',
	        sect: '\u00A7',
	        uml: '\u00A8',
	        copy: '\u00A9',
	        ordf: '\u00AA',
	        laquo: '\u00AB',
	        not: '\u00AC',
	        shy: '\u00AD',
	        reg: '\u00AE',
	        macr: '\u00AF',
	        deg: '\u00B0',
	        plusmn: '\u00B1',
	        sup2: '\u00B2',
	        sup3: '\u00B3',
	        acute: '\u00B4',
	        micro: '\u00B5',
	        para: '\u00B6',
	        middot: '\u00B7',
	        cedil: '\u00B8',
	        sup1: '\u00B9',
	        ordm: '\u00BA',
	        raquo: '\u00BB',
	        frac14: '\u00BC',
	        frac12: '\u00BD',
	        frac34: '\u00BE',
	        iquest: '\u00BF',
	        Agrave: '\u00C0',
	        Aacute: '\u00C1',
	        Acirc: '\u00C2',
	        Atilde: '\u00C3',
	        Auml: '\u00C4',
	        Aring: '\u00C5',
	        AElig: '\u00C6',
	        Ccedil: '\u00C7',
	        Egrave: '\u00C8',
	        Eacute: '\u00C9',
	        Ecirc: '\u00CA',
	        Euml: '\u00CB',
	        Igrave: '\u00CC',
	        Iacute: '\u00CD',
	        Icirc: '\u00CE',
	        Iuml: '\u00CF',
	        ETH: '\u00D0',
	        Ntilde: '\u00D1',
	        Ograve: '\u00D2',
	        Oacute: '\u00D3',
	        Ocirc: '\u00D4',
	        Otilde: '\u00D5',
	        Ouml: '\u00D6',
	        times: '\u00D7',
	        Oslash: '\u00D8',
	        Ugrave: '\u00D9',
	        Uacute: '\u00DA',
	        Ucirc: '\u00DB',
	        Uuml: '\u00DC',
	        Yacute: '\u00DD',
	        THORN: '\u00DE',
	        szlig: '\u00DF',
	        agrave: '\u00E0',
	        aacute: '\u00E1',
	        acirc: '\u00E2',
	        atilde: '\u00E3',
	        auml: '\u00E4',
	        aring: '\u00E5',
	        aelig: '\u00E6',
	        ccedil: '\u00E7',
	        egrave: '\u00E8',
	        eacute: '\u00E9',
	        ecirc: '\u00EA',
	        euml: '\u00EB',
	        igrave: '\u00EC',
	        iacute: '\u00ED',
	        icirc: '\u00EE',
	        iuml: '\u00EF',
	        eth: '\u00F0',
	        ntilde: '\u00F1',
	        ograve: '\u00F2',
	        oacute: '\u00F3',
	        ocirc: '\u00F4',
	        otilde: '\u00F5',
	        ouml: '\u00F6',
	        divide: '\u00F7',
	        oslash: '\u00F8',
	        ugrave: '\u00F9',
	        uacute: '\u00FA',
	        ucirc: '\u00FB',
	        uuml: '\u00FC',
	        yacute: '\u00FD',
	        thorn: '\u00FE',
	        yuml: '\u00FF',
	        OElig: '\u0152',
	        oelig: '\u0153',
	        Scaron: '\u0160',
	        scaron: '\u0161',
	        Yuml: '\u0178',
	        fnof: '\u0192',
	        circ: '\u02C6',
	        tilde: '\u02DC',
	        Alpha: '\u0391',
	        Beta: '\u0392',
	        Gamma: '\u0393',
	        Delta: '\u0394',
	        Epsilon: '\u0395',
	        Zeta: '\u0396',
	        Eta: '\u0397',
	        Theta: '\u0398',
	        Iota: '\u0399',
	        Kappa: '\u039A',
	        Lambda: '\u039B',
	        Mu: '\u039C',
	        Nu: '\u039D',
	        Xi: '\u039E',
	        Omicron: '\u039F',
	        Pi: '\u03A0',
	        Rho: '\u03A1',
	        Sigma: '\u03A3',
	        Tau: '\u03A4',
	        Upsilon: '\u03A5',
	        Phi: '\u03A6',
	        Chi: '\u03A7',
	        Psi: '\u03A8',
	        Omega: '\u03A9',
	        alpha: '\u03B1',
	        beta: '\u03B2',
	        gamma: '\u03B3',
	        delta: '\u03B4',
	        epsilon: '\u03B5',
	        zeta: '\u03B6',
	        eta: '\u03B7',
	        theta: '\u03B8',
	        iota: '\u03B9',
	        kappa: '\u03BA',
	        lambda: '\u03BB',
	        mu: '\u03BC',
	        nu: '\u03BD',
	        xi: '\u03BE',
	        omicron: '\u03BF',
	        pi: '\u03C0',
	        rho: '\u03C1',
	        sigmaf: '\u03C2',
	        sigma: '\u03C3',
	        tau: '\u03C4',
	        upsilon: '\u03C5',
	        phi: '\u03C6',
	        chi: '\u03C7',
	        psi: '\u03C8',
	        omega: '\u03C9',
	        thetasym: '\u03D1',
	        upsih: '\u03D2',
	        piv: '\u03D6',
	        ensp: '\u2002',
	        emsp: '\u2003',
	        thinsp: '\u2009',
	        zwnj: '\u200C',
	        zwj: '\u200D',
	        lrm: '\u200E',
	        rlm: '\u200F',
	        ndash: '\u2013',
	        mdash: '\u2014',
	        lsquo: '\u2018',
	        rsquo: '\u2019',
	        sbquo: '\u201A',
	        ldquo: '\u201C',
	        rdquo: '\u201D',
	        bdquo: '\u201E',
	        dagger: '\u2020',
	        Dagger: '\u2021',
	        bull: '\u2022',
	        hellip: '\u2026',
	        permil: '\u2030',
	        prime: '\u2032',
	        Prime: '\u2033',
	        lsaquo: '\u2039',
	        rsaquo: '\u203A',
	        oline: '\u203E',
	        frasl: '\u2044',
	        euro: '\u20AC',
	        image: '\u2111',
	        weierp: '\u2118',
	        real: '\u211C',
	        trade: '\u2122',
	        alefsym: '\u2135',
	        larr: '\u2190',
	        uarr: '\u2191',
	        rarr: '\u2192',
	        darr: '\u2193',
	        harr: '\u2194',
	        crarr: '\u21B5',
	        lArr: '\u21D0',
	        uArr: '\u21D1',
	        rArr: '\u21D2',
	        dArr: '\u21D3',
	        hArr: '\u21D4',
	        forall: '\u2200',
	        part: '\u2202',
	        exist: '\u2203',
	        empty: '\u2205',
	        nabla: '\u2207',
	        isin: '\u2208',
	        notin: '\u2209',
	        ni: '\u220B',
	        prod: '\u220F',
	        sum: '\u2211',
	        minus: '\u2212',
	        lowast: '\u2217',
	        radic: '\u221A',
	        prop: '\u221D',
	        infin: '\u221E',
	        ang: '\u2220',
	        and: '\u2227',
	        or: '\u2228',
	        cap: '\u2229',
	        cup: '\u222A',
	        'int': '\u222B',
	        there4: '\u2234',
	        sim: '\u223C',
	        cong: '\u2245',
	        asymp: '\u2248',
	        ne: '\u2260',
	        equiv: '\u2261',
	        le: '\u2264',
	        ge: '\u2265',
	        sub: '\u2282',
	        sup: '\u2283',
	        nsub: '\u2284',
	        sube: '\u2286',
	        supe: '\u2287',
	        oplus: '\u2295',
	        otimes: '\u2297',
	        perp: '\u22A5',
	        sdot: '\u22C5',
	        lceil: '\u2308',
	        rceil: '\u2309',
	        lfloor: '\u230A',
	        rfloor: '\u230B',
	        lang: '\u2329',
	        rang: '\u232A',
	        loz: '\u25CA',
	        spades: '\u2660',
	        clubs: '\u2663',
	        hearts: '\u2665',
	        diams: '\u2666'
	    };

	    function getQualifiedXJSName(object) {
	        if (object.type === Syntax.XJSIdentifier) {
	            return object.name;
	        }
	        if (object.type === Syntax.XJSNamespacedName) {
	            return object.namespace.name + ':' + object.name.name;
	        }
	        if (object.type === Syntax.XJSMemberExpression) {
	            return (
	                getQualifiedXJSName(object.object) + '.' +
	                getQualifiedXJSName(object.property)
	            );
	        }
	    }

	    function isXJSIdentifierStart(ch) {
	        // exclude backslash (\)
	        return (ch !== 92) && isIdentifierStart(ch);
	    }

	    function isXJSIdentifierPart(ch) {
	        // exclude backslash (\) and add hyphen (-)
	        return (ch !== 92) && (ch === 45 || isIdentifierPart(ch));
	    }

	    function scanXJSIdentifier() {
	        var ch, start, value = '';

	        start = index;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isXJSIdentifierPart(ch)) {
	                break;
	            }
	            value += source[index++];
	        }

	        return {
	            type: Token.XJSIdentifier,
	            value: value,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanXJSEntity() {
	        var ch, str = '', count = 0, entity;
	        ch = source[index];
	        assert(ch === '&', 'Entity must start with an ampersand');
	        index++;
	        while (index < length && count++ < 10) {
	            ch = source[index++];
	            if (ch === ';') {
	                break;
	            }
	            str += ch;
	        }

	        if (str[0] === '#' && str[1] === 'x') {
	            entity = String.fromCharCode(parseInt(str.substr(2), 16));
	        } else if (str[0] === '#') {
	            entity = String.fromCharCode(parseInt(str.substr(1), 10));
	        } else {
	            entity = XHTMLEntities[str];
	        }
	        return entity;
	    }

	    function scanXJSText(stopChars) {
	        var ch, str = '', start;
	        start = index;
	        while (index < length) {
	            ch = source[index];
	            if (stopChars.indexOf(ch) !== -1) {
	                break;
	            }
	            if (ch === '&') {
	                str += scanXJSEntity();
	            } else {
	                index++;
	                if (ch === '\r' && source[index] === '\n') {
	                    str += ch;
	                    ch = source[index];
	                    index++;
	                }
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    ++lineNumber;
	                    lineStart = index;
	                }
	                str += ch;
	            }
	        }
	        return {
	            type: Token.XJSText,
	            value: str,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanXJSStringLiteral() {
	        var innerToken, quote, start;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        innerToken = scanXJSText([quote]);

	        if (quote !== source[index]) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        ++index;

	        innerToken.range = [start, index];

	        return innerToken;
	    }

	    /**
	     * Between XJS opening and closing tags (e.g. <foo>HERE</foo>), anything that
	     * is not another XJS tag and is not an expression wrapped by {} is text.
	     */
	    function advanceXJSChild() {
	        var ch = source.charCodeAt(index);

	        // { (123) and < (60)
	        if (ch !== 123 && ch !== 60) {
	            return scanXJSText(['<', '{']);
	        }

	        return scanPunctuator();
	    }

	    function parseXJSIdentifier() {
	        var token, marker = markerCreate();

	        if (lookahead.type !== Token.XJSIdentifier) {
	            throwUnexpected(lookahead);
	        }

	        token = lex();
	        return markerApply(marker, delegate.createXJSIdentifier(token.value));
	    }

	    function parseXJSNamespacedName() {
	        var namespace, name, marker = markerCreate();

	        namespace = parseXJSIdentifier();
	        expect(':');
	        name = parseXJSIdentifier();

	        return markerApply(marker, delegate.createXJSNamespacedName(namespace, name));
	    }

	    function parseXJSMemberExpression() {
	        var marker = markerCreate(),
	            expr = parseXJSIdentifier();

	        while (match('.')) {
	            lex();
	            expr = markerApply(marker, delegate.createXJSMemberExpression(expr, parseXJSIdentifier()));
	        }

	        return expr;
	    }

	    function parseXJSElementName() {
	        if (lookahead2().value === ':') {
	            return parseXJSNamespacedName();
	        }
	        if (lookahead2().value === '.') {
	            return parseXJSMemberExpression();
	        }

	        return parseXJSIdentifier();
	    }

	    function parseXJSAttributeName() {
	        if (lookahead2().value === ':') {
	            return parseXJSNamespacedName();
	        }

	        return parseXJSIdentifier();
	    }

	    function parseXJSAttributeValue() {
	        var value, marker;
	        if (match('{')) {
	            value = parseXJSExpressionContainer();
	            if (value.expression.type === Syntax.XJSEmptyExpression) {
	                throwError(
	                    value,
	                    'XJS attributes must only be assigned a non-empty ' +
	                        'expression'
	                );
	            }
	        } else if (match('<')) {
	            value = parseXJSElement();
	        } else if (lookahead.type === Token.XJSText) {
	            marker = markerCreate();
	            value = markerApply(marker, delegate.createLiteral(lex()));
	        } else {
	            throwError({}, Messages.InvalidXJSAttributeValue);
	        }
	        return value;
	    }

	    function parseXJSEmptyExpression() {
	        var marker = markerCreatePreserveWhitespace();
	        while (source.charAt(index) !== '}') {
	            index++;
	        }
	        return markerApply(marker, delegate.createXJSEmptyExpression());
	    }

	    function parseXJSExpressionContainer() {
	        var expression, origInXJSChild, origInXJSTag, marker = markerCreate();

	        origInXJSChild = state.inXJSChild;
	        origInXJSTag = state.inXJSTag;
	        state.inXJSChild = false;
	        state.inXJSTag = false;

	        expect('{');

	        if (match('}')) {
	            expression = parseXJSEmptyExpression();
	        } else {
	            expression = parseExpression();
	        }

	        state.inXJSChild = origInXJSChild;
	        state.inXJSTag = origInXJSTag;

	        expect('}');

	        return markerApply(marker, delegate.createXJSExpressionContainer(expression));
	    }

	    function parseXJSSpreadAttribute() {
	        var expression, origInXJSChild, origInXJSTag, marker = markerCreate();

	        origInXJSChild = state.inXJSChild;
	        origInXJSTag = state.inXJSTag;
	        state.inXJSChild = false;
	        state.inXJSTag = false;

	        expect('{');
	        expect('...');

	        expression = parseAssignmentExpression();

	        state.inXJSChild = origInXJSChild;
	        state.inXJSTag = origInXJSTag;

	        expect('}');

	        return markerApply(marker, delegate.createXJSSpreadAttribute(expression));
	    }

	    function parseXJSAttribute() {
	        var name, marker;

	        if (match('{')) {
	            return parseXJSSpreadAttribute();
	        }

	        marker = markerCreate();

	        name = parseXJSAttributeName();

	        // HTML empty attribute
	        if (match('=')) {
	            lex();
	            return markerApply(marker, delegate.createXJSAttribute(name, parseXJSAttributeValue()));
	        }

	        return markerApply(marker, delegate.createXJSAttribute(name));
	    }

	    function parseXJSChild() {
	        var token, marker;
	        if (match('{')) {
	            token = parseXJSExpressionContainer();
	        } else if (lookahead.type === Token.XJSText) {
	            marker = markerCreatePreserveWhitespace();
	            token = markerApply(marker, delegate.createLiteral(lex()));
	        } else {
	            token = parseXJSElement();
	        }
	        return token;
	    }

	    function parseXJSClosingElement() {
	        var name, origInXJSChild, origInXJSTag, marker = markerCreate();
	        origInXJSChild = state.inXJSChild;
	        origInXJSTag = state.inXJSTag;
	        state.inXJSChild = false;
	        state.inXJSTag = true;
	        expect('<');
	        expect('/');
	        name = parseXJSElementName();
	        // Because advance() (called by lex() called by expect()) expects there
	        // to be a valid token after >, it needs to know whether to look for a
	        // standard JS token or an XJS text node
	        state.inXJSChild = origInXJSChild;
	        state.inXJSTag = origInXJSTag;
	        expect('>');
	        return markerApply(marker, delegate.createXJSClosingElement(name));
	    }

	    function parseXJSOpeningElement() {
	        var name, attribute, attributes = [], selfClosing = false, origInXJSChild, origInXJSTag, marker = markerCreate();

	        origInXJSChild = state.inXJSChild;
	        origInXJSTag = state.inXJSTag;
	        state.inXJSChild = false;
	        state.inXJSTag = true;

	        expect('<');

	        name = parseXJSElementName();

	        while (index < length &&
	                lookahead.value !== '/' &&
	                lookahead.value !== '>') {
	            attributes.push(parseXJSAttribute());
	        }

	        state.inXJSTag = origInXJSTag;

	        if (lookahead.value === '/') {
	            expect('/');
	            // Because advance() (called by lex() called by expect()) expects
	            // there to be a valid token after >, it needs to know whether to
	            // look for a standard JS token or an XJS text node
	            state.inXJSChild = origInXJSChild;
	            expect('>');
	            selfClosing = true;
	        } else {
	            state.inXJSChild = true;
	            expect('>');
	        }
	        return markerApply(marker, delegate.createXJSOpeningElement(name, attributes, selfClosing));
	    }

	    function parseXJSElement() {
	        var openingElement, closingElement = null, children = [], origInXJSChild, origInXJSTag, marker = markerCreate();

	        origInXJSChild = state.inXJSChild;
	        origInXJSTag = state.inXJSTag;
	        openingElement = parseXJSOpeningElement();

	        if (!openingElement.selfClosing) {
	            while (index < length) {
	                state.inXJSChild = false; // Call lookahead2() with inXJSChild = false because </ should not be considered in the child
	                if (lookahead.value === '<' && lookahead2().value === '/') {
	                    break;
	                }
	                state.inXJSChild = true;
	                children.push(parseXJSChild());
	            }
	            state.inXJSChild = origInXJSChild;
	            state.inXJSTag = origInXJSTag;
	            closingElement = parseXJSClosingElement();
	            if (getQualifiedXJSName(closingElement.name) !== getQualifiedXJSName(openingElement.name)) {
	                throwError({}, Messages.ExpectedXJSClosingTag, getQualifiedXJSName(openingElement.name));
	            }
	        }

	        // When (erroneously) writing two adjacent tags like
	        //
	        //     var x = <div>one</div><div>two</div>;
	        //
	        // the default error message is a bit incomprehensible. Since it's
	        // rarely (never?) useful to write a less-than sign after an XJS
	        // element, we disallow it here in the parser in order to provide a
	        // better error message. (In the rare case that the less-than operator
	        // was intended, the left tag can be wrapped in parentheses.)
	        if (!origInXJSChild && match('<')) {
	            throwError(lookahead, Messages.AdjacentXJSElements);
	        }

	        return markerApply(marker, delegate.createXJSElement(openingElement, closingElement, children));
	    }

	    function collectToken() {
	        var start, loc, token, range, value;

	        if (!state.inXJSChild) {
	            skipComment();
	        }

	        start = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        token = extra.advance();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (token.type !== Token.EOF) {
	            range = [token.range[0], token.range[1]];
	            value = source.slice(token.range[0], token.range[1]);
	            extra.tokens.push({
	                type: TokenName[token.type],
	                value: value,
	                range: range,
	                loc: loc
	            });
	        }

	        return token;
	    }

	    function collectRegex() {
	        var pos, loc, regex, token;

	        skipComment();

	        pos = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        regex = extra.scanRegExp();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (!extra.tokenize) {
	            // Pop the previous token, which is likely '/' or '/='
	            if (extra.tokens.length > 0) {
	                token = extra.tokens[extra.tokens.length - 1];
	                if (token.range[0] === pos && token.type === 'Punctuator') {
	                    if (token.value === '/' || token.value === '/=') {
	                        extra.tokens.pop();
	                    }
	                }
	            }

	            extra.tokens.push({
	                type: 'RegularExpression',
	                value: regex.literal,
	                range: [pos, index],
	                loc: loc
	            });
	        }

	        return regex;
	    }

	    function filterTokenLocation() {
	        var i, entry, token, tokens = [];

	        for (i = 0; i < extra.tokens.length; ++i) {
	            entry = extra.tokens[i];
	            token = {
	                type: entry.type,
	                value: entry.value
	            };
	            if (extra.range) {
	                token.range = entry.range;
	            }
	            if (extra.loc) {
	                token.loc = entry.loc;
	            }
	            tokens.push(token);
	        }

	        extra.tokens = tokens;
	    }

	    function patch() {
	        if (extra.comments) {
	            extra.skipComment = skipComment;
	            skipComment = scanComment;
	        }

	        if (typeof extra.tokens !== 'undefined') {
	            extra.advance = advance;
	            extra.scanRegExp = scanRegExp;

	            advance = collectToken;
	            scanRegExp = collectRegex;
	        }
	    }

	    function unpatch() {
	        if (typeof extra.skipComment === 'function') {
	            skipComment = extra.skipComment;
	        }

	        if (typeof extra.scanRegExp === 'function') {
	            advance = extra.advance;
	            scanRegExp = extra.scanRegExp;
	        }
	    }

	    // This is used to modify the delegate.

	    function extend(object, properties) {
	        var entry, result = {};

	        for (entry in object) {
	            if (object.hasOwnProperty(entry)) {
	                result[entry] = object[entry];
	            }
	        }

	        for (entry in properties) {
	            if (properties.hasOwnProperty(entry)) {
	                result[entry] = properties[entry];
	            }
	        }

	        return result;
	    }

	    function tokenize(code, options) {
	        var toString,
	            token,
	            tokens;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowKeyword: true,
	            allowIn: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1
	        };

	        extra = {};

	        // Options matching.
	        options = options || {};

	        // Of course we collect tokens here.
	        options.tokens = true;
	        extra.tokens = [];
	        extra.tokenize = true;
	        // The following two fields are necessary to compute the Regex tokens.
	        extra.openParenToken = -1;
	        extra.openCurlyToken = -1;

	        extra.range = (typeof options.range === 'boolean') && options.range;
	        extra.loc = (typeof options.loc === 'boolean') && options.loc;

	        if (typeof options.comment === 'boolean' && options.comment) {
	            extra.comments = [];
	        }
	        if (typeof options.tolerant === 'boolean' && options.tolerant) {
	            extra.errors = [];
	        }

	        if (length > 0) {
	            if (typeof source[0] === 'undefined') {
	                // Try first to convert to a string. This is good as fast path
	                // for old IE which understands string indexing for string
	                // literals only and not for string object.
	                if (code instanceof String) {
	                    source = code.valueOf();
	                }
	            }
	        }

	        patch();

	        try {
	            peek();
	            if (lookahead.type === Token.EOF) {
	                return extra.tokens;
	            }

	            token = lex();
	            while (lookahead.type !== Token.EOF) {
	                try {
	                    token = lex();
	                } catch (lexError) {
	                    token = lookahead;
	                    if (extra.errors) {
	                        extra.errors.push(lexError);
	                        // We have to break on the first error
	                        // to avoid infinite loops.
	                        break;
	                    } else {
	                        throw lexError;
	                    }
	                }
	            }

	            filterTokenLocation();
	            tokens = extra.tokens;
	            if (typeof extra.comments !== 'undefined') {
	                tokens.comments = extra.comments;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                tokens.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            unpatch();
	            extra = {};
	        }
	        return tokens;
	    }

	    function parse(code, options) {
	        var program, toString;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowKeyword: false,
	            allowIn: true,
	            labelSet: {},
	            parenthesizedCount: 0,
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            inXJSChild: false,
	            inXJSTag: false,
	            lastCommentStart: -1,
	            yieldAllowed: false
	        };

	        extra = {};
	        if (typeof options !== 'undefined') {
	            extra.range = (typeof options.range === 'boolean') && options.range;
	            extra.loc = (typeof options.loc === 'boolean') && options.loc;
	            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

	            if (extra.loc && options.source !== null && options.source !== undefined) {
	                delegate = extend(delegate, {
	                    'postProcess': function (node) {
	                        node.loc.source = toString(options.source);
	                        return node;
	                    }
	                });
	            }

	            if (typeof options.tokens === 'boolean' && options.tokens) {
	                extra.tokens = [];
	            }
	            if (typeof options.comment === 'boolean' && options.comment) {
	                extra.comments = [];
	            }
	            if (typeof options.tolerant === 'boolean' && options.tolerant) {
	                extra.errors = [];
	            }
	            if (extra.attachComment) {
	                extra.range = true;
	                extra.comments = [];
	                extra.bottomRightStack = [];
	                extra.trailingComments = [];
	                extra.leadingComments = [];
	            }
	        }

	        if (length > 0) {
	            if (typeof source[0] === 'undefined') {
	                // Try first to convert to a string. This is good as fast path
	                // for old IE which understands string indexing for string
	                // literals only and not for string object.
	                if (code instanceof String) {
	                    source = code.valueOf();
	                }
	            }
	        }

	        patch();
	        try {
	            program = parseProgram();
	            if (typeof extra.comments !== 'undefined') {
	                program.comments = extra.comments;
	            }
	            if (typeof extra.tokens !== 'undefined') {
	                filterTokenLocation();
	                program.tokens = extra.tokens;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                program.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            unpatch();
	            extra = {};
	        }

	        return program;
	    }

	    // Sync with *.json manifests.
	    exports.version = '6001.0001.0000-dev-harmony-fb';

	    exports.tokenize = tokenize;

	    exports.parse = parse;

	    // Deep copy.
	    exports.Syntax = (function () {
	        var name, types = {};

	        if (typeof Object.create === 'function') {
	            types = Object.create(null);
	        }

	        for (name in Syntax) {
	            if (Syntax.hasOwnProperty(name)) {
	                types[name] = Syntax[name];
	            }
	        }

	        if (typeof Object.freeze === 'function') {
	            Object.freeze(types);
	        }

	        return types;
	    }());

	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	var docblockRe = /^\s*(\/\*\*(.|\r?\n)*?\*\/)/;
	var ltrimRe = /^\s*/;
	/**
	 * @param {String} contents
	 * @return {String}
	 */
	function extract(contents) {
	  var match = contents.match(docblockRe);
	  if (match) {
	    return match[0].replace(ltrimRe, '') || '';
	  }
	  return '';
	}


	var commentStartRe = /^\/\*\*?/;
	var commentEndRe = /\*+\/$/;
	var wsRe = /[\t ]+/g;
	var stringStartRe = /(\r?\n|^) *\*/g;
	var multilineRe = /(?:^|\r?\n) *(@[^\r\n]*?) *\r?\n *([^@\r\n\s][^@\r\n]+?) *\r?\n/g;
	var propertyRe = /(?:^|\r?\n) *@(\S+) *([^\r\n]*)/g;

	/**
	 * @param {String} contents
	 * @return {Array}
	 */
	function parse(docblock) {
	  docblock = docblock
	    .replace(commentStartRe, '')
	    .replace(commentEndRe, '')
	    .replace(wsRe, ' ')
	    .replace(stringStartRe, '$1');

	  // Normalize multi-line directives
	  var prev = '';
	  while (prev != docblock) {
	    prev = docblock;
	    docblock = docblock.replace(multilineRe, "\n$1 $2\n");
	  }
	  docblock = docblock.trim();

	  var result = [];
	  var match;
	  while (match = propertyRe.exec(docblock)) {
	    result.push([match[1], match[2]]);
	  }

	  return result;
	}

	/**
	 * Same as parse but returns an object of prop: value instead of array of paris
	 * If a property appers more than once the last one will be returned
	 *
	 * @param {String} contents
	 * @return {Object}
	 */
	function parseAsObject(docblock) {
	  var pairs = parse(docblock);
	  var result = {};
	  for (var i = 0; i < pairs.length; i++) {
	    result[pairs[i][0]] = pairs[i][1];
	  }
	  return result;
	}


	exports.extract = extract;
	exports.parse = parse;
	exports.parseAsObject = parseAsObject;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var Base62 = (function (my) {
	  my.chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

	  my.encode = function(i){
	    if (i === 0) {return '0'}
	    var s = ''
	    while (i > 0) {
	      s = this.chars[i % 62] + s
	      i = Math.floor(i/62)
	    }
	    return s
	  };
	  my.decode = function(a,b,c,d){
	    for (
	      b = c = (
	        a === (/\W|_|^$/.test(a += "") || a)
	      ) - 1;
	      d = a.charCodeAt(c++);
	    )
	    b = b * 62 + d - [, 48, 29, 87][d >> 5];
	    return b
	  };

	  return my;
	}({}));

	module.exports = Base62

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(30).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(31).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(32).SourceNode;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64VLQ = __webpack_require__(33);
	  var util = __webpack_require__(34);
	  var ArraySet = __webpack_require__(35).ArraySet;

	  /**
	   * An instance of the SourceMapGenerator represents a source map which is
	   * being built incrementally. To create a new one, you must pass an object
	   * with the following properties:
	   *
	   *   - file: The filename of the generated source.
	   *   - sourceRoot: An optional root for all URLs in this source map.
	   */
	  function SourceMapGenerator(aArgs) {
	    this._file = util.getArg(aArgs, 'file');
	    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	    this._sources = new ArraySet();
	    this._names = new ArraySet();
	    this._mappings = [];
	    this._sourcesContents = null;
	  }

	  SourceMapGenerator.prototype._version = 3;

	  /**
	   * Creates a new SourceMapGenerator based on a SourceMapConsumer
	   *
	   * @param aSourceMapConsumer The SourceMap.
	   */
	  SourceMapGenerator.fromSourceMap =
	    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	      var sourceRoot = aSourceMapConsumer.sourceRoot;
	      var generator = new SourceMapGenerator({
	        file: aSourceMapConsumer.file,
	        sourceRoot: sourceRoot
	      });
	      aSourceMapConsumer.eachMapping(function (mapping) {
	        var newMapping = {
	          generated: {
	            line: mapping.generatedLine,
	            column: mapping.generatedColumn
	          }
	        };

	        if (mapping.source) {
	          newMapping.source = mapping.source;
	          if (sourceRoot) {
	            newMapping.source = util.relative(sourceRoot, newMapping.source);
	          }

	          newMapping.original = {
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          };

	          if (mapping.name) {
	            newMapping.name = mapping.name;
	          }
	        }

	        generator.addMapping(newMapping);
	      });
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          generator.setSourceContent(sourceFile, content);
	        }
	      });
	      return generator;
	    };

	  /**
	   * Add a single mapping from original source line and column to the generated
	   * source's line and column for this source map being created. The mapping
	   * object should have the following properties:
	   *
	   *   - generated: An object with the generated line and column positions.
	   *   - original: An object with the original line and column positions.
	   *   - source: The original source file (relative to the sourceRoot).
	   *   - name: An optional original token name for this mapping.
	   */
	  SourceMapGenerator.prototype.addMapping =
	    function SourceMapGenerator_addMapping(aArgs) {
	      var generated = util.getArg(aArgs, 'generated');
	      var original = util.getArg(aArgs, 'original', null);
	      var source = util.getArg(aArgs, 'source', null);
	      var name = util.getArg(aArgs, 'name', null);

	      this._validateMapping(generated, original, source, name);

	      if (source && !this._sources.has(source)) {
	        this._sources.add(source);
	      }

	      if (name && !this._names.has(name)) {
	        this._names.add(name);
	      }

	      this._mappings.push({
	        generatedLine: generated.line,
	        generatedColumn: generated.column,
	        originalLine: original != null && original.line,
	        originalColumn: original != null && original.column,
	        source: source,
	        name: name
	      });
	    };

	  /**
	   * Set the source content for a source file.
	   */
	  SourceMapGenerator.prototype.setSourceContent =
	    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	      var source = aSourceFile;
	      if (this._sourceRoot) {
	        source = util.relative(this._sourceRoot, source);
	      }

	      if (aSourceContent !== null) {
	        // Add the source content to the _sourcesContents map.
	        // Create a new _sourcesContents map if the property is null.
	        if (!this._sourcesContents) {
	          this._sourcesContents = {};
	        }
	        this._sourcesContents[util.toSetString(source)] = aSourceContent;
	      } else {
	        // Remove the source file from the _sourcesContents map.
	        // If the _sourcesContents map is empty, set the property to null.
	        delete this._sourcesContents[util.toSetString(source)];
	        if (Object.keys(this._sourcesContents).length === 0) {
	          this._sourcesContents = null;
	        }
	      }
	    };

	  /**
	   * Applies the mappings of a sub-source-map for a specific source file to the
	   * source map being generated. Each mapping to the supplied source file is
	   * rewritten using the supplied source map. Note: The resolution for the
	   * resulting mappings is the minimium of this map and the supplied map.
	   *
	   * @param aSourceMapConsumer The source map to be applied.
	   * @param aSourceFile Optional. The filename of the source file.
	   *        If omitted, SourceMapConsumer's file property will be used.
	   */
	  SourceMapGenerator.prototype.applySourceMap =
	    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile) {
	      // If aSourceFile is omitted, we will use the file property of the SourceMap
	      if (!aSourceFile) {
	        aSourceFile = aSourceMapConsumer.file;
	      }
	      var sourceRoot = this._sourceRoot;
	      // Make "aSourceFile" relative if an absolute Url is passed.
	      if (sourceRoot) {
	        aSourceFile = util.relative(sourceRoot, aSourceFile);
	      }
	      // Applying the SourceMap can add and remove items from the sources and
	      // the names array.
	      var newSources = new ArraySet();
	      var newNames = new ArraySet();

	      // Find mappings for the "aSourceFile"
	      this._mappings.forEach(function (mapping) {
	        if (mapping.source === aSourceFile && mapping.originalLine) {
	          // Check if it can be mapped by the source map, then update the mapping.
	          var original = aSourceMapConsumer.originalPositionFor({
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          });
	          if (original.source !== null) {
	            // Copy mapping
	            if (sourceRoot) {
	              mapping.source = util.relative(sourceRoot, original.source);
	            } else {
	              mapping.source = original.source;
	            }
	            mapping.originalLine = original.line;
	            mapping.originalColumn = original.column;
	            if (original.name !== null && mapping.name !== null) {
	              // Only use the identifier name if it's an identifier
	              // in both SourceMaps
	              mapping.name = original.name;
	            }
	          }
	        }

	        var source = mapping.source;
	        if (source && !newSources.has(source)) {
	          newSources.add(source);
	        }

	        var name = mapping.name;
	        if (name && !newNames.has(name)) {
	          newNames.add(name);
	        }

	      }, this);
	      this._sources = newSources;
	      this._names = newNames;

	      // Copy sourcesContents of applied map.
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          if (sourceRoot) {
	            sourceFile = util.relative(sourceRoot, sourceFile);
	          }
	          this.setSourceContent(sourceFile, content);
	        }
	      }, this);
	    };

	  /**
	   * A mapping can have one of the three levels of data:
	   *
	   *   1. Just the generated position.
	   *   2. The Generated position, original position, and original source.
	   *   3. Generated and original position, original source, as well as a name
	   *      token.
	   *
	   * To maintain consistency, we validate that any new mapping being added falls
	   * in to one of these categories.
	   */
	  SourceMapGenerator.prototype._validateMapping =
	    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                                aName) {
	      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	          && aGenerated.line > 0 && aGenerated.column >= 0
	          && !aOriginal && !aSource && !aName) {
	        // Case 1.
	        return;
	      }
	      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	               && aGenerated.line > 0 && aGenerated.column >= 0
	               && aOriginal.line > 0 && aOriginal.column >= 0
	               && aSource) {
	        // Cases 2 and 3.
	        return;
	      }
	      else {
	        throw new Error('Invalid mapping: ' + JSON.stringify({
	          generated: aGenerated,
	          source: aSource,
	          orginal: aOriginal,
	          name: aName
	        }));
	      }
	    };

	  /**
	   * Serialize the accumulated mappings in to the stream of base 64 VLQs
	   * specified by the source map format.
	   */
	  SourceMapGenerator.prototype._serializeMappings =
	    function SourceMapGenerator_serializeMappings() {
	      var previousGeneratedColumn = 0;
	      var previousGeneratedLine = 1;
	      var previousOriginalColumn = 0;
	      var previousOriginalLine = 0;
	      var previousName = 0;
	      var previousSource = 0;
	      var result = '';
	      var mapping;

	      // The mappings must be guaranteed to be in sorted order before we start
	      // serializing them or else the generated line numbers (which are defined
	      // via the ';' separators) will be all messed up. Note: it might be more
	      // performant to maintain the sorting as we insert them, rather than as we
	      // serialize them, but the big O is the same either way.
	      this._mappings.sort(util.compareByGeneratedPositions);

	      for (var i = 0, len = this._mappings.length; i < len; i++) {
	        mapping = this._mappings[i];

	        if (mapping.generatedLine !== previousGeneratedLine) {
	          previousGeneratedColumn = 0;
	          while (mapping.generatedLine !== previousGeneratedLine) {
	            result += ';';
	            previousGeneratedLine++;
	          }
	        }
	        else {
	          if (i > 0) {
	            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
	              continue;
	            }
	            result += ',';
	          }
	        }

	        result += base64VLQ.encode(mapping.generatedColumn
	                                   - previousGeneratedColumn);
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (mapping.source) {
	          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
	                                     - previousSource);
	          previousSource = this._sources.indexOf(mapping.source);

	          // lines are stored 0-based in SourceMap spec version 3
	          result += base64VLQ.encode(mapping.originalLine - 1
	                                     - previousOriginalLine);
	          previousOriginalLine = mapping.originalLine - 1;

	          result += base64VLQ.encode(mapping.originalColumn
	                                     - previousOriginalColumn);
	          previousOriginalColumn = mapping.originalColumn;

	          if (mapping.name) {
	            result += base64VLQ.encode(this._names.indexOf(mapping.name)
	                                       - previousName);
	            previousName = this._names.indexOf(mapping.name);
	          }
	        }
	      }

	      return result;
	    };

	  SourceMapGenerator.prototype._generateSourcesContent =
	    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	      return aSources.map(function (source) {
	        if (!this._sourcesContents) {
	          return null;
	        }
	        if (aSourceRoot) {
	          source = util.relative(aSourceRoot, source);
	        }
	        var key = util.toSetString(source);
	        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
	                                                    key)
	          ? this._sourcesContents[key]
	          : null;
	      }, this);
	    };

	  /**
	   * Externalize the source map.
	   */
	  SourceMapGenerator.prototype.toJSON =
	    function SourceMapGenerator_toJSON() {
	      var map = {
	        version: this._version,
	        file: this._file,
	        sources: this._sources.toArray(),
	        names: this._names.toArray(),
	        mappings: this._serializeMappings()
	      };
	      if (this._sourceRoot) {
	        map.sourceRoot = this._sourceRoot;
	      }
	      if (this._sourcesContents) {
	        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	      }

	      return map;
	    };

	  /**
	   * Render the source map being generated to a string.
	   */
	  SourceMapGenerator.prototype.toString =
	    function SourceMapGenerator_toString() {
	      return JSON.stringify(this);
	    };

	  exports.SourceMapGenerator = SourceMapGenerator;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(34);
	  var binarySearch = __webpack_require__(36);
	  var ArraySet = __webpack_require__(35).ArraySet;
	  var base64VLQ = __webpack_require__(33);

	  /**
	   * A SourceMapConsumer instance represents a parsed source map which we can
	   * query for information about the original file positions by giving it a file
	   * position in the generated source.
	   *
	   * The only parameter is the raw source map (either as a JSON string, or
	   * already parsed to an object). According to the spec, source maps have the
	   * following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - sources: An array of URLs to the original source files.
	   *   - names: An array of identifiers which can be referrenced by individual mappings.
	   *   - sourceRoot: Optional. The URL root from which all sources are relative.
	   *   - sourcesContent: Optional. An array of contents of the original source files.
	   *   - mappings: A string of base64 VLQs which contain the actual mappings.
	   *   - file: The generated file this source map is associated with.
	   *
	   * Here is an example source map, taken from the source map spec[0]:
	   *
	   *     {
	   *       version : 3,
	   *       file: "out.js",
	   *       sourceRoot : "",
	   *       sources: ["foo.js", "bar.js"],
	   *       names: ["src", "maps", "are", "fun"],
	   *       mappings: "AA,AB;;ABCDE;"
	   *     }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	   */
	  function SourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sources = util.getArg(sourceMap, 'sources');
	    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	    // requires the array) to play nice here.
	    var names = util.getArg(sourceMap, 'names', []);
	    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	    var mappings = util.getArg(sourceMap, 'mappings');
	    var file = util.getArg(sourceMap, 'file', null);

	    // Once again, Sass deviates from the spec and supplies the version as a
	    // string rather than a number, so we use loose equality checking here.
	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    // Pass `true` below to allow duplicate names and sources. While source maps
	    // are intended to be compressed and deduplicated, the TypeScript compiler
	    // sometimes generates source maps with duplicates in them. See Github issue
	    // #72 and bugzil.la/889492.
	    this._names = ArraySet.fromArray(names, true);
	    this._sources = ArraySet.fromArray(sources, true);

	    this.sourceRoot = sourceRoot;
	    this.sourcesContent = sourcesContent;
	    this._mappings = mappings;
	    this.file = file;
	  }

	  /**
	   * Create a SourceMapConsumer from a SourceMapGenerator.
	   *
	   * @param SourceMapGenerator aSourceMap
	   *        The source map that will be consumed.
	   * @returns SourceMapConsumer
	   */
	  SourceMapConsumer.fromSourceMap =
	    function SourceMapConsumer_fromSourceMap(aSourceMap) {
	      var smc = Object.create(SourceMapConsumer.prototype);

	      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	      smc.sourceRoot = aSourceMap._sourceRoot;
	      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                              smc.sourceRoot);
	      smc.file = aSourceMap._file;

	      smc.__generatedMappings = aSourceMap._mappings.slice()
	        .sort(util.compareByGeneratedPositions);
	      smc.__originalMappings = aSourceMap._mappings.slice()
	        .sort(util.compareByOriginalPositions);

	      return smc;
	    };

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  SourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      return this._sources.toArray().map(function (s) {
	        return this.sourceRoot ? util.join(this.sourceRoot, s) : s;
	      }, this);
	    }
	  });

	  // `__generatedMappings` and `__originalMappings` are arrays that hold the
	  // parsed mapping coordinates from the source map's "mappings" attribute. They
	  // are lazily instantiated, accessed via the `_generatedMappings` and
	  // `_originalMappings` getters respectively, and we only parse the mappings
	  // and create these arrays once queried for a source location. We jump through
	  // these hoops because there can be many thousands of mappings, and parsing
	  // them is expensive, so we only want to do it if we must.
	  //
	  // Each object in the arrays is of the form:
	  //
	  //     {
	  //       generatedLine: The line number in the generated code,
	  //       generatedColumn: The column number in the generated code,
	  //       source: The path to the original source file that generated this
	  //               chunk of code,
	  //       originalLine: The line number in the original source that
	  //                     corresponds to this chunk of generated code,
	  //       originalColumn: The column number in the original source that
	  //                       corresponds to this chunk of generated code,
	  //       name: The name of the original symbol which generated this chunk of
	  //             code.
	  //     }
	  //
	  // All properties except for `generatedLine` and `generatedColumn` can be
	  // `null`.
	  //
	  // `_generatedMappings` is ordered by the generated positions.
	  //
	  // `_originalMappings` is ordered by the original positions.

	  SourceMapConsumer.prototype.__generatedMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	    get: function () {
	      if (!this.__generatedMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__generatedMappings;
	    }
	  });

	  SourceMapConsumer.prototype.__originalMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	    get: function () {
	      if (!this.__originalMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__originalMappings;
	    }
	  });

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  SourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      var generatedLine = 1;
	      var previousGeneratedColumn = 0;
	      var previousOriginalLine = 0;
	      var previousOriginalColumn = 0;
	      var previousSource = 0;
	      var previousName = 0;
	      var mappingSeparator = /^[,;]/;
	      var str = aStr;
	      var mapping;
	      var temp;

	      while (str.length > 0) {
	        if (str.charAt(0) === ';') {
	          generatedLine++;
	          str = str.slice(1);
	          previousGeneratedColumn = 0;
	        }
	        else if (str.charAt(0) === ',') {
	          str = str.slice(1);
	        }
	        else {
	          mapping = {};
	          mapping.generatedLine = generatedLine;

	          // Generated column.
	          temp = base64VLQ.decode(str);
	          mapping.generatedColumn = previousGeneratedColumn + temp.value;
	          previousGeneratedColumn = mapping.generatedColumn;
	          str = temp.rest;

	          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
	            // Original source.
	            temp = base64VLQ.decode(str);
	            mapping.source = this._sources.at(previousSource + temp.value);
	            previousSource += temp.value;
	            str = temp.rest;
	            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
	              throw new Error('Found a source, but no line and column');
	            }

	            // Original line.
	            temp = base64VLQ.decode(str);
	            mapping.originalLine = previousOriginalLine + temp.value;
	            previousOriginalLine = mapping.originalLine;
	            // Lines are stored 0-based
	            mapping.originalLine += 1;
	            str = temp.rest;
	            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
	              throw new Error('Found a source and line, but no column');
	            }

	            // Original column.
	            temp = base64VLQ.decode(str);
	            mapping.originalColumn = previousOriginalColumn + temp.value;
	            previousOriginalColumn = mapping.originalColumn;
	            str = temp.rest;

	            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
	              // Original name.
	              temp = base64VLQ.decode(str);
	              mapping.name = this._names.at(previousName + temp.value);
	              previousName += temp.value;
	              str = temp.rest;
	            }
	          }

	          this.__generatedMappings.push(mapping);
	          if (typeof mapping.originalLine === 'number') {
	            this.__originalMappings.push(mapping);
	          }
	        }
	      }

	      this.__originalMappings.sort(util.compareByOriginalPositions);
	    };

	  /**
	   * Find the mapping that best matches the hypothetical "needle" mapping that
	   * we are searching for in the given "haystack" of mappings.
	   */
	  SourceMapConsumer.prototype._findMapping =
	    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                           aColumnName, aComparator) {
	      // To return the position we are searching for, we must first find the
	      // mapping for the given position and then return the opposite position it
	      // points to. Because the mappings are sorted, we can use binary search to
	      // find the best mapping.

	      if (aNeedle[aLineName] <= 0) {
	        throw new TypeError('Line must be greater than or equal to 1, got '
	                            + aNeedle[aLineName]);
	      }
	      if (aNeedle[aColumnName] < 0) {
	        throw new TypeError('Column must be greater than or equal to 0, got '
	                            + aNeedle[aColumnName]);
	      }

	      return binarySearch.search(aNeedle, aMappings, aComparator);
	    };

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  SourceMapConsumer.prototype.originalPositionFor =
	    function SourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      var mapping = this._findMapping(needle,
	                                      this._generatedMappings,
	                                      "generatedLine",
	                                      "generatedColumn",
	                                      util.compareByGeneratedPositions);

	      if (mapping) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source && this.sourceRoot) {
	          source = util.join(this.sourceRoot, source);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: util.getArg(mapping, 'name', null)
	        };
	      }

	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * availible.
	   */
	  SourceMapConsumer.prototype.sourceContentFor =
	    function SourceMapConsumer_sourceContentFor(aSource) {
	      if (!this.sourcesContent) {
	        return null;
	      }

	      if (this.sourceRoot) {
	        aSource = util.relative(this.sourceRoot, aSource);
	      }

	      if (this._sources.has(aSource)) {
	        return this.sourcesContent[this._sources.indexOf(aSource)];
	      }

	      var url;
	      if (this.sourceRoot
	          && (url = util.urlParse(this.sourceRoot))) {
	        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	        // many users. We can help them out when they expect file:// URIs to
	        // behave like it would if they were running a local HTTP server. See
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	        if (url.scheme == "file"
	            && this._sources.has(fileUriAbsPath)) {
	          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	        }

	        if ((!url.path || url.path == "/")
	            && this._sources.has("/" + aSource)) {
	          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	        }
	      }

	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.generatedPositionFor =
	    function SourceMapConsumer_generatedPositionFor(aArgs) {
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: util.getArg(aArgs, 'column')
	      };

	      if (this.sourceRoot) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var mapping = this._findMapping(needle,
	                                      this._originalMappings,
	                                      "originalLine",
	                                      "originalColumn",
	                                      util.compareByOriginalPositions);

	      if (mapping) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null)
	        };
	      }

	      return {
	        line: null,
	        column: null
	      };
	    };

	  SourceMapConsumer.GENERATED_ORDER = 1;
	  SourceMapConsumer.ORIGINAL_ORDER = 2;

	  /**
	   * Iterate over each mapping between an original source/line/column and a
	   * generated line/column in this source map.
	   *
	   * @param Function aCallback
	   *        The function that is called with each mapping.
	   * @param Object aContext
	   *        Optional. If specified, this object will be the value of `this` every
	   *        time that `aCallback` is called.
	   * @param aOrder
	   *        Either `SourceMapConsumer.GENERATED_ORDER` or
	   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	   *        iterate over the mappings sorted by the generated file's line/column
	   *        order or the original's source/line/column order, respectively. Defaults to
	   *        `SourceMapConsumer.GENERATED_ORDER`.
	   */
	  SourceMapConsumer.prototype.eachMapping =
	    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	      var context = aContext || null;
	      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	      var mappings;
	      switch (order) {
	      case SourceMapConsumer.GENERATED_ORDER:
	        mappings = this._generatedMappings;
	        break;
	      case SourceMapConsumer.ORIGINAL_ORDER:
	        mappings = this._originalMappings;
	        break;
	      default:
	        throw new Error("Unknown order of iteration.");
	      }

	      var sourceRoot = this.sourceRoot;
	      mappings.map(function (mapping) {
	        var source = mapping.source;
	        if (source && sourceRoot) {
	          source = util.join(sourceRoot, source);
	        }
	        return {
	          source: source,
	          generatedLine: mapping.generatedLine,
	          generatedColumn: mapping.generatedColumn,
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: mapping.name
	        };
	      }).forEach(aCallback, context);
	    };

	  exports.SourceMapConsumer = SourceMapConsumer;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var SourceMapGenerator = __webpack_require__(30).SourceMapGenerator;
	  var util = __webpack_require__(34);

	  /**
	   * SourceNodes provide a way to abstract over interpolating/concatenating
	   * snippets of generated JavaScript source code while maintaining the line and
	   * column information associated with the original source code.
	   *
	   * @param aLine The original line number.
	   * @param aColumn The original column number.
	   * @param aSource The original source's filename.
	   * @param aChunks Optional. An array of strings which are snippets of
	   *        generated JS, or other SourceNodes.
	   * @param aName The original identifier.
	   */
	  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	    this.children = [];
	    this.sourceContents = {};
	    this.line = aLine === undefined ? null : aLine;
	    this.column = aColumn === undefined ? null : aColumn;
	    this.source = aSource === undefined ? null : aSource;
	    this.name = aName === undefined ? null : aName;
	    if (aChunks != null) this.add(aChunks);
	  }

	  /**
	   * Creates a SourceNode from generated code and a SourceMapConsumer.
	   *
	   * @param aGeneratedCode The generated code
	   * @param aSourceMapConsumer The SourceMap for the generated code
	   */
	  SourceNode.fromStringWithSourceMap =
	    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer) {
	      // The SourceNode we want to fill with the generated code
	      // and the SourceMap
	      var node = new SourceNode();

	      // The generated code
	      // Processed fragments are removed from this array.
	      var remainingLines = aGeneratedCode.split('\n');

	      // We need to remember the position of "remainingLines"
	      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	      // The generate SourceNodes we need a code range.
	      // To extract it current and last mapping is used.
	      // Here we store the last mapping.
	      var lastMapping = null;

	      aSourceMapConsumer.eachMapping(function (mapping) {
	        if (lastMapping === null) {
	          // We add the generated code until the first mapping
	          // to the SourceNode without any mapping.
	          // Each line is added as separate string.
	          while (lastGeneratedLine < mapping.generatedLine) {
	            node.add(remainingLines.shift() + "\n");
	            lastGeneratedLine++;
	          }
	          if (lastGeneratedColumn < mapping.generatedColumn) {
	            var nextLine = remainingLines[0];
	            node.add(nextLine.substr(0, mapping.generatedColumn));
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	          }
	        } else {
	          // We add the code from "lastMapping" to "mapping":
	          // First check if there is a new line in between.
	          if (lastGeneratedLine < mapping.generatedLine) {
	            var code = "";
	            // Associate full lines with "lastMapping"
	            do {
	              code += remainingLines.shift() + "\n";
	              lastGeneratedLine++;
	              lastGeneratedColumn = 0;
	            } while (lastGeneratedLine < mapping.generatedLine);
	            // When we reached the correct line, we add code until we
	            // reach the correct column too.
	            if (lastGeneratedColumn < mapping.generatedColumn) {
	              var nextLine = remainingLines[0];
	              code += nextLine.substr(0, mapping.generatedColumn);
	              remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	              lastGeneratedColumn = mapping.generatedColumn;
	            }
	            // Create the SourceNode.
	            addMappingWithCode(lastMapping, code);
	          } else {
	            // There is no new line in between.
	            // Associate the code between "lastGeneratedColumn" and
	            // "mapping.generatedColumn" with "lastMapping"
	            var nextLine = remainingLines[0];
	            var code = nextLine.substr(0, mapping.generatedColumn -
	                                          lastGeneratedColumn);
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                                lastGeneratedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	            addMappingWithCode(lastMapping, code);
	          }
	        }
	        lastMapping = mapping;
	      }, this);
	      // We have processed all mappings.
	      // Associate the remaining code in the current line with "lastMapping"
	      // and add the remaining lines without any mapping
	      addMappingWithCode(lastMapping, remainingLines.join("\n"));

	      // Copy sourcesContent into SourceNode
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          node.setSourceContent(sourceFile, content);
	        }
	      });

	      return node;

	      function addMappingWithCode(mapping, code) {
	        if (mapping === null || mapping.source === undefined) {
	          node.add(code);
	        } else {
	          node.add(new SourceNode(mapping.originalLine,
	                                  mapping.originalColumn,
	                                  mapping.source,
	                                  code,
	                                  mapping.name));
	        }
	      }
	    };

	  /**
	   * Add a chunk of generated JS to this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.add = function SourceNode_add(aChunk) {
	    if (Array.isArray(aChunk)) {
	      aChunk.forEach(function (chunk) {
	        this.add(chunk);
	      }, this);
	    }
	    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
	      if (aChunk) {
	        this.children.push(aChunk);
	      }
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Add a chunk of generated JS to the beginning of this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	    if (Array.isArray(aChunk)) {
	      for (var i = aChunk.length-1; i >= 0; i--) {
	        this.prepend(aChunk[i]);
	      }
	    }
	    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
	      this.children.unshift(aChunk);
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Walk over the tree of JS snippets in this node and its children. The
	   * walking function is called once for each snippet of JS and is passed that
	   * snippet and the its original associated source's line/column location.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	    var chunk;
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      chunk = this.children[i];
	      if (chunk instanceof SourceNode) {
	        chunk.walk(aFn);
	      }
	      else {
	        if (chunk !== '') {
	          aFn(chunk, { source: this.source,
	                       line: this.line,
	                       column: this.column,
	                       name: this.name });
	        }
	      }
	    }
	  };

	  /**
	   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	   * each of `this.children`.
	   *
	   * @param aSep The separator.
	   */
	  SourceNode.prototype.join = function SourceNode_join(aSep) {
	    var newChildren;
	    var i;
	    var len = this.children.length;
	    if (len > 0) {
	      newChildren = [];
	      for (i = 0; i < len-1; i++) {
	        newChildren.push(this.children[i]);
	        newChildren.push(aSep);
	      }
	      newChildren.push(this.children[i]);
	      this.children = newChildren;
	    }
	    return this;
	  };

	  /**
	   * Call String.prototype.replace on the very right-most source snippet. Useful
	   * for trimming whitespace from the end of a source node, etc.
	   *
	   * @param aPattern The pattern to replace.
	   * @param aReplacement The thing to replace the pattern with.
	   */
	  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	    var lastChild = this.children[this.children.length - 1];
	    if (lastChild instanceof SourceNode) {
	      lastChild.replaceRight(aPattern, aReplacement);
	    }
	    else if (typeof lastChild === 'string') {
	      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	    }
	    else {
	      this.children.push(''.replace(aPattern, aReplacement));
	    }
	    return this;
	  };

	  /**
	   * Set the source content for a source file. This will be added to the SourceMapGenerator
	   * in the sourcesContent field.
	   *
	   * @param aSourceFile The filename of the source file
	   * @param aSourceContent The content of the source file
	   */
	  SourceNode.prototype.setSourceContent =
	    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	    };

	  /**
	   * Walk over the tree of SourceNodes. The walking function is called for each
	   * source file content and is passed the filename and source content.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walkSourceContents =
	    function SourceNode_walkSourceContents(aFn) {
	      for (var i = 0, len = this.children.length; i < len; i++) {
	        if (this.children[i] instanceof SourceNode) {
	          this.children[i].walkSourceContents(aFn);
	        }
	      }

	      var sources = Object.keys(this.sourceContents);
	      for (var i = 0, len = sources.length; i < len; i++) {
	        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	      }
	    };

	  /**
	   * Return the string representation of this source node. Walks over the tree
	   * and concatenates all the various snippets together to one string.
	   */
	  SourceNode.prototype.toString = function SourceNode_toString() {
	    var str = "";
	    this.walk(function (chunk) {
	      str += chunk;
	    });
	    return str;
	  };

	  /**
	   * Returns the string representation of this source node along with a source
	   * map.
	   */
	  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	    var generated = {
	      code: "",
	      line: 1,
	      column: 0
	    };
	    var map = new SourceMapGenerator(aArgs);
	    var sourceMappingActive = false;
	    var lastOriginalSource = null;
	    var lastOriginalLine = null;
	    var lastOriginalColumn = null;
	    var lastOriginalName = null;
	    this.walk(function (chunk, original) {
	      generated.code += chunk;
	      if (original.source !== null
	          && original.line !== null
	          && original.column !== null) {
	        if(lastOriginalSource !== original.source
	           || lastOriginalLine !== original.line
	           || lastOriginalColumn !== original.column
	           || lastOriginalName !== original.name) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	        lastOriginalSource = original.source;
	        lastOriginalLine = original.line;
	        lastOriginalColumn = original.column;
	        lastOriginalName = original.name;
	        sourceMappingActive = true;
	      } else if (sourceMappingActive) {
	        map.addMapping({
	          generated: {
	            line: generated.line,
	            column: generated.column
	          }
	        });
	        lastOriginalSource = null;
	        sourceMappingActive = false;
	      }
	      chunk.split('').forEach(function (ch) {
	        if (ch === '\n') {
	          generated.line++;
	          generated.column = 0;
	        } else {
	          generated.column++;
	        }
	      });
	    });
	    this.walkSourceContents(function (sourceFile, sourceContent) {
	      map.setSourceContent(sourceFile, sourceContent);
	    });

	    return { code: generated.code, map: map };
	  };

	  exports.SourceNode = SourceNode;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64 = __webpack_require__(37);

	  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
	  // length quantities we use in the source map spec, the first bit is the sign,
	  // the next four bits are the actual value, and the 6th bit is the
	  // continuation bit. The continuation bit tells us whether there are more
	  // digits in this value following this digit.
	  //
	  //   Continuation
	  //   |    Sign
	  //   |    |
	  //   V    V
	  //   101011

	  var VLQ_BASE_SHIFT = 5;

	  // binary: 100000
	  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	  // binary: 011111
	  var VLQ_BASE_MASK = VLQ_BASE - 1;

	  // binary: 100000
	  var VLQ_CONTINUATION_BIT = VLQ_BASE;

	  /**
	   * Converts from a two-complement value to a value where the sign bit is
	   * is placed in the least significant bit.  For example, as decimals:
	   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	   */
	  function toVLQSigned(aValue) {
	    return aValue < 0
	      ? ((-aValue) << 1) + 1
	      : (aValue << 1) + 0;
	  }

	  /**
	   * Converts to a two-complement value from a value where the sign bit is
	   * is placed in the least significant bit.  For example, as decimals:
	   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	   */
	  function fromVLQSigned(aValue) {
	    var isNegative = (aValue & 1) === 1;
	    var shifted = aValue >> 1;
	    return isNegative
	      ? -shifted
	      : shifted;
	  }

	  /**
	   * Returns the base 64 VLQ encoded value.
	   */
	  exports.encode = function base64VLQ_encode(aValue) {
	    var encoded = "";
	    var digit;

	    var vlq = toVLQSigned(aValue);

	    do {
	      digit = vlq & VLQ_BASE_MASK;
	      vlq >>>= VLQ_BASE_SHIFT;
	      if (vlq > 0) {
	        // There are still more digits in this value, so we must make sure the
	        // continuation bit is marked.
	        digit |= VLQ_CONTINUATION_BIT;
	      }
	      encoded += base64.encode(digit);
	    } while (vlq > 0);

	    return encoded;
	  };

	  /**
	   * Decodes the next base 64 VLQ value from the given string and returns the
	   * value and the rest of the string.
	   */
	  exports.decode = function base64VLQ_decode(aStr) {
	    var i = 0;
	    var strLen = aStr.length;
	    var result = 0;
	    var shift = 0;
	    var continuation, digit;

	    do {
	      if (i >= strLen) {
	        throw new Error("Expected more digits in base 64 VLQ value.");
	      }
	      digit = base64.decode(aStr.charAt(i++));
	      continuation = !!(digit & VLQ_CONTINUATION_BIT);
	      digit &= VLQ_BASE_MASK;
	      result = result + (digit << shift);
	      shift += VLQ_BASE_SHIFT;
	    } while (continuation);

	    return {
	      value: fromVLQSigned(result),
	      rest: aStr.slice(i)
	    };
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * This is a helper function for getting values from parameter/options
	   * objects.
	   *
	   * @param args The object we are extracting values from
	   * @param name The name of the property we are getting.
	   * @param defaultValue An optional value to return if the property is missing
	   * from the object. If this is not specified and the property is missing, an
	   * error will be thrown.
	   */
	  function getArg(aArgs, aName, aDefaultValue) {
	    if (aName in aArgs) {
	      return aArgs[aName];
	    } else if (arguments.length === 3) {
	      return aDefaultValue;
	    } else {
	      throw new Error('"' + aName + '" is a required argument.');
	    }
	  }
	  exports.getArg = getArg;

	  var urlRegexp = /([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/;
	  var dataUrlRegexp = /^data:.+\,.+/;

	  function urlParse(aUrl) {
	    var match = aUrl.match(urlRegexp);
	    if (!match) {
	      return null;
	    }
	    return {
	      scheme: match[1],
	      auth: match[3],
	      host: match[4],
	      port: match[6],
	      path: match[7]
	    };
	  }
	  exports.urlParse = urlParse;

	  function urlGenerate(aParsedUrl) {
	    var url = aParsedUrl.scheme + "://";
	    if (aParsedUrl.auth) {
	      url += aParsedUrl.auth + "@"
	    }
	    if (aParsedUrl.host) {
	      url += aParsedUrl.host;
	    }
	    if (aParsedUrl.port) {
	      url += ":" + aParsedUrl.port
	    }
	    if (aParsedUrl.path) {
	      url += aParsedUrl.path;
	    }
	    return url;
	  }
	  exports.urlGenerate = urlGenerate;

	  function join(aRoot, aPath) {
	    var url;

	    if (aPath.match(urlRegexp) || aPath.match(dataUrlRegexp)) {
	      return aPath;
	    }

	    if (aPath.charAt(0) === '/' && (url = urlParse(aRoot))) {
	      url.path = aPath;
	      return urlGenerate(url);
	    }

	    return aRoot.replace(/\/$/, '') + '/' + aPath;
	  }
	  exports.join = join;

	  /**
	   * Because behavior goes wacky when you set `__proto__` on objects, we
	   * have to prefix all the strings in our set with an arbitrary character.
	   *
	   * See https://github.com/mozilla/source-map/pull/31 and
	   * https://github.com/mozilla/source-map/issues/30
	   *
	   * @param String aStr
	   */
	  function toSetString(aStr) {
	    return '$' + aStr;
	  }
	  exports.toSetString = toSetString;

	  function fromSetString(aStr) {
	    return aStr.substr(1);
	  }
	  exports.fromSetString = fromSetString;

	  function relative(aRoot, aPath) {
	    aRoot = aRoot.replace(/\/$/, '');

	    var url = urlParse(aRoot);
	    if (aPath.charAt(0) == "/" && url && url.path == "/") {
	      return aPath.slice(1);
	    }

	    return aPath.indexOf(aRoot + '/') === 0
	      ? aPath.substr(aRoot.length + 1)
	      : aPath;
	  }
	  exports.relative = relative;

	  function strcmp(aStr1, aStr2) {
	    var s1 = aStr1 || "";
	    var s2 = aStr2 || "";
	    return (s1 > s2) - (s1 < s2);
	  }

	  /**
	   * Comparator between two mappings where the original positions are compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same original source/line/column, but different generated
	   * line and column the same. Useful when searching for a mapping with a
	   * stubbed out mapping.
	   */
	  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	    var cmp;

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp || onlyCompareOriginal) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.name, mappingB.name);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    return mappingA.generatedColumn - mappingB.generatedColumn;
	  };
	  exports.compareByOriginalPositions = compareByOriginalPositions;

	  /**
	   * Comparator between two mappings where the generated positions are
	   * compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same generated line and column, but different
	   * source/name/original line and column the same. Useful when searching for a
	   * mapping with a stubbed out mapping.
	   */
	  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
	    var cmp;

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	    if (cmp || onlyCompareGenerated) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp) {
	      return cmp;
	    }

	    return strcmp(mappingA.name, mappingB.name);
	  };
	  exports.compareByGeneratedPositions = compareByGeneratedPositions;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(34);

	  /**
	   * A data structure which is a combination of an array and a set. Adding a new
	   * member is O(1), testing for membership is O(1), and finding the index of an
	   * element is O(1). Removing elements from the set is not supported. Only
	   * strings are supported for membership.
	   */
	  function ArraySet() {
	    this._array = [];
	    this._set = {};
	  }

	  /**
	   * Static method for creating ArraySet instances from an existing array.
	   */
	  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	    var set = new ArraySet();
	    for (var i = 0, len = aArray.length; i < len; i++) {
	      set.add(aArray[i], aAllowDuplicates);
	    }
	    return set;
	  };

	  /**
	   * Add the given string to this set.
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	    var isDuplicate = this.has(aStr);
	    var idx = this._array.length;
	    if (!isDuplicate || aAllowDuplicates) {
	      this._array.push(aStr);
	    }
	    if (!isDuplicate) {
	      this._set[util.toSetString(aStr)] = idx;
	    }
	  };

	  /**
	   * Is the given string a member of this set?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.has = function ArraySet_has(aStr) {
	    return Object.prototype.hasOwnProperty.call(this._set,
	                                                util.toSetString(aStr));
	  };

	  /**
	   * What is the index of the given string in the array?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	    if (this.has(aStr)) {
	      return this._set[util.toSetString(aStr)];
	    }
	    throw new Error('"' + aStr + '" is not in the set.');
	  };

	  /**
	   * What is the element at the given index?
	   *
	   * @param Number aIdx
	   */
	  ArraySet.prototype.at = function ArraySet_at(aIdx) {
	    if (aIdx >= 0 && aIdx < this._array.length) {
	      return this._array[aIdx];
	    }
	    throw new Error('No element indexed by ' + aIdx);
	  };

	  /**
	   * Returns the array representation of this set (which has the proper indices
	   * indicated by indexOf). Note that this is a copy of the internal array used
	   * for storing the members so that no one can mess with internal state.
	   */
	  ArraySet.prototype.toArray = function ArraySet_toArray() {
	    return this._array.slice();
	  };

	  exports.ArraySet = ArraySet;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * Recursive implementation of binary search.
	   *
	   * @param aLow Indices here and lower do not contain the needle.
	   * @param aHigh Indices here and higher do not contain the needle.
	   * @param aNeedle The element being searched for.
	   * @param aHaystack The non-empty array being searched.
	   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	   */
	  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
	    // This function terminates when one of the following is true:
	    //
	    //   1. We find the exact element we are looking for.
	    //
	    //   2. We did not find the exact element, but we can return the next
	    //      closest element that is less than that element.
	    //
	    //   3. We did not find the exact element, and there is no next-closest
	    //      element which is less than the one we are searching for, so we
	    //      return null.
	    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	    var cmp = aCompare(aNeedle, aHaystack[mid], true);
	    if (cmp === 0) {
	      // Found the element we are looking for.
	      return aHaystack[mid];
	    }
	    else if (cmp > 0) {
	      // aHaystack[mid] is greater than our needle.
	      if (aHigh - mid > 1) {
	        // The element is in the upper half.
	        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
	      }
	      // We did not find an exact match, return the next closest one
	      // (termination case 2).
	      return aHaystack[mid];
	    }
	    else {
	      // aHaystack[mid] is less than our needle.
	      if (mid - aLow > 1) {
	        // The element is in the lower half.
	        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
	      }
	      // The exact needle element was not found in this haystack. Determine if
	      // we are in termination case (2) or (3) and return the appropriate thing.
	      return aLow < 0
	        ? null
	        : aHaystack[aLow];
	    }
	  }

	  /**
	   * This is an implementation of binary search which will always try and return
	   * the next lowest value checked if there is no exact hit. This is because
	   * mappings between original and generated line/col pairs are single points,
	   * and there is an implicit region between each of them, so a miss just means
	   * that you aren't on the very start of a region.
	   *
	   * @param aNeedle The element you are looking for.
	   * @param aHaystack The array that is being searched.
	   * @param aCompare A function which takes the needle and an element in the
	   *     array and returns -1, 0, or 1 depending on whether the needle is less
	   *     than, equal to, or greater than the element, respectively.
	   */
	  exports.search = function search(aNeedle, aHaystack, aCompare) {
	    return aHaystack.length > 0
	      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
	      : null;
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var charToIntMap = {};
	  var intToCharMap = {};

	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    .split('')
	    .forEach(function (ch, index) {
	      charToIntMap[ch] = index;
	      intToCharMap[index] = ch;
	    });

	  /**
	   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	   */
	  exports.encode = function base64_encode(aNumber) {
	    if (aNumber in intToCharMap) {
	      return intToCharMap[aNumber];
	    }
	    throw new TypeError("Must be between 0 and 63: " + aNumber);
	  };

	  /**
	   * Decode a single base 64 digit to an integer.
	   */
	  exports.decode = function base64_decode(aChar) {
	    if (aChar in charToIntMap) {
	      return charToIntMap[aChar];
	    }
	    throw new TypeError("Not a valid base 64 digit: " + aChar);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])