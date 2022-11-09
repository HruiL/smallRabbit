type apiFunction = () => Promise<void>;
export default function useLazyLoad(apiFunction: apiFunction) {
  const target = ref<HTMLElement>();
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        stop();
        apiFunction();
      }
    },
    { threshold: 0 }
  );
  return target;
}
