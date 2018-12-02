import React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';

import {Notifier} from '../../components/Notify'

import "../../status.css"





export class customButton extends React.Component {
    render() {
        const buttonOnMouseClick = () => Notifier.createAlert("test");
        return (
            <CommandBarButton
                {...this.props}
                onClick={buttonOnMouseClick}
                styles={{
                    ...this.props.styles,
                    textContainer: { fontSize: 10 },
                    icon: { color: 'red' }
                }}
            />
        );
    }
}
export class NodeControls extends React.Component  {
    render(){
        return (
            <div>
                <CommandBar

                    buttonAs={customButton}
                    items={this.getItems()}
                    ariaLabel={'Use left and right arrow keys to navigate between commands'}
                />
            </div>
        );
    }
    // Data for CommandBar
    getItems = () => {
        return [
            {
                key: 'upload',
                name: '',
                iconProps: {
                    iconName: 'Upload'
                },
            },
            {
                key: 'share',
                name: 'Share',
                iconProps: {
                    iconName: 'Share'
                },
                onClick: () => console.log('Share')
            },
            {
                key: 'download',
                name: 'Download',
                iconProps: {
                    iconName: 'Download'
                },
                onClick: () => console.log('Download')
            }
        ];
    };

    getOverlflowItems = () => {
        return [
            {
                key: 'move',
                name: 'Move to...',
                onClick: () => console.log('Move to'),
                iconProps: {
                    iconName: 'MoveToFolder'
                }
            },
            {
                key: 'copy',
                name: 'Copy to...',
                onClick: () => console.log('Copy to'),
                iconProps: {
                    iconName: 'Copy'
                }
            },
            {
                key: 'rename',
                name: 'Rename...',
                onClick: () => console.log('Rename'),
                iconProps: {
                    iconName: 'Edit'
                }
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
                onClick: () => console.log('Sort')
            },
            {
                key: 'tile',
                name: 'Grid view',
                iconProps: {
                    iconName: 'Tiles'
                },
                iconOnly: true,
                onClick: () => console.log('Tiles')
            },
            {
                key: 'info',
                name: 'Info',
                iconProps: {
                    iconName: 'Info'
                },
                iconOnly: true,
                onClick: () => console.log('Info')
            }
        ];
    };
}
export default NodeControls;
