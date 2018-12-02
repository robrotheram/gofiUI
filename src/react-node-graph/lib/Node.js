import React from "react";
import onClickOutside from "react-onclickoutside";
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import NodeInputList from "./NodeInputList";
import NodeOuputList from "./NodeOutputList";

import nodestyle from "./styles/node";
import { Link } from 'office-ui-fabric-react/lib/Link';
import StatusIcon from '../../components/StatusIcon'
import {Gofi} from "../../utils/gofiAPI";
import {Notifier} from "../../components/Notify";
import {addTodo, setModal, toggleModal} from "../../actions";
import connect from "react-redux/es/connect/connect";


var Draggable = require("react-draggable");

class Startbtn extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            start: props.start,
            cb: props.onclicked
        }
    }
    onclicked(){
        this.setState({start: !this.state.start})
        this.state.cb();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({start: nextProps.start})
    }

    render() {
        const start = this.state.start;
        return (
            <li>
                {start ? (
                    <a onClick={() =>{this.onclicked()}}><Icon iconName="Play"/></a>
                ) : (
                    <a onClick={() =>{this.onclicked()}}><Icon iconName="Stop"/></a>
                )}
            </li>
        );
    }

}

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selected: false,
        status: "",
        nid: props.nid,
        showModal: false,
        graphid: props.graphid

    };
  }

    getStatus(){
      Gofi.getStatus(this.state.nid).then(
        status => {
            this.setState({status:status})
        }
    );
  }
  componentDidMount() {
      this.getStatus();
      this.interval = setInterval(() => {this.getStatus()}, 1000);
  }

  componentWillUnmount() {
      clearInterval(this.interval);
  }

    handleDragStart(event, ui) {
    this.props.onNodeStart(this.props.nid, ui);
  }

  handleDragStop(event, ui) {
    this.props.onNodeStop(this.props.nid, { x: ui.x, y: ui.y });
  }

  handleDrag(event, ui) {
    this.props.onNodeMove(this.props.index, { x: ui.x, y: ui.y });
  }

  onStartConnector(index) {
    this.props.onStartConnector(this.props.nid, index);
  }

  onCompleteConnector(index) {
    this.props.onCompleteConnector(this.props.nid, index);
  }

  handleClick(e) {
    this.setState({ selected: true });
    if (this.props.onNodeSelect) {
      this.props.onNodeSelect(this.props.nid);
    }
  }

  handleClickOutside() {
    let { selected } = this.state;
    if (this.props.onNodeDeselect && selected) {
      this.props.onNodeDeselect(this.props.nid);
    }
    this.setState({ selected: false });
  }


    _onRenderItemColumn(item, index, column) {
        if (column.key === 'WebUrl') {
            return <Link data-selection-invoke={ true }>{ item[column.key] }</Link>;
        }
        return item[column.key];
    }


    switchProcess(){
      if(this.state.status.status!=="ACTIVE"){
          Gofi.startProcess(this.props.nid).then(data =>{
              Notifier.createAlert("Node: "+this.props.title+" has been started", "success")

          });
      }else{
          Gofi.stopProcess(this.props.nid).then(data =>{
              Notifier.createAlert("Node: "+this.props.title+" has been stopped", "success")
          });
      }
    }

    delete(){

          Gofi.deleteNode(this.state.graphid, this.props.nid).then(data =>{
              Notifier.createAlert("Node: "+this.props.title+" has been Deleted", "success")
          });

    }

    _closeModal = ()  => {
        this.setState({ showModal: false });
    };

    _showModal = () => {
        console.log("DTAT",this.props)
        let data = {}
        try{
            data = JSON.parse(this.props.meta)
        }catch (e) {}

        this.props.setModal(this.props.title, this.props.params, data, "EDIT", this.props.nid);
    }

  render() {
    let { grid } = this.props;
    let tlist = this.props.meta
    if(tlist === undefined){
        tlist = []
    }

    //let { selected } = this.state;

    //let nodeClass = "node" + (selected ? " selected" : "");

    return (
      <div
        onDoubleClick={e => {
          this.handleClick(e);
        }}
      >
        <Draggable
          position={{ x: this.props.pos.x, y: this.props.pos.y }}
          handle=".node"
          grid={grid}
          onStart={(event, ui) => this.handleDragStart(event, ui)}
          onStop={(event, ui) => this.handleDragStop(event, ui)}
          onDrag={(event, ui) => this.handleDrag(event, ui)}
        >
            <section style={nodestyle}>
                <div>
                <NodeInputList
                items={this.props.inputs}
                onCompleteConnector={index => this.onCompleteConnector(index)}
                />
                <NodeOuputList
                items={this.props.outputs}
                onStartConnector={index => this.onStartConnector(index)}
                />
                </div>
                <div className={"node"}>
                    <div style={{
                            "height": "40px",
                            "backgroundColor": "#337ab7",
                            "width": "100%",
                            "padding":"0px",
                            "fontSize": "18px",
                            "color": "white",
                    }}>
                    <p style={{"padding":"10px", "margin":"0px"}}>{this.props.title}</p>
                    <span style={{"position":"absolute","top": 0, "right": 0, "padding": "12px"}}>
                        <StatusIcon icon={this.state.status.status}/>
                    </span>

                </div>
                <ul className="nav">
                    <Startbtn start={this.state.status.status!=="ACTIVE"} onclicked={() => this.switchProcess()}/>
                    <li><a onClick={() => this._showModal()}><Icon iconName="EditMirrored"/> </a></li>
                    <li><a onClick={() => this.delete()} className=""><Icon iconName="Delete"/> </a></li>
                    <li><a className="active"><Icon iconName="Down"/> {this.state.status.received_msg}</a></li>
                    <li><a className="active"><Icon iconName="Up"/> {this.state.status.sent_msg}</a></li>
                </ul>

                <table className="zui-table zui-table-horizontal" style={{width:"100%"}}>
                    <tbody>
                    <tr>
                        <td>Status</td><td>{this.state.status.status}</td>
                    </tr>
                    <tr>
                        <td>Messages Sent</td><td>{this.state.status.sent_msg}</td>
                    </tr>
                    <tr>
                        <td>Messages Received</td><td>{this.state.status.received_msg}</td>
                    </tr>

                    {/*{tlist.map(function(row, ri) {*/}
                        {/*return (*/}
                        {/*<tr key={ri}>*/}
                        {/*{Object.entries(row).map(function(column, ci) {*/}
                            {/*return <td key={ci}>{column}</td>; })}*/}
                        {/*</tr>); })}*/}
                    </tbody>
                </table>
                </div>
            </section>
        </Draggable>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    todos: state.todos,
});
const mapDispatchToProps = {
    addTodo,
    toggleModal,
    setModal

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(onClickOutside(Node));
