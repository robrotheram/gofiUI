import React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import {Notify} from './Notify'

import "../status.css"
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types';
import {Gofi} from "../utils/gofiAPI"; // You need to add this dependency
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

class GraphListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            nid: props.id,
            graphid: props.graphid

        };
    }
    componentDidMount() {
       // this.getStatus();
        //this.interval = setInterval(() => {this.getStatus()}, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getStatus(){
        Gofi.getStatus(this.state.nid).then(
            status => {
                this.setState({status:status})
            }
        );
    }

    render() {
        return (
            <tr className="ms-Table-row">
                <td>{this.props.id}</td>
                <td>{this.props.type}</td>
                <td>{this.state.status.status}</td>
                <td>{this.state.status.sent_msg}</td>
                <td>{this.state.status.received_msg}</td>
            </tr>
        )
    }
}




class GraphList extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }
    constructor(){
        super()
        this.state = {
            nodes:[]
        }
    }

    componentDidMount() {
        this.getAlldata();
        this.interval = setInterval(() => {this.getAlldata()}, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getAlldata(){
        var prom = []
        var nodes = this.props.data.nodes;
        let _this = this
        console.log(nodes)
        nodes.map((node, i) => {
            prom.push(Gofi.getStatus(node.id))
        })
        Promise.all(prom).then(function (val) {
            const newArray = nodes.map((item) => item.status = val.filter(v => v.id === item.id)[0])
            console.log(val);
            console.log(nodes);
            _this.setState({"nodes": nodes})
        })
    }

    render() {
        const _columns = [
            {
                key: 'column2',
                name: 'id',
                fieldName: 'id',
                minWidth: 210,
                maxWidth: 350,
                data: 'string',
                isPadded: true
            },
            {
                key: 'column3',
                name: 'Type',
                fieldName: 'type',
                minWidth: 70,
                maxWidth: 90,
                data: 'number',
                isPadded: true
            },
            {
                key: 'column4',
                name: 'Status',
                minWidth: 70,
                maxWidth: 90,
                data: 'string',
                isPadded: true,
                onRender: (item) => {
                    return <span>{item.status.status}</span>;
                }
            },
            {
                key: 'column5',
                name: 'Messages Sent',
                minWidth: 70,
                maxWidth: 90,
                data: 'number',
                isPadded: true,
                onRender: (item) => {
                    return <span>{item.status.sent_msg}</span>;
                }
            },
            {
                key: 'column6',
                name: 'Messages Received',
                minWidth: 70,
                maxWidth: 90,
                data: 'number',
                isPadded: true,
                onRender: (item) => {
                    return <span>{item.status.received_msg}</span>;
                }
            },

        ];
        return (
            <DetailsList
                items={this.state.nodes}
                compact={false}
                columns={_columns}
                selectionMode={SelectionMode.none}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
            />
        );
    }
}

const mapStateToProps = state => ({
    list: state.editNode.list
});


export default connect(
    mapStateToProps
)(GraphList);



