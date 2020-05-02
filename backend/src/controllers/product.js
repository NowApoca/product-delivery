const getClient = require ("../database").getClient;
const constants = require ("../config").constants;

//operationId: products.create

/**
 * 
 * @param {/product:
    post:
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
    const {token ,id } = res.locals;
    if((await client.query('SELECT id from product WHERE id = $1;',[id])).rows.length < 0){
        throw new Error({});
    }
    const productsInDb = await client.query('SELECT id from product WHERE id=$1;',[id]);
    const products =[];
    productsInDb.rows.map((product,index)=>{
        products.push({
            product
        });
    });
    res.status(200).json(products);
}; 