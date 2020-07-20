require('dotenv').config();
const express = require('express');
const dbConnect = require('./dbConnect');

const Item = require('./models/item');
const cuisine = ['indian', 'chinese', 'mexican', 'italian', 'thai', 'arabian'];
const categories = ['appetizer', 'burger', 'pizza', 'sandwich', 'noodles', 'rice', 'fries', 'dessert', 'salad', 'soup'];

// const categories = ['beverage','appetizer', 'burger', 'pizza', 'sandwich', 'noodles', 'rice', 'fries', 'dessert', 'salad', 'soup'];
const isVeg = [true, false, false, true, false];

const beverages = ['bev1', 'bev2', 'bev3', 'bev4', 'bev5', 'bev6', 'bev7', 'bev8', 'bev9', 'bev10'];

/* 
beverages   => price => 100-300   items=> bev1-bev10          total => 10 qty=> 0-100
appetizers  => price => 100-300   items => item1 - item50     total => 50 qty=> 0-100
burgers     => price => 100-300   items => item51 - item100   total => 50 qty=> 0-100
pizzas      => price => 100-300   items => item101 - item150  total => 50 qty=> 0-100
sandwiches  => price => 100-300   items => item151 - item200  total => 50 qty=> 0-100
noodle
*/

async function setMenu() { 
  try {
    await dbConnect();
    for(let i=1; i<=500; i++) {
      const name = 'item'+i;
      const qty = 0+Math.floor(101*Math.random());
      const price = 100+Math.floor(201*Math.random());
      const categoryIndex = Math.floor(10*Math.random());
      const description = `${categories[categoryIndex].toUpperCase()} ${name} contains ingredients a, b ,c`;
      const cuisineIndex = Math.floor(6*Math.random());
      const vegIndex = Math.floor(5*Math.random());  
      const preview = getPreviewImg(categories[categoryIndex]);
      // const result = {name, price, qty, description, preview, category: categories[categoryIndex], cuisine: cuisine[cuisineIndex], isVeg: isVeg[vegIndex] };
      // console.log(result);
      await Item.create({name, price, qty, description, preview, category: categories[categoryIndex], cuisine: cuisine[cuisineIndex], isVeg: isVeg[vegIndex]});
    } 
    console.log('Done...');
  }
  catch(err) {
    console.log(err);
  }
}
  
async function addBeverages() { 
  try {
    await dbConnect();
    for(let i=1; i<=10; i++) {
      const name = 'bev'+i;
      const qty = 0+Math.floor(101*Math.random());
      const price = 10+Math.floor(21*Math.random());
      const description = `BEVERAGE ${name} contains ingredients a, b ,c`;
      const preview = getPreviewImg('beverage');
      // const result = {name, price, qty, description, preview, category:'beverage' };
      // console.log(result);
      await Item.create({name, price, qty, description, preview, category: 'beverage'});
    } 
    console.log('Done...');
  }
  catch(err) {
    console.log(err);
  }
}

setMenu();
addBeverages();

function getPreviewImg(catName) {
  let preview;
  switch(catName) {
    case 'beverage':
      preview='https://images.alphacoders.com/769/thumb-1920-769420.jpg';
      break;

    case 'appetizer':
      preview='https://anaffairfromtheheart.com/wp-content/uploads/2019/12/Spicy-Caribbean-Shrimp-Appetizer-sq-close-up-735x735.png';
      break;
    
    case'burger':
      preview='https://i.pinimg.com/originals/b6/51/c4/b651c473c595f728118644568221637e.jpg';
      break;
    
    case 'pizza':
      preview='https://wallpapercave.com/wp/wc1813154.jpg';
      break;

    case 'sandwich':
      preview='https://www.itl.cat/pngfile/big/164-1645396_sandwich-tomato-grape-toast-fast-food-indian-sandwich.jpg';
      break;
      
    case 'noodles':
      preview='https://pngimg.com/uploads/noodle/noodle_PNG57.png';
      break;

    case 'rice':
      preview='https://www.fifteenspatulas.com/wp-content/uploads/2012/03/Fried-Rice-Fifteen-Spatulas-8-640x427.jpg';
      break; 

    case 'fries':
      preview='https://c4.wallpaperflare.com/wallpaper/666/302/422/food-potato-french-fries-hd-wallpaper-preview.jpg';
      break;

    case 'dessert':
      preview='https://1.bp.blogspot.com/-vlvESlveYSo/VjCmt9rLw_I/AAAAAAAAK7s/x1-7MWl9D7M/s1600/yammy-good-morning-breakfast-coffee-ice-cream-full-hd-image.jpg';
      break;

    case 'salad':
      preview='https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Salad_platter.jpg/1200px-Salad_platter.jpg';
      break;

    case 'soup':
      preview='https://www.kagomeindia.com/wp-content/uploads/Tomato-Pepper-Soup.jpg';
      break;
  }
  return preview;
}