
//// modulos express / mysql / cors 
let port= process.env.PORT || 300;
let express=require ('express');
let app= new express()
app.use(express.urlencoded({extended:false,limit: '50mb'}));
app.use(express.json({limit: '50mb'}))
let mysql=require ('mysql');
let cors=require('cors');
app.use(cors())
app.listen(port)
let connection=mysql.createConnection({
    host: "phoneapp.c7akwgf5vfhs.eu-west-1.rds.amazonaws.com",
    database: "phones",
    user: "admin",
    password: "10897699"
})
//// Endpoints 

app.get('/phones',(request,response)=>{
    let respuesta;
    let params;
    let sql;
    if(request.query.id!=null){
        params=[request.query.id]
        sql=`SELECT * FROM phones WHERE id=?`
    }else{
        sql=`SELECT * FROM phones`
    }
        connection.query(sql,params,(err,res)=>{
            if (err){
                respuesta={error:true, type:0, message: err};
            }
            else{
                if(res.length>0){
                    respuesta={error:true, code:200, type:1, message: res};
                }else{
                    if(request.query.id!=null){
                        respuesta={error:true, code:200, type:-1, message: `No existe receta con id ${request.query.id}`};
                    }else{
                        respuesta={error:true, code:200, type:-2, message: res};
                    }
                } response.send(respuesta)
            }
        })
})

app.post('/phones', (request,response) =>{
    let respuesta;
    let params=[
                request.body.name,
                request.body.manufacturer, 
                request.body.description,
                request.body.color,
                request.body.price, 
                request.body.imageFileName,
                request.body.screen,
                request.body.processor,
                request.body.ram];
/*     let sql='INSERT INTO `phones` (`name`,`manufacturer`,`description`,`color`,`price`, `imageFileName`,`screen`,`processor`,`ram`) VALUES (?,?,?,?,?,?,?,?,?)';
 */    
    let sql=' INSERT INTO `phones`.`phones` (`name`, `manufacturer`, `description`, `color`, `price`, `imageFileName`, `screen`, `processor`, `ram`) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';
    ;

        connection.query(sql,params,(err,res)=>{
        if (err){
            respuesta={error:true, type:0, message: err};
            console.log('Ha habido un error posteando telefonos')
            console.log(err)
        }
        else{
            if(res.affectedRows>0){
                respuesta={error:false, code:200, type:1, message: res.insertId};
            }
            else{
                respuesta={error:true, code:200, message: `El telefono no se ha podido añadir a la base de datos`};
            }
        }
        response.send(respuesta)
    })
})

app.put('/phones',(request,response)=>{
    let respuesta;
    let params=[request.body.id,
        request.body.name,
        request.body.manufacturer, 
        request.body.description,
        request.body.color,
        request.body.price, 
        request.body.imageFileName,
        request.body.screen,
        request.body.processor,
        request.body.ram, 
        request.body.id]
    let sql="UPDATE `phones` SET `id` =COALESCE(?,id),`name`=COALESCE(?,name),`manufacturer`=COALESCE(?,manufacturer),`description`=COALESCE(?,description),`color`=COALESCE(?,color),`price`=COALESCE(?,price),`imageFileName`=COALESCE(?,imageFileName),`screen`=COALESCE(?,screen),`processor`=COALESCE(?,processor),`ram`=COALESCE(?,ram)  WHERE id = COALESCE(?,id)"
    connection.query(sql,params,(err,res)=>{
        if (err){
            respuesta={error:true, type:0, message: err};
        }
        else{
            if(res.affectedRows>0){
                respuesta={error:false, type:1, message: res};
            }else{
                respuesta={error:true, type:-1, message: `Telefono con id ${request.body.id} no encontrado`};
            }
        }
        response.send(respuesta)
    })
})

app.delete('/phones',(request,response)=>{
    let respuesta;
    let params=[request.query.id]
    let sql="DELETE FROM phones WHERE id=?"
    connection.query(sql,params,(err,res)=>{
        if (err){
            respuesta={error:true, type:0, message:err};
        }
        else{
            if(res.affectedRows>0){
                respuesta={error:false, type:1, message:` telefono con id ${request.query.id} eliminado correctamente`};
            }
            else{
                respuesta={error:true, type:-1, message:` telefono  con id ${request.query.id} no encontrado`};
            }
        }
        response.send(respuesta);
    })
})

connection.connect();
