const connectionString = process.env.MONGO_DB_AUTH; 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_DB_AUTH
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// ========================================================================== //
// mongoose
// ========================================================================== //
// enforces the schema of the data, mongodb is no-sql meaning it does not
// require a schema to store data, which is messy, mongoose mimics the schema 
// that we enforce for us
const glob = require('glob');
const mongoose = require('mongoose').connect(uri);

// ========================================================================== //
//  Automatically create api endpoints
// ========================================================================== //
//for each model
      //find a controller
        //create an api route for each controller found
        //POST create + modelName
        //GET findAll + modelName
        //GET findOne + modelName
        //GET findAllPublished + modelName
        //PUT update + modelName
        //DELETE delete + modelName
        //DELETE deleteAll + modelName
    
    // delete = delete, put = update, get = find, post = create
//mongodb has name conventions that relate to the request type 
checkReqType = (string) => {
  const POST = new RegExp(`/(create)/mg`);
  const GET = new RegExp(`/(find)/mg`);
  const PUT = new RegExp(`/(update|insert)/mg`);
  const DELETE = new RegExp(`/(delete)/mg`);
  return POST.test(string) ? 'POST' : GET.test(string) ? 'GET' : PUT.test(string) ? 'PUT' : DELETE.test(string) ? 'DELETE' : console.log('no valid method type');
}
//take our express app, and add routes automatically based on models and controllers declared
const createApi = (app) => {
  const models = glob.sync('./src/model/*.model.js',);
  return models.map(model => {
    const _model = require(model(mongoose))
    //get the controller by model name, then pass it the schema it needs
    const controller = glob.sync(`./src/controllers/${_model.name}.controller.js`)(_model.model);
    Object.keys(controller).forEach(methodName => {
      switch (checkReqType(methodName)) {
        //example: one of these could be an POST endpoint for api/user-create
        case 'POST': app.post(`api/${_model.name}-${methodName}`, controller[methodName]); break;
        case 'GET': app.get(`api/${_model.name}-${methodName}`, controller[methodName]); break;
        case 'PUT': app.get(`api/${_model.name}-${methodName}`, controller[methodName]); break;
        case 'UPDATE': app.get(`api/${_model.name}-${methodName}`, controller[methodName]); break;
        default: console.log('no valid method type');
      }
    });
    console.log('====== created api endpoints for model: =====', _model.name);
  })
};

//old fasioned way of doing this
const connecToMongo = (DB_NAME = "socialert",handler) => {
  return client.connect((err, connection) => {
    if (err) return handler(callback, err);
    
    console.log("======== Connected successfully to Mongodb ========");
    // we pass a handler to pass off too, as the db connection only exists
    // inside this functions scope
    handler(connection.db(DB_NAME));
  });
}
  
module.exports = {
  connecToMongo,
  createApi,
}; 