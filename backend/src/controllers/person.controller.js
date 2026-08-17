const Person = require("../models/person.model");

const createPerson = async (req, res) => {
    try {
        const person = await Person.create({
            ...req.body,
            createdBy: req.user?.userId
        });

        res.status(201).json({
            success: true,
            message: "Person created successfully",
            data: person
        });

    } catch (error) {
        console.error("Create person error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create person",
            error: error.message
        });
    }
};

const getPeople = async (req, res) => {
    try {
        const people = await Person.find({
            createdBy: req.user?.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: people.length,
            data: people
        });

    } catch (error) {
        console.error("Get people error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch people",
            error: error.message
        });
    }
};

const updatePerson = async (req, res) => {
    try {
        const { id } = req.params;

        const person = await Person.findOneAndUpdate(
            {
                _id: id,
                createdBy: req.user?.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found or not authorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Person updated successfully",
            data: person
        });

    } catch (error) {
        console.error("Update person error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to update person",
            error: error.message
        });
    }
};

const deletePerson = async (req, res) => {
    try {
        const { id } = req.params;

        const person = await Person.findOneAndDelete({
            _id: id,
            createdBy: req.user?.userId
        });

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found or not authorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Person deleted successfully"
        });

    } catch (error) {
        console.error("Delete person error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete person",
            error: error.message
        });
    }
};

const addFollowUp = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            date,
            status,
            remark
        } = req.body;

        const person = await Person.findOne({
            _id: id,
            createdBy: req.user?.userId
        });

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found or not authorized"
            });
        }

        const followUpNumber =
            person.followUps.length + 1;

        person.followUps.push({
            followUpNumber,
            date,
            status,
            remark
        });

        await person.save();

        res.status(201).json({
            success: true,
            message: "Follow-up added successfully",
            data: person
        });

    } catch (error) {
        console.error(
            "Add follow-up error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to add follow-up",
            error: error.message
        });
    }
};

const updateFollowUp = async (req, res) => {
    try {
        const {
            id,
            followUpId
        } = req.params;

        const {
            date,
            status,
            remark
        } = req.body;

        const person = await Person.findOne({
            _id: id,
            createdBy: req.user?.userId
        });

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found or not authorized"
            });
        }

        const followUp =
            person.followUps.id(followUpId);

        if (!followUp) {
            return res.status(404).json({
                success: false,
                message: "Follow-up not found"
            });
        }

        if (date !== undefined) {
            followUp.date = date;
        }

        if (status !== undefined) {
            followUp.status = status;
        }

        if (remark !== undefined) {
            followUp.remark = remark;
        }

        await person.save();

        res.status(200).json({
            success: true,
            message: "Follow-up updated successfully",
            data: person
        });

    } catch (error) {
        console.error(
            "Update follow-up error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to update follow-up",
            error: error.message
        });
    }
};

const deleteFollowUp = async (req, res) => {
    try {
        const {
            id,
            followUpId
        } = req.params;

        const person = await Person.findOne({
            _id: id,
            createdBy: req.user?.userId
        });

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found or not authorized"
            });
        }

        const followUp =
            person.followUps.id(followUpId);

        if (!followUp) {
            return res.status(404).json({
                success: false,
                message: "Follow-up not found"
            });
        }

        followUp.deleteOne();

        await person.save();

        res.status(200).json({
            success: true,
            message: "Follow-up deleted successfully",
            data: person
        });

    } catch (error) {
        console.error(
            "Delete follow-up error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete follow-up",
            error: error.message
        });
    }
};

module.exports = {
    createPerson,
    getPeople,
    updatePerson,
    deletePerson,

    addFollowUp,
    updateFollowUp,
    deleteFollowUp
};