import { UseCaseError } from "@/core/errors/contracts/use-case-error";

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super("Not allowed");
  }
}
