import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
  

import { InlineIcon } from '@iconify/react';
// import chevronRight from "@iconify/icons-mdi/chevron-right";
// import githubLogo from "@iconify/icons-fa-brands/github-square";
// import linkedinLogo from "@iconify/icons-ion/logo-linkedin";
// import instagramLogo from "@iconify/icons-ri/instagram-fill";
import {
  Box, Container, Typography, Grid, useTheme,
} from '@mui/material';
import {
  RegularButton,
} from '../components/custom/buttons';
import { useStore } from '../store/store';

export default ({ children }) => {
  // const theme = useTheme();
  const type = useStore((state) => state.appContext.type);
  const theme = useTheme(); 

  const makeCall = useCallback(
    () => typeof window !== 'undefined' && window.open('tel:+61-475-565-709'),
    [],
  );
  // table footer?
  return (
    <footer> 
    </footer>
  );
}; 