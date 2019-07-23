import { apiStatus } from '../../../lib/util';
import { Router } from 'express';

const Magento2Client = require('magento2-rest-client').Magento2Client;

module.exports = ({ config, db }) => {

	let mcApi = Router();

	mcApi.put('/customers/:customerId', (req, res) => {

		let customerAddressData = req.body
		if(!customerAddressData) {
			apiStatus(res, 'Internal Server Error!', 500)
			return
		}

		const client = Magento2Client(config.magento2.api);
		client.addMethods('customers', function (restClient) {
            var module = {};
			module.customerAddress = function () {
				return restClient.put(`/customers/${customerAddressData.customer.id}`, customerAddressData)
            }
            return module;
		})
		
		client.customers.customerAddress().then((result) => {
			apiStatus(res, result, 200);
		}).catch(err=> {
			apiStatus(res, err, 500);
		})	
	})

	mcApi.delete('/addresses/:addressId', (req, res) => {

		let addressData = req.body
		if(!addressData) {
			apiStatus(res, 'Internal Server Error!', 500)
			return
		}

		const client = Magento2Client(config.magento2.api);
		client.addMethods('customers', function (restClient) {
            var module = {};
			module.removeAddress = function () {
				return restClient.delete(`/addresses/${addressData.addressId}`)
            }
            return module;
		})
		
		client.customers.removeAddress().then((result) => {
			apiStatus(res, result, 200);
		}).catch(err=> {
			apiStatus(res, err, 500);
		})	
	})

	return mcApi
}
