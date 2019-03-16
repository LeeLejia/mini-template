interface Date {
  toCustomString(): string,
  toNumString(): string
}

Date.prototype.toCustomString = function() {
  return `${this.getFullYear()}/${this.getMonth() + 1}/${this.getDate()}`
}

Date.prototype.toNumString = function() {
  const month = this.getMonth() + 1
  const date = this.getDate()
  const hourse = this.getHours()
  const min = this.getMinutes()
  const sec = this.getSeconds()
  const msec = this.getMilliseconds()
  return `D${this.getFullYear()}${month<10?'0'+month:month}${date<10?'0'+date:date}${hourse<10?'0'+hourse:hourse}${min<10?'0'+min:min}${sec<10?'0'+sec:sec}${msec<10?'0'+msec:msec}`
}