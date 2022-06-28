const express = require("express");
const {
   addProject,
   getAllProjects,
   getProject,
   updateProject,
   deleteProject,
   getNumber,
   tellerCall,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/project", addProject);
router.get("/projects", getAllProjects);
router.get("/project/:id", getProject);
router.put("/project/:id", updateProject);
router.put("/project/:id/getnumber", getNumber);
router.put("/project/:id/tellerCall", tellerCall);
// router.delete("/project/:id", deleteProject);

module.exports = {
   routes: router,
};
