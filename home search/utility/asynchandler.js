export default function asyncHandler(requesthandler){
    return function(req, res, next){
        Promise.resolve(requesthandler(req,res,next)).catch(next)
    }
}