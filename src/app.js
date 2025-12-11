"use strict";

let Browse = "Browse.js";
let Error404 = "Error404.js";
let Home = "Home.js";
let ProductShow = "ProductShow.js";
let Checkout = "Checkout.js";
let OrderHistory = "OrderHistory.js";

import Navbar from './views/components/Navbar.js';
import Bottombar from './views/components/Bottombar.js';
import Cart from './views/components/Cart.js';

import {Order} from './views/classes/Order.js';

import Utils from './services/Utils.js';
import i18n from './services/i18n.js';

import Products from './content/products.js';



var orderHistory = [];

//adds some dummy orders to the history on startup
let dummyOrders = () => {
    let now = new Date(); 
    var twoDays = now - 1000 * 60 * 60 * 24 * 2;
    var fiveDays = now - 1000 * 60 * 60 * 24 * 5;
    let order2 = new Order(900, new Date(fiveDays)); 
    let order1 = new Order(68500, new Date(twoDays)); 
    orderHistory.push(order1);
    orderHistory.push(order2);
}

if(localStorage.getItem("orderHistory") !== null) {
    dummyOrders();
    //get and parse the stringified array
    let orders = JSON.parse(localStorage.getItem('orderHistory'));
    //construct the objects and put into object array
    for(let order of orders) {
        let orderObj = new Order(parseInt(order[2]), new Date(order[0]), parseInt(order[1])); 
        console.log(orderObj);
        orderHistory.unshift(orderObj);
    }
}


var locale;
//check localStorage for saved locale, load if exists, set to en-US be default
if(localStorage.getItem("locale") === null) {
    locale = "en-US";
}
else {
    locale = localStorage.getItem("locale");
}
//function to update and save locale
var updateLocale = async(newLocale) => {
    locale = newLocale;
    localStorage.setItem('locale', locale);
    console.log("Locale changed to: " + locale);
    
    //fetch new products list and refresh stringsJSON
    await getProductsList(locale);

    //refresh
    reloadCart();

    router();
}

//update the shopping cart based on the new product list
var reloadCart = () => {

    //get references to droid and vehicle map
    let droidMap = productList.get("droids");
    let vehicleMap = productList.get("vehicles");

    for(let key in shoppingCart) {
        let product = shoppingCart[key];
        let saveQty;
        if(product.type == "droid") {
            saveQty = product.qty;
            shoppingCart[product.productID] = droidMap.get(product.productID);
            shoppingCart[product.productID].qty = saveQty;
        }
        else {
            saveQty = product.qty;
            shoppingCart[product.productID] = vehicleMap.get(product.productID);
            shoppingCart[product.productID].qty = saveQty;
        }
    }
    saveCart();
}

//stringify the cart
var saveCart = () => {
    let cartIds = [];

    for(let key in shoppingCart) {
        cartIds.push([key, shoppingCart[key].type, shoppingCart[key].qty]);
    }
    localStorage.setItem("cart", JSON.stringify(cartIds));
}

//map of maps to hold vehicles and droids
var productList = new Map();
productList.set("droids", new Map());
productList.set("vehicles", new Map());

//function to get products and push to map
let getProductsList = async() => {
    let droidMap = productList.get("droids");
    let vehicleMap = productList.get("vehicles");

    droidMap.clear();
    vehicleMap.clear();

    let productsJSON = await Products.loadProductCatalog();

    for(let item of productsJSON) {
 
        if(item.type == "droid") {
            droidMap.set(item.productID, item);
        }
        else if(item.type == "vehicle") {
            vehicleMap.set(item.productID, item);
        }
    }

    await getFeaturedProducts();
    //localStorage.removeItem('cart');
    readCart();
}


var shoppingCart = {};

//load cart contents fromlocalStorage
var readCart = () => {
    if(localStorage.getItem("cart") !== null) {
        console.log("found cart in storage, reconstructing...");

        let droidMap = productList.get("droids");
        let vehicleMap = productList.get("vehicles");

        let cartIdString = localStorage.getItem("cart");
        let cartIds = JSON.parse(cartIdString);

        for(let productAr of cartIds) {
            if(productAr[1] == 'droid') { 
                let product = droidMap.get(parseInt(productAr[0]));
                product.qty = parseInt(productAr[2]);
                shoppingCart[productAr[0]] = product;
            }
            else {
                let product = vehicleMap.get(parseInt(productAr[0]));
                product.qty = parseInt(productAr[2]);
                shoppingCart[productAr[0]] = product;
            }
        }

    }
}

//function for anytime an object is added to cart
var addToCart = async (item) =>  {
    const cart = null || document.querySelector('.cartSlider');

    //add item to cart if it doesn't already exist
    if(!shoppingCart.hasOwnProperty(item.productID)) {
        shoppingCart[item.productID] = item;
    }

    //re-render the cart and navbar
    cart.innerHTML = await Cart.render();
    await Cart.after_render();
    await Navbar.after_render();

    showCart();

    saveCart();
}

//show the cart and fade the other elements
var showCart = () => {
    var slider = document.querySelector(".cartSlider")
    var overlayBG = document.querySelector('.bg');
    overlayBG.classList.toggle('overlay');
    slider.classList.toggle('showCart');
}

let featuredProducts = [];

let getFeaturedProducts = async () => {
    featuredProducts = [];

    let vehicleMap = productList.get('vehicles');
    let droidMap = productList.get('droids');
   
    featuredProducts.push(vehicleMap.get(5));
    featuredProducts.push(droidMap.get(1));
    featuredProducts.push(vehicleMap.get(8));
    featuredProducts.push(droidMap.get(2));
}

export { shoppingCart, addToCart, showCart, router, locale, productList, updateLocale, orderHistory, featuredProducts, saveCart };

// Supported routes
const routes = {
    './' : Home, 
    './droids' : Browse,
    './droids/:id' : ProductShow,
    './vehicles' : Browse,
    './vehicles/:id' : ProductShow,
    './history' : OrderHistory,
    './checkout' : Checkout
};

// call back
particlesJS.load('particles-js', './plugins/assets/particlesjs-config.json', function() {
    
});


const router = async () => {

    // load view element:
    const header = null || document.getElementById('header_container');
    const content = null || document.getElementById('page_container');
    const footer = null || document.getElementById('footer_container');
    const cart = null || document.querySelector('.cartSlider');
    const ham = null || document.querySelector('.hamSlider');

    //grab products from JSON
    if(productList.get("droids").size == 0 && productList.get("vehicles").size == 0) {
        await getProductsList();
    }
    
    // Render the Header, footer, and empty cart of the page
    cart.innerHTML = await Cart.render();
    await Cart.after_render();
   
    header.innerHTML = await Navbar.render();
    await Navbar.after_render();

    if(orderHistory.length == 0) {
        dummyOrders();
    }


    let request = Utils.parseRequestURL();

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? './' + request.resource : './') + (request.id ? '/:id' : '') + (request.verb ? './' + request.verb : '')
    

    // If the parsed URL is not in the list of supported routes - 404 page
    let page = routes[parsedURL] ? routes[parsedURL] : Error404

    //lazy load and then render the correct page
    let loadPage = await import(`./views/pages/${page}`);
    content.innerHTML = await loadPage.default.render();
    await loadPage.default.after_render();
    
}



window.addEventListener('hashchange', router);

document.addEventListener('DOMContentLoaded', router);