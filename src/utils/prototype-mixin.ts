interface Date {
  toCustomString: () => string
}
Date.prototype.toCustomString = () => {
  return 'hahhahha'
}