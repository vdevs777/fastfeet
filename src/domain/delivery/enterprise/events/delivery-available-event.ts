import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Delivery } from "../entities/delivery";

export class DeliveryAvailableEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public delivery: Delivery) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id;
  }
}
