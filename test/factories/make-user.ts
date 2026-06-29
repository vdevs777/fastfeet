import { faker } from "@faker-js/faker";
import { generate as generateCPF } from "gerador-validador-cpf";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  User,
  UserProps,
  UserRole,
} from "@/domain/identity/enterprise/entities/user";
import { CPF } from "@/domain/identity/enterprise/entities/value-objects/cpf";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const student = User.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(generateCPF({ format: false })),
      password: faker.internet.password(),
      role: UserRole.DELIVERYMAN,
      ...override,
    },
    id,
  );

  return student;
}
