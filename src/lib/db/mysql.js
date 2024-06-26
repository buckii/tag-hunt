import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "$env/static/private";

import mysql from "mysql2/promise";

export function mysqlconnFn() {
  //always create a new connection to avoid closed connections
  let mysqlconn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 10,
  });

  return mysqlconn;
}

async function lookupHunt(hunt_name) {
  let mysqlconn = await mysqlconnFn();
  let hunt;

  try {
    await mysqlconn
      .query("SELECT * FROM hunts where short_name='" + hunt_name + "' OR domain='" + hunt_name + "';")
      .then(function ([rows, fields]) {
        if(rows && rows.length) {
          hunt = rows[0];
        }
      });

    mysqlconn.end();

    return hunt;
  } catch (error) {
    console.error("Got an error looking up the hunt!!!");
    console.log(error);
    return null;
  }

}

export async function storeInDB(data) {
  let mysqlconn = await mysqlconnFn();
  let results = {};
  let user_id;
  
  data.opt_out = data.opt_out ? 1 : 0;

  let hunt = await lookupHunt(data.hunt);

  try {
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      return 'Invalid email';
    }

    await mysqlconn
      .query("SELECT id FROM users where email='" + data.email + "'"
        + " and hunt_id = " + hunt.id + ";")
      .then(function ([rows, fields]) {
        if(rows && rows.length) {
          user_id = rows[0].id;
        }
      });

    if(!user_id) {
      await mysqlconn
        .query("INSERT INTO users(hunt_id,email,created_at) "
          + "VALUES(" + hunt.id + ",'" + data.email + "',now());")
        .then(function ([rows, fields]) {
          user_id = rows.insertId;
          results.newuser = true;
        });
    }

    if(!user_id) {
      mysqlconn.end();
      return 'Insert failed';
    }

    await mysqlconn
      .query("UPDATE users SET "
        + "name='" + data.name + "'"
        + ",organization='" + data.organization + "'"
        + ",updated_at=now() WHERE id='" + user_id + "';"
      )
      .then(function ([rows, fields]) {
      });

    //upsert tags_tapped in user_tags
    let user_tag_id = null;
    await mysqlconn
      .query("SELECT id FROM user_tags where user_id='" + user_id + "' AND tag_id='" + data.tag_number + "';")
      .then(function ([rows, fields]) {
        if(rows && rows.length) {
          user_tag_id = rows[0].id;
        }
      });

    if(!user_tag_id) {
      await mysqlconn
        .query("INSERT INTO user_tags(user_id,tag_id,opt_out,created_at) VALUES('"
          + user_id + "','" + data.tag_number + "','" + data.opt_out + "',now());")
        .then(function ([rows, fields]) {
          user_tag_id = rows.insertId;
        });
    } else {
      await mysqlconn
        .query("UPDATE user_tags SET opt_out='" + data.opt_out + "',updated_at=now() WHERE id=" + user_tag_id + ";")
        .then(function ([rows, fields]) {
          //id = rows.rows[0].id;
        });

    }

    mysqlconn.end();

    return {
      data: results,
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}

export async function getAllUsers(hunt_name) {
  let mysqlconn = await mysqlconnFn();
  let results;

  let hunt = await lookupHunt(hunt_name);

  try {
    await mysqlconn
      .query("SELECT * FROM users WHERE hunt_id=" + hunt.id + " ORDER BY id DESC;")
      .then(function ([rows, fields]) {
        results = rows;
      })
      .then( () => mysqlconn.end());

  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  return results;
}

export async function getTags(hunt_name) {
  let mysqlconn = await mysqlconnFn();
  let tags = [];

  let hunt = await lookupHunt(hunt_name);

  try {
    await mysqlconn
      .query("SELECT * "
       + "FROM tags "
       + "WHERE hunt_id=" + hunt.id + " "
       + "ORDER BY id;")
      .then(function ([rows, fields]) {
        tags = rows;
      });
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  mysqlconn.end();
  return {
    tags,
  };
}

export async function getTag(tag_number) {
  let mysqlconn = await mysqlconnFn();
  let tag;
  let total_tags_count;

  tag_number = parseInt(tag_number);

  try {
    await mysqlconn
      .query("SELECT * "
       + "FROM tags "
       + "WHERE id=" + tag_number + " AND is_active=1;")
      .then(function ([rows, fields]) {
        if(rows.length) {
          tag = rows[0];
        } else {
          tag = null;
        }
      });
    await mysqlconn
      .query("SELECT count(*) as tag_count "
       + "FROM tags "
       + "WHERE is_active=1;")
      .then(function ([rows, fields]) {
        if(rows.length) {
          total_tags_count = rows[0].tag_count;
        } else {
          total_tags_count = null;
        }
      });
    await mysqlconn
      .query("SELECT tf.*,q.question_text,q.order AS qorder "
       + "FROM tag_facts tf JOIN questions q ON tf.question_id = q.id "
       + "WHERE tf.tag_id=" + tag_number + ";")
      .then(function ([rows, fields]) {
        tag.facts = rows;
      });
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  mysqlconn.end();
  return {
    tag,
    total_tags_count,
  };
}

export async function getLeaderboard(hunt_name) {
  let mysqlconn = await mysqlconnFn();
  let latest;
  let organizations;
  let leaders;
  let tags = '';

  let hunt = await lookupHunt(hunt_name);

  try {
    await mysqlconn
      .query("SELECT organization,count(*) as user_count "
       + "FROM users "
       //+ "WHERE LENGTH(organization)>0 AND organization != 'Buckeye Innovation'"
       + "WHERE hunt_id=" + hunt.id + " "
       + "GROUP BY organization ORDER BY count(*) DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        organizations = rows;
      });
    await mysqlconn
      .query("SELECT name, count(*) AS user_tag_count "
       + "FROM tags JOIN user_tags ON tags.id = user_tags.tag_id "
       //+ "WHERE name != 'Buckeye Innovation'"
       + "WHERE hunt_id=" + hunt.id + " "
       + "GROUP BY tags.id ORDER BY count(*) DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        tags = rows;
      });
    await mysqlconn
      .query("SELECT name, organization, count(*) as tag_count, users.created_at "
        + "FROM users JOIN user_tags ON users.id = user_tags.user_id "
        + "WHERE name not like '%test%' AND email NOT LIKE '%test%' and organization != 'Buckeye Innovation' "
        + "AND hunt_id=" + hunt.id + " "
        + "GROUP BY name,organization "
        + "ORDER BY users.id DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        latest = rows;
      });
    await mysqlconn
      .query("SELECT name,organization,count(*) as tag_count "
        + "FROM users JOIN user_tags ON users.id = user_tags.user_id "
        + "WHERE name not like '%test%' AND email NOT LIKE '%test%' and organization != 'Buckeye Innovation' "
        + "AND hunt_id=" + hunt.id + " "
        + "GROUP BY name,organization "
        + "ORDER BY count(*) DESC,users.id DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        leaders = rows;
      });
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  mysqlconn.end();
  return {
    latest,
    leaders,
    organizations,
    tags,
  };
}