import React from 'react';

export default class NodeOutputListItem extends React.Component {

	onMouseDown(e) {
		e.stopPropagation();
  		e.preventDefault();

		this.props.onMouseDown(this.props.index);
	}

	noop(e) {
		e.stopPropagation();
  		e.preventDefault();
	}

	render() {
		return (
			<div className="circle circle-left" onMouseDown={(e)=>this.onMouseDown(e)} onClick={(e)=>this.noop(e)}>
			</div>
		);
	}
}
