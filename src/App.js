import React, { Component } from 'react';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import NavBar from './components/NavBar.js';
import Content from './pages/Content.js';
import Home from './pages/Home.js';
import Admin from './pages/Admin.js';
import Footer from './components/Footer.js';
import { Route, Switch, Link } from 'react-router-dom'
import './App.css';
import {Gofi} from "./utils/gofiAPI";
import {paramsList} from "./actions";

const About = () => (
    <div style={{"marginTop":"50px", "padding":"10px"}}>
        <h1>About Page</h1>
        <p>Did you get here via Redux?</p>
    </div>
)

const NoMatch = ({ location }) => (
    <div style={{"marginTop":"50px", "padding":"10px", "textAlign":"center"}}>
        <h3>No match for <code>{location.pathname}</code></h3>
        <Link to="/"><h3>Click here to go back home</h3></Link>
    </div>
)

class App extends Component {

    componentWillMount() {
        Gofi.getParams().then(data => {
            this.props.store.dispatch(paramsList(data))
        });
    }

    render() {
    return (
            <Fabric className="App">
                <div className="header">
                    <NavBar />
                </div>
                <div className="body">
                    <div className="content">
                        <Switch>
                        <Route default exact path="/" component={Home} />
                        <Route exact path="/about-us" component={About} />
                        <Route exact path="/admin" component={Admin} />
                        <Route exact path="/graph/:id" component={Content} />
                        <Route component={NoMatch} />
                    </Switch>
                    </div>
                    <div className="sidebar">

                    </div>
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </Fabric>

    );
  }
}


export default App;


