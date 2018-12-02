import React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import {Notify} from './Notify'

import "../status.css"

class Controls extends React.Component {
    static contextTypes = {
        router: () => true, // replace with PropTypes.object if you use them
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
            {
                key: 'newItem',
                name: 'New',
                cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
                iconProps: {
                    iconName: 'Add'
                },
                ariaLabel: 'New. Use left and right arrow keys to navigate',
                subMenuProps: {
                    items: []

                }
            },
            {
                key: 'export',
                name: 'Export',
                iconProps: {
                    iconName: 'Download'
                },
                onClick: () => this.props.export()
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
                key: 'tile',
                name: 'Grid view',
                iconProps: {
                    iconName: 'Tiles'
                },
                iconOnly: true,
                onClick: () => alert("Currently this feature has not been implemented")
            },
            {
                key: 'info',
                name: 'Info',
                iconProps: {
                    iconName: 'Info'
                },
                iconOnly: true,
                onClick: () => alert("Currently this feature has not been implemented")
            }
        ];
    };

    render() {
        return (
            <div className="controls" style={{"zIndex":"999"}}>
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
export default Controls;


