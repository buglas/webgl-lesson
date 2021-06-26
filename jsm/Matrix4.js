export default class Matrix4{
  constructor() {
    this.elements = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]
  }
  lookAt(e,t,u) {
    const d=t.sub(e)
  }
}