import Cookies from 'js-cookie';

//uglify our cookie names for security purposes

export const AWS_ACCESS_KEY = "AWS_ACCESS_KEY";
export const AWS_ACCESS_SECRET_KEY = "AWS_ACCESS_SECRET_KEY";

class CookiesManager {

    getAccessKey(){
        return Cookies.get(AWS_ACCESS_KEY);
    }

    setAccessKey(val, expirationInDays=365, path="/"){
        Cookies.set(AWS_ACCESS_KEY, val, { expires: expirationInDays, path});
    }

    getSecretKey(){
        return Cookies.get(AWS_ACCESS_SECRET_KEY);
    }

    setSecretKey(val, expirationInDays=365, path="/"){
        Cookies.set(AWS_ACCESS_SECRET_KEY, val, { expires: expirationInDays, path});
    }
}

export default CookiesManager;