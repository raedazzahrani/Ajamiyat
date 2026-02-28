const credentials = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};


function checkAdmin(req, res, next) {
  const token = req.headers.authorization;

  console.log(token)
  if (!token) {
        res.set('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).json({error: 'Missing Authorization header'});
    }

    const [type, encoded] = token.split(' ');

    if (type !== 'Basic' || !encoded) {
        return res.status(401).json({error: 'Invalid Authorization header'});
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    if (username === credentials.username && password === credentials.password) {
        next(); // credentials valid, proceed
    } else {
        res.set('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).json({error: 'Invalid credentials'});
    }
}


module.exports = {checkAdmin}