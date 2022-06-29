const express = require("express");
const {
   addProject,
   getAllProjects,
   getProject,
   updateProject,
   deleteProject,
   resetProject,
   getNumber,
   tellerCall,
   requestRate,
   tellerCheckQueue,
   userRate,
   getUser,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/projects", getAllProjects);
router.get("/project/:id", getProject);
router.post("/project", addProject);
router.put("/project/:id", updateProject);
router.get("/project/reset/:id", resetProject);
// FOR TELLER
router.get("/user/request-rate/:id", requestRate);
router.put("/project/:id/tellerCall/:userId", tellerCall);
router.put("/project/:id/tellercheckqueue", tellerCheckQueue);
// USERS
router.put("/project/:id/getnumber", getNumber);
router.get("/user/:id/:rate", userRate);
router.get("/user/:id", getUser);
// router.delete("/project/:id", deleteProject);

module.exports = {
   routes: router,
};
