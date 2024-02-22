import { Request } from "express";

export type RequestWithFailsPhoto = Request & {failsPhoto: any | object}