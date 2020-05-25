
import _ from 'lodash'

export default function action(_action, router) {
    return async (dispatch, getState) => {
        try {
            return await _action(dispatch, getState);
        }
        catch (ex) {
        }
    }
}