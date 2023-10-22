import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
    // res.render("index", { title: "Express" });
    res.json({
        status: 200,
        message: "hello world",
    }).status(200);
};
