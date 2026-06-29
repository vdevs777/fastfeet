import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "../repositories/users-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";

import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { CPF } from "../../enterprise/entities/value-objects/cpf";

interface AuthenticateUserUseCaseRequest {
  cpf: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    let cpfVO: CPF;

    try {
      cpfVO = CPF.create(cpf);
    } catch {
      return left(new WrongCredentialsError());
    }

    const user = await this.usersRepository.findByCpf(cpfVO.value);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
