var leancloud = require('../../utils/leancloud');
var util = require('../../utils/util');

Page({
  data: {
    words: [
    ],
    word: '',
    current: 0
  },
  refresh: function () {
    var self = this;
    // https://leancloud.cn/docs/rest_api.html#遍历_Class
    leancloud.request({
      url: 'classes/Words',
      success: function (res) {
        var words = res.results || [];
        words.push({ name: '' });
        self.setData({
          words: words,
          word: ''
        });
      }
    });
  },
  onReady: function () {
    this.refresh();
  },
  handleInput: function (e) {
    this.setData({
      word: e.detail.value
    });
  },
  handleIndexChange: function (e) {
    this.setData({
      current: e.detail.current
    });
  },
  handleLongTap: function (e) {
    var self = this;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex === 0) {
          self.deleteWord();
        }
      }
    })
  },
  deleteWord: function () {
    var self = this;
    var word = self.data.words[self.data.current];
    // https://leancloud.cn/docs/rest_api.html#删除对象
    leancloud.request({
      url: 'classes/Words/' + word.objectId,
      method: 'DELETE',
      success: function (res) {
        if (word.imgUrl) {
          leancloud.deleteFile({
            id: word.imgObjectId,
            success: function () {
              self.refresh();
            }
          });
        } else {
          self.refresh();
        }
      }
    });
  },
  chooseImage: function () {
    var self = this;
    var word = self.data.word;
    if (!word) {
      wx.showToast({
        title: '输入单词'
      });
      return;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        self.addWord(res.tempFilePaths[0]);
      }
    });
  },
  addWord: function (filePath) {
    var self = this;
    leancloud.uploadFile({
      fileName: util.getFileName(filePath),
      filePath: filePath,
      success: function (data) {
        // https://leancloud.cn/docs/rest_api.html#创建对象
        leancloud.request({
          url: 'classes/Words',
          method: 'POST',
          data: {
            name: self.data.word,
            imgUrl: data.url,
            imgObjectId: data.objectId
          },
          success: function () {
            self.refresh();
          }
        });
      }
    });
  }
});