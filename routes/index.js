let express = require('express')
let router = express.Router()
let Monster = require("../models/monster.js")

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Butts'})
})

// Create
router.post("/api/monster", async (req, res) => {
  console.log(req)
  console.log(req.body)
  if (req.body.name === undefined || req.body.owner === undefined) {
    res.sendStatus(500)
    return
  }
  let monster = new Monster({
    name: req.body.name,
    age: 0,
    health: 100,
    hunger: 0,
    owner: req.body.owner
  })
  try {
    monster.save()
    res.send(monster)
  } catch (err) {
    res.sendStatus(500)
  }
})

// Read
router.get("/api/monster", async (req, res) => {
  Monster.find({}, (err, monsters) => {
    if (err) {
      res.sendStatus(500)
      return
    }
    res.send(monsters)
  })
})

/*
router.get("/api/monster", (req, res) => {
  Monster.findOne({owner: req.body.owner}, (err, monster) => {
    if (err) {
      res.sendStatus(500)
    }
    res.send(monster)
  })
})
 */

// Update
router.put("/api/monster/:id", async (req, res) => {
  let id = req.params.id
  let name = req.body.name
  let age = req.body.age
  let health = req.body.health
  let hunger = req.body.hunger
  let owner = req.body.owner
  Monster.findOne({_id: id}, (err, monster) => {
    if (err) {
      console.log("before")
      console.error(err)
      console.log("after")
      res.sendStatus(500)
      return
    }
    monster.name = name
    monster.age = Number(age)
    monster.health = Number(health)
    monster.hunger = Number(hunger)
    monster.save()
    res.send(monster)
  })
})

// Delete
router.delete("/api/monster/:id", async (req, res) => {
  let id = req.params.id
  Monster.findOne({_id: id}, (err, monster) => {
    if (err) {
      res.sendStatus(500)
      return
    }
    Monster.deleteOne({_id: id}, err => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.send(200)
    })
  })
})

module.exports = router
