class Api_success {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = true;
        if (data) {
            this.data = data;
        }
    }
}

export default Api_success;