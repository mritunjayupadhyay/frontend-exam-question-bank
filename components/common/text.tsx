interface ITextProps {
  children: React.ReactNode;
  type?: "section-header" | "boldText" | "text";
}
const Text: React.FC<ITextProps> = ({ children, type }) => {
    console.log({ type });
  if (type === "boldText") {
    return (
        <p className="text-black font-noto-sans font-medium text-sm">{children}</p>
    )
  }
  if (type === "section-header") {
    return (
        <p className="text-black font-noto-sans text-[22px] font-medium">
        {children}
      </p>
    );
  }
  return (
    <p className="text-black font-noto-sans text-[22px] font-medium">
      {children}
    </p>
  );
};
export default Text;
