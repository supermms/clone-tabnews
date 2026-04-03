import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersion = (await database.query("SHOW server_version;")).rows[0]
    .server_version;

  const maxConnectionsDB = Number(
    (await database.query("SHOW max_connections;")).rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_allowed_connections: maxConnectionsDB,
        current_opened_connections: databaseOpenedConnectionsValue,
        version: databaseVersion,
      },
    },
  });
}

export default status;
