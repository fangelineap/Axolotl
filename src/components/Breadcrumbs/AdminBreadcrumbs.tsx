import Link from "next/link";

interface AdminBreadcrumbsProps {
  parentPage?: string
  pageName: string;
}

const AdminBreadcrumbs = ({ parentPage,pageName }: AdminBreadcrumbsProps) => {
  return (
    <div className="mb-6 ml-20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/admin">
              Home /
            </Link>
          </li>
          {parentPage && (
            <li className="font-medium">{parentPage} /</li>
          )}
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default AdminBreadcrumbs;
