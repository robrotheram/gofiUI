import React from 'react';

import NodeInputListItem from './NodeInputListItem';

export default class NodeInputList extends React.Component {

	onMouseUp(i) {
		this.props.onCompleteConnector(i);
	}

	render() {
		let i = 0;

		return (
			<div>
                <NodeInputListItem onMouseUp={(i)=>this.onMouseUp(i)} key={i} index={i++} />
					{/*{this.props.items.map((item) => {*/}
						{/*return (*/}
							{/*<NodeInputListItem onMouseUp={(i)=>this.onMouseUp(i)} key={i} index={i++} item={item} />*/}
						{/*)*/}
					{/*})}*/}

			</div>
		);
	}
}
