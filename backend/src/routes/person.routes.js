const express = require("express");

const router = express.Router();

const {
    createPerson,
    getPeople,
    updatePerson,
    deletePerson,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp
} = require("../controllers/person.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", createPerson);

router.get("/", getPeople);

router.put("/:id", updatePerson);

router.delete("/:id", deletePerson);

router.post(
    "/:id/followups",
    addFollowUp
);

router.put(
    "/:id/followups/:followUpId",
    updateFollowUp
);

router.delete(
    "/:id/followups/:followUpId",
    deleteFollowUp
);


module.exports = router;