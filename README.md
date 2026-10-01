# URL Shortener

A simple URL shortener built for study and experimentation with **NestJS, MongoDB, and Redis**.

## Tech Stack

- NestJS
- MongoDB
- Redis
- TypeScript

## Routes

| Method | Route      | Description                                                                    |
| ------ | ---------- | ------------------------------------------------------------------------------ |
| `POST` | `/shorten` | Creates a short URL. Body: `{ "url": "https://..." }`                          |
| `GET`  | `/:code`   | Redirects (302) to the original URL                                            |
| `GET`  | `/:code`   | When the code doesn't exist: 404 page for browsers, JSON error for API clients |

> **Note:** the 404 page ([`not-found.html`](src/shorten/views/not-found.html)) was made with AI.

## Security Checklist

- [x] CORS configuration
- [x] Rate limiting
- [x] DTO input validation
- [x] URL validation (HTTP/HTTPS only)
- [ ] Request payload size limits
- [ ] Security headers
- [x] Random short code generation
- [x] Unique MongoDB index for short codes
- [ ] Redis cache with TTL
- [ ] Application logging

## Core Features

- [x] Create shortened URLs
- [x] Redirect using short codes
- [ ] Redis caching
- [x] MongoDB persistence
- [ ] Basic click tracking
