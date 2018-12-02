import React from 'react';

class Countdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeleft: 0
        }
    }

    componentDidMount() {
        // update every second
        this.setState({timeleft: this.props.timeleft})
        this.interval = setInterval(() => {
            let time = this.state.timeleft - 1;
            this.setState({timeleft: time});
            if(time <= 0){
                this.stop()
            }
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }


    stop() {
        clearInterval(this.interval);
        if(this.props.onStop !== undefined){this.props.onStop();}
        console.log("clling stop")
    }

    render() {
        return (
            <div style={{
                "backgroundColor": "#484848",
                "border": "none",
                "color": "white",
                "padding": "0px 8px",
                "textAlign": "center",
                "textDecoration": "none",
                "display": "inline-block",
                "margin": "0px",
                "cursor": "pointer",
                "borderRadius": "16px",




            }}>
                {this.state.timeleft}
            </div>
        );
    }
}


export default Countdown;