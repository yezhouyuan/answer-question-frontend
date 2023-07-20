// pages/editPaper/editPaper.js
import http from "../../utils/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addPopupVisible: false,
    // 是否选中
    selected: false,
    selectedIndex: -1,
    curPaper: {
      id: "",
      title: "",
      description: "",
      status: "0",
      questionList: [],
    },

    // 题型模板数据
    baseList: [
      { 
        id: "1", icon: "danxuanti", text: "单选题", title: "", value: "", requied: true, type: "1",
        options: [
          { name: "1", value: ""},
          { name: "2", value: ""},
        ]
      },
      { 
        id: "2", icon: "duoxuanti", text: "多选题", title: "", value: [], requied: true, type: "2",
        options: [
          { name: "1", value: "" },
          { name: "2", value: "" },
        ]
      },
      { 
        id: "3", icon: "tiankongti", text: "填空题", title: "", value: "", requied: true, type: "3", 
      },
    ],
    templateList: [
      { id: "1", icon: "icon-person", text: "姓名", title: "姓名：", value: "", requied: true, type: "3", },
      { id: "2", icon: "xingbie-xian", text: "性别", title: "您的性别：", value: "", requied: true, type: "1", 
        options: [
          { name: "1", value: "男" },
          { name: "2", value: "女" },
        ]
      },
      { id: "3", icon: "shouji", text: "手机", title: "请输入您的手机号码：", value: "", requied: true, type: "3", },
      { id: "4", icon: "riqi", text: "日期", title: "请选择日期：", value: "", requied: true, type: "3", },
    ],
    batchList: [
      { id: "1", icon: "tikuxuanti", text: "题库选题", title: "", value: "", type: "10", url: "questionStore", },
      // { id: "2", icon: "", text: "文本导入", title: "", value: "", type: "11", url: "", },
    ]
  }, 

  // 编辑
  onEdit(e){
    const curPaper = e.currentTarget.dataset.curpaper;
    const type = e.currentTarget.dataset.type;
    if (curPaper) {
      wx.navigateTo({
        url: '../createPaper/createPaper?id=' + curPaper.id,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          getCurPaper: (data) => {
          }
        },
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('getCurPaper', { data: { curPaper } })
        }
      })

    } else {
      let curQuestion = e.currentTarget.dataset.curquestion;
      wx.navigateTo({
        url: '../../components/questionConfig/questionConfig',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          getQuestion: (data) => {
            // console.log(data)
          }
        },
        success: (res) => {
          this.onPopupClose();
          // 通过eventChannel向被打开页面传送数据
          if (type != 'add') {
            res.eventChannel.emit('getQuestion', { data: { curQuestion, type } })
          } else {
            // 添加题目需要的 uuid
            curQuestion.id = (this.data.curPaper.questionList.length + 1).toString();
            res.eventChannel.emit('getQuestion', { data: { curQuestion, type } })
          }
          
        }
      })
    }
  },
  // 保存问卷
  onSave() {

    let data = { ...this.data.curPaper };
    data.questionList = JSON.stringify(this.data.curPaper.questionList);
    const params = {
      url: '/paper',
      method: "PUT",
      data: data,
      callBack: res => {

        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];

        prePage.init();
        this.init();

        wx.showModal({
          title: '保存成功',
          content: '问卷保存成功，是否立即发布？',
          cancelText: "继续编辑",
          confirmText: "发布调查",
          success: ()=>{
            console.log("save", this.data.curPaper)
          }
        })
      }
    };
    http.request(params);

  },
  // 预览问卷
  onPreview() {
    const curPaper = this.data.curPaper;
    wx.navigateTo({
      url: '../previewPaper/perviewPaper',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        getCurPaper: (data) => {
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        console.log(curPaper)
        res.eventChannel.emit('getCurPaper', { data: { curPaper } })
      }
    })
  },
  // 上移
  onMoveUp(e) {
    let curPaper = this.data.curPaper;
    let index = e.currentTarget.dataset.curquestionindex;
    if (index == 0) {
      wx.showModal({
        title: '',
        content: '第一题不能再上移了',
        showCancel: false,
      })
      return 
    }
    curPaper.questionList = this.swapArray(curPaper.questionList, index, index - 1);

    this.setData({
      'curPaper.questionList': curPaper.questionList
    })
  },
  // 下移
  onMoveDown(e) {
    let curPaper = this.data.curPaper;
    let index = e.currentTarget.dataset.curquestionindex;
    if (index == curPaper.questionList.length - 1) {
      wx.showModal({
        title: '',
        content: '最后一题不能再下移了',
        showCancel: false,
      })
      return 
    }
    curPaper.questionList = this.swapArray(curPaper.questionList, index, index + 1);
    this.setData({
      'curPaper.questionList': curPaper.questionList
    })
  },
  // 数组元素互换位置
  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  // 复制题目
  onCopy(e) {
    let curPaper = this.data.curPaper;
    let index = e.currentTarget.dataset.curquestionindex;
    let curQuestion = e.currentTarget.dataset.curquestion;
    curPaper.questionList.splice(index + 1, 0, curQuestion);

    this.setData({
      'curPaper.questionList': curPaper.questionList
    })
  },
  // 删除
  onDelete(e) {
    let curPaper = this.data.curPaper;
    let index = e.currentTarget.dataset.curquestionindex;

    wx.showModal({
      title: '提示',
      content: '是否确认删除此题?',
      success: (res) => {
        if (res.confirm) {
          curPaper.questionList.splice(index, 1);
          this.setData({
            'curPaper.questionList': curPaper.questionList
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
          return
        }
      }
    })

  },
  itemSelected(e){
    this.setData({
      selected: !this.data.selected,
      selectedIndex: e.currentTarget.dataset.questionindex
    })
  },

  // tab change
  onChange(event) {
    if (event.detail) {
      switch (event.detail) {
        case "add": 
          this.onPopupShow();
          break;
        case "preview":
          this.onPreview();
          break;
        case "save":
          this.onSave();
          break;
      }
    }
    
  },
  // 弹出层显示
  onPopupShow() {
    this.setData({
      addPopupVisible: true,
    })
  },
  // 弹出层关闭
  onPopupClose() {
    this.setData({
      addPopupVisible: false,
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
          console.log('res', res)
          curPaper.questionList = curPaper.questionList? JSON.parse(curPaper.questionList): [];
          console.log(curPaper.questionList)
          this.setData({
            curPaper: curPaper
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
        'curPaper.id': id
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