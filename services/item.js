const { response } = require('express');
const { find } = require('../models/item');

class ItemService {
    constructor() {
        this.Item = require('../models/item');
        this.Order = require('../models/order');
    }

    /* 
        RETURNS ITEMS SORTED BY SPECIFIC CRITERIA AND PAGINATED

        query string params [sortBy, order, page, limit]
        path = /items?sortBy=value&order=value&page=value&limit=value
        Default values sortBy   : ObjectId ('_id')
                       order    : ascending ('asc')
                       page     : 1
                       limit    : 5

        sortBy can take values ['price', 'qty'] corresponding to sorting results based on price and 
        quantity available.
        order can take values ['asc','desc'] i.e., ascending and descending
    */
    async getItems(req, callback) {
        
        const [err, data] = await this._getPaginatedResults(req.query, null, '/api/items');
        return callback(err, data);
 
    }

    /*
        RETURNS ITEMS BY SEARCH SORTED BY SPECIFIC CRITERIA AND PAGINATED
        Items filtered based on category(type of food item), cuisine, price(price range), isVeg (vegetarian/non-vegetarian)
            
        filters: { category, cuisine, price: [min,max], isVeg }
        categories = ['beverage','appetizer', 'burger', 'pizza', 'sandwich', 'noodles', 'rice', 'fries', 'dessert', 'salad', 'soup'];
    */
    async getItemsBySearch(req, callback) {

        const {category, priceRange, cuisine, isVeg} = req.body.filters ? req.body.filters : {};
        const [minPrice, maxPrice] = priceRange ? priceRange : [0, Number.MAX_SAFE_INTEGER];
    
        const findCriteria = { price:{ $gte:minPrice, $lte:maxPrice } };
        if(category) findCriteria.category=category;
        if(cuisine) findCriteria.cuisine=cuisine;
        if(isVeg) findCriteria.isVeg=true;
        
        const [err, data] = await this._getPaginatedResults(req.query, findCriteria, '/api/items/search');
        return callback(err, data);

    }


    /*
        ORDERS ITEMS AND RETURNS ITEMS THAT HAVE BEEN SUCCESSFULLY ORDERED AND ITEMS THAT ARE OUT OF STOCK
        Items filtered based on category(type of food item), cuisine, price(price range), isVeg (vegetarian/non-vegetarian)
            {
                "passengerName":"Pavan",
                "seatNumber":"29A",
                "items":[
                        { "id":"5f131e69afd9450a886be7f4",
                        "qty":2
                        }
                ]
            }
    */
    async orderItemsById(req, callback) {
        try {
            const { passengerName, seatNumber, items } = req.body;
            const orderItems=[];
            let bill = 0;
            for(const itemObj of items) {
                const item = await this._getItemById(itemObj.id);
                if(!item) {
                    return callback('Item id invalid', null);
                }
                if(!this._isInStock(item, itemObj.qty)) {
                    return callback(`Item id ${item.id} name ${item.name} unavailable`, null);
                }
                else {
                    
                    orderItems.push({item:itemObj.id, qty:itemObj.qty, price:item.price});
                }
            }

            // console.log(orderItems);
            for(const orderedItem of orderItems) {
                console.log(orderedItem);
                let stockLeft = orderedItem.qty;
                stockLeft-=1;
                await this.Item.findOneAndUpdate({_id:orderedItem.id}, {qty: stockLeft});
                bill+=orderedItem.price;
            }
            const newOrder = new this.Order({ passengerName, seatNumber, items: orderItems, bill});
            const savedOrder = await newOrder.save();
            const data = await savedOrder.populate('items.item', '-createdAt, -updatedAt, -description -category -cuisine -qty')                       
                                         .execPopulate();
            return callback(null, data);         
        }
        catch(err) {
            return callback(err, null);
        }
    }

    async _getItemById(itemId) {
        try {
            const item = await this.Item.findById(itemId)
                                            .select('-createdAt -updatedAt -__v');
            return item;
        }
        catch(err) {
            console.log(err);
        }
    }

    _isInStock(item, orderQty) {
            if(item.qty===0) return false;
            if(orderQty>item.qty) return false;
            return true;
    }

    async _getPaginatedResults(queryParams, findCriteria, path) {
        const sortBy = queryParams.sortBy ? queryParams.sortBy : '_id';
        const order = queryParams.order ? queryParams.order : 'asc';
        const page = queryParams.page ? parseInt(queryParams.page) : 1;
        const limit = queryParams.limit ? parseInt(queryParams.limit) : 5;
        const skip = (page-1)*limit;
        const endIndex = page*limit;
        const docCount = await this.Item.countDocuments();
        const maxPage = Math.ceil(docCount/limit);
        if(page > maxPage) {
            return [`Page limit exceed max page is ${maxPage}`, null];
        }
        try {
            const data={};
            const criteria = findCriteria===null ? {} : findCriteria
            data.results = await this.Item.find(criteria)
                                        .select('-createdAt -updatedAt -__v')
                                        .sort([[sortBy, order]])
                                        .limit(limit)
                                        .skip(skip);
            
            data.self=`${path}?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`;
            if(page>1) {
                const prevPage = page-1;
                data.prev = `${path}?sortBy=${sortBy}&order=${order}&page=${prevPage}&limit=${limit}`;
            }
            if(endIndex < docCount) {
                const nextPage = page+1;
                data.next = `${path}?sortBy=${sortBy}&order=${order}&page=${nextPage}&limit=${limit}`
            }
            return [null, data];
        }
        catch(err) {
            return [err, data];
        }
    }
}

module.exports = new ItemService();