//========== neo4j ==================
const neo4j = require('neo4j-driver').v1;

const connection = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "wutangfam"));

const graphdb = connection.session();
console.log("Neo your Database is now connected to the Matrix");
module.exports = {
  graphdb: graphdb,
  connection: connection
};
