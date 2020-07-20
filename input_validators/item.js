exports.pageAndLimitParamValidator = function(req, res, next) {
    const response={};
    response.success=false;

    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    if(page!==null) {
        if(isNaN(page)) {
            response.message='query string param page has to be a number';
            return res.status(400).json(response);
        }

        if(page<1) {
            response.message='query string param page has minimum value 1';
            return res.status(400).json(response);
        }
    }

    if(limit!==null) {
        if(isNaN(limit)) {
            response.message='query string param limit has to be a number';
            return res.status(400).json(response);
        }

        if(limit<1) {
            response.message='query string param limit has minimum value 1';
            return res.status(400).json(response);
        }
    }
    return next();
}


const cuisines = ['indian', 'chinese', 'mexican', 'italian', 'thai', 'arabian'];
const categories = ['appetizer', 'burger', 'pizza', 'sandwich', 'noodles', 'rice', 'fries', 'dessert', 'salad', 'soup'];
const isCategoryAvailable = {'beverage':true ,'appetizer':true, 'burger':true, 'pizza':true, 'sandwich':true, 'noodles':true, 'rice':true, 'fries':true, 'dessert':true, 'salad':true, 'soup':true };
const isCuisineAvailable = {'indian':true, 'chinese':true, 'mexican':true, 'italian':true, 'thai':true, 'arabian':true};

exports.searchFilterValidator = function(req, res, next) {
    const response={};
    response.success=false;

    if(!req.body.filters)
        return res.redirect('/api/items');
    const { category, cuisine, priceRange, isVeg } = req.body.filters;

    if(category && !isCategoryAvailable[category]) {
        response.message=`Category ${category} unavailable See available categories`;
        response.availableCategories = categories;
        return res.status(400).json(response);   
    }

    if(cuisine && !isCuisineAvailable[cuisine]) {
        response.message=`Cuisine ${cuisine} unavailable See available categories`;
        response.availableCuisines = cuisines;
        return res.status(400).json(response);   
    }

    if(priceRange) {
        if(toString.call(priceRange)!="[object Array]") {
            response.message=`priceRange should be an array with 2 elts min and max prices`;
            return res.status(400).json(response);   
        }
        const [min, max] = priceRange;
        if(typeof(min)!=="number" || typeof(max)!=="number") {
            response.message=`Both min and max prices should be numbers`;
            return res.status(400).json(response);      
        }
        if(!max) {
            response.message=`priceRange should be an array with 2 elts min and max prices`;
            return res.status(400).json(response);   
        }
        if(min > max) {
            response.message=`Min price cannot be greater than max price`;
            return res.status(400).json(response);   
        }
    }

    if(isVeg && typeof(isVeg)!="boolean") {
        response.message=`isVeg has to be a boolean`;
        return res.status(400).json(response);   
    }

    return next();
}

exports.orderInputValidator = function(req, res, next) {
    const response={};
    response.success=false;

    const { passengerName, seatNumber, items } = req.body;
    if(!passengerName) {
        response.message='passengerName is required';
        return res.status(400).json(response);  
    }
    
    if(!seatNumber) {
        response.message='seatNumber is required';
        return res.status(400).json(response);  
    }

    if(!items) {
        response.message='items field is required';
        return res.status(400).json(response);   
    }

    if(toString.call(items)!="[object Array]") {
        response.message='items field should be an array of item objects {id: itemId, qty: orderQuantity}';
        return res.status(400).json(response);   
    }

    if(items.length===0) {
        response.message='Order should contain atleast one item';
        return res.status(400).json(response); 
    }
    
    for(const item of items) {
        const {id, qty} = item;
        if(!id) {
            response.message='item in items array missing field id';
            return res.status(400).json(response);  
        }
        if(typeof(id)!=="string") {
            response.message='field id of item should be a string';
            return res.status(400).json(response); 
        }
        if(!qty && qty!==0) {
            response.message='item in items array missing field quantity';
            return res.status(400).json(response); 
        }
        if(typeof(qty)!=="number" || qty<=0) {
            response.message='field qty of item should be a number greater than zero';
            return res.status(400).json(response); 
        }
    }
    
    return next();
}