import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplifyStorage",
  access: (allow) => ({
    'models/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'motions/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'stages/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
  }),
});
