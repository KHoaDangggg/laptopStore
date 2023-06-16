class appError extends Error {
    constructor(message, statusCode) {
        super(message);

        (this.statusCode = statusCode),
            (this.status = `${statusCode}`.startsWith('4')
                ? 'FAILED'
                : 'ERROR');
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default appError;
