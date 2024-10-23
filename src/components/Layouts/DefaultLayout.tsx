import { ToastContainer } from "react-toastify";
import DynamicFooter from "./DynamicFooter";
import SidebarToggleWrapper from "./SidebarToggle";

export default function DefaultLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const initialSidebarState = false;

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <SidebarToggleWrapper triggerSidebar={initialSidebarState} />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <ToastContainer />
            {children}
          </div>
        </main>
        <DynamicFooter />
      </div>
    </div>
  );
}
