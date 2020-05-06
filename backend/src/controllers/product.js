const getClient = require("../database/database").getClient;
const {getFilterQuery} = require("../common/common");
const {errors} = require("../common/errors")

async function create(req,res){
    const client = getClient();
    const{
      id,
      name,
      type,
      price,
      allowed_amount,
      production_type,
      additionalOptions,
      description,
      image,
    } = res.locals.product;
    if((await client.query('SELECT product_id from product WHERE product_id = $1;',[id])).rows.length > 0){
      throw new Error({})
    };
    await client.query('INSERT INTO product (product_id,name,type,price,allowed_amount,"additionalOptions", production_type, description,image) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);',[
      id,
      name,
      type,
      price,
      allowed_amount,
      additionalOptions,
      production_type,
      description,
      image
    ]);
    res.status(200).json({error: errors.noError});
}; 

async function getList(req,res){
  const client = getClient();
  const { filters } = res.locals;
  const {query, values} = getFilterQuery(filters, "product")
  const productsInDb = await client.query(query, values);
  const products =[];
  productsInDb.rows.map((product,index)=>{
    products.push(product);
  });
  res.status(200).json(products);
};

module.exports = {
  create,
  getList
}
