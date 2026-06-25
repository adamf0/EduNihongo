interface Props {
  children: any;
  className?: string;
}

const TimelineNode = ({
  children,
  className = "",
}: Props) => {
  return (
    <div
      className={`absolute left-6 md:relative md:left-0 z-10 flex items-center justify-center shrink-0 -translate-x-1/2 md:translate-x-0 ${className}`}
    >
      {children}
    </div>
  );
};

export default TimelineNode;