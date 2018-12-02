import React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';

const Footer = () => (
  <div className="footer-container">
    {'© Gofi 2018. '}
    <Link href="https://github.com/guzmonne/office-ui-layout/tree/01-blank-project">Get in touch!</Link>
    {' -- Made with '}
    <span className="text-red">♥</span>
    {' by '}
    <Link href="https://github.com/robrotheram"> {'<@robrotheram>'}</Link>
  </div>
);

export default Footer;
