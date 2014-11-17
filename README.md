#React JS Playground
Starter for beginners exploring React JS. Compiles JSX realtime. Feel free to use ES6 (to the capabilities of 6to5).

###Get started today exploring React. Copy and paste any of the examples in the editor, or make your own creation. It’s fun:

__ES6 Flavor with Object literals__
```javascript
var React = window.React;

var Component = React.createClass({
	render() {
		return (
			<h1>Hello World</h1>
		);
	}
});

var mount = document.getElementById(‘mount’);
React.renderComponent(<Component />, mount);
```

__Canvas with React JS__
```javascript
var React = window.React;

var Canvas = React.createClass({
  propTypes: {
    fill: React.PropTypes.string,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  },

  getDefaultProps() {
    return {
      fill: '#3AF'
    }
  },

  componentWillMount() {
    [this.width, this.height] = [this.props.width, this.props.height];
    var pixelRatio = window.devicePixelRatio || window.webkitDevicePixelRatio;
    this.dpx = isFinite(pixelRatio) && pixelRatio > 1 ? pixelRatio : 1;
  },
  
  componentDidMount() {
    var context = this.getDOMNode().getContext('2d');
    var {width, height} =
      this.getDOMNode().parentElement.getBoundingClientRect();  
    this.width = width;
    this.height = height;

    this.paint(context, [0, 0, width, height]);
  },

  paint(context, data) {
    var dpx = this.dpx;
    var [x, y, w, h] = data.map(n => n * dpx);
    context.fillStyle = this.props.fill;
    context.fillRect(x, y, w, h);
  },
  
  render() {
    var [x, width, height] = [this.dpx, this.props.width, this.props.height];

    return (
      <canvas width={width * x} height={height * x} style={{width, height}} />
    );
  }
});

var mount = document.getElementById('mount');
React.render(<Canvas width={300} height={300} />, mount);
```

__Creepy Eye Ball__
```javascript
var React = window.React;

var EyeBall = React.createClass({
	
	getDefaultProps() {
		return {
			width: 300,
			height: 300,
			pupilWidth: 40,
			pupilHeight: 40
		}
	},

	getInitialState() {
		return {
			xOffset: ( this.props.width / 2 ) - ( this.props.pupilWidth / 2 )
		}
	},
	
	handleMouseMovement(e) {
		var x = e.pageX - e.target.offsetLeft;
	
		this.setState({ xOffset: x });
	},
	
	render() {
		var style = {
			width: this.props.width,
			height: this.props.height,
			borderRadius: '50%',
			background: 'white',
			boxShadow: 'inset 0 0 50px rgba(0, 0, 0, .1)',
			position: 'relative'
		};
		
		var pupil = {
			width: this.props.pupilWidth,
			height: this.props.pupilHeight,
			borderRadius: '50%',
			background: 'black',
			MsTransform: 'translateY(-50%)',
			WebkitTransform: 'translateY(-50%)',
      transform: 'translateY(-50%)',
      position: 'relative',
      top: '50%',
			left: this.state.xOffset
		};
		
		return (
			<div onMouseMove={this.handleMouseMovement} style={style}>
				<div style={pupil}></div>
			</div>
		);
	}
});

var mount = document.getElementById('mount');
React.render(<EyeBall />, mount);
```

##Getting started
* Download or clone the repo
* Navigate to the repo in the command line (cd FOLDER_LOCATION/react-playground)
* Run `npm install`
* Run `node server.js`
* Go to http://localhost:8858 for the fun

###License
MIT

###Contributing 
Feel free to contribute, but follow the guidelines:

####Prerequisites
* Be familiar with `node` and `npm`
* Use JSHint
* I don't care about tests with this repo, however document new features

####Code
* 80 characters maximum per line
* Indent using 2 spaces
* Semicolons; Always;
* "use strict"; //Note that 6to5 automatically adds this for each file
* ES6 preferred

####Docs
* Don't wrap lines at 80 chars
