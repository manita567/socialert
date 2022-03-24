const swaggerJsdoc = require('swapper-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Socialert Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Sociaelrt',
        url: 'socialert.netlify.app'
      }
    }
    // servers: [
    //   {
    //     url: "http://localhost:3001/server",
    //   },
    // ],
  }
  // apis: ["./routes/server"],
}

//start swaggerui endpoint
const startSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options),{explorer: true}))
}

module.exports = startSwagger


// ========================================================================== //
// Swagger is useful for big apis, but it's not a requirement for the MVP
// ========================================================================== //
// you would need to define the documentation based on the models and controllers
// this is how you can declare such definitions, or we can use mongoose 
//   @swagger
//   components:
//     schemas:
//       Book:
//         type: object
//         required:
//           - title
//           - author
//           - finished
//         properties:
//           id:
//             type: integer
//             description: The auto-generated id of the book.
//           title:
//             type: string
//             description: The title of your book.
//           author:
//             type: string
//             description: Who wrote the book?
//           finished:
//             type: boolean
//             description: Have you finished reading it?
//           createdAt:
//             type: string
//             format: date
//             description: The date of the record creation.
//         example:
//            title: The Pragmatic Programmer
//            author: Andy Hunt / Dave Thomas
//            finished: true
// /


