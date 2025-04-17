import Image from "next/image";
import Text from "../../components/common/text";
import SmallCircle from "../common/small-circle";
import { ChevronDown } from "lucide-react";

export default function GetClassSubject() {
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <div className="flex justify-center items-center h-64 overflow-hidden">
        <Image
          src="https://question-bank-p.s3.ap-south-1.amazonaws.com/static/dart-target-color.png"
          width={1200}
          height={420}
          alt="dart-target"
          className="h-full object-contain" // Covers the area while maintaining aspect ratio
        />
      </div>
      <div className="flex justify-center items-center gap-6 px-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <SmallCircle>
                <p className="font-inter text-black font-medium text-sm">1</p>
            </SmallCircle>
            <Text type="lightText">Select the Class</Text>
          </div>
          <div className="flex justify-between items-center h-12 gap-2 rounded-lg border border-solid border-gray-300">
            <div className="w-28 h-5 bg-indigo-100 rounded-md"></div>
            <ChevronDown color="#DEE0FF" size={22} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <SmallCircle>
                <p className="font-inter text-black font-medium text-sm">2</p>
            </SmallCircle>
            <Text type="lightText">Select the Subject</Text>
          </div>
          <div className="flex justify-between items-center h-10 px-4 gap-2 rounded-lg border border-solid border-gray-300">
            <div className="w-28 h-5 bg-indigo-100 rounded-md"></div>
            <ChevronDown color="#DEE0FF" size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}
