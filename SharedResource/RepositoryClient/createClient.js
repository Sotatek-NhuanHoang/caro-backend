const Seneca = require('seneca');
const Promise = require('bluebird');


module.exports = (repositoryName) => {
    const client = Seneca()
        .quiet()
        .use('seneca-amqp-transport')
        .client({
            type: 'amqp',
            pin: `repo:${repositoryName},service:*`,
            hostname: process.env.AMQP_HOSTNAME,
            port: process.env.AMQP_PORT,
            vhost: process.env.AMQP_VHOST,
            username: process.env.AMQP_USERNAME,
            password: process.env.AMQP_PASSWORD,
        });
    
    client.call = (serviceName, data = {}) => new Promise((resolve, reject) => {
        client.act(`repo:${repositoryName},service:${serviceName}`, data, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });

    return client;
};
