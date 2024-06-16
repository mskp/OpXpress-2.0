import app from "./app";
import { PORT } from "./config/consts";
import logger from "./config/logger";

// Start the server and listen on the specified port
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
