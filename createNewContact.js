const express = require("express");
const app = express();

const createPayload = async (donor_id, title, description) => {
  const newlisting = await (
    `INSERT INTO list (donor_id, title, description) values ( $1, $2, $3 )`,
    [donor_id, title, description]
  );
}
  module.exports = {
    createPayload
  }