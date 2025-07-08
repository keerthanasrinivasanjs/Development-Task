const sql = require("mssql/msnodesqlv8");

const config = {
    server: "DESKTOP-0GIN3MJ",
    database: "UserDB",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};

module.exports = {
    connect: () => sql.connect(config),
    sql
};



