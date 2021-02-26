const { Client, Pool } = require('pg');
const Cursor = require('pg-cursor');
const DbConnection = require("./dbConnection")

get_friends_id_only = async(user_id, client) => {
    try{
           const id_array = []
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
        return id_array
            
    } catch (err){
            console.log(err)
        }
}

get_all_users = async() => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'SELECT * FROM public.socialtable';
        const res = await client.query(sql_text);
        client.release()
        return res.rows
            
    } catch (err){
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
        return res.rows
            
    } catch (err){
            console.log(err)
        }
}

get_page_count = async(pageNumber) => {
    try{
        const client = await DbConnection.get_db_connection()
        const sql_text = 'select COUNT(*) from public.socialtable';
        const res = await client.query(sql_text);
        client.release()
        return res.rows[0].count
            
    } catch (err){
            console.log(err)
        }
}

get_all_friends = async(id) => {
        try{
            const client = await DbConnection.get_db_connection()

            const friends = await get_friends_id_only(id, client)
            if(friends.length==0){
                client.release()
                return []

            }
            else
            {
                const sql_text = 'SELECT * FROM  socialtable where id in ('+friends+')';
                const res = await client.query(sql_text );
                client.release()
                return res.rows                 
            }
                
        } catch (err){
                console.log("error from final catch",err)
            }
    }



get_friends_of_friends = async(id) => {
        try{
            foff_array = []
            const client = await DbConnection.get_db_connection()
            const friends = await get_friends_id_only(id, client)

            if(friends.length==0){
                client.release()
                return []
            }
            else{

                for (let item of friends) {
                    const foff = await get_friends_id_only(item, client)
                    foff_array = foff_array.concat(foff);
                }
                
                const sql_text = 'SELECT * FROM  socialtable where id in ('+foff_array+')';   
                const res = await client.query(sql_text );
                client.release()
                return res.rows
            }
            
                
        } catch (err){
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
