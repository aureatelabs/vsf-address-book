import Address from '../types/Address'

export const AddAddress = {
  name: 'AddAddress',
  methods: {
    addAddress (address: Address) {
      return new Promise ((resolve) => {
        this.$store.dispatch('addressBook/addAddress', address)
        resolve()
      })
    },
    updateAddress (currentAddressId, address: Address) {
      return new Promise ((resolve) => {
        this.$store.dispatch('addressBook/updateAddress', {"currentAddressId": currentAddressId, "newAddress": address})
        resolve()
      })
    }
  }
}
