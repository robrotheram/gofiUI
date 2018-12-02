import React from 'react';
import { MessageBar, MessageBarType, } from 'office-ui-fabric-react';
import Countdown from "./Countdown";

class n {
    constructor(){
        this.alerts = {}
        this.cb = []
    }

    uniqueId() {
        return Math.random().toString(36).substr(2, 16);
    };
    register(alert) {
        this.cb.push(alert)
    }

    callback(){
        this.cb.forEach(function(cb) {
            cb()
        });

    }
    createAlert(message, type) {
        var _type;
        switch(type) {
            case "error":
                _type = MessageBarType.error
                break;
            case "warning":
                _type = MessageBarType.warning
                break;
            case "success":
                _type = MessageBarType.success
                break;
            default:
                _type = MessageBarType.severeWarning
        }
        let _id = this.uniqueId()
        this.alerts[_id] = {"id":_id, "msg":message, type: _type};
        this.callback()
    }
    getAlerts(){
        console.log(this.alerts);
        return Object.values(this.alerts)
    }

    deleteAlert(id){
        delete this.alerts[id];
        this.callback()
    }
}

let Notifier = new n()
class Notify extends React.Component {

    constructor(){
        super();
        this.state = {
            alerts: []
        };
        Notifier.register(() => this.setState({"alerts": Notifier.getAlerts()}))
    }
    render() {
        return (
            <div className="alertsPanel">
                {Notifier.getAlerts().map(alert => {
                    return <MessageBar
                    messageBarType={alert.type}
                    isMultiline={false}
                    onDismiss={() => Notifier.deleteAlert(alert.id)}
                    dismissButtonAriaLabel="Close"
                    actions={
                    <div>
                        <Countdown  timeleft={10} onStop={() => Notifier.deleteAlert(alert.id)}/>
                    </div>
                }
                >
                    {alert.msg}
                    </MessageBar>
                })}

            </div>
        );
    }
}

export { Notifier, Notify }