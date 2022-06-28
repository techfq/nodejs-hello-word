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
            const project = new Project(
               doc.id,
               doc.data().firstName,
               doc.data().lastName,
               doc.data().fatherName,
               doc.data().class,
               doc.data().age,
               doc.data().phoneNumber,
               doc.data().subject,
               doc.data().year,
               doc.data().semester,
               doc.data().status
            );
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
            .update({ ticketNumber: _runtime.waiting, token: user.id, current: _runtime.current });
         res.send({ ticketNumber: _runtime.waiting, token: user.id, current: _runtime.current });
      }
   } catch (error) {
      res.status(400).send(error.message);
   }
};

const tellerCall = async (req, res, next) => {
   try {
      const id = req.params.id;
      const data = req.body;
      const user = await firestore.collection("users");

      const project = await firestore.collection("projects").doc(id);
      const prjData = await project.get();
      if (!prjData.exists) {
         res.status(404).send("Project with the given ID not found");
      } else {
         let _runtime = prjData.data().runtime;
         let active = _runtime.queue.shift();
         const userData = await user.doc(active).get();
         if (!userData.exists) {
            await project.update({ runtime: _runtime });
            res.status(404).send("User with the given ID not found");
         } else {
            _runtime.current = userData.data().ticketNumber;
            await user.doc(active).update(data);
            await project.update({ runtime: _runtime });
            res.send({ runtime: _runtime, user: userData.data() });
         }
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
   deleteProject,
   getNumber,
   tellerCall,
};
