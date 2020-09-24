import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bookCateList: [
      {
        value: '理工',
        label: '理工',
        children: [
          {
            value: '自然',
            label: '自然',
            children: [
              { value: '数理化', label: '数理化' },
              { value: '生物医药', label: '生物医药' },
              { value: '农林', label: '农林' },
              { value: '天文', label: '天文' },
              { value: '建筑', label: '建筑' }
            ]
          },
          {
            value: '互联网',
            label: '互联网',
            children: [
              { value: '前端', label: '前端' },
              { value: '后端', label: '后端' },
              { value: '多媒体', label: '多媒体' }
            ]
          }
        ]
      },
      {
        value: '文艺',
        label: '文艺',
        children: [
          {
            value: 'novel',
            label: '文学小说',
            children: [
              { value: '散文', label: '散文' },
              { value: '小说', label: '小说' },
              { value: '传记', label: '传记' },
              { value: '报刊评论', label: '报刊评论' }
            ]
          },
          {
            value: '语言文字',
            label: '语言文字',
            children: [
              { value: '汉语', label: '汉语' },
              { value: '外文', label: '外文' }
            ]
          },
          {
            value: '艺术鉴赏',
            label: '艺术鉴赏',
            children: [
              { value: '书画', label: '书画' },
              { value: '古玩', label: '古玩' },
              { value: '时尚', label: '时尚' }
            ]
          }
        ]
      },
      {
        value: '社科',
        label: '社科',
        children: [
          {
            value: '历史',
            label: '历史',
            children: [
              { value: '古代史', label: '古代史' },
              { value: '现代史', label: '现代史' },
              { value: '通史', label: '通史' },
              { value: '外国历史', label: '外国历史' }
            ]
          },
          {
            value: '政经法',
            label: '政经法',
            children: [
              { value: '政治', label: '政治' },
              { value: '经济', label: '经济' },
              { value: '法律', label: '法律' }
            ]
          },
          {
            value: '哲学心理',
            label: '哲学心理',
            children: [
              { value: '哲学', label: '哲学' },
              { value: '心理学', label: '心理学' },
              { value: '宗教', label: '宗教' }
            ]
          }
        ]
      },
      { value: '考试', label: '考试' },
      { value: '外文', label: '外文' }
    ]
  },
  mutations: {
    setCategories(state) {}
  },
  actions: {
    getCategories() {}
  },
  getters: {}
})
