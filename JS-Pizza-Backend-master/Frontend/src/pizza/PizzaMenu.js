/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API')
var Pizza_List = [];
var thisUrl = "http://localhost:5050";
var orderUrl = thisUrl + "//order.html";
//HTML едемент куди будуть додаватися піци
var $pizza_list = $(".pizzas");

function initPizzaList(error, data) {
    if (error === null) {
        Pizza_List = data;
        showPizzaList(Pizza_List);
    }
}

function showPizzaList(list) {
    $pizza_list.html("");

    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    $("#pizzasAll").html(list.length);
    list.forEach(showOnePizza);
}

$("body").find(".typeOfPizza").find("input").change(function () {
    filterPizza(this);
});

function filterPizza(filter) {
    var pizzaToShow = [];
    var idOption = $(filter).attr('id');
    Pizza_List.forEach(function (pizza) {
        if(idOption === 'filterAll') {
            pizzaToShow.push(pizza);
        }
        else if(idOption === 'filterMeat') {
            if (pizza.content.meat !== undefined) {
                pizzaToShow.push(pizza);
            }
        }
        else if(idOption === 'filterPineapple') {
            if (pizza.content.pineapple !== undefined) {
                pizzaToShow.push(pizza);
            }
        }
        else if(idOption === 'filterMushrooms') {
            if (pizza.content.mushroom !== undefined) {
                pizzaToShow.push(pizza);
            }
        }
        else if(idOption === 'filterFish') {
            if (pizza.content.ocean !== undefined) {
                pizzaToShow.push(pizza);
            }
        }
        else if(idOption === 'filterVega') {
            if (pizza.content.ocean === undefined && pizza.content.meat === undefined) {
                pizzaToShow.push(pizza);
            }
        }
    });
    showPizzaList(pizzaToShow);
}

function initialiseMenu() {
    API.getPizzaList(initPizzaList);
}

$(".orderButton").click(function () {
    if (!($("#cart").is(":visible"))) {
        $("#cart").addClass("visible");
        $("#cart").removeClass("notVisible");
        $(".menu").removeClass("visible");
        $(".menu").addClass("notVisible");
    } else {
        $("#cart").addClass("notVisible");
        $("#cart").removeClass("visible");
        $(".menu").removeClass("notVisible");
        $(".menu").addClass("visible");
    }
});

$(".buyButton").click(function () {
    var URL = window.location.href;
    if (URL.endsWith("order.html")) {
        window.location.href = thisUrl;
    } else {
        window.location.href = orderUrl;
    }
});

function isCharName(c) {
    if(c == " " || c == "'" || c == "-" || (c.toUpperCase() != c.toLowerCase())){
        return true;
    }

}

function isCharNumber(c) {
    if( c >= '0' && c <= '9'){
        return true;
    };
}

function checkName(name) {
    if (name.length == 0) return false;
    for (var i = 0; i < name.length; i++) {
        if (!isCharName(name[i])) {
            return false;
        }
    }
    return true;
}

function checkPhone(numb) {
    if ((numb.startsWith("+380") && numb.length == 13) || (numb.startsWith("0") && numb.length == 10)) {
        for (var i = 1; i < numb.length; i++) {
            if (!isCharNumber(numb[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function checkAddress(address) {
    if (address != "невідома"){
        return true;
    } else {
        return false;
    }
}

$("#inputPhone").on("input", function f() {
    var phone = $("#inputPhone").val();
    if (checkPhone(phone)) {
        $("#phoneGroup").removeClass("has-error");
        $("#phoneGroup").addClass("has-success");
        $("#phoneError").removeClass("visible");
        $("#phoneError").addClass("notVisible");
    } else {
        $("#phoneGroup").removeClass("has-success");
        $("#phoneGroup").addClass("has-error");
        $("#phoneError").removeClass("notVisible");
        $("#phoneError").addClass("visible");
    }
});
$("#inputName").on("input", function f() {
    var name = $("#inputName").val();
    if (checkName(name)) {
        $("#nameGroup").removeClass("has-error");
        $("#nameGroup").addClass("has-success");
        $("#nameError").removeClass("visible");
        $("#nameError").addClass("notVisible");
    } else {
        $("#nameGroup").removeClass("has-success");
        $("#nameGroup").addClass("has-error");
        $("#nameError").removeClass("notVisible");
        $("#nameError").addClass("visible");
    }
});
var basil = require('basil.js');
basil = new basil();
exports.get = function (key) {
    return basil.get(key);
};
exports.set = function (key, value) {
    return basil.set(key, value);
}

function sendToServer(error, data) {
    if(error === null) {
        LiqPayCheckout.init({
            data: data.data,
            signature:data.signature,
            embedTo: "#liqpay",
            mode: "popup"
        }).on("liqpay.callback", function(data){
            console.log(data.status);
            console.log(data);
        }).on("liqpay.ready", function(data){
        }).on("liqpay.close", function(data){
            basil.set("cartSt",[])
            window.location.href = thisUrl;
        });
    }
}

$("#sendInfo").click(function () {
    var name = $("#inputName").val();
    var phone = $("#inputPhone").val();
    var address = $("#addressDeliver").text();

    if (checkName(name) && checkPhone(phone) && checkAddress(address)) {
        var ordered = [];
        var price = 0;
        basil.get("cartSt").forEach(element => {
            var singlePizza = {
                pizza: element.pizza.title,
                size: element.size,
                quantity: element.quantity
            }
            price += element.quantity * element.pizza[element.size].price;
            ordered.push(singlePizza);
        });
        var data = {
            name: name,
            phone: phone,
            address: address,
            pizzas: ordered,
            price: price
        }
        API.createOrder(data, sendToServer)
    }
});



exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;