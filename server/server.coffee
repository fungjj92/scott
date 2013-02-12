cluster = require 'cluster'
app = require './app'

# cluster(app).listen(3000)

# cluster(app)
# .use(cluster.stats())
# .use(cluster.pidfiles('pids'))
# .use(cluster.cli())
# .use(cluster.repl(8888))
# .listen(3000);
