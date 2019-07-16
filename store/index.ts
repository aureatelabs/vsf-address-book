import { Module } from 'vuex'
import { AddressBookState } from '../types/AddressBookState'
import { actions } from './actions'

export const module: Module<AddressBookState, any> = {
  namespaced: true,
  actions
}
