const { Client, Pool } = require('pg');
const Cursor = require('pg-cursor');
const DbConnection = require("./dbConnection")

get_all_users = async() => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'SELECT * FROM public.socialtable';
        const res = await client.query(sql_text);
        client.release()
        // console.log(res.rows)
        return res.rows
            
    } catch (err){
            client.release()
            console.log(err)
        }
}

get_users_by_page_num = async(pageNumber) => {
    try{
        const client = await DbConnection.get_db_connection()
        const pageSize = 10
        offset = (pageNumber - 1)*pageSize
        const sql_text = 'select * from public.socialtable order by id offset $1 rows fetch next $2 rows only';
        const res = await client.query(sql_text,[offset,pageSize]);
        client.release()
        // console.log(res.rows)
        return res.rows
            
    } catch (err){
            client.release()
            console.log(err)
        }
}

get_page_count = async(pageNumber) => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'select COUNT(*) from public.socialtable';
        const res = await client.query(sql_text);
        client.release()
        // console.log(res.rows[0].count)
        return res.rows[0].count
            
    } catch (err){
            client.release()
            console.log(err)
        }
}

get_all_friends = async(id) => {
        try{
            const client = await DbConnection.get_db_connection()

            const sql_text = `
                          SELECT * FROM relationship
                          WHERE (user_one_id = $1 OR user_two_id = $1)
                          AND status = 1`;
            const res = await client.query(sql_text,[id]);
            client.release()
            // console.log(res.rows)
            return res.rows
                
        } catch (err){
                client.release()
                console.log(err)
            }
    }

get_friends_id_only = async(user_id) => {
        try{
                id_array = []
            const client = await DbConnection.get_db_connection()
            const sql_text = `
            WITH test as 
            (select user_one_id from relationship where (user_one_id = $1 OR user_two_id = $1) AND status = 1
            union 
            select user_two_id from relationship where (user_one_id = $1 OR user_two_id = $1) AND status = 1)
            select * from test where user_one_id <> $1
                        `;
            const res = await client.query(sql_text,[user_id]);
            for (let item of res.rows) {
                id_array.push(item.user_one_id)
            }
            client.release()
            // console.log(res.rows)
            return id_array
                
        } catch (err){
                client.release()
                console.log(err)
            }
    }

get_friends_of_friends = async(id) => {
        try{
            foff_array = []
            const friends = await get_friends_id_only(id)
        //     console.log("friends",friends)
            const client = await DbConnection.get_db_connection()

            for (let item of friends) {
                //     temp_array = []
                const sql_text = `
                          SELECT * FROM relationship
                          WHERE (user_one_id = $1 OR user_two_id = $1)
                          AND status = 1`;
                const res = await client.query(sql_text,[item]);
                // temp_array.push(res.rows)
                // console.log(temp_array)
                foff_array = foff_array.concat(res.rows);
            }
            
            client.release()
            // console.log(res.rows)
        //     return res.rows
            return foff_array
                
        } catch (err){
                client.release()
                console.log(err)
            }
    }
module.exports = {
        get_all_users:get_all_users,
        get_all_friends:get_all_friends,
        get_friends_of_friends:get_friends_of_friends,
        get_users_by_page_num:get_users_by_page_num,
        get_page_count:get_page_count
}
