export default function ArrowIcon({
  width = 18,
  height = 18
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      fill='none'
      viewBox='0 0 18 18'
    >
      <path
        fill='#637381'
        d='M5.821 16.116a.7.7 0 0 1-.45-.169.63.63 0 0 1 0-.9L11.278 9 5.37 2.981a.63.63 0 0 1 0-.9.63.63 0 0 1 .9 0l6.357 6.47a.63.63 0 0 1 0 .9L6.27 15.918a.66.66 0 0 1-.45.197'
      ></path>
    </svg>
  );
}
