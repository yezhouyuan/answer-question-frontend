// pages/previewPaper/perviewPaper.js
import WxValidate from '../../assets/plugins/wx-validate/WxValidate';
import http from "../../utils/http.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPaper: {
      id: "",
      title: "",
      description: "",
      status: "0",
      questionList: [
      ],
    },
    isPreview: true,
    requiedAll: false,
    success: false,
  },
  // 提交
  submit(e) {
    const value = e.detail.value;
    console.log(value)

    if (this.data.isPreview) {
      wx.showModal({
        title: '提示',
        content: '此卷为预览状态无法提交',
        showCancel: false,
      })
      return;
    }

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(value)) {
      const error = this.WxValidate.errorList;
      console.log(error)
      wx.showModal({
        title: '提示',
        content: '请填写完问卷，再提交',
        showCancel: false,
      })
      return false
    }
    
    const data = {
      id: this.data.curPaper.id,
      questionList: JSON.stringify(this.data.curPaper.questionList),
    }

    let pages = getCurrentPages();
    let prePage = pages[pages.length - 3];
    
    const params = {
      url: '/paperAnswer',
      method: "POST",
      data: data,
      callBack: res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            this.setData({
              success: true,
            })
            if (pages.length > 1) {
              prePage.init();
            }
          }
        })
      }
    }
    http.request(params);

  },
  // 选项改变
  onOptionChange(e) {
    const value = e.detail;
    const id = e.currentTarget.id;
    let questionList = this.data.curPaper.questionList;

    // 根据 id 查找问题位置
    for (let key in questionList) {
      if (questionList[key].id == id) {
        questionList[key].value = value
      }
    }
    this.setData({
      'curPaper.questionList': questionList,
    })
  },

  // 初始化表单验证
  initValidate() {
    let questionList = this.data.curPaper.questionList;
    let rules = {};
    let messages = {};
    questionList.forEach((item, index) => {
      if (item.requied) {
        rules[index] = {required: true,};
        messages[index] = {required: "请选择",};
  
      }
      
    })
 
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

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
          console.log(curPaper)
          this.setData({
            curPaper: curPaper
          });
          wx.setNavigationBarTitle({
            title: this.data.curPaper.title
          }) 
          this.initValidate();
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
    } else {
      const eventChannel = this.getOpenerEventChannel()
      // 监听 getCurPaper 事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('getCurPaper', (data) => {
        if (data) {
          this.initValidate();
          this.setData({
            curPaper: data.data.curPaper,
            isPreview: true,
          })
        }
      })      
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
    this.setData({
      curPaper: ""
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