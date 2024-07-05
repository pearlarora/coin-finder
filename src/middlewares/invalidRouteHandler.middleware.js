export const invalidRouteHandlerMidddleware = (req, res, next) => {
    res.status(404).send('Invalid route');
    next();
}