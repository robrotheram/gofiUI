import React from 'react';
import PropTypes from 'prop-types';
import { Nav} from 'office-ui-fabric-react/lib/Nav';

const SidebarMenu = ({ groups, expanded, collapsed }) => (
  <div className='SidebarMenu'>
    <Nav groups={groups}
      expandedStateText={expanded}
      collapsedStateText={collapsed}
    />
  </div>
);


SidebarMenu.defaultProps = {
  groups: [{
    links: [
      {
        name: 'Parent link', url: 'http://example.com', links: [
          { name: 'Child link', url: 'http://example.com' },
          {
            name: 'Child link', url: 'http://example.com', links: [
              { name: 'Child link', url: 'http://example.com' },
              { name: 'Child link', url: 'http://example.com' }
            ]
          },
          { name: 'Child link', url: 'http://example.com' }
        ]
      },
      {
        name: 'Parent link', url: 'http://example.com', links: [
          { name: 'Child link', url: 'http://example.com' }
        ]
      }
    ]
  }],
  expanded: 'expanded',
  collapsed: 'collapsed'
};

export default SidebarMenu;
