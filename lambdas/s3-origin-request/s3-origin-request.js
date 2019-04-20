const isS3OriginRequest = request => {
  return request && request.origin && request.origin.s3;
};

const getS3PathFromHeader = request => {
  return request.headers['s3-path'];
};

const rerouteRequest = reuqest => {
  console.log('Rerouting s3 request');
  const s3PathHeader = getS3PathFromHeader(reuqest);
  if (s3PathHeader) {
    const s3Folder = s3PathHeader[0].value;
    console.log('Folder: ', s3Folder);
    request.origin.s3.path = s3Folder;
  }
};

// used for our application routing logic
const rerouteApplicationRoutes = request => {
  if (request.uri) {
    const path = request.uri.split('.');
    // if not an asset file reroute to index.html
    if (!path[1]) {
      console.log('Rerouting application route to index.html');
      request.uri = '/index.html';
    }
  }
};

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  console.log('Request: ', request);
  if (isS3OriginRequest(request)) {
    rerouteRequest(request);
    rerouteApplicationRoutes(request);
  }
  callback(null, request);
};
