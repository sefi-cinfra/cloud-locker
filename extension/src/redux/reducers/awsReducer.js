import { UPDATE_VALIDATION, UPDATE_CREDS } from '../actions/awsActions';

const initialState = {
    validation: {isValid: null, reason: null},
    creds: {accessKey: null, secretKey: null}
};

export default function (state = initialState, { type, payload }) {
    switch (type) {
        case UPDATE_CREDS:
            return {...state, validation: payload};

            case UPDATE_VALIDATION:
            return {...state, creds: payload};

        default:
            return state;
    }
}
