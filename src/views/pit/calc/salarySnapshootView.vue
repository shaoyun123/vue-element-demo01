<template>
  <basic-view
    ref="ref"
    :dialog-title="dialogTitle"
    :get-entity="getEntity"
    :handle-items="handleItems" />
</template>

<script>
import * as validator from '@/utils/validate'
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
      dialogTitle: '薪金明细',
      getEntity: salarySnapshootSingle
    }
  },
  methods: {
    showDialog(PK) {
      let primaryKey = null
      if (
        validator.isNotEmpty(PK) &&
        validator.isNotEmpty(PK.SS_FREQ) &&
        validator.isNotEmpty(PK.SS_ISSUE) &&
        validator.isNotEmpty(PK.SS_STAFF_NUMBER) &&
        validator.isNotEmpty(PK.SS_TYPE)
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
