import React from 'react';
import PropTypes from 'prop-types';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';


const NavBar = ({ onChange, onSearch }) => (
  <div className="NavBar">
    <div className="logo ms-font-xl" style={{"margin":"0 auto"}}>
      <a href={"/"} style={{"textDecoration": "none", "color": "white" }} ><strong>GoFi</strong></a>
    </div>
  </div>
);

NavBar.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func
};

NavBar.defaultProps = {
  onChange: (newValue) => console.log('SearchBox onChange fired: ' + newValue),
  onSearch: (newValue) => console.log('SearchBox onSearch fired: ' + newValue)
};

export default NavBar;
