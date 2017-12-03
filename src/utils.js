export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}
