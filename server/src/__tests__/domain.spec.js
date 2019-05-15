const fastify = require('fastify');

describe('/api/domains', () => {
  let server;

  beforeEach(async () => {
    server = fastify({});

    server.register(require('../domain'), { prefix: '/api' });

    await server.ready();

    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close.bind(server);
  });

  describe('GET /api/domains', () => {
    it('should return a list of domains', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/domains',
      });

      expect(response.statusCode).toEqual(200);
      expect(response.headers['total-count']).toEqual(10);

      done();
    });

    it('should return a list of domains filtered by fqdn', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/domains?~fqdn=own',
      });

      expect(response.headers['total-count']).toEqual(1);
      expect(JSON.parse(response.payload)).toEqual([
        {
          fqdn: 'i-have-my-own.company',
          owner: 'Paul',
          nameservers: 'livedns',
          expiration_date: '2019-06-16',
        },
      ]);

      done();
    });

    it('should return a list of domains filtered by owner', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/domains?owner=David',
      });

      expect(response.headers['total-count']).toEqual(2);
      expect(JSON.parse(response.payload)).toEqual([
        {
          fqdn: 'i-need-more.email',
          owner: 'David',
          nameservers: 'classic',
          expiration_date: '2020-02-08',
        },
        {
          fqdn: 'its-my-domain-na.me',
          owner: 'David',
          nameservers: 'livedns',
          expiration_date: '2019-09-09',
        },
      ]);

      done();
    });

    it('should return a list of domains filtered by nameservers', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/domains?nameservers=classic',
      });

      expect(response.headers['total-count']).toEqual(6);
      expect(JSON.parse(response.payload)).toEqual([
        {
          fqdn: 'another-test.app',
          owner: 'Chris',
          nameservers: 'classic',
          expiration_date: '2019-04-22',
        },
        {
          fqdn: 'i-need-more.email',
          owner: 'David',
          nameservers: 'classic',
          expiration_date: '2020-02-08',
        },
        {
          fqdn: 'lost-in.space',
          owner: 'Georges',
          nameservers: 'classic',
          expiration_date: '2020-03-20',
        },
        {
          fqdn: 'my-new-domain-is-very.cool',
          owner: 'Kurt',
          nameservers: 'classic',
          expiration_date: '2019-11-07',
        },
        {
          fqdn: 'my-web.site',
          owner: 'Roger',
          nameservers: 'classic',
          expiration_date: '2019-08-30',
        },
        {
          fqdn: 'steve.jobs',
          owner: 'Serj',
          nameservers: 'classic',
          expiration_date: '2020-03-03',
        },
      ]);

      done();
    });

    it('should return a list of domains filtered by expiration date', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/domains?>expiration_date=2020-01-01',
      });

      expect(response.headers['total-count']).toEqual(5);
      expect(JSON.parse(response.payload)).toEqual([
        {
          fqdn: 'blah.fr',
          owner: 'Dave',
          nameservers: 'livedns',
          expiration_date: '2020-02-15',
        },
        {
          fqdn: 'i-need-more.email',
          owner: 'David',
          nameservers: 'classic',
          expiration_date: '2020-02-08',
        },
        {
          fqdn: 'lost-in.space',
          owner: 'Georges',
          nameservers: 'classic',
          expiration_date: '2020-03-20',
        },
        {
          fqdn: 'portfol.io',
          owner: 'Dexter',
          nameservers: 'livedns',
          expiration_date: '2020-01-26',
        },
        {
          fqdn: 'steve.jobs',
          owner: 'Serj',
          nameservers: 'classic',
          expiration_date: '2020-03-03',
        },
      ]);

      done();
    });

    it('should return a list of domains after multiple filters', async done => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/domains?nameservers=livedns&>expiration_date=2020-01-01',
      });

      expect(response.headers['total-count']).toEqual(2);
      expect(JSON.parse(response.payload)).toEqual([
        {
          fqdn: 'blah.fr',
          owner: 'Dave',
          nameservers: 'livedns',
          expiration_date: '2020-02-15',
        },
        {
          fqdn: 'portfol.io',
          owner: 'Dexter',
          nameservers: 'livedns',
          expiration_date: '2020-01-26',
        },
      ]);

      done();
    });
  });
});
