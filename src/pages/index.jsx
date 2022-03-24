import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
import Layout from '../layout/layout';

function MyApp({ children, pageProps }) { 
  return <Layout {...pageProps}>{children}</Layout>
}

export default MyApp;
