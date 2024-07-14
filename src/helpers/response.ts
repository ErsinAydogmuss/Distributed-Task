import { Response } from "express";

export function ok(res: Response, data = {}) {
  return json(res, data);
}

export function json(res: Response, data = {}) {
  return res.status(200).json(data);
}

export function badRequest(res: Response, msg = "400 Bad Request") {
  return res.status(400).end(msg);
}

export function unauthorized(res: Response, msg = "401 Unauthorized") {
  return res.status(401).end(msg);
}

export function forbidden(res: Response, msg = "403 Forbidden") {
  return res.status(403).end(msg);
}

export function notFound(res: Response, msg = "404 Not Found") {
  return res.status(404).end(msg);
}

export function methodNotAllowed(
  res: Response,
  msg = "405 Method Not Allowed"
) {
  res.status(405).end(msg);
}

export function serverError(res: Response, msg = "500 Internal Server Error") {
  res.status(500).end(msg);
}
