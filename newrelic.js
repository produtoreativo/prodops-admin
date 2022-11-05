'use strict';
/**
* New Relic agent configuration.
*
* See lib/config/default.js in the agent distribution for a more complete
* description of configuration variables and their potential values.
*/
exports.config = {
  /**
  * Array of application names.
  */
  app_name: ['prodops'],
  /**
  * Your New Relic license key.
  */
 // 8aa69d24d13d73935e4a5ba2519bc248FFFFNRAL
  license_key: 'ebd28325141a2db1bc1fbf558f57190846f8NRAL',
  logging: {
    /**
    * Level at which to log. 'trace' is most useful to New Relic when diagnosing
    * issues with the agent, 'info' and higher will impose the least overhead on
    * production applications.
    */
    level: 'info'
  },
  /**
  * When true, all request headers except for those listed in attributes.exclude
  * will be captured for all traces, unless otherwise specified in a destination's
  * attributes include/exclude lists.
  */
  allow_all_headers: true,
  attributes: {
    /**
    * Prefix of attributes to exclude from all destinations. Allows * as wildcard
    * at end.
    *
    * NOTE: If excluding headers, they must be in camelCase form to be filtered.
    *
    * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
    */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
}

//curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash && sudo NEW_RELIC_API_KEY=NRAK-7LMGJF90D89ZZ5Y0VW2VVMM8DX2 NEW_RELIC_ACCOUNT_ID=3686419 /usr/local/bin/newrelic install -n logs-integration