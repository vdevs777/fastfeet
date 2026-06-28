import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

import { UserRole } from "../../enterprise/entities/user";

import { UsersRepository } from "../repositories/users-repository";
import { HashGenerator } from "../cryptography/hash-generator";

interface ChangeUserPasswordUseCaseRequest {
  adminId: string;
  userId: string;
  newPassword: string;
}

type ChangeUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    userId,
    newPassword,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const admin = await this.usersRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError());
    }

    if (admin.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    user.changePassword(await this.hashGenerator.hash(newPassword));

    await this.usersRepository.save(user);

    return right(null);
  }
}
