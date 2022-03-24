const db = require("../models/user.model.js");
const User = db.tutorials;


//creates generic CRUD methods for each model
//models come bundled with all of mongodb's CRUD methods
//we create an instance of a model, if we are creating a new document, we must enforce its schema
const dbController = (model) => {
  return {
    "create": (req, res) => {
      // Validate request
      if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
      }
      // Create a model with the body as it is
      const Model = new model({...req.body});
      // Save model in the database
      Model
        .save(Model)
        .then(data =>res.send(data))
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the model."
          });
        });
    },


    "findAll": (req, res) => {
      const title = req.query.title;
      var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
      model.find(condition)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials."
          });
        });
    },


    "findOne": (req, res) => {
      const id = req.params.id;
      model.findById(id)
        .then(data => {
          if (!data)
            res.status(404).send({ message: "Not found model with id " + id });
          else res.send(data);
        })
        .catch(err => {
          res
            .status(500)
            .send({ message: "Error retrieving model with id=" + id });
        });
    },

    
    "update": (req, res) => {
      if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
      const id = req.params.id;
      model.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update model with id=${id}. Maybe model was not found!`
            });
          } else res.send({ message: "model was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating model with id=" + id
          });
        });
    },

    
    "delete": (req, res) => {
      const id = req.params.id;
      model.findByIdAndRemove(id)
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot delete model with id=${id}. Maybe model was not found!`
            });
          } else {
            res.send({
              message: "model was deleted successfully!"
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete model with id=" + id
          });
        });
    },

    
    "deleteAll": (req, res) => {
      model.deleteMany({})
        .then(data => {
          res.send({
            message: `${data.deletedCount} models were deleted successfully!`
          });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tutorials."
          });
        });
    },

    
    "findAllPublished": (req, res) => {
      model.find({ published: true })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials."
          });
        });
    }
  }
}