import { module } from './store'
import { createModule } from '@vue-storefront/core/lib/module'
import { initCacheStorage } from '@vue-storefront/core/helpers/initCacheStorage'

export const KEY = 'addressBook'
export const cacheStorage = initCacheStorage(KEY)
export const AddressBook = createModule({
  key: KEY,
  store: { modules: [{ key: KEY, module }]}
})
