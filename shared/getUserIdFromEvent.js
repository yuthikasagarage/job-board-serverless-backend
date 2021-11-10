export default function getUserIdFromEvent(event) {
  return event.requestContext.identity.cognitoAuthenticationProvider.split(
    ":CognitoSignIn:"
  )[1];
}
