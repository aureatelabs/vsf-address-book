<template>

  <div class="mb15 mt20 customer-address">

    <div class="customer-address-list mb15" v-if="getallAddresses.length > 0">
      <h3 class="mb30">
        {{ $t('Additional Addresses') }}
      </h3>
      <div class="row gutter-md">
        <div class="col-md-4 col-sm-6 col-xs-12 mb30" :class="'customer-address-'+ address.id" v-for="address in getallAddresses" :key="address.id">
          <div class="address-box">
            <p class="mb15"><strong>{{ address.firstname }} {{ address.lastname }}</strong></p>
            <p v-if="address.company">
              {{ address.company }}
            </p>
            <p>
              {{ address.street[0] }}
              <span v-if="address.street[1]"> {{ address.street[1] }}</span>
            </p>
            <p>
              {{ address.city }} {{ address.postcode }}
            </p>
            <p>
              <span v-if="address.region">{{ address.region.region }}, </span>
              {{ getCountryName(address.country_id) }}
            </p>
            <div v-if="address.telephone">
              {{ address.telephone }}
            </div>
          </div>
          <div class="address-action">
            <a href="javascript:void(0)" @click="editAddress(address.id)">{{ $t('Edit') }}</a>
            <a href="javascript:void(0)" @click="removeCustomerAddress(address.id)">{{ $t('Remove') }}</a>
          </div>
        </div>
      </div>
    </div>

    <div class="row gutter-md">
      <div class="col-xs-12 col-md-6">
        <button-full
          @click.native="toggleAddressForm = !toggleAddressForm"
          v-show="!toggleAddressForm"
        >
          {{ $t('Add new address') }}
        </button-full>
      </div>
    </div>
    <address-form
      v-if="toggleAddressForm"
      @reset-toggle="resetToggle"
      :address-id="currentAddressId"
    />
  </div>

</template>
<script>

import AddressForm from './AddressForm'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Countries from '@vue-storefront/i18n/resource/countries.json'
import { RemoveAddress } from './RemoveAddress'
import i18n from '@vue-storefront/i18n'

export default {
  name: 'CustomerAddress',
  data () {
    return {
      toggleAddressForm: false,
      countries: Countries,
      currentAddressId: null
    }
  },
  computed: {
    getallAddresses () {
      return this.$store.state.user.current ? this.$store.state.user.current.addresses.filter(address => address.default_shipping !== true) : {}
    }
  },
  components: {
    ButtonFull,
    AddressForm
  },
  mixins: [ RemoveAddress ],
  methods: {
    resetToggle () {
      this.toggleAddressForm = false
      this.currentAddressId = null
    },
    getCountryName (countryId) {
      return this.countries.filter(country => country.code === countryId)[0].name
    },
    editAddress (addressId) {
      if (this.toggleAddressForm) {
        this.toggleAddressForm = false
      }
      setTimeout(() => {
        this.toggleAddressForm = true
        this.currentAddressId = addressId
      }, 1)
    },
    removeCustomerAddress (addressId) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t('Are you sure you want to remove this address?'),
        action1: { label: i18n.t('Cancel'), action: 'close' },
        action2: { label: i18n.t('OK'),
          action: () => {
            this.removeAddress(addressId)
            document.querySelector('.customer-address-' + addressId).remove()
          }
        },
        hasNoTimeout: true
      })
    }
  }
}
</script>
<style lang="scss">
.address-box {
  padding: 10px;
  min-height: 240px;
  border: 1px solid #ededed;
}
.address-action {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border: 1px solid #ededed;
  border-top: 0;
  background: #F5F5F5;
  a {
    color: #4A4A4A;
  }
}
</style>
