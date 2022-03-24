// ========================================================================== //
// TODO: MVP
// - user can login/register/logout
// - user can make posts
// - user can like, comment, and share posts
// - user can follow other users
// - user can view their own posts
// - user can view other users posts
// - user can view their own comments
// - user can view other users comments
// - user can view their own profile
// - user can view other users profile
// ========================================================================== //
// TODO: POST MVP
// - user can view their own likes
// - user can view other users likes
// - user can view their own followers
// - user can view other users followers
// - user can view their own following
// - user can view other users following
// - user can view their own notifications
// - user can receive notifications
// ========================================================================== //

import { createTheme } from '@mui/material'
import create from 'zustand'
import React from 'react'
import { deepmerge } from '@mui/utils'
import { link } from 'next/link'
// ========================================================================== //
// Handle theming
// ========================================================================== //
import { DARK_THEME, LIGHT_THEME, OVERRIDES, CUSTOM_THEME_PROPS } from './theme'
const afCreateTheme = (theme) => {
  const muiTheme = createTheme({ ...theme })
  const newTheme = deepmerge(muiTheme, CUSTOM_THEME_PROPS, OVERRIDES)
  // custom theme properties **quick hack**
  newTheme.typography.h1.fontWeight = 900
  newTheme.typography.h2.fontWeight = 900
  newTheme.typography.h2.textTransform = 'capitalize'
  // console.log(newTheme);
  return newTheme
}

//create base themes to re-use derived from the theme.js
const lt = afCreateTheme(LIGHT_THEME)
const dt = afCreateTheme(DARK_THEME)

// ========================================================================== //
// Socialert API methods
// ========================================================================== //
import {
  addUser,
  authorizeUser,
  addUsers,
  deleteUser,
  getUser,
  updateUser,
  updateUsers,
  getUsers
} from '../util/apis.js'
import { useAsync } from '../util/customHooks'

