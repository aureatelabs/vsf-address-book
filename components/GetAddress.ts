import store from '@vue-storefront/core/store'

export const GetAddress = {
  name: 'GetAddress',
  methods: {
    getAllAddresses () {
      let currentUser = Object.assign({}, store.state.user.current)
      return currentUser.addresses
    },
    getShippingAddress () {
      let currentUser = Object.assign({}, store.state.user.current)
      return currentUser.addresses.filter(address => address.default_shipping === true)
    },
    getBillingAddress () {
      let currentUser = Object.assign({}, store.state.user.current)
      return currentUser.addresses.filter(address => address.default_billing === true)
    },
    getCurrentShippingDetails () {
      if (this.getShippingAddress()) {
        let currentShippingAddress = this.getShippingAddress()
        if (currentShippingAddress) {
          currentShippingAddress = currentShippingAddress[0]
          return {
            firstName: currentShippingAddress.firstname,
            lastName: currentShippingAddress.lastname,
            street: currentShippingAddress.street[0],
            house: currentShippingAddress.street[1],
            city: currentShippingAddress.city,
            postcode: currentShippingAddress.postcode,
            region: currentShippingAddress.region.region ? currentShippingAddress.region.region : '',
            country: currentShippingAddress.country_id,
            phone: currentShippingAddress.telephone ? currentShippingAddress.telephone : '',
            default_shipping: currentShippingAddress.default_shipping ? currentShippingAddress.default_shipping : false,
            default_billing: currentShippingAddress.default_billing ? currentShippingAddress.default_billing : false
          }
        }
      }
    },
    objectsEqual (a, b) {
      const aProps = Object.keys(a)
      const bProps = Object.keys(b)

      if (aProps.length !== bProps.length) {
        return false
      }

      for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i]
        if (!b.hasOwnProperty(propName)) {
          return false
        } else {
          if (a[propName] !== null && b[propName] !== null && a[propName] === 'object' && b[propName] === 'object') {
            if (!this.objectsEqual(a[propName], b[propName])) {
              return false
            }
          } else if (a[propName] !== b[propName]) {
            return false
          }
        }
      }
      return true
    }
  }
}
