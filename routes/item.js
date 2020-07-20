const router = require('express').Router();
const { pageAndLimitParamValidator, searchFilterValidator, orderInputValidator } = require('../input_validators/item')
const { getItems, getItemsBySearch, orderItemsById } = require('../controllers/item');

router.get('/items', pageAndLimitParamValidator, getItems);
router.post('/items/search', pageAndLimitParamValidator, searchFilterValidator, getItemsBySearch);
router.post('/items/order', orderInputValidator, orderItemsById);

module.exports=router;