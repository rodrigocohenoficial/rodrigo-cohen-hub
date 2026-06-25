import ImageWithFallback from "./ImageWithFallback";
import { AUTHOR } from "@/lib/author";

export default function AuthorBox() {
  return (
    <div className="flex gap-5 items-start bg-evergreen text-bone rounded-2xl p-7 my-10">
      <ImageWithFallback
        src="/img/rodrigo-cohen.jpg"
        alt="Rodrigo Cohen"
        width={64}
        height={64}
        className="w-16 h-16 rounded-full flex-shrink-0 object-cover border-2 border-brass"
      />
      <div>
        <h4 className="font-serif text-[19px] font-semibold mb-1">
          {AUTHOR.name}
        </h4>
        <p className="text-[14px] text-[#C5D1C9]">{AUTHOR.description}</p>
      </div>
    </div>
  );
}
