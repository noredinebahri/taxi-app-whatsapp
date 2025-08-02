# WhatsApp Session Persistence

This application now supports automatic WhatsApp session persistence, ensuring that your WhatsApp connections remain active even after server restarts.

## How It Works

### Automatic Session Restoration
- When the server starts, it automatically scans for stored session data in the `.wwebjs_auth` directory
- All previously authenticated WhatsApp sessions are automatically restored
- Sessions are restored in parallel for faster startup times
- Each session uses `LocalAuth` with a unique `clientId` for proper isolation

### Session Storage
- Sessions are stored in `.wwebjs_auth/session-{senderId}/` directories
- Each session contains authentication data, cookies, and browser state
- Sessions persist across server restarts automatically

## Configuration

### Environment Variables
```env
# Enable/disable automatic session restoration (default: true)
AUTO_RESTORE_SESSIONS=true
```

### Disable Auto-Restoration
To disable automatic session restoration on startup:
```env
AUTO_RESTORE_SESSIONS=false
```

## API Endpoints

### Manual Session Restoration
```http
POST /api/whatsapp/sessions/restore
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

Response:
```json
{
  "message": "Session restoration initiated successfully",
  "note": "Sessions are being restored in the background. Check individual session statuses for progress."
}
```

### Check Session Status
```http
GET /api/whatsapp/session/{senderId}/status
```

### Check All Sessions Status
```http
GET /api/whatsapp/sessions/status
```

## Benefits

1. **No Re-authentication Required**: Users don't need to scan QR codes again after server restarts
2. **Faster Startup**: Sessions restore automatically without manual intervention
3. **Production Ready**: Handles multiple sessions efficiently
4. **Configurable**: Can be enabled/disabled via environment variables
5. **Error Handling**: Failed session restorations don't affect other sessions

## Logs

The application provides detailed logging for session management:

```
🔄 Found 2 stored session(s), restoring...
🔄 Restoring session for user123 from storage...
🔄 Restoring session for admin from storage...
✅ WhatsApp session user123 restored and ready!
✅ WhatsApp session admin restored and ready!
```

## Important Notes

- Sessions are stored locally in the `.wwebjs_auth` directory
- Make sure to backup this directory if you need to preserve sessions
- Sessions may expire if not used for extended periods (WhatsApp's policy)
- The application runs in test mode when `NODE_ENV=test` or `WHATSAPP_TEST_MODE=true`