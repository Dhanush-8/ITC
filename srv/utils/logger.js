const cds = require('@sap/cds');

const VALID_LEVELS = ['error', 'warn', 'info', 'debug', 'trace'];
const requested = (process.env.ITC_LOG_LEVEL || 'info').toLowerCase();
const configuredLevel = VALID_LEVELS.includes(requested) ? requested : 'info';

function getLogger(moduleName) {
  const base = cds.log(moduleName, { level: configuredLevel });

  // Adds the correlation ID to every log line
  const wrap = (lvl) => (msg, ctx) => {
    base[lvl](JSON.stringify({
      msg,
      module: moduleName,
      correlationId: cds.context?.id,
      ...(ctx ? { ctx } : {})
    }));
  };

  return {
    error: wrap('error'),
    warn: wrap('warn'),
    info: wrap('info'),
    debug: wrap('debug'),
    trace: wrap('trace')
  };
}

module.exports = { getLogger };