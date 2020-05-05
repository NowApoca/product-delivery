const getClient = require ("../database/database").getClient;
const constants = require ("./config").constants;

async function create(req,res){
    const client = getClient();
    const{
      id,
      name,
      type,
      price,
      additionalOptions,
      description,
      image,
    } = res.locals;
    //check product id valid
    if((await client.query('SELECT id from product WHERE id = $1;',[id])).rows.length > 0){
      throw new Error({})
    };
    //Create product
    await client.query('INSERTO INTO product (id,name,type,price,additionalOptions,description,image) VALUES $1;',[
      id,
      name,
      type,
      price,
      additionalOptions,
      description,
      image
    ]);
    res.status(200);
}; 

async function getList(req,res){
  const client = getClient();
  const { filters } = res.locals;
  const productsInDb = await client.query('SELECT * from product WHERE $1;',[filters]);
  const products =[];
  productsInDb.rows.map((product,index)=>{
      products.push({
          product
      });
  });
  res.status(200).json(products);
}; 

module.exports = {
  create,
  getList
}
