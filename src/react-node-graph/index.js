import React from "react";
import Node from "./lib/Node";
import Spline from "./lib/Spline";
import SVGComponent from "./lib/SVGComponent";

import { computeOutOffsetByIndex, computeInOffsetByIndex } from "./lib/util";



export default class index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      source: [],
      dragging: false,
      showModal:false
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data});
  }

  onMouseUp(e) {
    this.setState({ dragging: false });
  }

  onMouseMove(e) {
    e.stopPropagation();
    e.preventDefault();

    const { svgComponent: { refs: { svg } } } = this.refs;

    //Get svg element position to substract offset top and left
    const svgRect = svg.getBoundingClientRect();

    if(svgRect.top >0){
        this.setState({
            mousePos: {
                x: e.pageX - svgRect.left,
                y: e.pageY - svgRect.top,
            }
        });
    } else {
        this.setState({
            mousePos: {
                x: e.pageX - svgRect.left,
                y: e.pageY - 15
            }
        });
    }

  }

  handleNodeStart(nid) {
    this.props.onNodeStartMove(nid);
  }

  handleNodeStop(nid, pos) {
    this.props.onNodeMove(nid, pos);
  }

  calculateHeight(nodes){
    let h =  Math.max.apply(Math, nodes.map(function(o) { return o.meta.y; }))+250;
    return h+"px"
  }

  calculateWidth(nodes){
        let h =  Math.max.apply(Math, nodes.map(function(o) { return o.meta.x; }))+300;
        if(h > document.body.clientWidth){
            return h+"px"
        }
        return "100%"

    }
  handleNodeMove(index, pos) {
    let d = this.state.data;

    d.nodes[index].meta.x = pos.x;
    d.nodes[index].meta.y = pos.y;


    // this.setState({
    //     data: d
    // });


  }

  handleStartConnector(nid, outputIndex) {
    this.setState({ dragging: true, source: [nid, outputIndex] });
  }

  handleCompleteConnector(nid, inputIndex) {
    if (this.state.dragging) {
      let nodes = this.state.data.nodes;
      let fromNode = this.getNodebyId(nodes, this.state.source[0]);
      let toNode = this.getNodebyId(nodes, nid);

      this.props.onNewConnector(fromNode.id, toNode.id);
    }
    this.setState({ dragging: false });
  }

  handleRemoveConnector(connector) {
    if (this.props.onRemoveConnector) {
      this.props.onRemoveConnector(connector);
    }
  }

  handleNodeSelect(nid) {
    if (this.props.onNodeSelect) {
      this.props.onNodeSelect(nid);
    }
  }

  handleNodeDeselect(nid) {
    if (this.props.onNodeDeselect) {
      this.props.onNodeDeselect(nid);
    }
  }

  computePinIndexfromLabel(pins, pinLabel) {
    let reval = 0;

    for (let pin of pins) {
      if (pin.name === pinLabel) {
        return reval;
      } else {
        reval++;
      }
    }
  }

  getNodebyId(nodes, nid) {
    let reval = 0;

    for (let node of nodes) {
      if (node.id === nid) {
        return nodes[reval];
      } else {
        reval++;
      }
    }
  }

  _closeModal = ()  => {
      this.setState({ showModal: false });
  };

  _showModal = ()  => {
      this.setState({ showModal: true });
  };

  render() {
    let { data, mousePos, dragging } = this.state;
    let { grid } = this.props;

    let connectors = data.connections;

    let nodes = data.nodes;
    let newConnector = null;
    let height = this.calculateHeight(nodes);
    let width = this.calculateWidth(nodes);

    if (dragging) {

      let sourceNode = this.getNodebyId(nodes, this.state.source[0]);
      let connectorStart = computeOutOffsetByIndex(
        sourceNode.meta.x,
        sourceNode.meta.y,
        3
        //sourceNode.list.length
      );
      const { svgComponent: { refs: { svg } } } = this.refs;
      const svgRect = svg.getBoundingClientRect();
      let connectorEnd = { x: this.state.mousePos.x, y: this.state.mousePos.y - svgRect.top };

        console.log()
      newConnector = <Spline start={connectorStart} end={connectorEnd} />;
    }

    let splineIndex = 0;
    return (
      <div id="test" className={dragging ? "dragging" : ""}>
        {nodes.map((node, i) => {
          return (
            <Node
              key={node.id}
              index={i}
              nid={node.id}
              title={node.type}
             // inputs={node.fields.in}
             // outputs={node.fields.out}
              meta={node.params}
              status={node.status}
              grid={grid}
              pos={{ x: node.meta.x, y: node.meta.y }}
              onNodeStart={nid => this.handleNodeStart(nid)}
              onNodeStop={(nid, pos) => this.handleNodeStop(nid, pos)}
              onNodeMove={(index, pos) => this.handleNodeMove(index, pos)}
              onStartConnector={(nid, outputIndex) => this.handleStartConnector(nid, outputIndex)}
              onCompleteConnector={(nid, inputIndex) =>
                this.handleCompleteConnector(nid, inputIndex)
              }
              onNodeSelect={nid => {
                this.handleNodeSelect(nid);
              }}
              onNodeDeselect={nid => {
                this.handleNodeDeselect(nid);
              }}
            />
          );
        })}

        {/* render our connectors */}

        <SVGComponent height={height} width={width} ref="svgComponent">
          {connectors.map(connector => {
            let fromNode = this.getNodebyId(nodes, connector.input_node);
            let toNode = this.getNodebyId(nodes, connector.output_node);


            if(toNode === undefined || fromNode === undefined){
              return (<div key={connector.nid}/>);
            }

            let splinestart = computeOutOffsetByIndex(
              fromNode.meta.x,
              fromNode.meta.y,
              3
              //fromNode.list.length
              //this.computePinIndexfromLabel(fromNode.fields.in, connector.output_node)
            );
            let splineend = computeInOffsetByIndex(
              toNode.meta.x,
              toNode.meta.y, 3
              //toNode.list.length
              //this.computePinIndexfromLabel(toNode.fields.in, connector.input_node)
            );
            //console.log(splinestart, splineend)
            return (
              <Spline
                start={splinestart}
                end={splineend}
                height={height}
                key={splineIndex++}
                mousePos={mousePos}
                onRemove={() => {
                  this.handleRemoveConnector(connector);
                }}
              />
            );
          })}

          {/* this is our new connector that only appears on dragging */}
          {newConnector}
        </SVGComponent>
      </div>
    );
  }
}
