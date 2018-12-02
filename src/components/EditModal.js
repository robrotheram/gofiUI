import React from 'react';
import {IconButton, Modal,} from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import {Gofi} from "../utils/gofiAPI";
import {Notifier} from "./Notify";
import {addTodo, toggleModal} from "../actions";
import connect from "react-redux/es/connect/connect";
class EditModal extends React.Component {

    constructor(){
        super();
        this.state = {
            model: [],
            params:{}
        };
    }


    componentWillReceiveProps(nextProps, nextContext) {
        console.log(this.props, nextProps, nextContext )
       this.setState({params : nextProps.editNode.params})
    }

    inputChangeHandlerParams = (event) => {
        let params = this.state.params;
        params[event.target.name] = event.target.value;
        this.setState({params:params});
    }

    submitChangeHandler = () => {
        let model = {
            type: this.props.editNode.type,
            meta: {"x": 10, "y": 100},
            params: JSON.stringify(this.state.params)
        };
        let _that = this;

        console.log("MODE", this.props.editNode.mode, this.props.editNode.id);
        if(this.props.editNode.mode === "CREATE") {
            Gofi.createNode(this.props.id, model).then(data => {
                Notifier.createAlert("Node Created", "success")
                    _that.props.toggleModal();
                }
            ).catch(error => {
                console.log(error.response)
                Notifier.createAlert(error.response.data)
                _that.props.toggleModal();
            })
        }else if(this.props.editNode.mode === "EDIT") {
            console.log("MODE", this.props.editNode.mode, this.props.editNode.id);
            Gofi.editNode(this.props.id, model, this.props.editNode.id).then(data => {
                Notifier.createAlert("Node Edited", "success")
                    _that.props.toggleModal();
                }
            ).catch(error => {
                Notifier.createAlert(error.message)
                _that.props.toggleModal();
            })
        }

    };

    cancelChangeHandler = () => {
        this.setState({parmas:{}})
        this.props.toggleModal();
    };

    render() {
        let model = this.props.editNode.list.filter(list => list.type===this.props.editNode.type)[0];
        if (model === undefined || model=== null){
            model = []
        }else if(model.params !== undefined && model.params !== null){
            model = model.params
        } else{
            model = []
        }

        console.log("RENDER", model)
        return (
            <Modal
                titleAriaId="titleId"
                subtitleAriaId="subtitleId"
                isOpen={this.props.editNode.showModal}
                onDismiss={this.props.toggleModal}
                isBlocking={false}
                containerClassName="ms-modalExample-container"
            >
                <div className="ms-modalExample-header">
                    <span id="titleId">Create {this.props.editNode.type} Node</span>
                    <IconButton style={{"position":"absolute", "right":"10px"}} onClick={()=>{this.props.toggleModal()}} iconProps={{ iconName: 'ChromeClose' }} title="Close" ariaLabel="Close" />
                </div>
                <div id="subtitleId" className="ms-modalExample-body">
                    {model.map((d) => {
                        return (
                            <div className="uk-margin">
                                <TextField label={d} placeholder={d} required={true} name={d}  value={this.state.params[d]} onChange={this.inputChangeHandlerParams} />
                            </div>
                        )
                    })}
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
        );
    }
}


const mapStateToProps = state => ({
    editNode : state.editNode
});

const mapDispatchToProps = {
    addTodo,
    toggleModal

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditModal);
