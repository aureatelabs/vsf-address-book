export const RemoveAddress = {
  name: 'RemoveAddress',
  methods: {
    removeAddress (addressId) {
      return new Promise ((resolve) => {
        this.$store.dispatch('addressBook/removeAddress', addressId)
        resolve()
      })
    }
  }
}
