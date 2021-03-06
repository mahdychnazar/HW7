/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".buyPizzasList");

function addToCart(pizza, size) {
    var isIn = false;
    getPizzaInCart().forEach(element => {
        if (element.pizza.title == pizza.title && element.size == size) {
            isIn = true;
            element.quantity++;
        }
    });
    if (!isIn) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    updateCart();
}

$("#clearAll").click(function () {
    Cart = [];
    updateCart();
});

function removeFromCart(cart_item) {
    var ind = getPizzaInCart().indexOf(cart_item);
    getPizzaInCart().splice(ind, 1);
    updateCart();
}

var basil = require('basil.js');
basil = new basil();
exports.get = function (key) {
    return basil.get(key);
};
exports.set = function (key, value) {
    return basil.set(key, value);
}
function initialiseCart() {
    if (basil.get("cartSt") !== null) {
        Cart = basil.get("cartSt");
        updateCart();
    }
}

function getPizzaInCart() {
    return Cart;
}

function updatePriceAndOrder() {
    var number = 0;
    var price = 0;
    getPizzaInCart().forEach(element => {
        price += element.pizza[element.size].price * element.quantity;
        number += element.quantity;
    });
    $("#totalPrice").html(price + " грн");
    $("#totalOrder").html(number);
}

function updateCart() {

    $cart.html("");
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        var checkUrl = window.location.href;
        if(!checkUrl.endsWith("order.html")) {
            $node.find(".plus").click(function () {
                cart_item.quantity += 1;
                $node.find(".price").html("");
                updateCart();
            });
            $node.find(".minus").click(function () {
                if (cart_item.quantity > 1) {
                    cart_item.quantity -= 1;
                } else {
                    removeFromCart(cart_item);
                }
                updateCart();
            });

            $node.find(".deleteButton").click(function () {
                removeFromCart(cart_item);
            });
        } else {
            $node.find(".plus").addClass("notVisible");
            $node.find(".minus").addClass("notVisible");
            $node.find(".deleteButton").addClass("notVisible");
            $node.find(".number").html("Кількість: "+cart_item.quantity);
            $node.find(".number").addClass("numberOrder");
        }
        $cart.append($node);
    }

    basil.set("cartSt", Cart);
    updatePriceAndOrder();
    Cart.forEach(showOnePizzaInCart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;