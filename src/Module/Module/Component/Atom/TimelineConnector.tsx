const TimelineConnector = () => {
  return (
    <div
      className="absolute left-6 md:left-1/2 top-6 bottom-6 w-1 bg-repeat-y -translate-x-1/2 z-0"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #edeef0 50%, transparent 50%)",
        backgroundSize: "4px 20px",
      }}
    />
  );
};

export default TimelineConnector;