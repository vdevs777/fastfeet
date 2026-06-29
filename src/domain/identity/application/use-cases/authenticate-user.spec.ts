import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeUser } from "test/factories/make-user";
import { makeInvalidCpf, makeValidCpf } from "test/factories/make-cpf";

import { AuthenticateUserUseCase } from "./authenticate-user";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      encrypter,
    );
  });

  it("should be able to authenticate a user", async () => {
    const cpf = makeValidCpf();

    const user = makeUser({
      cpf: CPF.create(cpf),
      password: await fakeHasher.hash("123456"),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      cpf,
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not authenticate with an invalid cpf", async () => {
    const result = await sut.execute({
      cpf: makeInvalidCpf(),
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not authenticate with a cpf that does not exist", async () => {
    const result = await sut.execute({
      cpf: makeValidCpf(),
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not authenticate with a wrong password", async () => {
    const cpf = makeValidCpf();

    const user = makeUser({
      cpf: CPF.create(cpf),
      password: await fakeHasher.hash("123456"),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      cpf,
      password: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
