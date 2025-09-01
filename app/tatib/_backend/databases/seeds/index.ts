import { sutando } from "sutando";
import config from "../../../../../sutando.config";
import userSeed from "./users_seed";

async function main() {
  sutando.addConnection(config);

  await userSeed();
  console.info(`Seeding finished!`)

  await sutando.destroyAll();
}

main();