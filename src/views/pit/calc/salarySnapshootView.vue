<template>
  <basic-view
    ref="ref"
    :form-title="formTitle"
    :get-entity="getEntity"
    :handle-items="handleItems" />
</template>

<script>
import { isNotEmpty } from '@/utils/validate'
import { salarySnapshootSingle } from '@/api/pit'
import { getSalarySnapshootFormItems } from './kit'
import BasicView from '@/views/components/basicView'

export default {
  name: 'SalarySnapshootView',
  components: { BasicView },
  props: {
    enterpriseOptions: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      formTitle: '薪金明细',
      getEntity: salarySnapshootSingle
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (
        isNotEmpty(PK) &&
        isNotEmpty(PK.SS_FREQ) &&
        isNotEmpty(PK.SS_ISSUE) &&
        isNotEmpty(PK.SS_STAFF_NUMBER) &&
        isNotEmpty(PK.SS_TYPE)
      ) {
        primaryKey = PK
      }
      this.$refs['ref'].showDialog(primaryKey)
    },
    handleItems(operate, model) {
      const self = this
      return getSalarySnapshootFormItems(operate, model, {
        enterpriseOptions: self.enterpriseOptions
      })
    }
  }
}
</script>
