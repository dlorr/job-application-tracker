import { Router } from "express";
import * as controller from "../controllers/jobApplication.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createJobSchema,
  updateJobSchema,
} from "../schemas/jobApplication.schema";

const router = Router();

router.post("/", validate(createJobSchema), controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", validate(updateJobSchema), controller.update);
router.delete("/:id", controller.remove);

export default router;
