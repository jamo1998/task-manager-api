const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// CREATE TASK
router.post('/task', auth, async (req, res) => {
  // when new task is created, the createdBy property sets up an
  // association with the authenticated user
  const task = new Task({
    ...req.body,
    createdBy: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// READ TASKS
// GET /tasks?completed=true
// GET /tasks? limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  // Set Default find Conditions
  const findWhat = {
    createdBy: req.user._id,
  };

  // Add/Set Optional Find Conditions
  if (req.query.completed) {
    findWhat.completed = req.query.completed === 'true'
  }

  // Set Default Find Options
  const findOptions = {
    limit: 10,
    skip: 0,
    sort: {}
  }

  // Add/Set Optional Find Options
  if (req.query.limit) {
    findOptions.limit = parseInt(req.query.limit)
  }

  if (req.query.skip) {
    findOptions.skip = parseInt(req.query.skip)
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    findOptions.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const tasks = await Task.find(findWhat, null, findOptions)
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

// READ TASK
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    // const task = await Task.findById(_id)
    const task = await Task.findOne({
      _id,
      createdBy: req.user._id
    })

    if (!task) {
      res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

// UPDATE TASK
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValid = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValid) {
    return res.status(400).send({
      error: 'Invalid updates'
    })
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => {
      task[update] = req.body[update]
    })
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

// DELETE TASK
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    })

    if (!task) {
      res.status(404).send({
        error: 'task not found'
      })
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router