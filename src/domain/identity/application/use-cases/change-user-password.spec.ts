import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";

import { ChangeUserPasswordUseCase } from "./change-user-password";

import { UserRole } from "../../enterprise/entities/user";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: ChangeUserPasswordUseCase;

describe("Change User Password", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new ChangeUserPasswordUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to change a user's password", async () => {
    const admin = makeUser({
      role: UserRole.ADMIN,
    });

    const user = makeUser({
      password: await fakeHasher.hash("123456"),
    });

    inMemoryUsersRepository.items.push(admin);
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      userId: user.id.toString(),
      newPassword: "654321",
    });

    expect(result.isRight()).toBe(true);
    expect(user.password).toBe("654321-hashed");
  });

  it("should not change the password if the admin does not exist", async () => {
    const user = makeUser();

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      adminId: "non-existing-id",
      userId: user.id.toString(),
      newPassword: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not change the password if the user does not exist", async () => {
    const admin = makeUser({
      role: UserRole.ADMIN,
    });

    inMemoryUsersRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      userId: "non-existing-id",
      newPassword: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not allow a non-admin user to change passwords", async () => {
    const deliveryMan = makeUser({
      role: UserRole.DELIVERYMAN,
    });

    const user = makeUser();

    inMemoryUsersRepository.items.push(deliveryMan);
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      adminId: deliveryMan.id.toString(),
      userId: user.id.toString(),
      newPassword: "654321",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
