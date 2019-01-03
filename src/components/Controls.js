import React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import {Notify} from './Notify'

import "../status.css"
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types'; // You need to add this dependency

class Controls extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    getItems = () => {
        console.log(this.props)
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
            {
                key: 'newItem',
                name: 'New',
                cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
                iconProps: {
                    iconName: 'Add'
                },
                ariaLabel: 'New. Use left and right arrow keys to navigate',
                subMenuProps: {
                    items: this.props.list.map(prop => {
                        return {
                            key: prop.type,
                            name: "New " + prop.type.toLowerCase() + " node",
                            iconProps: {
                                iconName: 'PageAdd'
                            },
                            onClick: (e) => this.props.createNode(e, prop)
                        }
                    })

                }
            },
            {
                key: 'view',
                name: 'View',
                iconProps: {
                    iconName: 'Tiles'
                },
                subMenuProps: {
                    items: [
                        {
                            key: 'nview',
                            name: 'Graph View',
                            iconProps: {
                                iconName: 'GitGraph'
                            },
                            onClick: () => this.props.view(false)
                        },
                        {
                            key: 'gview',
                            name: 'List View',
                            iconProps: {
                                iconName: 'ViewList'
                            },
                            onClick: () => this.props.view(true)
                        }
                    ]
                }
            },
            {
                key: 'contorls',
                name: 'Controls',
                iconProps: {
                    iconName: 'Settings'
                },
                subMenuProps: {
                    items: [
                        {
                            key: "export",
                            name: "View Json",
                            iconProps: {
                                iconName: 'Download'
                            },
                            onClick: () => this.props.export()
                        },
                        {
                            key: "start",
                            name: "Start all nodes",
                            iconProps: {
                                iconName: 'Play'
                            },
                            onClick: () => this.props.start()
                        },
                        {
                            key: "stop",
                            name: "Stop all nodes",
                            iconProps: {
                                iconName: 'Stop'
                            },
                            onClick: () => this.props.stop()
                        }

                    ]
                }
            },

        ];
    };

    getFarItems = () => {
        return [

        ];
    };

    render() {
        return (
            <div className="controls">
                <CommandBar
                    items={this.getItems()}
                    farItems={this.getFarItems()}
                    ariaLabel={'Use left and right arrow keys to navigate between commands'}
                />
                <Notify></Notify>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.editNode.list
});


export default connect(
    mapStateToProps
)(Controls);



