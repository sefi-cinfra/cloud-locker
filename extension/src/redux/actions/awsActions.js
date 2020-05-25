import _ from 'lodash';
import CookiesManager from '../../utils/cookiesManager';
import action from "../middleware";

export const UPDATE_CREDS = "UPDATE_CREDS";
export const UPDATE_VALIDATION = "UPDATE_VALIDATION";

const updateCreds = (accessKey, secretKey) => {
    return action(async dispatch => {
        let cookiesManager = new CookiesManager();


        cookiesManager.setAccessKey(accessKey);
        cookiesManager.setSecretKey(secretKey);

        dispatch({
            type: UPDATE_CREDS,
            payload: { accessKey, secretKey }
        });
    });
}

const getCreds = () => {
    return action(async dispatch => {
        let cookiesManager = new CookiesManager();

        let accessKey = cookiesManager.getAccessKey();
        let secretKey = cookiesManager.getSecretKey();

        dispatch({
            type: UPDATE_CREDS,
            payload: { accessKey, secretKey }
        });
        
        return { accessKey, secretKey };
    });
}

const isValid = (accessKey, secretKey) => {
    return action(async dispatch => {

        if (_.isEmpty(accessKey) || _.isEmpty(secretKey)) {
            dispatch({
                type: UPDATE_VALIDATION,
                payload: { isValid: false, reason: "AccessKey and SecretKey are mandatory parameters" }
            });
            return false;
        }

        //TODO: Check AWS Validation
        /*dispatch({
            type: UPDATE_VALIDATION,
            payload: { isValid: false, reason: "AccessKey and SecretKey are mandatory parameters" }
        });*/

        dispatch({
            type: UPDATE_VALIDATION,
            payload: { isValid: true, reason: null }
        });
        return true;
    });
}

export {
    updateCreds,
    getCreds,
    isValid
}
