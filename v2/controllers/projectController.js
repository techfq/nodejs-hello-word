"use strict";

const firebase = require("../../db");
const Project = require("../models/project");
const firestore = firebase.firestore();

const addProject = async (req, res, next) => {
   try {
      const data = req.body;
      const newPrj = await firestore.collection("projects").add(data);
      console.log(newPrj);
      res.send(`Record ${newPrj.id} saved successfuly`);
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const getAllProjects = async (req, res, next) => {
   try {
      const projects = await firestore.collection("projects");
      const data = await projects.get();
      const projectsArray = [];
      if (data.empty) {
         res.status(404).send("No project record found");
      } else {
         data.forEach((doc) => {
            const project = new Project(doc.id, doc.data().name, doc.data().information.address);
            projectsArray.push(project);
         });
         res.send(projectsArray);
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const getProject = async (req, res, next) => {
   try {
      const id = req.params.id;
      const project = await firestore.collection("projects").doc(id);
      const data = await project.get();
      if (!data.exists) {
         res.status(404).send("Project with the given ID not found");
      } else {
         res.send(data.data());
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const updateProject = async (req, res, next) => {
   try {
      const id = req.params.id;
      const data = req.body;
      const project = await firestore.collection("projects").doc(id);
      await project.update(data);
      res.send("Project record updated successfuly");
   } catch (error) {
      res.status(400).send(error.message);
   }
};
const resetProject = async (req, res, next) => {
   try {
      const id = req.params.id;
      const project = await firestore.collection("projects").doc(id);
      const doc = await project.get();
      if (!doc.exists) {
         res.status(404).send("Project with the given ID not found");
      } else {
         let runtime = doc.data().runtime;
         runtime.current = 0;
         runtime.waiting = 0;
         runtime.queue = [];
         await project.update({ runtime: runtime });
         res.send("Project record updated successfuly");
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const getNumber = async (req, res, next) => {
   try {
      const id = req.params.id;
      const data = req.body;
      const user = await firestore.collection("users").add(data);

      const project = await firestore.collection("projects").doc(id);
      const prjData = await project.get();
      if (!prjData.exists) {
         res.status(404).send("Project with the given ID not found");
      } else {
         let _runtime = prjData.data().runtime;
         _runtime.waiting += 1;
         if (_runtime.lowest > _runtime.waiting || _runtime.waiting > _runtime.highest) _runtime.waiting = _runtime.lowest;
         _runtime.queue.push(user.id);
         await project.update({ runtime: _runtime });
         await firestore
            .collection("users")
            .doc(user.id)
            .update({ ticketNumber: _runtime.waiting, token: user.id, current: _runtime.current, timeIn: Date.now() });
         res.send({ ticketNumber: _runtime.waiting, token: user.id, current: _runtime.current });
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const tellerCall = async (req, res, next) => {
   try {
      const id = req.params.id;
      const userID = req.params.userId;
      const data = req.body;
      const user = await firestore.collection("users").doc(userID);
      const userData = await user.get();
      const project = await firestore.collection("projects").doc(id);
      const prjData = await project.get();
      if (!prjData.exists) {
         res.status(404).send("Project with the given ID not found");
      } else {
         if (!userData.exists) {
            res.status(404).send("User with the given ID not found");
         } else {
            let _runtime = prjData.data().runtime;
            _runtime.current = userData.data().ticketNumber;
            await project.update({ runtime: _runtime });
            data["timeCall"] = Date.now();
            await user.update(data);
            res.send({ runtime: _runtime, user: userData.data() });
         }
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const tellerCheckQueue = async (req, res, next) => {
   try {
      const id = req.params.id;
      const data = req.body;

      const project = await firestore.collection("projects").doc(id);
      const prjData = await project.get();
      if (!prjData.exists) {
         res.status(404).send("Project with the given ID not found");
      } else {
         let _runtime = prjData.data().runtime;
         let active = _runtime.queue.shift();
         if (!active) {
            res.status(404).send("No queue");
         } else {
            await project.update({ runtime: _runtime });
            res.send({ active: active, runtime: _runtime });
         }
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const requestRate = async (req, res, next) => {
   try {
      const id = req.params.id;
      const user = await firestore.collection("users").doc(id);
      const userData = await user.get();
      if (!userData.exists) {
         res.status(404).send("User with the given ID not found");
      } else {
         await user.update({ timeOut: Date.now() });
         res.status(200).send("Success");
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const userRate = async (req, res, next) => {
   try {
      const id = req.params.id;
      const rate = parseInt(req.params.rate);
      const user = await firestore.collection("users").doc(id);
      const userData = await user.get();
      if (!userData.exists) {
         res.status(404).send("User with the given ID not found");
      } else {
         await user.update({ rate: rate });
         res.status(200).send("Success");
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const getUser = async (req, res, next) => {
   try {
      const id = req.params.id;
      const user = await firestore.collection("users").doc(id);
      const userData = await user.get();
      if (!userData.exists) {
         res.status(404).send("User with the given ID not found");
      } else {
         res.status(200).send(userData.data());
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const deleteProject = async (req, res, next) => {
   try {
      const id = req.params.id;
      await firestore.collection("projects").doc(id).delete();
      res.send("Record deleted successfuly");
   } catch (error) {
      res.status(400).send(error.message);
   }
};

module.exports = {
   addProject,
   getAllProjects,
   getProject,
   updateProject,
   resetProject,
   deleteProject,
   getNumber,
   tellerCall,
   requestRate,
   tellerCheckQueue,
   userRate,
   getUser,
};
