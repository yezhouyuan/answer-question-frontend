// components/questionStoreDetail/questionStoreDetail.js
import http from "../../utils/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPaper: {
      id: "",
    },
    // 是否选中
    selected: false,
    selectedIndex: -1,
    selectedList: [],
    showPopup: false,
  },
  // 完成选题
  completed() {
    
    let pages = getCurrentPages();
    wx.navigateBack(
      { 
        delta: 2,
        success: () => {
          let questionList = this.getQuestionByIndex();
          let prePage = pages[pages.length - 3];
          let curPaper = prePage.data.curPaper;
          let newQuestionList = curPaper.questionList.concat(questionList);
          // 重新设置 id，保证 id 是唯一的
          newQuestionList.forEach((item, index) => {
            item.id = index;
          })
          console.log('newQuestionList', newQuestionList)
          prePage.setData({
            'curPaper.questionList': newQuestionList
          })
        }
      },
    );
  },
  // 获取对应索引的选中题目
  getQuestionByIndex() {
    let questionList = [];
    this.data.selectedList.forEach((item) => {
      const question = this.data.curPaper.questionList[item];
      questionList.push(question);
    })
    return questionList;
  },
  // 显示已选择列表
  showPaperHandle() {
    this.setData({
      showPopup: true
    })
  },
  // 弹出层关闭
  onPopupClose() {
    this.setData({
      showPopup: false,
    })
  },

  // 复选框组 change 事件
  checkBoxChange(e) {
    this.setData({
      selectedList: e.detail,
    });
  },
  // 选中题目
  itemSelected(e){
    let { questionindex } = e.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${questionindex}`);
    checkbox.toggle();
    
    this.setData({
      selected: !this.data.selected,
      selectedIndex: questionindex
    })
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
          })
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
    const paperId = options? options.paperId: null;
    if (paperId) {
      this.setData({
        'curPaper.id': paperId
      })
      this.init();
    } else {
      wx.navigateBack();
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