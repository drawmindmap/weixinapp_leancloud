module.exports.getFileName = function (name) {
  var index;
  if (!name) {
    return '';
  }
  if ((index = name.lastIndexOf('/')) >= 0) {
    return name.substr(index + 1);
  }
  if ((index = name.lastIndexOf('\\')) >= 0) {
    return name.substr(index + 1);
  }
  return name;
};

module.exports.showFail = function (title) {
  wx.showToast({
    title: title,
    duration: 3000,
    mask: true
  });
};