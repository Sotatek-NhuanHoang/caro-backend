import BaseApi from './BaseApi';


const RoomApi = {
    getRooms: (page) => {
        return BaseApi.GET('/rooms/available', { page: page, });
    },

    createRoom: () => {
        return BaseApi.POST('/rooms');
    },

    joinRoom: (roomId) => {
        return BaseApi.PUT('/rooms/join', {
            roomId: roomId,
        });
    },
};


export default RoomApi;
