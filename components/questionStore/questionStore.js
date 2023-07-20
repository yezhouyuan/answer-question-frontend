// components/questionStore/questionStore.js
import http from "../../utils/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchParams: "",
    searchVisible: false,
    paperList: [{}],
  },
  // 跳转到问卷详情页面
  gotoDetail(e) {
    const paper = e.currentTarget.dataset.paper? e.currentTarget.dataset.paper: null;
    if (paper) {
      wx.navigateTo({
        url: '../../components/questionStoreDetail/questionStoreDetail?paperId=' + paper.id,
      })
    }
  },
  // 显示搜索
  showSearch() {
    this.setData({
      searchVisible: true,
    })
    wx.showToast({ title: '点击搜索', icon: 'none' });
  },
  // 执行搜索
  onSearch() {

  },
  // 搜索框隐藏
  onSearchCancel() {
    this.setData({
      searchVisible: false,
    })
  },
  // 初始化
  init() {
    const params = {
      url: '/paper',
      method: "GET",
      callBack: res => {
        if (res) {
          let paperList = res.records;
          this.setData({
            paperList: paperList
          });
          console.log('home/pageList', res.records)
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