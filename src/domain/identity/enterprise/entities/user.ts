import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CPF } from "./value-objects/cpf";

export enum UserRole {
  ADMIN = "ADMIN",
  DELIVERYMAN = "DELIVERYMAN",
}

export interface UserProps {
  name: string;
  cpf: CPF;
  password: string;
  role: UserRole;

  createdAt: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  changePassword(passwordHash: string) {
    this.props.password = passwordHash;
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<UserProps, "createdAt">, id?: UniqueEntityID) {
    return new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
