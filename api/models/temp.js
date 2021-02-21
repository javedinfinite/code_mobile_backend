const { Client, Pool } = require('pg');
const Cursor = require('pg-cursor');

// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'test',
//     password: '123',
//     port: 5432,
// });


// client.connect(function (err){
//     if(err){
//         return console.log('not able to connect', err)
//     }
// });

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '123',
    port: 5432,
});


pool.on('error', (err, client) => {
    console.error('Error:', err);
});


const sql_text = 'SELECT * FROM public.testing_table';

values = [2]

test = async () => {
    try{

        const client = await pool.connect();

        const res = await client.query(sql_text);
        // console.log(res)
        for (let row of res.rows) {
            console.log(row);
        }
        
        client.release()


        // const row_count_res = await client.query('SELECT COUNT(*) FROM testing_table');
        // const no_rows = row_count_res.rows[0].count
        // console.log(row_count_res.rows[0].count)

    
        // const cursor = await client.query(new Cursor(sql_text));
        // cursor.read(no_rows, (err, rows) => {
        //     console.log(rows);
        //     cursor.read(100, (err, rows) => {
        //         if(rows.length == 0){
        //             console.log("ens of rows")
        //         }
        //       })
            
        // });

        //   cursor.close(() => {
        //     client.release()
        //   })

    } catch (err){
        console.log(err)
    }

};

test();