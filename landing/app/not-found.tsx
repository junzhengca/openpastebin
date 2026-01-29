import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="text-center space-y-4 py-12">
      <h1 className="text-4xl font-bold text-secondary-900">404</h1>
      <p className="text-lg text-secondary-600">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
}
