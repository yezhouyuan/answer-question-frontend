// pages/previewTempPaper/previewTempPaper.js
import http from "../../utils/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPaper: "",
  },
  // 复制此问卷
  onCopy() {
    let data = { ...this.data.curPaper };
    data.id = "";
    data.status = 0;
    data.questionList = JSON.stringify(data.questionList);

    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];

    const params = {
      url: '/paper',
      method: "POST",
      data: data,
      callBack: res => {
        wx.navigateBack({
          delta: 2,
          success: () => {
            prePage.init();
          }
        })
      }
    };
    http.request(params);
  },
  // 初始化
  init() {
    const params = {
      url: '/paper/' + this.data.curPaper.id,
      method: "GET",
      callBack: res => {
        if (res) {
          let curPaper = res;
          curPaper.questionList = res.questionList? JSON.parse(res.questionList): [];
          this.setData({
            curPaper: curPaper
          });
          wx.setNavigationBarTitle({
            title: this.data.curPaper.title
          }) 
        }
      }
    };
    http.request(params);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options? options.id: null;
    if (id) {
      this.setData({
        'curPaper.id': id,
        isPreview: false,
      })
      this.init();      
    }

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