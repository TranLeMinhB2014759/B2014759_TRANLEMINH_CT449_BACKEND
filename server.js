const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");



async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("connect to database!");
        const port = config.app.port;
        app.listen(port, () => {
            console.log(`Sever is running on port ${port}.`);
        });

    } catch (error) {
        console.log("Cannot connect to database!", error);
        process.exit();
    }
}

startServer();