"use strict";

const express = require("express");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/async-handler");

// Construct a router instance.
const router = express.Router();
const User = require("../models").User;
const Course = require("../models").Course;
// Handler function to wrap each route.

// Get currently authenticated user.
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = await User.findAll({
      where: { id: req.currentUser.id },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    });
    console.log(user);
    user
      ? res.json(user).status(200)
      : res.status(400).json({ message: "user not found" });
  })
);

// Get a user info by id -- for testing
router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    let user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user).status(200);
    } else {
      res.status(400).json({ message: "user not found" });
    }
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res
        .status(201)
        .location("/")
        .end();
    } catch (error) {
      console.log("ERROR: ", error.name);

      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
