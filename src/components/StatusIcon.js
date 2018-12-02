import React from "react";

/*
pending
passed
offered
active
lost
complete
waiting
*/


class StatusIcon extends React.Component {
    render() {
        let classNme = "status grow ";
        switch (this.props.icon) {
            case "REGISTERED":
                classNme += "pending"; break;

            case "ACTIVE":
                classNme += "running"; break;

            case "INACTIVE":
                classNme += "error"; break;

            case "STOPPED":
                classNme += "stopped"; break;

            default:
                classNme += "error" ; break;
        }
        return (
                <div className={classNme} style={this.props.style}></div>

        );
    }
}

export default StatusIcon;

