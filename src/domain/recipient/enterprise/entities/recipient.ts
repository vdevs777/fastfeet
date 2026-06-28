import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface RecipientProps {
  name: string;

  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;

  latitude?: number;
  longitude?: number;

  createdAt: Date;
  updatedAt?: Date;
}

export class Recipient extends AggregateRoot<RecipientProps> {
  static create(
    props: Optional<RecipientProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
