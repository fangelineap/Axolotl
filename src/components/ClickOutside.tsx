import React, { useEffect, useRef, ReactNode, RefObject } from "react";

interface Props {
  children: ReactNode;
  exceptionRef?: RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

const ClickOutside: React.FC<Props> = ({
  children,
  exceptionRef,
  onClick,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        wrapperRef.current.contains(event.target as Node)
      ) {
        return;
      }

      if (
        exceptionRef &&
        exceptionRef.current &&
        exceptionRef.current.contains(event.target as Node)
      ) {
        return;
      }

      onClick();
    };

    document.addEventListener("mousedown", handleClickListener);

    return () => {
      document.removeEventListener("mousedown", handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;
