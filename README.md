# Customer address book module for Vue Storefront
Customer address book extension for [vue-storefront](https://github.com/DivanteLtd/vue-storefront), by [Aureate Labs](https://aureatelabs.com)
> This extension is used for manage customer multiple addresses.

## Installation

By hand (preferer):
```
git clone https://github.com/aureatelabs/vsf-address-book.git ./vue-storefront/src/modules/address-book
```

Add the following config to your config/local.json
```
"addressbook": {
  "create_endpoint": "http://localhost:8080/api/ext/address-book/customers/{{customerId}}",
  "remove_endpoint": "http://localhost:8080/api/ext/address-book/addresses/{{addressId}}"
},
```

## Registration the customer address book module

Add script import to ./src/modules/index.ts
```
...
import { AddressBook } from './address-book'

export const registerModules: VueStorefrontModule[] = [
 ...,
 Url,
 AddressBook
]
```

## Integration to your current theme

Open `src/themes/{current-theme-dir}/components/core/blocks/MyAccount/MyShippingDetails.vue` file and import component of address book module to your theme.

```
import CustomerAddress from 'src/modules/address-book/components/CustomerAddress.vue'

export default {
  components: {
    ...,
    CustomerAddress
  },
  mixins: [MyShippingDetails],
```

Need to add component instance after shipping information view code.

```
	...
	</div>

    <customer-address />
  </div>
</template>

<script>
...
```
## Customer address book API module

Install additional extension for vue-storefront-api:

```
$ cp -f ./API/address-book ../vue-storefront-api/src/api/extensions/
```

Add the following config to your ../vue-storefront-api/config/local.json for Registration
```
"registeredExtensions": [
  ...
  "mail-service",
  "address-book"
],
```
