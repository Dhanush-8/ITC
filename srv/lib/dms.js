const xsenv = require('@sap/xsenv');
const { Readable } = require('stream');

const { sdm } = xsenv.getServices({ sdm: { label: 'sdm' } });   // from VCAP_SERVICES
const REPOSITORY_ID = process.env.DMS_REPOSITORY_ID;
const BASE = sdm.endpoints.ecmservice.url;

let token, expiresAt = 0;
async function getToken() {
  if (token && Date.now() < expiresAt - 30_000) return token;      // cached
  const res = await fetch(`${sdm.uaa.url}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${sdm.uaa.clientid}:${sdm.uaa.clientsecret}`).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) throw new Error(`DMS token request failed: ${res.status}`);
  const json = await res.json();
  token = json.access_token;
  expiresAt = Date.now() + json.expires_in * 1000;
  return token;
}

// returns { stream, contentType, contentLength }
async function getContent(objectId) {
  const url = `${BASE}/browser/${REPOSITORY_ID}/root?objectId=${encodeURIComponent(objectId)}&cmisselector=content`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken()}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`DMS content request failed: ${res.status}`);
  return {
    stream: Readable.fromWeb(res.body),            // stream, don't buffer the whole file
    contentType: res.headers.get('content-type') || 'application/pdf',
    contentLength: res.headers.get('content-length')
  };
}

module.exports = { getContent };