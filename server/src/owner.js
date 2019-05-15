const fakeDomains = require('./fixtures');

module.exports = (fastify, opts, next) => {
  /**
   * GET /api/owners
   **/
  const getOwnersOpts = {
    schema: {
      response: {
        200: {
          description: 'Result is an array of owners',
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  };

  const getOwnersHandler = async (request, reply) => {
    const owners = fakeDomains.map(domain => domain.owner);
    const result = [...new Set(owners)]; // renove duplicate owners

    await reply
      .code(200)
      .header('Content-Type', 'application/json')
      .header('Total-Count', result.length)
      .send(result);
  };

  fastify.get('/owners', getOwnersOpts, getOwnersHandler);

  next();
};
