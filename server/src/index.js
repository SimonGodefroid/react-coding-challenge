const PORT = 3000;

const isProduction = process.env.NODE_ENV === 'production';

const fastifyOptions = {
  logger: {
    level: isProduction ? 'error' : 'info',
    prettyPrint: true,
  },
  bodyLimit: 5 * 1048576,
};

const fastify = require('fastify')(fastifyOptions);

async function run() {
  fastify.register(require('fastify-no-icon'));

  if (!isProduction) {
    fastify.register(require('fastify-blipp'));
  }

  fastify.register(require('./domain'), { prefix: '/api' });
  fastify.register(require('./owner'), { prefix: '/api' });

  await fastify.listen(PORT);

  if (!isProduction) {
    fastify.blipp();
  }
}

try {
  run();
} catch (err) {
  fastify.server.close();
  fastify.log.error(err);
}
