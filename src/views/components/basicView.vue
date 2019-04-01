<template>
  <typography-form-basic
    ref="ref"
    :dialog="dialog"
    :form="form"
    :loading="loading"
    :controller="controller" />
</template>

<script>
import * as validator from '@/utils/validate'
import TypographyFormBasic from '@/components/Typography/Form/basic'

export default {
  name: 'BasicView',
  components: { TypographyFormBasic },
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
    getEntity: {
      type: Function,
      default: function() {}
    },
    handleItems: {
      type: Function,
      default: function() {}
    },
    actions: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      operate: 'view',
      items: [],
      model: {},
      loading: false
    }
  },
  computed: {
    dialog: function() {
      return {
        props: {
          title: this.dialogTitle
        }
      }
    },
    form: function() {
      return {
        props: { model: this.model },
        items: this.items
      }
    },
    controller: function() {
      let items = []
      if (validator.isNotEmpty(this.actions)) {
        items = items.concat(this.actions)
      }
      return { showReset: false, items }
    }
  },
  methods: {
    showDialog(primaryKey) {
      this.$refs['ref'].showDialog()
      this.init(primaryKey)
    },
    init(primaryKey) {
      this.loading = true
      if (validator.isNotEmpty(primaryKey)) {
        this.getEntity(primaryKey).then(response => {
          this.model = response.data
          this.initItems()
          this.loading = false
        })
      }
    },
    initItems() {
      this.items = this.handleItems(this.operate, this.model)
    }
  }
}
</script>
