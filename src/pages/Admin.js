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
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardPreview,
    DocumentCardTitle,
    DocumentCardType,
    DocumentCardStatus,
    IDocumentCardPreviewProps
} from 'office-ui-fabric-react/lib/DocumentCard';
import {CommandBar} from "office-ui-fabric-react";
import PropTypes from "prop-types";

class AdminCard extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {}
    componentDidMount() {
    }

    render(){
        // const { items: originalItems } = this.props;
        const  item  = this.props.data;
        const _columns = [
            {
                key: 'column2',
                name: 'id',
                fieldName: 'id',
                minWidth: 100,
                maxWidth: 250,
                data: 'string',
                isPadded: true
            },
            {
                key: 'column3',
                name: 'Type',
                fieldName: 'status',
                minWidth: 70,
                maxWidth: 90,
                data: 'string',
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
                    return <span>{item.status}</span>;
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
                    return <span>{item.sent_msg}</span>;
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
                    return <span>{item.received_msg}</span>;
                }
            },

        ];
        return (
            <DocumentCard type={DocumentCardType.compact} className="adminCard">
                <DocumentCardTitle className="adminCardTitle"
                    title={"Worker: "+ item.worker}
                    shouldTruncate={true}
                />
                <DocumentCardTitle
                    title={item.ip}
                    shouldTruncate={true}
                    showAsSecondaryTitle={true}
                />

                <div className="ms-Grid">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
                            Worker Status:
                            <table className="zui-table zui-table-horizontal" style={{width:"100%"}}>
                                <tbody>
                                <tr>
                                    <td>Status</td><td>{item.status}</td>
                                </tr>
                                <tr>
                                    <td>memory_used</td><td>{item.memory_used}</td>
                                </tr>
                                <tr>
                                    <td>memory_total</td><td>{item.memory_total}</td>
                                </tr>
                                <tr>
                                    <td>memory_percent</td><td>{item.memory_percent.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Load</td><td>{item.load}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
                            <DetailsList
                                items={item.stats}
                                compact={false}
                                columns={_columns}
                                selectionMode={SelectionMode.none}
                                setKey="set"
                                layoutMode={DetailsListLayoutMode.justified}
                                isHeaderVisible={true}
                            />
                        </div>
                    </div>
                </div>








            </DocumentCard>
        );
    }
}



class Admin extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          health:{}
      };
  }

    static contextTypes = {
        router: PropTypes.object
    }

  componentWillUnmount() {}
  componentDidMount() {
      Gofi.getHealth().then(
          health => {
             this.setState({health:health})
          }
      )
  }

    getItems = () => {
        return [
            {
                key: 'backitem',
                name: '',
                iconProps: {
                    iconName: 'Back'
                },
                ariaLabel: 'New. Use left and right arrow keys to navigate',
                onClick: this.context.router.history.goBack
            },
        ];
    };

  render() {
    return (
        <div style={{"marginTop":"55px"}}>
            <CommandBar
                items={this.getItems()}
                ariaLabel={'Use left and right arrow keys to navigate between commands'}
            />
            <div style={{"marginTop":"10px", "padding":"10px"}}>
            {Object.keys(this.state.health).map((key, i) => {
                return (<AdminCard data={this.state.health[key]}/>)})}
            </div>
        </div>
    );
  }
}



export default (Admin);
