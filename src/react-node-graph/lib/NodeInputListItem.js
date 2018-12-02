import React from 'react';

export default class NodeInputListItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hover: false
		}
	}

	onMouseUp(e) {
		e.stopPropagation();
  		e.preventDefault();

		this.props.onMouseUp(this.props.index);
	}

  onMouseOver() {
		this.setState({hover: true});
	}

	onMouseOut() {
    this.setState({hover: false});
  }

	noop(e) {
		e.stopPropagation();
  		e.preventDefault();
	}

	render() {
		return (
                <div className="circle circle-right"
					 onClick={(e)=>this.noop(e)}
					 onMouseUp={(e)=>this.onMouseUp(e)}
					 onMouseOver={() => {this.onMouseOver()}}
					 onMouseOut={() => {this.onMouseOut()}}
					/>

		);
	}
}
