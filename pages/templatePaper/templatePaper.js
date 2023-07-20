// pages/template/template.js
import http from "../../utils/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchParams: "",
    otherPaperList: [
      { id: 1111, title: "测试测试测试测试测试测试测试", questionNum: 12 },
    ],
  },
  // 预览模板问卷
  gotoPreviewTempPaper(e) {
    const otherPaper = e.currentTarget.dataset.otherpaper? e.currentTarget.dataset.otherpaper: null;
    if (otherPaper) {
      wx.navigateTo({
        url: '/pages/previewTempPaper/previewTempPaper?id=' + otherPaper.id
      })
    }
  },
  // 从空白创建
  createPaper() {
    wx.navigateTo({
      url: '../createPaper/createPaper'
    })
  },
  // 初始化
  init() {
    const params = {
      url: '/paper',
      data: {
        searchText: this.data.searchParams
      },
      method: "GET",
      callBack: res => {
        if (res) {
          let paperList = res.records;
          paperList.forEach((item) => {
            item.questionList = item.questionList? JSON.parse(item.questionList): [];
          })
          console.log(paperList)
          this.setData({
            otherPaperList: paperList,
          });
        }
      }
    };
    http.request(params);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init();
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
  onShareAppMessage() {

  }
})