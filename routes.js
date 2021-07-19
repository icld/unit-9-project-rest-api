"use strict";

const express = require("express");
const { authenticateUser } = require("./middleware/auth-user");

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
  //   authenticateUser,
  asyncHandler(async (req, res) => {
    let users = await User.findAll();
    res.json(users).status(200);
  })
);

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

router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.redirect(201, `/courses/${course.id}`);
  })
);

//update course
router.put(
  "/courses/:id",
  //   authenticateUser,
  asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id);
    // const { currentUser } = res.local;

    if (course) {
      await course.update(req.body);
      res.status(204).json({ message: "updated the course" });
    } else {
      res.status(400).json({ message: "Course not found" });
    }

    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map(error => error.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  })
);

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
