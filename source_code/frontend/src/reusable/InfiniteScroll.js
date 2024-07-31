import React, { useRef, useCallback, useMemo } from "react";

function InfiniteScroll({
  isLoading,
  hasMore,
  next,
  threshold = 10,
  root = null,
  rootMargin = "0px",
  reverse = false,
  children,
}) {
  const observer = useRef();

  const observerRef = useCallback(
    (element) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      if (!element) return;
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            next();
          }
        },
        { threshold, root, rootMargin }
      );
      observer.current.observe(element);
    },
    [isLoading, hasMore, next, root, rootMargin]
  );

  const flattenChildren = useMemo(
    () => React.Children.toArray(children),
    [children]
  );

  return (
    <>
      {flattenChildren.map((child, index) => {
        if (!React.isValidElement(child)) {
          process.env.NODE_ENV === "development" &&
            console.warn("You should use a valid element with InfiniteScroll");
          return child;
        }

        const isObserveTarget = reverse
          ? index === 0
          : index === flattenChildren.length - 1;
        const ref = isObserveTarget ? observerRef : null;
        return React.cloneElement(child, { ref });
      })}
    </>
  );
}

export default InfiniteScroll;
