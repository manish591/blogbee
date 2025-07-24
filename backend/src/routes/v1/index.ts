import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    message: "success",
    status: "ok",
    docs: "",
    version: "v1",
    timestamp: new Date().toISOString()
  });
})

export default Router;