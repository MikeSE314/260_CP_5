let app = new Vue({
  el: "#app",
  data: {
    alien_names: ["Stan", "Robby", "Arnie", "Jim", "Tom", "Bob", "Mike", "Dan", "Parry", "Ted", "Ron", "Doug", "Ed", "Rick", "Ron", "Frank", "Ronny", "Bill", "Mick", "Dan"],
    monster: {
      _id: "",
      name: "",
      age: 0,
      health: 0,
      hunger: 0,
      owner: "",
    },
    poops: [],
    just_pooped: false,
    is_hungry: false,
  },
  methods: {

    getOwner() {
      let val = window.localStorage.getItem("owner")
      if (val === null) {
        val = this.makeOwner()
        window.localStorage.setItem("owner", val)
      }
      return val
    },

    makeOwner() {
      return "xxxxxxxxxxxx".replace(/[x]/g, c => {
        var r = Math.random()*16|0
        return r.toString(16);
      })
    },

    makeName() {
      i = Math.floor(Math.random() * this.alien_names.length)
      return this.alien_names[i]
    },

    // Create
    postMonster() {
      url = "api/monster"
      fetch(url, {
        method: "POST",
        body: JSON.stringify(this.monster),
        headers: {'Content-Type': 'application/json'}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.monster = json
      }).catch(err => {
        console.error(err)
      })
    },

    // Read
    getMonster() {
      url = "api/monster"
      fetch(url).then(response => {
        return response.json()
      }).then(json => {
        this.monster = json.filter(monster => {return monster.owner === this.monster.owner})[0]
      }).catch(err => {
        console.error(err)
        this.postMonster()
      })
    },

    // Update putMonster()
    putMonster() {
      url = "api/monster/" + this.monster._id
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.monster),
        headers: {'Content-Type': 'application/json'}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.monster = json
      }).catch(err => {
        console.error(err)
      })
    },

    // Delete
    deleteMonster() {
      url = "api/monster/" + this.monster._id
      fetch(url, {
        method: "DELETE",
        body: JSON.stringify(this.monster),
        headers: {'Content-Type': 'application/json'}
      }).then(response => {
        return response.json()
      }).then(json => {
      }).catch(err => {
        console.error(err)
      })
    },

    hunger() {
      this.monster.hunger += 0.1
      if (this.monster.hunger > 100) {
        this.monster.hunger = 100
      }
      if (this.monster.hunger < 0) {
        this.monster.hunger = 0
      }
      if (this.monster.hunger > 36) {
        this.is_hungry = true
      } else {
        this.is_hungry = false
      }
    },

    healthFunc() {
      let x = this.monster.hunger
      let y = this.poops.length
      let r = ((x - 60) / 30) ** 3 + .5 + y
      return r
    },

    health() {
      this.monster.health -= this.healthFunc()
      if (this.monster.health > 100) {
        this.monster.health = 100
      }
      if (this.monster.health < 0) {
        this.monster.health = 0
      }
    },

    feed() {
      console.log("feeding...")
      this.monster.hunger -= 10
      this.maybePoop()
    },

    makeMonster() {
      this.deleteMonster()
      this.postMonster()
    },

    maybePoop() {
      if (Math.random() < .5) {
        this.poop()
      }
    },

    poop() {
      console.log("pooping...")
      this.poops.push({
        _id: this.makeOwner(),
        top: (Math.random() * 100).toString() + "%",
        left: (Math.random() * 100).toString() + "%",
      })
      this.just_pooped = true
    },

    removePoop(id) {
      this.poops = this.poops.filter(poop => {
        return poop._id !== id
      })
      this.just_pooped = false
    },

  },
  computed: {

    healthbar() {
      h = []
      for (let i = 0; i < this.monster.health / 10; i++) {
        h.push([])
      }
      return h
    },

    hungerbar() {
      h = []
      for (let i = 0; i < this.monster.hunger / 10; i++) {
        h.push([])
      }
      return h
    },

    which_image() {
      if (!this.monster._id) {
        return ""
      }
      if (this.monster._id.endsWith("0")
        || this.monster._id.endsWith("1")
        || this.monster._id.endsWith("2")
        || this.monster._id.endsWith("3")) {
        return "img1"
      }
      if (this.monster._id.endsWith("4")
        || this.monster._id.endsWith("5")
        || this.monster._id.endsWith("6")
        || this.monster._id.endsWith("7")) {
        return "img2"
      }
      if (this.monster._id.endsWith("8")
        || this.monster._id.endsWith("9")
        || this.monster._id.endsWith("a")
        || this.monster._id.endsWith("b")) {
        return "img3"
      }
      return "img4"
    },

    no_monster() {
      return this.monster._id === ""
    },

  },
  created() {
    console.log("created")
    this.monster.owner = this.getOwner()
    console.log("1")
    if (this.no_monster) {
      console.log("Making monster!")
      this.monster.name = this.makeName()
      this.postMonster()
    }
    console.log("2")
    this.getMonster()
    //
    window.setInterval(() => {
      this.hunger()
      this.health()
      console.log("health:", this.monster.health, "hunger", this.monster.hunger)
      this.putMonster()
    }, 1000)
  }
})

