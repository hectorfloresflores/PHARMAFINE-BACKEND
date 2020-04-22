const express = require('express')
const router = express.Router()

var Openpay = require('openpay');


const id = process.env.openpay_id;
const privatekey = process.env.openpay_privatekey;
//instantiation
var openpay = new Openpay(id, privatekey, false);
//use the api

/*For encrypt passwords */


router.route('/pay')
    .post((req, res) => {
        var newCustomer = {
            "name":"carlos",
            "email":"carlos.flogars@gmail.com",
            "last_name":"flores",
            'requires_account': false,
            "address":{
              "city":"Ocotlan",
              "state":"Jalisco",
              "line1":"Montes de Oca",
              "line2":"col. Centro",
              "postal_code":"47800",
              "country_code":"MX"
            },
            "phone_number":"3929270291"
          };
          
          openpay.customers.create(newCustomer, function(error, body) {
              switch (error) {
                  case '200':
                    console.log(body)
                      break;
                      case '201':
                        console.log(body)
                    break;
                    case '204':
                        console.log(body)
                    break;
                  default:
                      console.log(error)
                      break;
              }
              error;    // null if no error occurred (status code != 200||201||204)
              body;     // contains the object returned if no error occurred (status code == 200||201||204)
          });
                
       
        // getProducts()
        res.status(202).send(`User successfully saved!`)
    })
    .get((req, res) => {
        openpay.customers.get('axvw0jx6cgwla19ogdb9', function(error, customer) {
            console.log(error)
            console.log(customer)
        });
    })

module.exports = router;