import Fastify from "fastify";
import { githubRepoService } from "./services";
import { getRepositoryReadme } from "./services/github/helpers";

const checkRandomRepo = async () => {
  const randomRepo = await githubRepoService.getRandomRepository();
  const repoName = randomRepo.full_name;
  const links = await githubRepoService.getLinksFromReadme(randomRepo);
  console.log("\n=== Links Found in README ===" + repoName);
  // TODO - add a check that those links are valid or not based on their response, in here weshould call the other backend
  console.log(links);

  // TODO: After that we checked which url is broken and which is not create somewhat this data structor:
  /**
   * [{urlDisplayNameInTheREADME : "name", fullUrl : "http:...", isBroken : boolean}]
   *
   *  **/
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
