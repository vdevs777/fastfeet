import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface NotificationProps {
  recipientId: UniqueEntityID;

  title: string;
  content: string;

  createdAt: Date;
}

export class Notification extends AggregateRoot<NotificationProps> {
  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
