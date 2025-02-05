import { Request, Response, NextFunction } from "express";
import { NoAuthorizedError } from "../errors/not-authorized-error";
import { currentUser } from "./current-user";

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!currentUser) {
        throw new NoAuthorizedError();
    }

    next();
};