import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  await fastify.listen({ port: 5000 });
  console.log('Server is running on port 5000');
};
start();
