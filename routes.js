"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// Get currently authenticated user.
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    let users = await User.findAll();
    res.json(users).status(200);
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.redirect(201, "/");
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

// Get all courses
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.json(courses).status(200);
  })
);

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id);
    if (course) {
      res.json(course).status(200);
    } else {
      res.status(400).json({ message: "Course not found" });
    }
  })
);

module.exports = router;
