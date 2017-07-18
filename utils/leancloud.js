var util = require('./util'),
  URL_PREFIX = 'https://api.leancloud.cn/1.1/';

exports.APP_ID = 'pxkifutgsd6h8eqyxwvbhnxwk1em709eacn9p8su8vtx26ap';
exports.APP_KEY = 'ksf2ig2xmpbwl7o1fdrhblj5u6claulqr6j8i777mwnieanm';

/**
 * 调用Leancloud REST方法
 * @param {Object} options 选项
 *     {
 *       url: 'class/Hello', // url路径
 *       data: { key: value }, // 参数
 *       method: 'GET', // HTTP请求的method，默认值为'GET'
 *       success: function (data) { }, // REST方法调用成功时的回调函数
 *       fail: function (error) { } // REST方法调用失败时的回调函数
 *     }
 */
var request = exports.request = function (options) {
  // https://leancloud.cn/docs/rest_api.html#请求格式
  wx.showLoading({
    title: '加载中',
  });
  wx.request({
    url: URL_PREFIX + options.url,
    data: options.data,
    header: {
      'X-LC-Id': exports.APP_ID,
      'X-LC-Key': exports.APP_KEY,
      'content-type': 'application/json; charset=utf-8'
    },
    method: options.method || 'GET',
    success: function (res) {
      options.success && options.success(res.data);
    },
    fail: function (error) {
      console.log(error);
      util.showFail('调用失败');
      options.fail && options.fail(error);
    },
    complete: function () {
      wx.hideLoading();
    }
  });
};

/**
 * 调用Leancloud云引擎方法
 * @param {Object} options 选项
 *     {
 *       func: 'hello', // 方法名
 *       data: { key: value }, // 参数
 *       success: function (data) { }, // 云引擎方法调用成功时的回调函数
 *       fail: function (error) { } // 云引擎方法调用失败时的回调函数
 *     }
 */
exports.invoke = function (options) {
  // https://leancloud.cn/docs/leanengine-rest-api.html
  request({
    url: 'functions/' + options.func,
    data: options.data,
    method: 'POST',
    success: options.success,
    fail: options.fail
  });
};

/**
 * 上传文件
 * @param {Object} options 选项
 *     {
 *       fileName: 'test.png', // 文件名
 *       filePath: '', // 文件路径
 *       success: function (data) { }, // 上传文件成功时的回调函数
 *       fail: function (error) { } // 上传文件失败时的回调函数
 *     }
 */
exports.uploadFile = function (options) {
  // https://leancloud.cn/docs/rest_api.html#上传文件
  wx.uploadFile({
    url: URL_PREFIX + 'files/' + options.fileName,
    filePath: options.filePath,
    name: 'file',
    header: {
      'X-LC-Id': exports.APP_ID,
      'X-LC-Key': exports.APP_KEY
    },
    success: function (res) {
      options.success && options.success(JSON.parse(res.data));
    },
    fail: function (error) {
      console.log(error);
      util.showFail('调用失败');
      options.fail && options.fail(error);
    }
  });
};

/**
 * 删除文件
 * @param {Object} options 选项
 *     {
 *       id: '596ddfd2570c35005b50d63c', // 文件对象的ObjectId
 *       success: function (data) { }, // 上传文件成功时的回调函数
 *       fail: function (error) { } // 上传文件失败时的回调函数
 *     }
 */
exports.deleteFile = function (options) {
  // https://leancloud.cn/docs/rest_api.html#删除文件
  request({
    url: 'files/' + options.id,
    method: 'DELETE',
    success: options.success,
    fail: options.fail
  });
};