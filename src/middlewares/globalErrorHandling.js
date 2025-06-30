export const globalErrorHandling = (error, req, res, next) => {
    const code = error.statusCode || 500;
    res.json({message:error.message})
}