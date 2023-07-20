// components/questionConfig/questionConfig.js

import WxValidate from '../../assets/plugins/wx-validate/WxValidate'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputStyle: "border: #DCDEE0 1px solid;border-radius: 4px;",
    curQuestion: {
      title: "",
    },
    // 操作类型
    type: "", 
  },
  // 标题输入值绑定
  titleInput(e) {
    const title = e.detail;
    let curQuestion = this.data.curQuestion;
    this.setData({
      'curQuestion.title': title
    })
  },
  // 选项输入值绑定
  optionInput(e) {
    const index = e.currentTarget.dataset.optionindex;
    const value = e.detail;
    let curQuestion = this.data.curQuestion;
    curQuestion.options[index].value = value;

    this.setData({
      'curQuestion.options': curQuestion.options
    })
  },
  // 是否必填
  quesionRequiedChange() {
    let curQuestion = this.data.curQuestion;
    this.setData({
      'curQuestion.requied': !curQuestion.requied
    });
  },
  // 添加选项
  addOptionItem() {
    let curQuestion = this.data.curQuestion;
    let len = curQuestion.options.length + 1;
    curQuestion.options.push({ name: len.toString(), value: "" });
    this.setData({
      'curQuestion.options': curQuestion.options
    })
  },
  // 删除选项
  delOptionItem(e) {
    const index = e.currentTarget.dataset.optionindex;
    let curQuestion = this.data.curQuestion;
    wx.showModal({
      title: '提示',
      content: '是否确认删除此选项',
      success: (res) => {
        if (res.confirm) {
          curQuestion.options.splice(index, 1);
          this.setData({
            'curQuestion.options': curQuestion.options
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
          return
        }
      }
    })
  },
  // 输入框获取焦点更改样式
  inputOnFouces() {
    this.setData({
      inputStyle: "border: #0095FF 1px solid;border-radius: 4px;"
    })
  },
  // 输入框失去焦点还原样式
  inputOnBlur() {
    this.setData({
      inputStyle: "border: #DCDEE0 1px solid;border-radius: 4px;"
    })
  },
  // 确认
  confirm(e) {
    const params = e.detail.value;
    console.log(params)
    if (this.data.curQuestion.type != '3') {
      for (const key in params) {
        if (params['option' + key] == "") {
          wx.showModal({
            title: '提示',
            content: '至少填写两个选项',
            showCancel: false,
          })
          return false;
        }
      }      
    }


    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0]
        wx.showModal({
          title: '提示',
          content: error.msg,
          showCancel: false,
        })
        return false
    }

    let pages = getCurrentPages();
    wx.navigateBack(
      { 
        success: () => {
          let prePage = pages[pages.length - 2];
          let curPaper = prePage.data.curPaper;
          
          if (this.data.type != "add") {
            for (let key in curPaper.questionList) {
              if (curPaper.questionList[key].id == this.data.curQuestion.id) {
                curPaper.questionList[key] = this.data.curQuestion;
                break;
              }
            }
          } else {
            curPaper.questionList.push(this.data.curQuestion);
            console.log(curPaper.questionList)
          }

          prePage.setData({
            'curPaper.questionList': curPaper.questionList
          })
        }
      },
    );
  },
  // 返回
  back() {
    wx.navigateBack();
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
        required: "请输入标题"
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initValidate();

    const eventChannel = this.getOpenerEventChannel();
    // 监听 getQuestion 事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('getQuestion', (data) => {
      if (data) {
        this.setData({
          curQuestion: data.data.curQuestion,
          type: data.data.type,
        })
        wx.setNavigationBarTitle({
          title: this.data.curQuestion.text
        })
      }
    })
    const curQuestion = this.data.curQuestion;
    eventChannel.emit('getQuestion', { data: { curQuestion }})
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