const baseURL = "https://XXXXXX";

let requestCount = 0;
const axios = (params) => {
  requestCount++;

  wx.showNavigationBarLoading();
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: `${baseURL}${params.url}`,
      success: (result) => {
        if (result.data.message) {
          resolve(result.data.message)
        } else {
          resolve(result)
        }
      },
      fail: (error) => {
        reject(error)
      },
      complete: () => {
        requestCount--;
        if (requestCount === 0) {
          wx.hideNavigationBarLoading();
        }
      }
    });
  });
}

const get = (url, data = {}) => {
  return axios({
    dataType: "json",
    method: "GET",
    url,
    data,
  })
}

const post = (url, data = {}) => {
  return axios({
    method: "POST",
    url,
    data,
  })
}

export default {
  get,
  post,
};