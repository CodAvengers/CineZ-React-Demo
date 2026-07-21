import { superEmbedProvider } from "./superembed";
import { vidlinkProvider } from "./vidlink";
import { twoEmbedProvider } from "./twoembed";
import { PLAYBACK_DEFAULT_PROVIDER } from "../config";

/**
 * Register new playback providers here.
 * Each provider must implement:
 *   { id, name, label, isConfigured(), movieEmbedUrl(), tvEmbedUrl() }
 */
const PROVIDER_DEFINITIONS = [
  superEmbedProvider,
  vidlinkProvider,
  twoEmbedProvider,
];

export const PLAYBACK_PROVIDERS = PROVIDER_DEFINITIONS.filter((provider) =>
  provider.isConfigured()
);

export function getProvider(providerId) {
  if (!PLAYBACK_PROVIDERS.length) return null;

  return (
    PLAYBACK_PROVIDERS.find((provider) => provider.id === providerId) ||
    PLAYBACK_PROVIDERS[0]
  );
}

export function getDefaultProviderId() {
  if (!PLAYBACK_PROVIDERS.length) return null;

  if (
    PLAYBACK_DEFAULT_PROVIDER &&
    PLAYBACK_PROVIDERS.some((provider) => provider.id === PLAYBACK_DEFAULT_PROVIDER)
  ) {
    return PLAYBACK_DEFAULT_PROVIDER;
  }

  return PLAYBACK_PROVIDERS[0].id;
}

export function listPlaybackProviders() {
  return PLAYBACK_PROVIDERS.map(({ id, name, label }) => ({ id, name, label }));
}
