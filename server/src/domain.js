const fakeDomains = require('./fixtures');

module.exports = (fastify, opts, next) => {
  /**
   * GET /api/domains
   **/
  const getDomainsOpts = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          '~fqdn': { type: 'string' },
          owner: { type: 'string' },
          nameservers: { type: 'string', enum: ['classic', 'livedns'] },
          '>expiration_date': { type: 'string', format: 'date' },
        },
        additionalProperties: false,
      },
      response: {
        200: {
          description: 'Result is an array of domain names',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fqdn: { type: 'string', format: 'idn-hostname' },
              owner: { type: 'string' },
              nameservers: { type: 'string', enum: ['classic', 'livedns'] },
              expiration_date: { type: 'string', format: 'date' },
            },
            required: ['fqdn', 'owner', 'nameservers', 'expiration_date'],
            additionalProperties: false,
          },
        },
      },
    },
  };

  const getDomainsHandler = async (request, reply) => {
    const filters = {
      '~fqdn': domain => domain.fqdn.indexOf(request.query['~fqdn']) > -1,
      owner: domain => domain.owner === request.query.owner,
      nameservers: domain =>
        (Array.isArray(request.query.nameservers)
          ? request.query.nameservers
          : [request.query.nameservers]
        ).indexOf(domain.nameservers) > -1,
      '>expiration_date': domain =>
        new Date(domain.expiration_date) >
        new Date(request.query['>expiration_date']),
    };

    let result = fakeDomains;

    Object.keys(filters).forEach(filter => {
      if (request.query[filter]) {
        result = result.filter(filters[filter]);
      }
    });

    await reply
      .code(200)
      .header('Content-Type', 'application/json')
      .header('Total-Count', result.length)
      .send(result);
  };

  fastify.get('/domains', getDomainsOpts, getDomainsHandler);

  next();
};
