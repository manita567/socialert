// ========================================================================== //
// Express base setup
// ========================================================================== //
const path = require('path')
const axios = require('axios')

const express = require('express')

const router = express.Router()
const app = express()

const bodyParser = require('body-parser')
const http = require('http')
const fs = require('fs')

const socketIo = require('socket.io')
const { connecToMongo, createApi } = require('./db/db-connect')

// read and apply variables that are sensitive based on the context .env
const dotenv = require('dotenv').config({
  path: `${process.cwd()}/.${process.env}.env`
})


// ========================================================================== //
// Server security setup
// ========================================================================== //
// const contentSecurityPolicy = require('helmet-csp');
// const session = require('express-session');
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// basic ddos protection
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: process.env.NODE_ENV === 'production' ? 40 : 10000 // limit each IP to 40 requests per windowMs (per hour)
})

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1) // trust first proxy
// if (process.env.NODE_ENV === "production")
// app.use(contentSecurityPolicy.getDefaultDirectives());
app.use(helmet())
const corsOptions = {
  origin: process.env.CORS_WHITELIST,
  credentials: false,
  methods: 'GET,POST',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.options('*', cors(corsOptions))
app.use(limiter) //  apply to all requests



// ========================================================================== //
// Sockets **for live-chat features**
// ========================================================================== //
const httpServer = http.createServer(app)
const io = socketIo(httpServer)
io.on('connection', (socket) => {
  console.log('A client connected', socket.id)
})
process.on('unhandledRejection', (err) => {
  console.error('unhandled promise rejection detected')
  console.error(err)
  process.exit(1)
})



// ========================================================================== //
// Configuration
// ========================================================================== //
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000,
  // inflate: true for if you are sending compressed data
  reviver: (key, value) => //called in JSON.parse(_, here)
    value,
  // strict: true,
  type: 'application/json',
  // verify: (req, res, buf) => {
  //   if (buf.toString('base64').length > req.headers['content-length']) {
  //     throw new Error('Request body larger than content-length!')
  //   }
  // },
}))


// ========================================================================== //
// Middleware
// ========================================================================== //
// these happen between requests, the compression below means data is compressed
// on each end of the request
// therefore it happens in the MIDDLE of the request hence MIDDLEware

// const functionName = 'standalone-aws-serverless-express-example'
// const basePath = `/.netlify/functions/${functionName}/`
// router.use(compression());
// router.use(awsServerlessExpressMiddleware.eventContext())
/* We need to set our base path for express to match on our function route */

// ========================================================================== //
// Re-usable headers you can re-use when handling request/result api requests
// ========================================================================== //

