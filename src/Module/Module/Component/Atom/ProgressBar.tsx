interface Props {
  value: number;
  color: string;
}

const ProgressBar = ({ value, color }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 mr-4">
        <div className="h-2 w-full bg-[#e1e2e4] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${value}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      <span
        className="text-xs font-bold"
        style={{ color }}
      >
        {value}%
      </span>
    </div>
  );
};

export default ProgressBar;