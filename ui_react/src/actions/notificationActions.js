import agent from "../agent";

const loadNotifications = async (dispatch) => {
    const response = await agent.Notification.get();

    dispatch({
        'type' : 'SET_NOTIFICATIONS',
        'value': response
    });
}; 


export default {loadNotifications}