import app from "./app.js";
import { PORT } from "./config/consts";
import logger from "./config/logger.js";

// Start the server and listen on the specified port
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
