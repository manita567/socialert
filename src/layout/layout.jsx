import React, {
  useEffect,
} from 'react';

import { styled } from '@mui/material/styles';
 

import { Helmet } from 'react-helmet';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Fab,
  useScrollTrigger,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Brightness2, Brightness5,
} from '@mui/icons-material';
import {
  a, useSpring, config,
} from '@react-spring/web';
import { useProgress } from '@react-three/drei';
import Navigation from './navigation';
import Footer from './footer';
import { useStore } from '../store/store';
import { hexToAlpha } from '../store/theme';

import MaterialUI from './materialUI';


// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.

const Layout = (props) => {
  //   //prettier-ignore  
  const theme = useTheme();

  const { children, window } = props;
  // if (typeof window === "undefined") return

  const scrollToTop = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#home',
    );

    if (anchor) {
      anchor.scrollIntoView({
        disableHysteresis: true,
        threshold: 150,
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const Head = () => (
    <Helmet
      title={seoTitle}
      meta={[
        { name: 'description', content: seoDescription },
        // { name: 'keywords', content: 'sample, something' },
      ]}
    >
      <meta
        name="viewpoint"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      /> 
    </Helmet>
  );

  const mySerif = '"Noto Serif TC", "Noto Serif SC", "Noto Serif", "serif"';

  const mySans = '"Merriweather", "Source Sans Pro", "sans-serif"';

  const toggleTheme = useStore((state) => state.appContext.toggleTheme);
  const type = useStore((state) => state.appContext.type);


  // use
  // if (typeof window === 'undefined') return null;
  const fabStyles = {
    borderRadius: '100%',
    background: (theme) => `${hexToAlpha(theme.palette.text.primary, 0.6)} !important`,
    backdropFilter: 'blur(35px)',
    transform: 'scale(.75)',
  };

  // if (process.env.NODE_ENV === 'development') console.log('layout: time elapsed now', performance.now());
  return (
    <div
      style={{
        overflowX: 'hidden',
        maxWidth: '100vw',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: type === 'light' ? '#E6EBFA' : '#000064',
        color: 'rgba(1,1,100,.1)',
      }}
      id="#root"
      className="pattern-horizontal-lines-md"
    > 
      <MaterialUI> 
        <Navigation/>
        {children}
        <Zoom in={trigger} role="presentation">
          <Fab
            sx={{
              ...fabStyles,
            }}
            color="primary"
            onClick={scrollToTop}
            size="small"
            style={{ bottom: '65px', right: '13px', position: 'fixed' }}
            aria-label="scroll back to top"
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Zoom>
        <Fab
          sx={{
            ...fabStyles,
          }}
          onClick={() => toggleTheme()}
          size="small"
          color="primary"
          style={{ bottom: '13px', right: '13px', position: 'fixed' }}
          aria-label="scroll back to top"
        >
          {(type === 'light' && <Brightness5 />) || <Brightness2 />}
        </Fab>

        <Consolelogs />

      </MaterialUI>
    </div>
  );
};
 
const Consolelogs = () => { 
  useEffect(() => { 
    if (process.env.NODE_ENV === 'production') {
      alert(`
    Hello devs! 

    make sure to reference code docs for express.js, react.js, materialui, next.js, and mongodb. 

    It seems like alot to take on, until you realise its all set-up and just needs to be added to!

    -Aiden
    `);
    } 
  }, []);
  return (<div />);
};
 
export default Layout;
