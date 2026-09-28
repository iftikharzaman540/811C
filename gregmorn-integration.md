# Gregmorn Provider Integration

## 1. Environment Variables Required
To run the integration, ensure the following environment variables are set in your `.env` file (both locally and on the server):

```env
# Gregmorn API endpoints
GREGMORN_OFFICE_API=https://office-api-dev.helcenac.com
GREGMORN_CLIENT_API=https://client-api-dev.helcenac.com

# Gregmorn Merchant Credentials
GREGMORN_LOGIN=your_login_id
GREGMORN_PASSWORD=your_password
GREGMORN_USER_ID=your_merchant_user_id
GREGMORN_SECRET_KEY=your_hmac_secret_key

# Your Platform Frontend URL (used for exitUrl)
FRONTEND_URL=https://8111c.com/
```

## 2. Provider Authentication
Authentication is handled in `GregmornService.login()`.
- **Endpoint:** `POST /auth/login`
- **Format:** `application/x-www-form-urlencoded`
- **Management:** The `accessToken` is securely cached in memory on the backend. It automatically refreshes by keeping track of `tokenExpiry` before making any administrative calls like fetching games.
- **Security:** Credentials are NEVER exposed to the frontend.

## 3. Game Synchronization
- **Endpoint:** `GET /users/{user_id}/getUserGames/{currencyISO}`
- **Usage:** In `GregmornService.getGames()`.
- **Behavior:** The system uses the active `accessToken` to fetch the game list for a specific currency (default: PKR). The list is then filtered to only include games where `isEnabled === true`.
- **Frontend Mapping:** The frontend calls `/api/v1/games/gregmorn/list`, retrieves this filtered array, and maps it onto the existing Slot Game Grid UI, respecting the current layout.

## 4. Game Launch
- **Endpoint:** `POST /games/openGame`
- **Security:** Requires **NO** access token. It strictly uses `X-Signature`.
- **Signature Verification:** The backend generates an HMAC-SHA256 hash using your `GREGMORN_SECRET_KEY` over the **EXACT RAW JSON REQUEST BODY**.
- **Process:** The frontend passes the `gameId` to the backend. The backend maps the user's ID as `player_login` (ensuring unique identification), prepares the required payload (`currency`, `demo`, `exitUrl`, `gameId`, `language`, `player_login`, `user_id`), signs it, and receives a `game_url`. The frontend then redirects the user to this URL.

## 5. Callback Endpoints & Seamless Wallet
- **Callback URL:** `https://8111c.com/api/v1/webhooks/gregmorn` (handled by `GregmornWebhookController`).
- **Player Wallet:** Maintained entirely on our side. No separate "create player" API is used.

### Bet/Win/Rollback Behavior
- **`getBalance`**: Returns the player's current wallet balance.
- **`writeBet`**: 
  - Handles bets (`bet > 0, win = 0`), wins (`bet = 0, win > 0`), and combined events (`bet > 0, win > 0`).
  - Calculates `netAmount = win - bet`.
  - **Error Handling:** If funds are insufficient, returns HTTP 400 with `status: "fail"` to prevent double-charging (as per Gregmorn's strict requirements).
- **`rollback`**: 
  - Automatically calculates the refund amount (`bet - win`).
  - Processes a `REFUND` type transaction to the user's wallet.
  - If the original transaction cannot be processed (e.g., already refunded), it logs a warning but STILL returns HTTP 200 `status: "success"` as strictly required by the provider.

### Signature Verification
- Implemented in `verifySignature(req, signature)`.
- Next.js / Express is configured to expose the `rawBody`.
- The webhook controller hashes the EXACT raw incoming bytes using `HMAC-SHA256` and compares it to the incoming `X-Signature` header. Invalid signatures result in an immediate HTTP 400 rejection.

## 6. Transaction Safety (Idempotency)
- All transactions are logged in the `WalletTransaction` table with a unique `reference_id` (mapping to the provider's `transactionId`).
- Before processing `writeBet` or `rollback`, the controller checks if `reference_id` already exists.
- If it exists, the system bypasses processing and immediately responds with HTTP 200 (idempotent success) returning the current balance. This absolutely prevents duplicate callbacks from charging or crediting the player more than once.

## 7. Local Testing Steps
1. Ensure your `.env` contains valid testing credentials.
2. Use the provider's test casino for manual verifications if necessary: [https://testozino.gambleaggregator.dev/login](https://testozino.gambleaggregator.dev/login)
3. You can monitor logs by running `pm2 logs gaming-backend` on the server to see real-time webhook hits and signature validations.
4. No real money transactions should be used during testing; ensure the `currency` is properly mocked or use Demo mode (`demo: "1"`) if configured.
