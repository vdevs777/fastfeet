import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { AttachmentList } from "./attachment-list";
import { DeliveryStatus } from "./delivery-status";

import { DeliveryAvailableEvent } from "../events/delivery-available-event";
import { DeliveryPickedUpEvent } from "../events/delivery-picked-up-event";
import { DeliveryDeliveredEvent } from "../events/delivery-delivered-event";
import { DeliveryReturnedEvent } from "../events/delivery-returned-event";

interface DeliveryProps {
  recipientId: UniqueEntityID;
  deliverymanId?: UniqueEntityID;

  status: DeliveryStatus;

  attachments: AttachmentList;

  availableAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  returnedAt?: Date;

  createdAt: Date;
  updatedAt?: Date;
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get status() {
    return this.props.status;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  get attachments() {
    return this.props.attachments;
  }

  setAvailable() {
    this.props.status = DeliveryStatus.AVAILABLE;
    this.props.availableAt = new Date();

    this.addDomainEvent(new DeliveryAvailableEvent(this));
  }

  pickUp(deliverymanId: UniqueEntityID) {
    this.props.deliverymanId = deliverymanId;
    this.props.status = DeliveryStatus.PICKED_UP;
    this.props.pickedUpAt = new Date();

    this.addDomainEvent(new DeliveryPickedUpEvent(this));
  }

  deliver() {
    this.props.status = DeliveryStatus.DELIVERED;
    this.props.deliveredAt = new Date();

    this.addDomainEvent(new DeliveryDeliveredEvent(this));
  }

  return() {
    this.props.status = DeliveryStatus.RETURNED;
    this.props.returnedAt = new Date();

    this.addDomainEvent(new DeliveryReturnedEvent(this));
  }

  static create(
    props: Optional<DeliveryProps, "createdAt" | "status" | "attachments">,
    id?: UniqueEntityID,
  ) {
    return new Delivery(
      {
        ...props,
        status: props.status ?? DeliveryStatus.PENDING,
        attachments: props.attachments ?? new AttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
