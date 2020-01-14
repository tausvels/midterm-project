const express = require('express');

const router = express.Router();

module.exports = (ordersService) => {

  router.get("/", (req, res) => {
    res.render("index");
  })

  router.get("/menu", (req, res) => {
    ordersService.getOrders()
    .then(result => {
      const data = result;
      res.json({data});
    })
    .catch(e => console.error(e))
  })

  return router
};
