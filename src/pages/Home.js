import React from 'react';
import {Gofi} from "../utils/gofiAPI";
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import {
    DocumentCard,
    DocumentCardTitle,
    DocumentCardStatus,
} from 'office-ui-fabric-react/lib/DocumentCard';

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import {TextField} from "office-ui-fabric-react";
import { Link } from 'react-router-dom'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';

import {withToastManager} from "react-toast-notifications";
import {Notifier, Notify} from "../components/Notify";

class Home extends React.Component {
  constructor() {
      super();
      this.state = {
          graphs:[],
          showModal:false,
          params: {}
      };
  }

    componentWillUnmount() {
        clearInterval(this.interval);

  }

  getGraph(){
    Gofi.getAllGraphs().then(
        graphs => {
            this.setState({graphs:graphs})
        }
    )
  }
  componentDidMount() {
    this._hasMounted = true;
    this.getGraph();

    this.interval = setInterval(() => {
       this.getGraph();
    }, 2000);
  }

    toggleModal = () =>{
      this.setState({showModal: !this.state.showModal})
  }

    _editModal = (graph) =>{
      this.setState({showModal: true, params:graph, type:"EDIT" })
  }

    showModal = () =>{
        this.setState({showModal: true,  params:{}, type:"CREATE"})
    }


    getItems = () => {
        return [
            {
                key: 'newItem',
                name: 'New',
                cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
                iconProps: {
                    iconName: 'Add'
                },
                ariaLabel: 'New. Use left and right arrow keys to navigate',
                onClick: () => this.showModal()
            }
        ];
    };


    getFarItems = () => {
        return [
            {
                key: 'sort',
                name: 'Sort',
                iconProps: {
                    iconName: 'SortLines'
                },
                onClick: () => alert("Currently this feature has not been implemented")
            },
            {
                key: 'flow',
                name: 'Flow',
                iconProps: {
                    iconName: 'flow'
                },
                iconOnly: true,
                onClick: () => window.location="admin"
            },
            {
                key: 'info',
                name: 'Info',
                iconProps: {
                    iconName: 'Info'
                },
                iconOnly: true,
                onClick: () => window.location="about-us"
            }
        ];
    };

    inputChangeHandlerParams = (event) => {
        let params = this.state.params;
        params[event.target.name] = event.target.value;
        this.setState({params:params});
    }

    submitChangeHandler = () => {
        let graph = {
            name:this.state.params.name,
            description:this.state.params.description
        }
        if(this.state.type === "CREATE") {
            Gofi.createGraph(graph).then(data => {
                Notifier.createAlert("Graph has been created", "success")
                this.setState({ graphs: [...this.state.graphs, data] });
                this.toggleModal();
            })
        } else if(this.state.type === "EDIT"){
            Gofi.editGraph(this.state.params.id, graph).then(data => {
                Notifier.createAlert("Graph has been edited", "success")
                this.toggleModal();
            })
        }


    };

    cancelChangeHandler = () => {
        this.setState({parmas:{}})
        this.toggleModal();
    };






    _showDialog = (id) => {
        this.setState({ hideDialog: false, id: id });
    };

    _closeDialog = () => {
        this.setState({ hideDialog: true });
    };
    _DeleteDialog = () => {
        Gofi.deleteGraph(this.state.id).then( data => {
                this.setState({hideDialog: true})
                Notifier.createAlert("Graph has been deleted", "success")
            }
        )
    };

  render() {
      return (
        <div style={{"marginTop":"55px"}}>
            <CommandBar
                items={this.getItems()}
                farItems={this.getFarItems()}
                ariaLabel={'Use left and right arrow keys to navigate between commands'}
            />
            <div className="ms-Grid" dir="ltr" >
            <br/>
                <Notify/>
            {
                this.state.graphs.map(graph => {
                    return (
                        <DocumentCard key={graph.id} className={"ms-Grid-col ms-lg8"}>
                            <IconButton style={{"position":"absolute", "right":"50px"}} onClick={()=>{this._editModal(graph)}} iconProps={{ iconName: 'Edit' }} title="Close" ariaLabel="Close" />
                            <IconButton style={{"position":"absolute", "right":"20px"}} onClick={() => {this._showDialog(graph.id)}} iconProps={{ iconName: 'Delete' }} title="Close" ariaLabel="Close" />
                            <div className="ms-ConversationTile-TitlePreviewArea">
                                <Link to={"/graph/"+graph.id} style={{"textDecoration":"none"}}>
                                    <DocumentCardTitle
                                    title={graph.name}
                                    shouldTruncate={true}
                                />
                                </Link>
                                <DocumentCardTitle
                                    title={graph.description}
                                    shouldTruncate={true}
                                    showAsSecondaryTitle={true}
                                />
                                <DocumentCardStatus statusIcon="ProcessMetaTask" status={graph.nodes.length + " Nodes"} />
                                <DocumentCardStatus statusIcon="ProcessMetaTask" status={graph.connections.length + " Connections"} />
                            </div>
                        </DocumentCard>
                    )
                })
            }
            </div>


            <Dialog
                hidden={this.state.hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Delete Graph',
                    subText: 'Are you sure you want to delete the graph: '+ this.state.id
                }}
                modalProps={{
                    titleAriaId: 'myLabelId',
                    subtitleAriaId: 'mySubTextId',
                    isBlocking: false,
                    containerClassName: 'ms-dialogMainOverride'
                }}
            >
                {null /** You can also include null values as the result of conditionals */}
                <DialogFooter>
                    <PrimaryButton onClick={this._DeleteDialog} text="Delete" style={{"background":"#e50040"}} />
                    <DefaultButton onClick={this._closeDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>

            <Modal
                titleAriaId="titleId"
                subtitleAriaId="subtitleId"
                isOpen={this.state.showModal}
                onDismiss={this.toggleModal}
                isBlocking={false}
                containerClassName="ms-modalExample-container"
            >
                <div className="ms-modalExample-header">
                    <span id="titleId">Create new Graph</span>
                    <IconButton style={{"position":"absolute", "right":"10px"}} onClick={()=>{this.toggleModal()}} iconProps={{ iconName: 'ChromeClose' }} title="Close" ariaLabel="Close" />
                </div>
                <div id="subtitleId" className="ms-modalExample-body">

                    <div className="uk-margin">
                        <TextField label={"Graph name"} placeholder={"Graph name"} required={true} name={"name"}  value={this.state.params["name"]} onChange={this.inputChangeHandlerParams} />
                    </div>

                    <div className="uk-margin">
                        <TextField multiline rows={5} label={"Graph description"} placeholder={"Graph description"} required={true} name={"description"}  value={this.state.params["description"]} onChange={this.inputChangeHandlerParams} />
                    </div>




                    <div style={{"float":"right","marginTop":"10px"}}>
                        <DefaultButton
                            data-automation-id="test"
                            allowDisabledFocus={true}
                            text="Cancel"
                            onClick={this.cancelChangeHandler}
                        />
                        <PrimaryButton
                            data-automation-id="test"
                            text="Submit"
                            onClick={this.submitChangeHandler}
                            allowDisabledFocus={true}
                        />
                    </div>

                </div>
            </Modal>








        </div>
    );
  }
}


export default Home
