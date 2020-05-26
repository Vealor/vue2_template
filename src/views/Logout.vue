<template><div></div></template>
<script>
export default {
  created() {
    this.$store.dispatch('jwtDestroy')
    this.$router.push('/login')
  },
}
</script>
