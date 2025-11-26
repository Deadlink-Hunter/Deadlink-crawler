import Fastify from 'fastify';
import { githubRepoService } from './services';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  await fastify.listen({ port: 5000 });

  const randomRepo = await githubRepoService.getRandomRepository();
  console.log(randomRepo);
  console.log('Server is running on port 5000');
};

start();
