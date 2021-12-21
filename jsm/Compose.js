export default class Compose {
  constructor() {
    this.parent = null;
    this.children = new Set();
  }
  add(obj) {
    obj.parent = this;
    this.children.add(obj);
  }
  update(t) {
    this.children.forEach((ele) => {
      ele.update(t);
    });
  }
  // 基于时间轨的目标对象删除时间轨
  deleteByTarget(targrt) {
    const { children } = this
    for (let child of children) {
      if (child.target === targrt) {
        children.delete(child)
        break
      }
    }
  }
}
