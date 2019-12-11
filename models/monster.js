var db = require("../db_connector")

let monsterSchema = new db.Schema({
  name: String,
  age: Number,
  health: Number,
  hunger: Number,
  owner: String,
})

let Monster = db.model("Monster", monsterSchema)

module.exports = Monster
