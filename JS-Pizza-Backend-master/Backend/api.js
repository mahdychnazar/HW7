/**
 * Created by chaika on 09.02.16.
 */
 var Pizza_List = require('./data/Pizza_List');

 exports.getPizzaList = function (req, res) {
     res.send(Pizza_List);
 };
 
 function base64(str) {
     return new Buffer(str).toString('base64');
 }
 
 var crypto = require('crypto');
 
 function sha1(string) {
     var sha1 = crypto.createHash('sha1');
     sha1.update(string);
     return sha1.digest('base64');
 }
 
  const LIQ_PUBLIC_KEY = 'sandbox_i82961203048';
 const LIQ_PRIVATE_KEY = 'sandbox_xPPEK8aZsvo9UlMLMNWWC4MBeRPtdqjMNUfzPIln';
 exports.createOrder = function (request, result) {
     var orderInfo = request.body;
     var description = "Замовлення піци: "+orderInfo.name+"\n"+ "Адреса доставки: "+orderInfo.address+"\n"+ "Телефон: "+orderInfo.phone+"\n";
     orderInfo.pizzas.forEach(element => {
         description=description+"- "+element.quantity+"шт.";
         if(element.size=="big_size") {
             description=description+" [Велика] ";
         } else {
             description=description+" [Мала] ";
         }
         description=description+element.pizza+"\n";
     });
     console.log(orderInfo);
     var order = {
         version: 3,
         public_key: LIQ_PUBLIC_KEY,
         action: "pay",
         amount: orderInfo.price,
         currency: "UAH",
         description: description,
         order_id: Math.random(),
         sandbox: 1
     };
     var data = base64(JSON.stringify(order));
     var signature = sha1(LIQ_PRIVATE_KEY + data + LIQ_PRIVATE_KEY);
     result.send({
         data: data,
         signature: signature,
         success: true
     });
 };