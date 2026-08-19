const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
    {
        followUpNumber: {
            type: Number,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["pending", "completed", "cancelled"]
        },

        remark: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: true
    }
);

const personSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        contactNo: {
            type: String,
            required: [true, "Contact number is required"],
            trim: true,
            match: [
                /^[0-9]{10}$/,
                "Contact number must contain exactly 10 digits"
            ]
        },

        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true
        },

        invitedBy: {
            type: String,
            required: [true, "Invited by is required"],
            trim: true
        },

        status: {
            type: String,
            required: [true, "Status is required"],
            trim: true
        },

        entryDate: {
            type: Date,
            default: Date.now
        },

        healthChallenges: {
            type: [String],
            default: []
        },

        otherHealthProblem: {
            type: String,
            trim: false,
            default: ""
        },

        remark: {
            type: String,
            required: [false, "Remark is required"],
            trim: true
        },

        followUps: {
            type: [followUpSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Person", personSchema);