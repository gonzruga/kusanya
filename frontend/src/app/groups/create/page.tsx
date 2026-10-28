
import { Suspense } from "react";
import CreateGroupClient from "./CreateGroupClient";

export default function CreateGroupPage() {
  return (
    <Suspense fallback={<div>Loading group creation form...</div>}>
      <CreateGroupClient />
    </Suspense>
  );
}
