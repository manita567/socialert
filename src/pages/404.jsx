import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
import Card from '../components/cards';
import Layout from '../layout/layout';

function FourOFour({ children, pageProps }) {
  return <Layout {...pageProps}>
    <h1>
    hello this is the 404 page
    </h1>
    {children}
    <Card text="hello world"/>
  </Layout>;
}

export default FourOFour;
