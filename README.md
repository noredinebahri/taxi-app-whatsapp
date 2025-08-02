# whatsappTransferVVIP

whatsappTransferVVIP is a Node.js microservice that facilitates sending WhatsApp messages via WhatsApp Web. This service acts as an external microservice to be integrated with another API (apibackendtransfer) for delegating the task of sending messages.

## Features

- Connects to WhatsApp Web using the `whatsapp-web.js` library.
- Supports sending messages with customizable templates.
- Manages multiple WhatsApp sessions based on `senderId`.
- In-memory storage for templates and session data.
- Simple security mechanism using API key authentication.

## Project Structure

```
whatsappTransferVVIP
├── src
│   ├── app.js                  # Entry point of the application
│   ├── controllers             # Contains controllers for handling requests
│   │   ├── whatsappController.js
│   │   └── templateController.js
│   ├── middleware              # Middleware for authentication
│   │   └── auth.js
│   ├── services                # Business logic for WhatsApp and templates
│   │   ├── whatsappService.js
│   │   └── templateService.js
│   ├── routes                  # API route definitions
│   │   ├── whatsapp.js
│   │   └── template.js
│   └── utils                   # Utility functions
│       └── logger.js
├── package.json                # NPM package configuration
├── .env.example                # Example environment variables
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd whatsappTransferVVIP
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and set your `API_SECRET_KEY`.

## Usage

To start the server, run:
```
npm start
```

The service will be available at `http://localhost:3000`.

## API Endpoints

### Send WhatsApp Message

- **POST** `/api/whatsapp/send`
  
  Request Body:
  ```json
  {
    "senderId": "instance1",
    "recipients": ["+212600000000", "+212611111111"],
    "template": "Bonjour {{name}}, votre rendez-vous est prévu le {{date}}.",
    "params": [
      { "name": "Ali", "date": "2025-08-10" },
      { "name": "Sara", "date": "2025-08-11" }
    ]
  }
  ```

### Add Custom Template (Optional)

- **POST** `/api/template/add`
  
  Request Body:
  ```json
  {
    "templateName": "template1",
    "template": "Your custom template here."
  }
  ```

## Security

This service uses API key authentication. Ensure that the `x-api-key` header is included in your requests to secure the communication between `apibackendtransfer` and `whatsappTransferVVIP`.

## Logging

The service logs successful message sends and errors to the console for monitoring purposes.

## License

This project is licensed under the MIT License.