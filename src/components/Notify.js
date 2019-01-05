import React from 'react';
import {ToastProvider, withToastManager } from 'react-toast-notifications';



const MyCustomToast = ({ appearance, children }) => (
    <div style={{"zIndex":"99999"}}>
        {children}
    </div>
);


class notifier {
    constructor(){
        this.cb = {}
    }
    register(cb) {
        this.cb = cb;
    }
    createAlert(message, type) {
        if (type === undefined) {
            type = "error"
        }
        this.cb(message,{ appearance: type, autoDismiss: true })
    }
}

let Provider = withToastManager(class extends React.Component {
    componentDidMount() {
            Notifier.register(this.props.toastManager.add)
    }
    render() {
        return <div style={{"zIndex":"10"}}></div>
    }
});

class Notify extends React.Component {
    render() {
        return (
            <div style={{"zIndex":"10"}}>
                <ToastProvider>
                    <Provider/>
                </ToastProvider>
            </div>
        );
    }
}
let Notifier = new notifier()
export { Notifier, Notify }