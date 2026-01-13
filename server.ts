import Fastify from "fastify";
import { githubRepoService } from "./services";
import { getRepositoryReadme } from "./services/github/helpers";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  await fastify.listen({ port: 5000 });

  const randomRepo = await githubRepoService.getRandomRepository();
  console.log("Random Repository:", randomRepo);

  // Get README content and print it
  const readmeContent = await getRepositoryReadme(randomRepo.full_name);
  console.log("\n=== README Content ===");
  console.log(readmeContent);

  // Get links from README
  const links = await githubRepoService.getLinksFromReadme(randomRepo);
  console.log("\n=== Links Found in README ===");
  // TODO - add a check that those links are valid or not based on their response, in here weshould call the other backend

  console.log(links);

  console.log("\nServer is running on port 5000");
};

start();
