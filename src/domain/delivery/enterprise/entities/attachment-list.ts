import { WatchedList } from "@/core/entities/watched-list";
import { Attachment } from "./attachment";

export class AttachmentList extends WatchedList<Attachment> {
  compareItems(a: Attachment, b: Attachment): boolean {
    return a.id.equals(b.id);
  }
}
