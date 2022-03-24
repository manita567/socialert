import axios from 'axios';
import { useStore } from '../store/store';
 
// ========================================================================== //
// Re-usable headers you can re-use to send api requests
// ========================================================================== //

//example, with some common header types you can play around with / reasearch
export const commonHeaders = {
  // 'Content-Type': 'application/json',
  // 'content-type': 'application/x-www-form-urlencoded',//default
  Accept: 'application/json, text/plain, */*',
  'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  // 'Access-Control-Allow-Credentials': true,
  // 'Access-Control-Allow-Headers':
  //   'Content-Type, Authorization, Content-Length, X-Requested-With',
  // 'cache-control': 'no-cache',
  // 'sec-fetch-dest': 'empty',
  // 'sec-fetch-mode': 'cors',
  // 'sec-fetch-site': 'same-site',
  // pragma: 'no-cache',
  // usequerystring: 'true',
};

// ========================================================================== //
//   These are the api's they call the database, and should reflect the underlying structure
// ========================================================================== //
// -endpoints have query paramaters, they are used to filter the data **this is handled in the query params aka the params**
// -endpoints have data payloads, they are used to create new data, **this is handled in the body**
// -endpoints can handle many or one payload/query, this is handled in the header
// -queries and data payloads, are structured in a javascript object {key:value,key:{subObject:value}} but
// -you should understand special key values used in mongodb, and the correct format for using these
//    -javascript objects before making ANY api calls, so as, to not mess up data in the database
//    -for this reason, we have a test database, and a production database, and this is configured in the environment variables
// -dont be overwhelmed, once you see one section, you see the rest are the same, just they handle
//    -different data models, and different payloads
// ========================================================================== // 
  

// ========================================================================== //
// Authorization and Account
// ========================================================================== //
//**MVP */
// use in auth param in request
// export const authorizeApp = async () => `Bearer ${new google.auth.JWT({
//   email: process.env.NODE_ENV.GOOGLESERVICEACCOUNTAIDEN,
//   key: process.env.NODE_ENV.GOOGLESERVICEACCOUNTAIDENPRIVATEKEY,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// }).authorize()}`;
// use as headers: {Authorization: 'Bearer JWT'}
export const authorizeUser = async () => {}
export const login = async()=> {}
export const logout = async()=> {}
export const forgotPassword = async()=> {}
export const forgotUsername = async()=> {}
export const getAuthToken = async()=> {}
export const getAuthSession = async()=> {}

// const serverURL = `http://localhost:${process.env.SERVER_PORT}/${process.env.API_URL}`; 
const serverURL =  `http://localhost:3001/api`; 

//**MVP */
// ========================================================================== //
// Users
// ========================================================================== //
export const getUser = async ({ query }) => {
  return axios.request({
    method: 'GET',
    url: `${serverURL}/getUser`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders, },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const getUsers = async ({ query }) => {
  console.log(serverURL) 
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getUser`,
    proxy: false,//breaks usage with localhost development
    headers: {
      ...commonHeaders, many: true,
      POST: 'http://localhost:3001 /.netlify/functions/server/api/getUser HTTP/1.1', 
    },
    body: {
      
    },

    params: { 
      ...query
    },
  });
}; 
export const addUsers = async ({ newUser }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addUser`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders, many:true },
    body: {
      newUser,
    },
    params: { 
    },
  });
}; 

export const addUser = async ({ newUser }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addUser`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newUser,
    },
    params: {
       
    },
  });
}; 

export const deleteUser = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/updateUser`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: { 
    },
    params: { 
      ...query
    },
  });
}; 

export const updateUser = async ({ newUserData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deleteUser}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newUserData,
    },
    params: {
      ...query
    },
  });
}; 

export const updateUsers = async ({ newUserData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deleteUser}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true},
    body: {
      newUserData,
    },
    params: {
      ...query
    },
  });
}; 

//**MVP */
// ========================================================================== //
// Posts
// ========================================================================== //
export const getPost = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getPost`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders, },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const getPosts = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getPost`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const addPosts = async ({ newPost }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addPost`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true },
    body: {
      newPost,
    },
    params: { 
    },
  });
}; 

export const addPost = async ({ newPost }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addPost`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newPost,
    },
    params: {
       
    },
  });
}; 

export const deletePost = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/updatePost`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: { 
    },
    params: { 
      ...query
    },
  });
}; 

export const updatePost = async ({ newPostData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deletePost}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newPostData,
    },
    params: {
      ...query
    },
  });
}; 

export const updatePosts = async ({ newPostData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deletePost}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true},
    body: {
      newUserData,
    },
    params: {
      ...query
    },
  });
}; 
 
//**POST MVP */
// ========================================================================== //
// Likes
// ========================================================================== //
export const getLike = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getLike`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders, },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const getLikes = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getLike`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const addLikes = async ({ newLike }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addLike`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true },
    body: {
      newLike,
    },
    params: { 
    },
  });
}; 

export const addLike = async ({ newLike }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addLike`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newLike,
    },
    params: {
       
    },
  });
}; 

export const deleteLike = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/updateLike`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: { 
    },
    params: { 
      ...query
    },
  });
}; 

export const updateLike = async ({ newLikeData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deleteLike}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newLikeData,
    },
    params: {
      ...query
    },
  });
}; 

export const updateLikes = async ({ newLikeData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deleteLike}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true},
    body: {
      newUserData,
    },
    params: {
      ...query
    },
  });
}; 

//**POST MVP */
// ========================================================================== //
// Following
// ========================================================================== //
export const getFollow = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getFollow`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders, },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const getFollows = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/getFollow`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true },
    body: {
      
    },
    params: { 
      ...query
    },
  });
}; 
export const addFollows = async ({ newFollow }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addFollow`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true },
    body: {
      newFollow,
    },
    params: { 
    },
  });
}; 

export const addFollow = async ({ newFollow }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/addFollow`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newFollow,
    },
    params: {
       
    },
  });
}; 

export const deleteFollow = async ({ query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/updateFollow`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: { 
    },
    params: { 
      ...query
    },
  });
}; 

export const updateFollow = async ({ newFollowData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deleteFollow}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders},
    body: {
      newFollowData,
    },
    params: {
      ...query
    },
  });
}; 

export const updateFollows = async ({ newFollowData,query }) => {
  return axios.request({
    method: 'POST',
    url: `${serverURL}/deleteFollow}`,
    proxy: false,//breaks usage with localhost development
    headers: { ...commonHeaders,many:true},
    body: {
      newUserData,
    },
    params: {
      ...query
    },
  });
}; 
 