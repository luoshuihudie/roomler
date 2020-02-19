export default class Tree {
  constructor (rooms) {
    this.init(rooms)
  }

  init (rooms) {
    this.rooms = rooms
    this.root = this.getRoot()
    this.buildTree(this.root, this.rooms)
  }

  getRoot () {
    const result = []
    this.rooms.forEach((room) => {
      room.children = []
      const names = room.name.split('.')

      const parent = this.rooms.find(parent => parent._id !== room._id && room.path.startsWith(parent.path))
      if (!parent) {
        room.short_name = room.name
        result.push(room)
      } else {
        room.short_name = names[names.length - 1]
      }
    })
    return result
  }

  buildTree (upperRooms, rooms) {
    const self = this
    upperRooms.forEach((upperRoom) => {
      const lowerRooms = rooms.filter(r => r.path.startsWith(`${upperRoom.path}.`) && !`${r.path}`.replace(`${upperRoom.path}.`, '').includes('.'))
      lowerRooms.forEach((lowerRoom) => {
        upperRoom.children.push(lowerRoom)
      })
      self.buildTree(lowerRooms, rooms)
    })
  }

  push (room) {
    const names = room.name.split('.')
    if (names.length) {
      names.pop()
    }
    const parentpath = names.join('.')
    const parent = this.findItem(parentpath)
    const items = parent && parent.children ? parent.children : this.root
    let pushed = false
    for (let i = 0; i < items.length; i++) {
      // room vs [goran, marx, tod]
      const compare = items[i].path.localeCompare(room.path)
      if (compare > 0) {
        items.splice(i, 0, room)
        pushed = true
        break
      } else if (compare === 0 || room._id === items[i]._id) {
        items.splice(i, 1, room)
        pushed = true
        break
      }
    }
    if (!pushed) {
      items.push(room)
    }
  }

  findItem (roompath, items = null) {
    if (!items) {
      items = this.root
    }

    return items.reduce((acc, item) => {
      if (acc) {
        return acc
      }

      if (item.path === roompath) {
        return item
      }

      if (item.children) {
        return this.findItem(roompath, item.children)
      }

      return acc
    }, null)
  }
}
