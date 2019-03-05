import BaseApi from './BaseApi';


const RoomApi = {
    getRooms: (page) => {
        return BaseApi.GET('/rooms/available', { page: page, });
    },
};


export default RoomApi;
