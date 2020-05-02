const getClient = require ("../database").getClient;
const constants = require ("../config").constants;

//operationId: products.create

/**
 * 
 * @param {/product:
    get:
      operationId: products.getList
      tags:
        - products
      summary: Returns list of available products.
      description: Return description, stock and status of available products.
      parameters:
        - in: header
          name: userToken
          description: User token.
          schema:
            type: string
            example: token
        - in: header
        name: filters
        description: User token.
        schema:
          type: string
          example: token
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Product"} req 
 * @param {*} res 
 */

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
    if((await client.query('SELECT id from product WHERE product = $1;',[id])).rows.length>0){
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
  const {token , filters } = res.locals;
  const userInDB = await client.query('SELECT email FROM user WHERE token = $1;',[token]);
  if(userInDB.row.length<0){
    throw new Error({})
  };
  //to review
  const productsInDb = await client.query('SELECT * from product WHERE type=$1;',[filters.type]);
  const products =[];
  productsInDb.rows.map((product,index)=>{
      products.push({
          product
      });
  });
  res.status(200).json(products);
}; 

