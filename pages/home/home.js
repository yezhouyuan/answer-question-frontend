import http from "../../utils/http.js";
const app = getApp();
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchParams: "",
    searchVisible: false,
    // 显示底部弹出层
    showPopup: false,
    // 显示侧边弹出层
    showAsidePopup: false,
    isShare: false,
    paperList: [
      {
        id: 0,
        title: "title",
        description: "description",
        questionList: [],
        status: 0,
        createId: 0
      }
    ],
    curPaper: "",
    curPaperIndex: 0,

    activeKey: 0,
  },
  // 显示菜单
  showMenu() {
    this.setData({
      showAsidePopup: true,
    })
  },
  // 个人中心
  gotoMine() {
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  // 显示搜索
  showSearch() {
    this.setData({
      searchVisible: true,
    })
  },
  // 执行搜索
  onSearch(e) {
    const searchParams = e.detail? e.detail: "";
    this.setData({
      searchParams: searchParams
    });
    this.init();
  },
  // 搜索框隐藏
  onSearchCancel() {
    this.setData({
      searchParams: "",
      searchVisible: false,
    })
    this.init();
  },
  // 创建问卷
  onCreate() {
    wx.navigateTo({
      url: '../templatePaper/templatePaper'
    })
  },
  // 显示弹出层
  showPaperHandle(e) {
    const curPaper = e.currentTarget.dataset.curpaper;
    const curPaperIndex = e.currentTarget.dataset.curpaperindex;
    this.setData({
      showPopup: true,
      curPaper: curPaper,
      curPaperIndex: curPaperIndex,
    })
  },
  // 弹出层关闭
  onPopupClose() {
    this.setData({
      showPopup: false,
      showAsidePopup: false,
    })
  },

  // ######################### 问卷操作弹出层事件 ####################
  // 发布
  onRelease() {
    let data = { ...this.data.curPaper };
    if (data.status) {
      // 暂停
      wx.showModal({
        title: '提示',
        content: '暂停后问卷将无法填写，确认吗？',
        success: (res) => {
          if (res.confirm) {
            data.status = 0;
            const params = {
              url: '/paper',
              method: "PUT",
              data: data,
              callBack: (res) => {
                this.init();
                this.onPopupClose();
              }
            };
            http.request(params);  
          } else if (res.cancel) {
            console.log('用户点击取消');
            return
          }
        }
      })
    } else {
      // 发布
      data.status = 1;
      const params = {
        url: '/paper',
        method: "PUT",
        data: data,
        callBack: (res) => {
          if (!this.data.isShare) {
            wx.showModal({
              title: '提示',
              content: '发布成功',
              success: (res) => {
                if (res.confirm) {
                  this.init();
                  this.onPopupClose();
                } else if (res.cancel) {
                  this.init();
                  this.onPopupClose();
                  console.log('用户点击取消');
                  return
                }
              }
            })            
          } else {
            this.init();
            this.onPopupClose();
          }
        }
      };
      http.request(params);      
    }
  },

  // 复制
  onCopy(e) {
    let data = { ...this.data.curPaper };
    data.id = "";
    data.title = data.title + "【复制】";
    data.status = 0;
    console.log(data)
    const params = {
      url: '/paper',
      method: "POST",
      data: data,
      callBack: res => {
        this.init();
        this.onPopupClose();
      }
    };
    http.request(params);
  },
  // 删除
  remove() {
    let paperList = this.data.paperList;
    const data = { id: this.data.curPaper.id };
    wx.showModal({
      title: '提示',
      content: '您确定要删除这份问卷吗?',
      success: (res) => {
        if (res.confirm) {
          const params = {
            url: '/paper/' + data.id,
            method: "DELETE",
            callBack: (res) => {
              this.init();
              this.onPopupClose();
            }
          };
          http.request(params);    
        } else if (res.cancel) {
          console.log('用户点击取消');
          return
        }
      }
    })
  },
  // 编辑
  edit() {

    wx.navigateTo({
      url: '../editPaper/editPaper?id=' + this.data.curPaper.id,
      success: (res) => {
        this.onPopupClose();
      }
    })
  },
  // 分享
  onShare() {
    if (this.data.curPaper.status) {
      this.gotoShare();
    } else {
      wx.showModal({
        title: '提示',
        content: '此问卷还未发布，确认发布吗?',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              isShare: true,
            })
            this.onRelease();
            this.gotoShare();
          } else if (res.cancel) {
            console.log('用户点击取消');
            return
          }
        }
      })
    }
  },
  // 跳转至分享页面
  gotoShare() {
    let curPaper = this.data.curPaper;
    wx.navigateTo({
      url: '../sharePaper/sharePaper',
      success: (res) => {
        res.eventChannel.emit('getCurPaper', { data: { curPaper } })
        this.onPopupClose();
      }
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
          this.setData({
            paperList: paperList,
            isShare: false,
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
  onShow() {
    wx.hideHomeButton();
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

})