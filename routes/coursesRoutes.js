"use strict";

const express = require("express");
const { authenticateUser } = require("../middleware/auth-user");
const { asyncHandler } = require("../middleware/async-handler");

// Construct a router instance.
const router = express.Router();
const User = require("../models").User;
const Course = require("../models").Course;

// Get all courses
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "userInformation",
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        }
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    res.json(courses).status(200);
  })
);

// Get courses by ID
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "userInformation",
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        }
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    if (course) {
      res.json(course).status(200);
    } else {
      res.status(400).json({ message: "Course not found" });
    }
  })
);

//Create a course
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res
        .status(201)
        .location(`/api/courses/${course.id}`)
        .end();
    } catch (error) {
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

//update a course
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      console.log(course.id);
      if (course) {
        if (course.userId === req.currentUser.id) {
          await course.update(req.body);
          res.status(204).json({ message: "updated the course" });
        } else {
          res
            .status(403)
            .json({ message: "You're not authorized to update this course" });
        }
      } else {
        res.status(400).json({ message: "Course not found" });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map(error => error.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Delete a course
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === req.currentUser.id) {
        await course.destroy();
        res.status(204).end();
      } else {
        res
          .status(403)
          .json({ message: "You're not authorized to delete this course" });
      }
    } else {
      res.status(400).json({ message: "Course not found" });
    }
  })
);

module.exports = router;
