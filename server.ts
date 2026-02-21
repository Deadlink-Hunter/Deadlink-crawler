import Fastify from "fastify";
import { githubRepoService } from "@/services";
import { checkLinksInBatches } from "@/utils/linkCheck";

const checkRandomRepo = async () => {
  const randomRepo = await githubRepoService.getRandomRepository();
  const repoName = randomRepo.full_name;
  const links = await githubRepoService.getLinksFromReadme(randomRepo);
  console.log("\n=== Links Found in README ===" + repoName);
  console.log(
    links.map((l) => `${l.displayName}: ${l.url}`)
  );

  if (links.length === 0) {
    console.log("No links to check.");
    return;
  }

  const allResults = await checkLinksInBatches(links);

  console.log("\n=== Link Check Results ===");
  console.log(JSON.stringify(allResults, null, 2));
};

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  await fastify.listen({ port: 5000 });
  console.log("\nServer is running on port 5000");

  checkRandomRepo();
};

start();