//example, with some common header types you can play around with / reasearch
const commonHeaders = {
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
// Image File utilities
// ========================================================================== //
const streamConfig = {
  // ./file-name.ext
  // {highWaterMark: 16}
}
// No more than 5mb total TODO: will upgrade host to AWs for more advanced use cases and larger files
const readImageFiles = (files) => {
  const images = []
  files.forEach((file) => {
    const { createReadStream } = file
    const stream = createReadStream(streamConfig)
    stream.on('data', (data) => images.push(data)) // transfer bye by byte in chunks
    stream.on('end', () => console.log('end :', Buffer.concat(file).toString()))
    stream.on('error', (err) => console.log('error :', err))
  })
  return images.map((file) => ({
    filename: `referencePhotos-${new Date().toDateString()}.jpg`,
    content: file,
    contentType: 'application/jpg'
  }))
}
 

// ========================================================================== //
// Mongodb Utility functions
// ========================================================================== //
// if you are filtering with the _id field you need to use ObjectId as such...
// { _id: ObjectId(theId) }


// ========================================================================== //
// Atomic Operations
// ========================================================================== //
//you can pass subroutines which run when updating/inserting data, the following
// is a list of these, they are reffered to as ATOMIC OPERATTIONS
// {$set: {key.childKey(if any child key) or key.0(if the key is a array) or key(if its just a key): value}}
// $inc
// $push
// $pull
// $unset
// $rename
// $bit
// $min
// $max
// $currentDate
// $addToSet
// $pop
// $pullAll
// $pushAll
// $each
// $position
// $sort
// $geoWithin
// $geoIntersects
// $geoNear
// $text 
const atomicOperations = {
  $set: '$set',
  $inc: '$inc',
  $push: '$push',
  $pull: '$pull',
  $unset: '$unset',
  $rename: '$rename',
  $bit: '$bit',
  $min: '$min',
  $max: '$max',
  $currentDate: '$currentDate',
  $addToSet: '$addToSet',
  $pop: '$pop',
  $pullAll: '$pullAll',
  $pushAll: '$pushAll',
  $each: '$each',
  $position: '$position',
  $sort: '$sort',
  $geoWithin: '$geoWithin',
  $geoIntersects: '$geoIntersects',
  $geoNear: '$geoNear',
  $text: '$text'
}


// #region mongo utility
const defaultHeaders = {
  isBase64Encoded: false,
  multiValueHeaders: { 'Content-Type': 'application/json' }
}
const handleResFromPromise = async function (
  res,
  promise,
  chained = false,
  resConfig = {
    statusCode: 404,
    body: '',
    ...defaultHeaders,
  }
) {
  //only return results 
  if (chained) {
    return await promise.forEach((promise) =>
      promise
      .then((result) => result)
      .catch((result) => result)
    )
  }
  //return and handle results
  else {
    return await promise
      .then((result) => {
        console.log(result)
        if(result){
          resConfig.body = JSON.stringify(result)
          resConfig.statusCode = 200
          res.send(resConfig)}
        else{
          resConfig.body = JSON.stringify(result+' did not find result from query')
          resConfig.statusCode = 404
          res.send(resConfig)
        }
      })
      .catch((err) => {
        console.log(err)
        resConfig.body = JSON.stringify(err)
        resConfig.statusCode = 500
        res.send(resConfig)
      })
  }
}
// ========================================================================== //
// If you want to call multiple datbase operations in one go, use chainRequests,
// which are a reference to the below method functions
// ========================================================================== //
const chainedRequests = function (res, chainedCallbacks = [], dependent = false) {
  // if(dependent)
    // return (chainedCallbacks.reduce((prevMethod, curMethod, index) => await curMethod()))
  // else
  if(chainedCallbacks != [])
    return chainedCallbacks.forEach(async (method) => {
      console.log(method)
      return await method(true)//tell methods they are chained
    }
    )
}
const parseQuery = function (collectionType, query) {
  //based on the colleciton type, pre-process the query to fit the format correctly
}

// ========================================================================== //
// Databse methods to re-use
// ========================================================================== //
const findOne = async function (res, collection, query = {},chained=false) {
  if (query != {} && res)
    return handleResFromPromise(
      res,
      new Promise((resolve, reject) => {
        collection.findOne(query, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const find = async function (res, collection, query = {}, options,chained=false) {
  if (query != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.find(query,options).toArray((err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
} 
const insertOne = (res, collection, query = {},options,chained=false) => {
  if (query != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.insertOne(query, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
// ========================================================================== //
// insert many takes an array of queries, where the query is the data your inserting
// ========================================================================== //
const insertMany = (res, collection, query = [],options,chained=false) => {
  if (query != [] && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.insertMany(query,options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const count = (res, collection, query = {},options,chained=false) => {
  if (query != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.count(query,options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}

// ============================================================================================= //
//  you MUST pass a filter, and a query to update which uses ATOMIC OPERATIONS (see above list)
// ============================================================================================ //
const updateOne = (res, collection, queryFilter, queryUpdate, options={}, chained=false) => {
  if (queryFilter != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.updateOne(queryFilter, queryUpdate, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
  else
    res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const findOneAndUpdate = (res, collection, queryFilter, queryUpdate, options={}, chained=false) => {
  if (queryFilter != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.findOneAndUpdate(queryFilter, queryUpdate, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
  else
    res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
  
// ========================================================================== //
//  you can use the following operations on updateMany methods
//  like update one, except it takes an array of query filters and updates
//  {$set: {key.childKey(if any child key) or key.0(if the key is a array) or key(if its just a key): value}}    
const updateMany = (res, collection, queryFilter, queryUpdate, options={}, chained=false) => {
  if (queryFilter != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.updateMany(queryFilter, queryUpdate, options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
  else
    res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
}
const deleteOne = (res, collection, query = {},chained=false) => {
  if (query != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.deleteOne(query, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
} 
const deleteMany = (res, collection, query={}, options ,chained=false) => {
  if (query != {} && res)
    return handleResFromPromise(
      res, 
      new Promise((resolve, reject) => {
        collection.deleteMany(query,options, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    )
    else res.send({
      statusCode: 500,
      body: 'you must pass in a valid query and res to call the db',
      ...defaultHeaders,
    })
} 
//#endregion mongo utility

// ========================================================================== //
// API setup
// ========================================================================== //
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<h1>Hello from Aiden Faulconer!</h1>')
  res.end()
})

//allow localhost requests on this server
if (process.env.NODE_ENV === "development")
  router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
  })

// ========================================================================== //
// Example mongodb database request
// ========================================================================== //
router.get('/api/getUser', async (req, res) => {
  const { query,headers} = req
  
  console.log(query)


  connecToMongo('socialert', (db) => {
    const collection = db.collection('users') //get user collection 
    const user = collection //get a user from collection
    //determine the type of query we are performing
    const _query =
      query.userId ? { userId: query.userId } :
        query.name ? { name: query.name } :
          query.email ? { email: query.email } :
            query.phone ? { phone: query.phone } :
              query.followers ? { followers: query.followers } :
                query.following ? { following: query.following } :
                  query.posts ? { posts: query.posts } :
                    query.comments ? { comments: query.comments } : 
                      {}
                    
    console.log(`=== getting ${headers.many?"many":"one"}  ${JSON.stringify(_query)} query ===`)
    if(headers.many) find(res, user, _query)  
    else findOne(res, user, _query)  
  })
})

// ========================================================================== //
// to update data, we use body, for simple queries we use the query param
// ========================================================================== // 
router.post('/api/updateUser', async (req, res) => {
  const { query,body,headers } = req

  connecToMongo('socialert', (db) => {
    const userCollection = db.collection('users') //get user collection  
    //determine the type of query we are performing
    const _queryFilter =
      query.userId ? { userId: query.userId } :
        query.name ? { name: query.name } :
          query.email ? { email: query.email } :
            query.phone ? { phone: query.phone } :
              query.followers ? { followers: query.followers } :
                query.following ? { following: query.following } :
                  query.posts ? { posts: query.posts } :
                    query.comments ? { comments: query.comments } : 
                      {}
    

    const _queryUpdate = body.delete ? {} : body ? body : res.send({
      //not reccomended to pass no data, it will update data to nothing
      body: 'you must declare you wish to clear a record, cannot pass a null body',
      statusCode: 500,
    })
 
    // const passOperationsToBody = {
    //   [atomicOperations.$rename]: body,
    // }

    //update options
    // const options = { upsert: true, returnOriginal: true, new: true }
    const options = {} 
    
    console.log(`=== updating ${headers.many?"many":"one"} ${JSON.stringify(_queryFilter)} query | updating with ${_queryUpdate} ===`)
    if(headers.many) updateMany(res, userCollection, _queryFilter, _queryUpdate, options)  
    else findOneAndUpdate(res, userCollection, _queryFilter, _queryUpdate, options)  
  })
})

// ========================================================================== //
// to insert data, we use body
// ========================================================================== // 
router.post('/api/createUser', async (req, res) => {
  const { body,headers } = req

  connecToMongo('socialert', (db) => {
    const userCollection = db.collection('users') //get user collection 
      
    

    const _queryUpdate =  body ? body : res.send({
      statusCode: 500,
      body: 'you cannot insert empty data, or incorrectly formed data',//not reccomended to pass no data, it will update data to nothing
    })
 
    // const passOperationsToBody = {
    //   [atomicOperations.$rename]: body,
    // }

    //update options
    // const options = { upsert: true, returnOriginal: true, forceServerObjectId }
    const options = {} 
    
    console.log(`=== adding ${headers.many?"many":"one"} user ${_queryUpdate} ===`)
    if (headers.many) insertMany(res, userCollection, _queryUpdate, options)
    else insertOne(res, userCollection, _queryUpdate, options)  
  })
})

// ========================================================================== //
// to insert data, we use body
// ========================================================================== // 
router.delete('/api/deleteUser', async (req, res) => {
  const { query,headers } = req
  
  if (!query && query === {}) res.send({
    statusCode: 500,
    body: 'you must pass in a query, or else you will drop the entire collection!!!',
  })

  connecToMongo('socialert', (db) => {
    const userCollection = db.collection('users') //get user collection 
    //determine the type of query we are performing
    const _query =
      query.userId ? { userId: query.userId } :
        query.name ? { name: query.name } :
          query.email ? { email: query.email } :
            query.phone ? { phone: query.phone } :
              query.followers ? { followers: query.followers } :
                query.following ? { following: query.following } :
                  query.posts ? { posts: query.posts } :
                    query.comments ? { comments: query.comments } :
                      {}
                    
    console.log(`=== deleting ${headers.many?"many":"one"} ${JSON.stringify(_query)} query ===`)
    const options = {}
    if(headers.many) deleteMany(res, userCollection, _query,options)
    else deleteOne(res, userCollection, _query,options)
  })
})

// app.use('/', (req, res) => res.sendFile(path.join(process.cwd(), './public/index.html')));
app.use('/api/test', (req, res) => {
  const {
    body,
    headers,
    readable,
    rawTrailers,
    socket,
    secure,
    subdomains,
    statusMessage,
    complete,
    fresh,
    ip,
    method,
    originalUrl,
    params,
    protocol,
    query
  } = req
  res.write(
    JSON.stringify(
      {
        message: 'you sent this information',
        body,
        headers,
        complete,
        fresh,
        ip,
        method,
        originalUrl,
        params,
        protocol,
        query,
        rawTrailers,
        readable,
        secure,
        // socket,
        subdomains,
        statusMessage
      },
      null,
      2
    )
  )
})
app.use('/api/test2', (req, res) => {
  const {
    body,
    headers,
    readable,
    rawTrailers,
    socket,
    secure,
    subdomains,
    statusMessage,
    complete,
    fresh,
    ip,
    method,
    originalUrl,
    params,
    protocol,
    query
  } = req
  res.write(
    JSON.stringify(
      {
        message: 'hey, you said hi!'
      },
      null,
      2
    )
  )
})


// ========================================================================== //
// Shoot an email
// ========================================================================== //
const { jsPDF } = require('jspdf')
const nodemailer = require('nodemailer') 

// ========================================================================== //
// sendEmail
// ========================================================================== //
app.post('/api/sendEmail', async (req, res) => {
  console.log(req)
  const { message, recipient } = req.body

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST || 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    debug: true,
    logger: true,
    auth: {
      user: process.env.MAIL_SENDER || '',
      pass: process.env.MAIL_P || ''
    }
  })
  // method to parse string from body

  console.log(`Sending PDF report to ${recipient}`)

  const report = Buffer.from(
    new jsPDF()
      .text(JSON.stringify(message, null, 2), 10, 10)
      .output('arraybuffer')
  )
  const invoice = await transporter.sendMail(
    {
      from: process.env.MAIL_SENDER,
      to: recipient,
      subject: 'Socialert - fix forgotten password',
      text: '',
      attachments: [
        report && {
          filename: `report-${new Date().toDateString()}.pdf`,
          content: report,
          contentType: 'application/pdf'
        }
      ],
      message
    },
    (err, info) => {
      if (err) console.log(err)
      console.log(info)
    }
  )
 
  res.send({
    statusCode: 200,
    body: JSON.stringify({ message: JSON.stringify(invoice) }),
    isBase64Encoded: false,
    multiValueHeaders: {
      'Content-Type': 'application/json'
    }
  })
})


// ========================================================================== //
// Extras **not used currently**
// ========================================================================== //

// ========================================================================== //
//      Search Weather
// ========================================================================== //
app.get('/api/weather', (req, res) => {
  const { query } = req
  res
    .send(
      axios
        .get(
          `${process.env.NODE_ENV.APIURL}/data/2.5/weather?q=${query}&appid=${process.env.OPENWEATHERAPIKEY}`
        )
        .then((data) => data)
    )
    .catch((err) => err)
})

// ========================================================================== //
//      Recatpcha
// ========================================================================== //
app.use('/api/recaptcha', (req, res) => {})

// ========================================================================== //
//      Google spreadsheet api
// ========================================================================== //
app.post('/api/spreadsheets', (req, res) => {
  const { body } = req
  res
    .send(
      axios
        .post({
          url: `${process.env.GOOGLESPREADSHEETSURL}/${process.env.GOOGLESPREADSHEETID}/values/A57:append`,
          headers: {
            accept: '*/*',
            userAgent: '*'
          },
          query: {
            valueInputOption: 'RAW',
            includeGridData: true,
            key: '',
            insertDataOption: 'RAW',
            responseDAteTimeRenderOption: 'SERIAL_NUMBER'
          },
          // range: 'A57:A59',
          // majorDimension: 'COLUMN', // READ MORE AT https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#dimension
          // values: ['james is a nicesmellingbutthead', 'ASDFASDFASDF', 'asdfasdfasdf'],
          body
        })
        .then((data) => data)
    )
    .catch((err) => err)
})

// ========================================================================== //
//      Google maps search
// ========================================================================== //
app.get('/api/spreadsheets', (req, res) => {
  const {
    body: { lat, lng }
  } = req
  res
    .send(
      axios
        .get(
          `${process.env.GOOGLEMAPAPIURL}?latlng=${lat},${lng}&key=${process.env.GOOGLEAPIKEY}`
        )
        .then((data) => data)
    )
    .catch((err) => err)
})

// ========================================================================== //
//      Reverse geocode
// ========================================================================== //
app.get('/api/reversegeocode', (req, res) => {
  const {
    params: { location, language }
  } = req
  res
    .send(
      axios(process.env.RGEOCODEURL, {
        method: 'get',
        headers: {
          ...commonHeaders,
          'x-rapidapi-host': process.env.RGEOCODEHOST,
          'x-rapidapi-key': process.env.RGEOCODEKEY
        },
        params: {
          location /** : `${lat},${lon}`, */,
          language
        },
        body: {
          code: 'US'
        }
      }).then((data) => data)
    )
    .catch((err) => err)
})
module.exports = { app, router }
