const itemService = require('../services/item');


exports.getItems = function(req, res) {
    const response={};
    itemService.getItems(req, (err, data) => {
        if(err) {
            response.success=false;
            response.error=err;
            return res.status(400).json(response);
        }
        else {
            response.success=true;
            response.message='Found available items successfully';
            response.data=data;
            return res.status(200).json(response);
        }
    });
}

exports.getItemsBySearch = function(req, res) {
    const response={};
    itemService.getItemsBySearch(req, (err, data) => {
        if(err) {
            response.success=false;
            response.error=err;
            return res.status(400).json(response);
        }
        else {
            response.success=true;
            response.message='Found available items successfully';
            response.data=data;
            return res.status(200).json(response);
        }
    });
}

exports.orderItemsById = function(req, res) {
    const response={};
    itemService.orderItemsById(req, (err, data) => {
        if(err) {
            response.success=false;
            response.error=err;
            return res.status(400).json(response);
        }
        else {
            response.success=true;
            response.message='Ordered items successfully';
            response.data=data;
            return res.status(200).json(response);
        }
    });
}