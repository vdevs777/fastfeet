import { UsersRepository } from "@/domain/identity/application/repositories/users-repository";
import { User } from "@/domain/identity/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf.value === cpf);

    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    return user ?? null;
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id));

    if (index >= 0) {
      this.items[index] = user;
      return;
    }

    this.items.push(user);
  }
}
