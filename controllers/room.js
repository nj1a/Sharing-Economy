class Room {
    constructor(name, id, owner) {
        this.name = name;
        this.id = id;
        this.owner = owner;
        this.people = [];
        // this.peopleLimit = 4;
        // this.private = false;
    }

    add(userId) {
	    this.people.push(userId);
    }

    get(userId) {
        var idx = this.people.indexOf(userId);
        if (idx !== -1) {
            return this.people[idx];
        }
    }

    remove(userId) {
        var idx = this.people.indexOf(userId);
        if (idx !== -1) {
            this.people.splice(idx, 1);
        }
    }
}

// Room.prototype.isPrivate = function() {
//   return this.private;
// };

module.exports = Room;