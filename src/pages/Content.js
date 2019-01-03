import React from 'react';
import { identity} from '../utils';
import { menuItems as defaultMenuItems, farMenuItems as defaultFarMenuItems } from '../components/items.js';
import ReactNodeGraph from "../react-node-graph";
import ReactJson from 'react-json-view'
import Controls from "../components/Controls";
import {Gofi} from "../utils/gofiAPI";
import {Notifier} from "../components/Notify";
import EditModal from "../components/EditModal";
import {addTodo, setModal, toggleModal} from "../actions";
import connect from "react-redux/es/connect/connect";
import {IconButton} from "office-ui-fabric-react";

import GraphList from "../components/GraphList"

class Content extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          nodes: [],
          connections:[],
          toggle: false,
          viewtoggle: false,
          paramsList: [],
          model: [],
          type:{},
          id: props.match.params.id
      };
      this.createNode = this.createNode.bind(this);
      this.exportToggle = this.exportToggle.bind(this);
      this.viewToggle = this.viewToggle.bind(this);
      this.startAllNodes = this.startAllNodes.bind(this);
      this.stopAllNodes = this.stopAllNodes.bind(this);
  }

    componentWillUnmount() {
        clearInterval(this.interval);

  }

  getGraph(){
      Gofi.getGraph(this.state.id).then(
          graph => {

              if(this.state.nodes.length !== graph.nodes.length || this.state.connections.length !== graph.connections.length){
                  this.setState(graph)
                 // console.log(graph)
              }
          }
      );
  }
  componentDidMount() {
    this._hasMounted = true;
    this.getGraph();

    this.interval = setInterval(() => {
       this.getGraph();
    }, 500);
  }

  _onSelectionChanged = () => {
    if (this._hasMounted) this.forceUpdate();
  }


    onNewConnector(fromNode, toNode ) {
        // let connections = [
        //     ...this.state.connections,
        //     {
        //         input_node: fromNode,
        //         output_node: toNode,
        //     }
        // ];
        // this.setState({ connections: connections });

        Gofi.createConnection(this.state.id, {
                    input_node: fromNode,
                    output_node: toNode,
                }).then(data =>{
                    Notifier.createAlert("Connection Has been created", "success");
        })

        console.log(this.state)
    }

    onRemoveConnector(connector) {
        Gofi.deleteConnection(this.state.id, connector.nid).then(data =>{
            Notifier.createAlert("Connection Has been deleted", "success");
        })
        // let connections = [...this.state.connections];
        // connections = connections.filter(connection => {
        //     return connection !== connector;
        // });
        //
        // this.setState({ connections: connections });
        console.log(connector)
    }

    onNodeMove(nid, pos) {


        let _node = {
            id: nid,
            meta: pos
        }
        Gofi.updateNode(this.state.id,_node)
        console.log("end move", _node);
    }

    onNodeStartMove(nid) {
        console.log("start move : " + nid);
    }

    handleNodeSelect(nid) {
        console.log("node selected : " + nid);
    }

    handleNodeDeselect(nid) {
        console.log("node deselected : " + nid);
    }

    exportToggle(){
        this.setState({toggle: !this.state.toggle})
    }
    viewToggle(toggle){
        if (toggle === undefined) {
            this.setState({viewtoggle: !this.state.viewtoggle})
            return
        }
        this.setState({viewtoggle: toggle})
    }

    createNode(e, prop) {
        this.props.setModal(prop.type, prop.params, {}, "CREATE");
    }

    addSinkNode(e) {
        let obj = {
            type: "SINK",
            meta: {
                x: Math.ceil(e.clientX / 10) * 20,
                y: Math.ceil(e.clientY / 10) * 20,
            },
            params: "",
        };
        Gofi.createNode(this.state.id, obj).then(data => {
            Notifier.createAlert("Node has been created", "success");
        })
    }

    addTODO(){
        console.log(this.props)
        this.props.toggleModal();
  }

    startAllNodes(){
        var i;
        var prom = []
        for (i = 0; i < this.state.nodes.length; i++) {
            let node = this.state.nodes[i];
            prom.push(Gofi.startProcess(node.id))
        }
        Promise.all(prom).then(function (data) {
            Notifier.createAlert("All nodes have been started", "success")
        })
    }
    stopAllNodes(){
        var i;
        var prom = []
        for (i = 0; i < this.state.nodes.length; i++) {
            let node = this.state.nodes[i];
            prom.push(Gofi.stopProcess(node.id))
        }
        Promise.all(prom).then(function (data) {
            Notifier.createAlert("All nodes have been stopped", "success")
        })
    }



  render() {

      console.log()
    return (
      <div className="container" ref="test" >
          <Controls
              createNode={this.createNode}
              export={this.exportToggle}
              view={this.viewToggle}
              start={this.startAllNodes}
              stop={this.stopAllNodes}
          />
          <EditModal id={this.state.id}/>

          <div>
              {this.state.viewtoggle ? (
                  <GraphList data={this.state} graphid={this.state.id}/>
              ) : (
                  <ReactNodeGraph
                      data={this.state}
                      graphid={this.state.id}
                      grid={[1, 1]}
                      onNodeMove={(nid, pos) => this.onNodeMove(nid, pos)}
                      onNodeStartMove={nid => this.onNodeStartMove(nid)}
                      onNewConnector={(n1, o, n2, i) => this.onNewConnector(n1, o, n2, i)}
                      onRemoveConnector={connector => this.onRemoveConnector(connector)}
                      onNodeSelect={nid => {
                          this.handleNodeSelect(nid);
                      }}
                      onNodeDeselect={nid => {
                          this.handleNodeDeselect(nid);
                      }}
                  />
              )}
          </div>







          { this.state.toggle &&
              <div style={{"position": "absolute", "top": "120px", "zIndex": "999999", "width": "100%"}}>
                  <div style={{
                      "width": "900px",
                      "margin": "0 auto",
                      "height": "30px",
                      "padding": "1px 10px 20px 10px",
                      "backgroundColor": "#337ab7",
                      "color": "white"
                  }}>
                      <h3>Graph Export</h3>
                      <IconButton style={{"float": "right", "margin-top": "-45px"}} onClick={()=>{this.exportToggle()}} iconProps={{ iconName: 'ChromeClose' }} title="Close" ariaLabel="Close" />
                  </div>
                  <pre className="well" style={{
                      "width": "900px",
                      "margin": "0 auto",
                      "height": "500px",
                      "overflow": "auto",
                      "padding": "10px"
                  }}>
                      <ReactJson
                          displayDataTypes={false}
                          displayObjectSize={false}
                          enableClipboard={true}
                          src={{"nodes": this.state.nodes, "connections": this.state.connections}} />
                  </pre>
              </div>
          }
      </div>
    );
  }
}

Content.defaultProps = {
  maxBreadcrumbs: 3,
  breadcrumbs: [
    { text: 'Files', 'key': 'Files', onClick: identity },
    { text: 'This is folder 1', 'key': 'f1', onClick: identity },
    { text: 'This is folder 2', 'key': 'f2', onClick: identity },
    { text: 'This is folder 3', 'key': 'f3', onClick: identity },
    { text: 'This is folder 4', 'key': 'f4', onClick: identity },
    { text: 'Home', 'key': 'f5', onClick: identity }
  ],
  menuItems: defaultMenuItems,
  farMenuItems: defaultFarMenuItems
};


const mapStateToProps = state => ({
    todos: state.todos,
    editNode: state.editNode
});

const mapDispatchToProps = {
    addTodo,
    toggleModal,
    setModal

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Content);
