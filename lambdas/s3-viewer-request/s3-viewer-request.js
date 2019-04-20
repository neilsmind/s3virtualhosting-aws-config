const getHostnameForRequest = request => {
  const hostHeaders = request.headers.host;
  const host = hostHeaders.find(({ key }) => {
    return key === 'Host';
  });
  if (host) {
    return host.value;
  }
};

const getS3Folder = hostname => {
  return `/${hostname.split('.')[0]}`;
};

const addS3PathHeader = request => {
  const hostname = getHostnameForRequest(request);
  if (hostname) {
    request.headers['s3-path'] = [
      {
        key: 's3-path',
        value: getS3Folder(hostname)
      }
    ];
  }
};

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  console.log('Request: ', request);
  addS3PathHeader(request);
  callback(null, request);
};
