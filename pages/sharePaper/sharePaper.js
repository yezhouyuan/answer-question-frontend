// pages/sharePaper/sharePaper.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPaper: "",
  },
  // 查看问卷
  gotToPreview() {
    wx.navigateTo({
      url: '../previewPaper/perviewPaper?id=' + this.data.curPaper.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    // 监听 getQuestion 事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('getCurPaper', (data) => {
      if (data) {
        this.setData({
          curPaper: data.data.curPaper,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    console.log(e)
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: this.data.curPaper? this.data.curPaper.title: '自定义转发标题',
          path: '/pages/previewPaper/perviewPaper?id=' + this.data.curPaper.id,
        })
      }, 1000)
    })
    return {
      title: this.data.curPaper? this.data.curPaper.title: '自定义转发标题',
      path: '/pages/previewPaper/perviewPaper?id=' + this.data.curPaper.id,
      promise
    }
  }
})