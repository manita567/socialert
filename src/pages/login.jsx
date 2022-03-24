import React, { Component, useEffect, useState, useCallback } from 'react'
import Layout from '../layout/layout'
import { useStore } from '../store/store'


function Login({ children, pageProps }) {
  const account = useStore((state) => state.account);
  const login = useStore((state) => state.account.methods.login);
  const logout = useStore((state) => state.account.methods.logout);

  useEffect(() => { },[account])

  return (
    <Layout {...pageProps}>
      <div>
        Login
        <img src={image} /> 
        {children}
      </div>
    </Layout>
  )
}

export default Login
