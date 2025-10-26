import Keycloak from 'keycloak-js';

let keycloakInstance = null;

export const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (!keycloakUrl || !realm || !clientId) {
      console.warn('Keycloak environment variables are not configured');
      return null;
    }

    keycloakInstance = new Keycloak({
      url: keycloakUrl,
      realm: realm,
      clientId: clientId,
    });
  }

  return keycloakInstance;
};

export const initKeycloak = async (onAuthenticatedCallback) => {
  const keycloak = getKeycloakInstance();

  if (!keycloak) {
    console.warn('Keycloak not initialized due to missing configuration');
    return false;
  }

  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      enableLogging: true,
    });

    if (authenticated && onAuthenticatedCallback) {
      onAuthenticatedCallback(keycloak);
    }

    return authenticated;
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error);
    return false;
  }
};

export const loginWithKeycloak = () => {
  const keycloak = getKeycloakInstance();

  if (!keycloak) {
    console.error('Keycloak not initialized');
    return;
  }

  keycloak.login({
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/keycloak-callback` : undefined,
  });
};

export const logoutKeycloak = () => {
  const keycloak = getKeycloakInstance();

  if (!keycloak) {
    console.error('Keycloak not initialized');
    return;
  }

  keycloak.logout({
    redirectUri: typeof window !== 'undefined' ? window.location.origin : undefined,
  });
};

export const getKeycloakToken = () => {
  const keycloak = getKeycloakInstance();
  return keycloak?.token || null;
};

export const refreshKeycloakToken = async (minValidity = 5) => {
  const keycloak = getKeycloakInstance();

  if (!keycloak) {
    return false;
  }

  try {
    const refreshed = await keycloak.updateToken(minValidity);
    return refreshed;
  } catch (error) {
    console.error('Failed to refresh Keycloak token:', error);
    return false;
  }
};

export const getKeycloakUserInfo = () => {
  const keycloak = getKeycloakInstance();

  if (!keycloak || !keycloak.authenticated) {
    return null;
  }

  return {
    id: keycloak.tokenParsed?.sub,
    email: keycloak.tokenParsed?.email,
    name: keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username,
    roles: keycloak.tokenParsed?.realm_access?.roles || [],
  };
};

export const isKeycloakConfigured = () => {
  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

  return !!(
    keycloakUrl &&
    realm &&
    clientId &&
    keycloakUrl !== 'your-keycloak-server-url' &&
    realm !== 'your-realm' &&
    clientId !== 'your-client-id'
  );
};
