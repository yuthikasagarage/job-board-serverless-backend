export default function createResponse(statusCode, headers, data) {
  return {
    statusCode,
    headers,
    data: JSON.stringify(data)
  };
}
