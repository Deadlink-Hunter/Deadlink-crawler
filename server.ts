import Fastify from "fastify";
import { githubRepoService, githubUserService } from "@/services";
import { checkLinksInBatches } from "@/utils/linkCheck";

const checkRandomRepo = async () => {
  const randomRepo = await githubRepoService.getRandomRepository();
  const repoName = randomRepo.full_name;
  const links = await githubRepoService.getLinksFromReadme(randomRepo);
  console.log("\n=== Checking Random Repository: " + repoName + " ===");
  
  if (links.length === 0) {
    console.log("No links found in README.");
    return;
  }

  console.log(`Found ${links.length} links. Checking for dead links...`);
  const checkResults = await checkLinksInBatches(links);
  
  const deadLinks = checkResults.filter(r => r.isBroken);
  if (deadLinks.length > 0) {
    console.log(`❌ Found ${deadLinks.length} dead links:`);
    deadLinks.forEach(l => console.log(`  - ${l.fullUrl}`));
  } else {
    console.log("✅ No dead links found.");
  }
};

const checkUserRepos = async (username: string) => {
  console.log(`\n=== Checking all repositories for user: ${username} ===`);
  const results = await githubUserService.getAllLinksFromUserRepos(username);

  for (const repoResult of results) {
    const { repository, links } = repoResult;
    console.log(`\n--- Repository: ${repository} ---`);
    
    if (links.length === 0) {
      console.log("No links found in README.");
      continue;
    }

    console.log(`Found ${links.length} links. Checking for dead links...`);
    const checkResults = await checkLinksInBatches(links);
    
    const deadLinks = checkResults.filter(r => r.isBroken);
    if (deadLinks.length > 0) {
      console.log(`❌ Found ${deadLinks.length} dead links:`);
      deadLinks.forEach(l => console.log(`  - ${l.fullUrl}`));
    } else {
      console.log("✅ No dead links found.");
    }
  }
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
  checkUserRepos('Tamir198');
};

start();
