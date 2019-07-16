import Vue from 'vue'
import { AddressBookState } from '../types/AddressBookState'
import { ActionTree } from 'vuex';
import Address from '../types/Address'
import rootStore from '@vue-storefront/core/store'
import { adjustMultistoreApiUrl } from '@vue-storefront/core/lib/multistore'
import i18n from '@vue-storefront/i18n'
import toString from 'lodash-es/toString'
import { Logger } from '@vue-storefront/core/lib/logger'

export const actions: ActionTree<AddressBookState, any> = {
  async addAddress ({ rootState }, addressData: Address) {
      let currentUser = Object.assign({}, rootState.user.current)
      if (currentUser) {
        let customerId = currentUser.id
        let existAddress = currentUser.addresses.length ? currentUser.addresses : []

        if (existAddress.length > 0) {
          for (let i = 0; i < existAddress.length; i++) {
            if (addressData.default_shipping) {
              existAddress[i].default_shipping = false
            }
            if (addressData.default_billing) {
              existAddress[i].default_billing = false
            }
          }
        }

        existAddress.push({
          city: addressData.city,
          country_id: addressData.country,
          customer_id: customerId,
          firstname: addressData.firstName,
          lastname: addressData.lastName,
          postcode: addressData.postcode,
          region: {
            region: addressData.region
          },
          region_id: 0,
          street: [
            addressData.street,
            addressData.house
          ],
          telephone: addressData.phone,
          default_shipping: addressData.default_shipping,
          default_billing: addressData.default_billing
        })

        let customerData = {
          customer: {
            id: customerId,
            email: currentUser.email,
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            website_id: currentUser.website_id,
            store_id: currentUser.store_id,
            addresses: existAddress
          }
        }

        Vue.prototype.$bus.$emit('notification-progress-start', i18n.t('Saving...'))
        try {

          let url = rootStore.state.config.addressbook.create_endpoint.replace('{{customerId}}', customerId)
          if (rootStore.state.config.storeViews.multistore) {
            url = adjustMultistoreApiUrl(url)
          }

          await fetch(url, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
          })
          .then(response => response.json())
          .then(data => {
            Vue.prototype.$bus.$emit('notification-progress-stop')
            if (data.code === 200) {
              rootStore.dispatch('user/me')
              rootStore.dispatch('notification/spawnNotification', {
                type: 'success',
                message: i18n.t('Address has been saved successfully.'),
                action1: { label: i18n.t('OK') }
              })
            } else {
              Logger.error('Something went wrong. Try again in a few seconds.', 'address-book')()
            }
          })
        } catch (e) {
          Vue.prototype.$bus.$emit('notification-progress-stop')
          Logger.error('Something went wrong. Try again in a few seconds.', 'address-book')()
        }
      } else {
        Logger.error('You must have to login', 'address-book')()
      }
  },

  async updateAddress ({ rootState }, addressData) {
    if (addressData.currentAddressId) {
      let currentUser = Object.assign({}, rootState.user.current)
      let customerId = currentUser.id
      let existAddresses = currentUser.addresses.length ? currentUser.addresses : []

      let index
      for (let i = 0; i < existAddresses.length; i++) {
        if (addressData.newAddress.default_shipping) {
          existAddresses[i].default_shipping = false
        }
        if (addressData.newAddress.default_billing) {
          existAddresses[i].default_billing = false
        }
        if (toString(existAddresses[i].id) === toString(addressData.currentAddressId)) {
          index = i
        }
      }

      if (index >= 0) {
        existAddresses[index].firstname = addressData.newAddress.firstName
        existAddresses[index].lastname = addressData.newAddress.lastName
        existAddresses[index].street = [addressData.newAddress.street, addressData.newAddress.house]
        existAddresses[index].city = addressData.newAddress.city
        existAddresses[index].region = {
          region: addressData.newAddress.region ? addressData.newAddress.region : null
        }
        existAddresses[index].country_id = addressData.newAddress.country
        existAddresses[index].postcode = addressData.newAddress.postcode
        existAddresses[index].telephone = addressData.newAddress.phone ? addressData.newAddress.phone : '',
        existAddresses[index].default_shipping = addressData.newAddress.default_shipping,
        existAddresses[index].default_billing = addressData.newAddress.default_billing
      }

      let customerData = {
        customer: {
          id: customerId,
          email: currentUser.email,
          firstname: currentUser.firstname,
          lastname: currentUser.lastname,
          website_id: currentUser.website_id,
          store_id: currentUser.store_id,
          addresses: existAddresses
        }
      }

      Vue.prototype.$bus.$emit('notification-progress-start', i18n.t('Saving...'))
      try {

        let url = rootStore.state.config.addressbook.create_endpoint.replace('{{customerId}}', customerId)
        if (rootStore.state.config.storeViews.multistore) {
          url = adjustMultistoreApiUrl(url)
        }

        await fetch(url, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerData)
        })
        .then(response => response.json())
        .then(data => {
          Vue.prototype.$bus.$emit('notification-progress-stop')
          if (data.code === 200) {
            rootStore.dispatch('user/me')
            rootStore.dispatch('notification/spawnNotification', {
              type: 'success',
              message: i18n.t('Address has been saved successfully.'),
              action1: { label: i18n.t('OK') }
            })
          } else {
            Logger.error('Something went wrong. Try again in a few seconds.', 'address-book')()
          }
        })
      } catch (e) {
        Vue.prototype.$bus.$emit('notification-progress-stop')
        Logger.error('Something went wrong. Try again in a few seconds.' + e, 'address-book')()
      }
    } else {
      Logger.error('Address Id missing', 'address-book')()
    }
  },

  async removeAddress ({ commit, rootState }, addressId) {
    if (addressId) {
      Vue.prototype.$bus.$emit('notification-progress-start', i18n.t('Removing...'))
      try {

        let url = rootStore.state.config.addressbook.remove_endpoint.replace('{{addressId}}', addressId)
        if (rootStore.state.config.storeViews.multistore) {
          url = adjustMultistoreApiUrl(url)
        }

        let addressData = {
          addressId : addressId
        }

        await fetch(url, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(addressData)
        })
        .then(response => response.json())
        .then(data => {
          Vue.prototype.$bus.$emit('notification-progress-stop')
          if (data.code === 200) {
            rootStore.dispatch('user/me')
            rootStore.dispatch('notification/spawnNotification', {
              type: 'success',
              message: i18n.t('Address has been deleted successfully.'),
              action1: { label: i18n.t('OK') }
            })
          } else {
            Logger.error('Something went wrong. Try again in a few seconds.', 'address-book')()
          }
        })
      } catch (e) {
        Vue.prototype.$bus.$emit('notification-progress-stop')
        Logger.error('Something went wrong. Try again in a few seconds.' + e, 'address-book')()
      }
    } else {
      Logger.error('Address Id missing', 'address-book')()
    }
  }
}
