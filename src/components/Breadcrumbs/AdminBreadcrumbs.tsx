import Link from "next/link";

interface AdminBreadcrumbsProps {
  parentPage?: string;
  subPage?: string;
  pageName: string;
}

const AdminBreadcrumbs = ({
  parentPage,
  subPage,
  pageName,
}: AdminBreadcrumbsProps) => {
  return (
    <div className="mb-6 ml-20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
      <nav>
        <ol className="flex items-center gap-2">
          <li className="m-0 p-0 font-medium">
            <Link href="/admin">Home /</Link>
          </li>
          <li className="m-0 p-0 font-medium">
            {parentPage && `${parentPage} / `}
            {subPage && `${subPage} / `}
            <span className="text-primary">{pageName}</span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default AdminBreadcrumbs;
