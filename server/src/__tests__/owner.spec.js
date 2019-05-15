const fastify = require('fastify');

describe('/api/owners', () => {
  let server;

  beforeEach(async () => {
    server = fastify({});

    server.register(require('../owner'), { prefix: '/api' });

    await server.ready();

    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close.bind(server);
  });

  describe('GET /api/owners', () => {
    it('should return a list of owners', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/owners',
      });

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.payload)).toEqual([
        'Chris',
        'Dave',
        'Paul',
        'David',
        'Georges',
        'Kurt',
        'Roger',
        'Dexter',
        'Serj',
      ]);

      done();
    });
  });
});
