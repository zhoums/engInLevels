<template>
<div class="app-container">
  <el-row>
    <el-button type="primary" @click="menuSet">menu</el-button>
  </el-row>
</div>
</template>

<script>
import {
  setMenu
} from '@/api/wechat'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    menuSet() {
      this.listLoading = true
      const menuObj = {
        "button": [{
            "name": "最新文章",
            "sub_button": [{
              "type": "click",
              "name": "我要读三篇",
              "key": "V1001_THE_NEWS"
            }, {
              "type": "click",
              "name": "我要读一页",
              "key": "V1001_PAGE_NEWS"
            }]
          },
          {
            "type": "click",
            "name": "全部文章",
            "key": "V1002_ALL_NEWS"
          },
          {
            "type": "click",
            "name": "我的单词本",
            "key": "V1003_MY_WORDS"
          }
        ]
      }
      setMenu(menuObj).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
