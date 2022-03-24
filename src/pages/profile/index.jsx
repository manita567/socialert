import { Box } from '@mui/material';
import axios from 'axios';
import React, {
  Component, useEffect, useState, useCallback,
} from 'react';
import Layout from '../../layout/layoutout';


// ========================================================================== //
// Example next lifecycle methods being handled
// ========================================================================== //
// this function is passed into next config as custom code to run when pre-rendering a page
// export const getServerSideProps = withSession(async ({ req, res }) => {
//   const { user } = req.session;

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { user },
//   };
// });

// This function gets called at build time
// export async function getStaticPaths() {
//   // Call an external API endpoint to get posts
//   const res = await fetch('https://.../posts')
//   const posts = await res.json()

//   // Get the paths we want to pre-render based on posts
//   const paths = posts.map((post) => ({
//     params: { id: post.id },
//   }))

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false }
// }

// ========================================================================== //
// User profile
// ========================================================================== //
const UserProfileContainer = ({ children, pageProps }) =>{
const userData = useStore((state) => state.userData);
  // Show the user. No loading state is required
  // {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
  return (
    <Layout>
      <Box
        sx={
          {
            m: 5,
            p: 5,//padding theme.spacing(5)
            background: theme.palette.text.primary,
            width: 100,
            height: 100,
          }
        }
      >
        <h1 
        >Your Profile</h1>
        {userData.name}
        {userData.followers}
        {userData.following}
        {userData.comments}
      {children}
      </Box>
    </Layout>
  )};
export default UserProfileContainer;
