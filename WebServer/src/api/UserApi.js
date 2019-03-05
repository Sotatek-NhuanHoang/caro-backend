import BaseApi from './BaseApi';


const UserApi = {
    login: ({ accessToken, facebookId }) => {
        return BaseApi.POST('/users/facebook/login', {
            accessToken: accessToken,
            facebookId: facebookId,
        });
    },
};


export default UserApi;
