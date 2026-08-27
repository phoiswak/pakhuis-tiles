import { redirect } from "next/navigation";

/** Public self-registration is disabled — only admins can add people. */
export default function RegisterPage() {
  redirect("/login");
}
