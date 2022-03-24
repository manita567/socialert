// ========================================================================== //
// MODELS
// ========================================================================== //
// these are the models that are used in the database, from these models we
// can call CRUD operations from them, ie: model.find(), model.findOne(), etc...
// ========================================================================== //

// ========================================================================== //
// Schemas
// ========================================================================== //
// these enforce the data structure so we stricyly enforce them to avoid
// inconsistent data on the datbase
module.exports = mongoose => {
    
    //create the schema
    const schema = mongoose.model(
      "user",
      mongoose.Schema(
        {
          title: String,
          description: String,
          published: Boolean,
          followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], 
          following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], 
          posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
        },
        { timestamps: true }
      )
    );

    //method to handle the schema every time its used, this one converts it to JSON every time
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    
    //combine methods with schema
    const User = mongoose.model('user', schema);

    return User;
  };