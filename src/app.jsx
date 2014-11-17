/* jshint ignore:start */
import {assign} from 'Object.assign'; 
import * as React from 'react';
/* jshint ignore:end */
/* global CodeMirror, to5, React */

var value = 
`/** This is a playground, have fun! */
var React = window.React;

var Component = React.createClass({
  render() {
    return (
      <h1>Hello world!</h1>
    );
  }
});


var mount = document.getElementById('mount');
React.render(<Component />, mount);
`;

class Editor {
  constructor(node, props = {}) {
    var defaults = {
      value: value.replace('__HUA', 'React'),
      autofocus: true,
      mode: 'javascript',
      theme: 'neo',
      smartIndent: false,
      electricChars: false,
      lineNumbers: true,
      workTime: 10,
      tabSize: 2
    };

    window.to5 = to5;
    window.React = React;
    
    node.innerHTML = '';

    props = Object.assign(defaults, props);
    
    this._compileTimeout = 30;

    this._editor = CodeMirror(node, props);

    this._editor.on('change', this.handleChange.bind(this));
  }

  handleCompile(change) {
    var code = to5(change.getValue()).code;
   
    eval(code); //jshint ignore:line
  }

  handleChange(change) {
    clearTimeout(this._compile);
    var compile = this.handleCompile.bind(this, change);
    this._compile = setTimeout(compile, this._compileTimeout);
  }
}

new Editor(document.getElementById('code')); //jshint ignore:line 
