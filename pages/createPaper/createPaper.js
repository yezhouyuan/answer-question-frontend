// pages/createPaper/createPaper.js
import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
import http from "../../utils/http.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    description: "",
    isEdit: false,
  },
  // 输入框改变
  change(e) {
    const value = e.detail;
  },
  // 确定
  back() {

    let pages = getCurrentPages();
    wx.navigateBack(
      { 
        delta: 1,
        success: () => {
          let prePage = pages[pages.length - 2];
          prePage.setData({
            'curPaper.title': this.data.title,
            'curPaper.description': this.data.description,
          })
        }
      },
    );
  },
  // 提交
  submit(e) {
    const value = e.detail.value;
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(value)) {
        const error = this.WxValidate.errorList[0]
        wx.showModal({
          title: '提示',
          content: error.msg,
          showCancel: false,
        })  
        return false
    }
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];

    const params = {
      url: '/paper',
      method: "POST",
      data: value,
      callBack: res => {
        // console.log('create', res)
        wx.navigateBack({
          delta: 2,
          success: () => {
            prePage.init();
          }
        })
      }
    }
    http.request(params);

  },
  // 初始化表单验证
  initValidate() {
    const rules = {
      title: {
        required: true,
      }
    }
    const messages = {
      title: {
        required: "请输入问卷名称"
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id? options.id: null;
    if (id) {
      const eventChannel = this.getOpenerEventChannel()
      // 监听 getCurPaper 事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('getCurPaper', (data) => {
        if (data) {
          const title = data.data.curPaper.title;
          const description = data.data.curPaper.description;
          this.setData({
            title: title,
            description: description,
            isEdit: true,
          })
        }
      })  
      wx.setNavigationBarTitle({
        title: '编辑问卷'
      })
    }
    this.initValidate();
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
    this.setData({
      isEdit: false
    })
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