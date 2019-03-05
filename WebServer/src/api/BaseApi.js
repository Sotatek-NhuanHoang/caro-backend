import { create } from 'apisauce';
import Config from 'caro-config';
import store from 'caro-store';
import _ from 'lodash';


const Api = create({
    baseURL: Config.API_SERVER_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },  
});


const BaseApi = {
    GET: async (endPoint, params = {}) => {
        const { user } = store.getState();
        const token = _.get(user, ['currentUser', 'token']);

        try {
            const response = await Api.get(endPoint, params, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (!response.ok) {
                throw new Error(response.data.message);
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    POST: async (endPoint, params = {}) => {
        const { user } = store.getState();
        const token = _.get(user, ['currentUser', 'token']);

        try {
            const response = await Api.post(endPoint, params, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (!response.ok) {
                throw new Error(response.data.message);
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    PUT: () => {},

    DELETE: () => {},
};


export default BaseApi;
