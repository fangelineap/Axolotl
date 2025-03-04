interface CustomBreadcrumbsProps {
  parentPage?: string;
  subPage?: string;
  pageName: string;
}

const CustomBreadcrumbs = ({
  parentPage,
  subPage,
  pageName
}: CustomBreadcrumbsProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
      <nav>
        <ol className="flex items-center gap-2">
          <li className="m-0 p-0 font-medium">Home /</li>
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

export default CustomBreadcrumbs;
