<template>

  <div class="customer-address-form">
    <div class="row gutter-md">
      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="first-name"
          autocomplete="given-name"
          :placeholder="`${$t('First name')} *`"
          v-model.trim="customer.firstName"
          @input="$v.customer.firstName.$touch()"
          :validations="[
            {
              condition: !$v.customer.firstName.required && $v.customer.firstName.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.customer.firstName.minLength,
              text: $t('Name must have at least 3 letters.')
            }
          ]"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="last-name"
          autocomplete="family-name"
          :placeholder="`${$t('Last name')} *`"
          v-model.trim="customer.lastName"
          @input="$v.customer.lastName.$touch()"
          :validation="{
            condition: !$v.customer.lastName.required && $v.customer.lastName.$error,
            text: $t('Field is required')
          }"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="street-address"
          autocomplete="address-line1"
          :placeholder="`${$t('Street name')} *`"
          v-model.trim="customer.street"
          @input="$v.customer.street.$touch()"
          :validation="{
            condition: !$v.customer.street.required && $v.customer.street.$error,
            text: $t('Field is required')
          }"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="apartment-number"
          autocomplete="address-line2"
          :placeholder="`${$t('House/Apartment number')} *`"
          v-model.trim="customer.house"
          @input="$v.customer.house.$touch()"
          :validation="{
            condition: !$v.customer.house.required && $v.customer.house.$error,
            text: $t('Field is required')
          }"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="city"
          autocomplete="address-level2"
          :placeholder="`${$t('City')} *`"
          v-model.trim="customer.city"
          @input="$v.customer.city.$touch()"
          :validation="{
            condition: !$v.customer.city.required && $v.customer.city.$error,
            text: $t('Field is required')
          }"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="state"
          autocomplete="address-level1"
          :placeholder="$t('State / Province')"
          v-model.trim="customer.region"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-select
          class="mb-6"
          name="countries"
          :options="countryOptions"
          :selected="customer.country"
          :placeholder="$t('Country *')"
          :validations="[
            {
              condition: $v.customer.country.$error && !$v.customer.country.required,
              text: $t('Field is required')
            }
          ]"
          v-model="customer.country"
          autocomplete="country-name"
          @blur="$v.customer.country.$touch()"
          @change="$v.customer.country.$touch()"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="zip-code"
          autocomplete="postal-code"
          :placeholder="`${$t('Zip-code')} *`"
          v-model.trim="customer.postcode"
          @input="$v.customer.postcode.$touch()"
          :validations="[
            {
              condition: !$v.customer.postcode.required && $v.customer.postcode.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.customer.postcode.minLength,
              text: $t('Zip-code must have at least 3 letters.')
            }
          ]"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="phone-number"
          autocomplete="tel"
          :placeholder="$t('Phone Number')"
          v-model.trim="customer.phone"
        />
      </div>

      <div class="col-xs-12 col-md-6" />

      <div class="col-xs-12 col-md-12">
        <base-checkbox
          class="mb-6"
          id="default_shipping"
          v-model="customer.default_shipping"
          @click="customer.default_shipping = !customer.default_shipping"
        >
          {{ $t('Use as my default shipping address') }}
        </base-checkbox>
      </div>

      <div class="col-xs-12 col-md-12">
        <base-checkbox
          class="mb-6"
          id="default_billing"
          v-model="customer.default_billing"
          @click="customer.default_billing = !customer.default_billing"
        >
          {{ $t('Use as my default billing address') }}
        </base-checkbox>
      </div>

      <div class="col-xs-12 col-sm-6 col-12 mt15">
        <button-full
          @click.native="addcustomerAddress"
          :disabled="$v.$invalid"
        >
          {{ $t('Save') }}
        </button-full>
      </div>
      <div class="col-xs-12 col-sm-6 flex middle-xs py10 mt15">
        <a href="javascript:void(0)" @click="exitSection" class="inline-block text-grey-dark bg-grey-lighter py-2 px-3">
          {{ $t('Cancel') }}
        </a>
      </div>
    </div>

  </div>

</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators'
import ButtonFull from 'theme/components/theme/ButtonFull'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import Countries from '@vue-storefront/i18n/resource/countries.json'
import { AddAddress } from './AddAddress'
import toString from 'lodash-es/toString'

export default {
  name: 'AddressForm',
  props: {
    addressId: {
      type: Number,
      required: false,
      default: null
    }
  },
  components: {
    ButtonFull,
    BaseCheckbox,
    BaseInput,
    BaseSelect
  },
  computed: {
    countryOptions () {
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    }
  },
  data () {
    return {
      customer: {
        firstName: null,
        lastName: null,
        phone: null,
        street: null,
        house: null,
        city: null,
        region: null,
        country: null,
        postcode: null,
        default_shipping: false,
        default_billing: false
      },
      countries: Countries
    }
  },
  mounted () {
    this.customer = this.getCustomerAddress()
  },
  mixins: [ AddAddress ],
  methods: {
    exitSection () {
      this.$v.$reset()

      this.customer = {
        firstName: '',
        lastName: '',
        street: '',
        house: '',
        city: '',
        postcode: '',
        region: '',
        country: '',
        phone: '',
        default_shipping: false,
        default_billing: false
      }

      this.$emit('reset-toggle')
    },
    addcustomerAddress () {
      if (this.addressId === null) {
        this.addAddress(this.customer)
      } else {
        if (!this.objectsEqual(this.customer, this.getCustomerAddress())) {
          this.updateAddress(this.addressId, this.customer)
        }
      }
      this.exitSection()
    },
    getCustomerAddress () {
      let currentUser = Object.assign({}, this.$store.state.user.current)
      if (currentUser && this.addressId !== null) {
        let index
        for (let i = 0; i < currentUser.addresses.length; i++) {
          if (toString(currentUser.addresses[i].id) === toString(this.addressId)) {
            index = i
          }
        }
        if (index >= 0) {
          return {
            firstName: currentUser.addresses[index].firstname,
            lastName: currentUser.addresses[index].lastname,
            street: currentUser.addresses[index].street[0],
            house: currentUser.addresses[index].street[1],
            city: currentUser.addresses[index].city,
            postcode: currentUser.addresses[index].postcode,
            region: currentUser.addresses[index].region.region ? currentUser.addresses[index].region.region : '',
            country: currentUser.addresses[index].country_id,
            phone: currentUser.addresses[index].hasOwnProperty('telephone') ? currentUser.addresses[index].telephone : '',
            default_shipping: currentUser.addresses[index].default_shipping ? currentUser.addresses[index].default_shipping : false,
            default_billing: currentUser.addresses[index].default_billing ? currentUser.addresses[index].default_billing : false
          }
        }
      } else {
        return {
          firstName: '',
          lastName: '',
          street: '',
          house: '',
          city: '',
          postcode: '',
          region: '',
          country: '',
          phone: '',
          default_shipping: false,
          default_billing: false
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
  },
  validations: {
    customer: {
      firstName: {
        required,
        minLength: minLength(3)
      },
      lastName: {
        required
      },
      country: {
        required
      },
      street: {
        required
      },
      house: {
        required
      },
      postcode: {
        required,
        minLength: minLength(3)
      },
      city: {
        required
      }
    }
  }
}
</script>
<style lang="scss">
.customer-address-form {
  .checkbox-wrap {
    position: relative;
  }
}
</style>