// ========================================================================== //
// App Global Shared State
// ========================================================================== //
const useStore = create((set) => ({
  // ========================================================================== //
  //   Fixed State **inherits from the models defined below or is static ie: account**
  // ========================================================================== //
  // -say a user is filling out a post, that data goes to post
  // -when a user submits the post, it goes to the server under the users posts
  // -say a user is viewing posts, that data goes to the post cache, but you will be using posts static methods
  // -static just means its intended for global use, not for a specific instances use
  //    -so when you call a data models methods, make sure to cache the results afterwards for them to be viewable
  // -server side means the methods interact with the backend api endpoints, but these will also update client side state in the CACHE
  // -client side means the methods interact with the frontend
  // -when we say instance, we dont mean new foo(), we mean, the data models hold temporary information, and we persist that information in a cache, or in areas defined the below section.
  //    -each instance has methods we can use for each of data model types, we have client side methods that update instances, and methods to publish those changes to the cache and database
  // -you will notice alot of the methods, are shared and common processes, once youve made one set
  //    -you can re-use the code, but make sure it handles the API and data structure appropriately by tweaking it
  // -failure to update data in accorance with the shape of the data stored on the database will
  //    -result in malformed database entries, which are BAD, data should be all consistent
  // -not all of this code has been throughoughly tested, so please be careful, and make changes where they need to be made
  // -if you have any questions contact aiden at whatsapp or email at aidenf09@yahoo.com
  // ========================================================================== //
  //**MVP */
  account: {
    //inherits account, but with extra features that are cliend-side specific
    //authentication specific data
    authToken: '',
    jtwToken: '',
    session: {
      userId: '',
      sessionToken: '',
      sessionTime: ''
    },

    //account specific data
    id: '',
    userId: '62396941eeb3bfab285fc75e',
    username: '',
    accountType: '', //guest, admin, user
    password: '', //should be stored as a hash, ensure its SALTED for security

    methods: {
      //server side methods
      login: async () => {}, //login to existing account with username/pw
      logout: async () => {}, //login to existing account with username/pw
      register: async () => {}, //create an account, by filling out a user model and publishing it to the database
      //for difficulty loggin in
      forgotPassword: async () => {},
      forgotUsername: async () => {},

      //client side getters
      isAdmin: () => {}, //check if user is an administrator
      isLoggedIn: () => {}, //check if user is logged in
      isSessionValid: () => {}, //check the current user session

      //client side methods
      clear: () => {
        set((state) => ({
          ...state,
          bookingForm: {
            // empty an object to clear all the fields
            ...Object(
              Object.keys(state.bookingForm).map((key) => ({ [key]: '' }))
            )
          }
        }))
      }
    }
  },
  //**MVP */
  currentUser: {
    //inherits user but originates from account, where login/register/logout methods are defined
    //will inherit from user on initialization to remember the current users details when logged in/currently using
  },
  //for offline use, in the case the user uses the app offline, so we store data fetched from when the app is online
  //**MVP */
  cache: {
    //the single source of persisted data
    //will be in one on one relationship with localStorage for persistance
    currentUser: {}, //if a user is logged in, his data goes here
    account: {}, //if a user is logged in, account details go here
    posts: [], //if a user is viewing posts, they get them from here
    comments: [], //if a user is viewing comments, they get them from here
    users: [], //store references to other users for quick access here
    likes: [], //same idea here
    follows: [], //same idea here
    methods: {
      //persist the cache to localStorage, by taking state and storing in localStorage
      persistThisCache: (cache) =>
        localStorage.setItem('cache', JSON.stringify(cache)),
      clearThisCache: () => localStorage.clear(),
      getPersistedCache: () => JSON.parse(localStorage.getItem('cache')),
      updateThisCache: (newCacheData) =>
        set((state) => ({ ...state, newCacheData })),
      pushToThisCache: (key = 'currentUser', data = {}) => {
        if (typeof data === 'object')
          set((state) => {
            state.cache[key] = data
            return {
              ...state,
              cache: { ...state.cache }
            }
          })
        if (typeof data === 'array')
          set((state) => {
            state.cache[key].push(data)
            return {
              ...state,
              cache: { ...state.cache }
            }
          })
      },
      //key and item must be in 1 to 1 correspondance, keyList is the name of the field, idList is the value you search for to remove
      removeDataFromCache: (
        cacheType = 'posts',
        query = { posts: { id: '123' } }
      ) => {
        const keyList = Object.keys(query)
        const idList = Object.values(query)
        set((state) => {
          state.cache[cacheType] = state.cache[cacheType].filter((item) => {
            return !idList.includes(item[keyList[0]])
          })
          return {
            ...state,
            cache: { ...state.cache }
          }
        })
      },
      //**NOT MVP */
      checkForNotUpdatedData: () => {
        //search for notUpdated: true -> if found hold a list here -> find the associated data model -> use a data model instance to request the data gets updated, if it fails, repeat this method until it does, or wait till a valid datbase connection is established on the server
      }
    }
  },

  // ========================================================================== //
  //   Data models **act as a model to fill out to then be cached as fixed data**
  // ========================================================================== //
  //data models, these act as objects to instance, you populate them with data
  //temporarily, and then pass them to fixed state, thats remembered
  //**MVP */
  post: {
    //hold data for a post, then enact upon that data, or use static methods to interact with the cache
    id: '',
    media: null, //can be an image file, embed, video, etc
    message: '',
    postDate: '', //when the post was made
    postBy: '', //userId of the person who made the post
    comments: [], //array of commentId's
    likes: [], //array of likeId's
    methods: {
      //client side methods
      updateThisPost: (data) => {
        set((state) => ({
          ...state,
          post: {
            ...state.post,
            ...data
          }
        }))
      },
      //dont ever clear methods
      clearThisPost: () => {
        set((state) => ({
          ...state,
          post: {
            // empty an object to clear all the fields except the methods
            ...Object(
              Object.keys(state.post).map((key) =>
                key !== 'methods' ? { [key]: '' } : { [key]: state.post[key] }
              )
            )
          }
        }))
      },
      //server side methods (update global state after a successful server request)
      getPost: async (postId) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      },
      getPosts: async (postIds = []) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      },
      updatePost: async (postId, post) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      },
      updatePosts: async (postIds = [], posts = []) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      },
      deletePost: async (postId) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      },
      createPost: async (newpost) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      },
      createPosts: async (newposts = []) => {
        ///use current post state -> api request if cant, do not proceed, log an error -> update cache
      }
    }
  },
  //**MVP */
  comment: {
    id: '',
    message: '',
    commentBy: '', //userId
    methods: {
      //client side methods
      updateThisComment: (data) => {
        set((state) => ({
          ...state,
          comment: {
            ...state.comment,
            ...data
          }
        }))
      },
      //dont ever clear methods
      clearThisComment: () => {
        set((state) => ({
          ...state,
          comment: {
            // empty an object to clear all the fields except the methods
            ...Object(
              Object.keys(state.comment).map((key) =>
                key !== 'methods'
                  ? { [key]: '' }
                  : { [key]: state.comment[key] }
              )
            )
          }
        }))
      },
      //server side methods (update global state after a successful server request)
      getComment: async (commentId) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      },
      getComments: async (commentIds = []) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      },
      updateComment: async (commentId, comment) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      },
      updateComments: async (commentIds = [], comments = []) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      },
      deleteComment: async (commentId) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      },
      createComment: async (newComment) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      },
      createComments: async (newComments = []) => {
        ///use current comment state -> api request if cant, do not proceed, log an error -> update cache
      }
    }
  },

  //auth is a list of all our users sensitive data, we dont want to store it all in one
  //place, so we store a reference to the users public data in the auth object
  //**MVP */
  account: {
    id: '',
    userId: '62396941eeb3bfab285fc75e', //default user (guest)
    username: '',
    accountType: '', //guest, admin, user
    password: '', //should be stored as a hash, ensure its SALTED for security
    methods: {
      fetchCurrentAccount: async (userId) => {
        const userData = await getUser({ query: { userId } })
          .then((d) => d)
          .catch((e) => e)
        set(async (state) => ({ ...state, user: await getUser({name: `aiden`}) }))
      },
      updateAccount: async (newPost) => {
      }
    }
  },
  like: {
    id: '',
    likedBy: [], //list of userIds
    likeType: '', //a reference to an emoji
    methods: {
      //client side methods
      updateThislike: (data) => {
        set((state) => ({
          ...state,
          like: {
            ...state.like,
            ...data
          }
        }))
      },
      //dont ever clear methods
      clearThisLike: () => {
        set((state) => ({
          ...state,
          like: {
            // empty an object to clear all the fields except the methods
            ...Object(
              Object.keys(state.like).map((key) =>
                key !== 'methods' ? { [key]: '' } : { [key]: state.like[key] }
              )
            )
          }
        }))
      },
      //server side methods (update global state after a successful server request)
      getLike: async (likeId) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      },
      getLikes: async (likeIds = []) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      },
      updateLike: async (likeId, like) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      },
      updateLikes: async (likeIds = [], likes = []) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      },
      deleteLike: async (likeId) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      },
      createLike: async (newlike) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      },
      createLikes: async (newlikes = []) => {
        ///use current like state -> api request if cant, do not proceed, log an error -> update cache
      }
    }
  },
  //**MVP */
  user: {
    //base data required of a user
    id: '62396941eeb3bfab285fc75e', //default user (guest)
    userType: 'guest',
    name: '',
    email: '',

    //expanded from usage after registering
    profilePhoto: '',
    posts: [], //take the current post data, and add it here before reading the next
    comments: [],
    online: false,
    likes: [],
    following: [],
    followers: [],
    methods: {
      //client side methods
      updateThisUser: (data) => {
        set((state) => ({
          ...state,
          user: {
            ...state.user,
            ...data
          }
        }))
      },
      //dont ever clear methods
      clearThisUser: () => {
        set((state) => ({
          ...state,
          user: {
            // empty an object to clear all the fields except the methods
            ...Object(
              Object.keys(state.user).map((key) =>
                key !== 'methods' ? { [key]: '' } : { [key]: state.user[key] }
              )
            )
          }
        }))
      },
      //server side methods (update global state after a successful server request)
      getUser: async (userId) => {
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      },
      getUsers: async (userIds ) => {
        const {body} = await getUsers(userIds)
        console.log(body)
        return body
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      },
      updateUser: async (userId, user) => {
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      },
      updateUsers: async (userIds = [], users = []) => {
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      },
      deleteUser: async (userId) => {
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      },
      createUser: async (newUser) => {
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      },
      createUsers: async (newUsers = []) => {
        ///use current user state -> api request if cant, do not proceed, log an error -> update cache
      }
    }
  },

  // ========================================================================== //
  //   App context **state maintained on the client side only**
  // ========================================================================== //
  appContext: {
    type: 'light',
    toggleTheme: () => {
      // TODO: move to methods for better separation
      set((state) => ({
        ...state,
        appContext: {
          ...state.appContext,
          type: state.appContext.type === 'light' ? 'dark' : 'light'
        }
      }))
    },

    isAppOffline: false, //check if app is online, this check can be used when making database operations

    //for app settings the user wants to persist, **not MVP**
    userPreferences: {
      theme: 'light'
    },
    location: {},
    methods: {
      setAppContext: (newAppContext) => {
        set((state) => ({
          ...state,
          appContext: {
            ...state.appContext,
            newAppContext
          }
        }))
      }
    }
  }
}))
//   import { devtools } from 'zustand/middleware'

// ========================================================================== //
// Using zustand with redux **not implemented yet**
// ========================================================================== //
// // Usage with a plain action store, it will log actions as "setState"
// const useStore = create(devtools(store))

// // Usage with a redux store, it will log full action types
// const useStore = create(devtools(redux(reducer, initialState)))

// ========================================================================== //
// Export the store and theme
// ========================================================================== //
export { createTheme, lt, dt, useStore }
