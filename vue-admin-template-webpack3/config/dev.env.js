'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  BASE_API: '"http://localhost:9001"',
  EXCEL_TEMPLATE:'"https://edu-jiangwei.oss-cn-beijing.aliyuncs.com/subjectExcel/excel.xlsx"',

  //获取方式process.env.EXCEL_TEMPLATE
})
